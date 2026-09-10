const path = require('path');
const Database = require('better-sqlite3');
// Serverless filesystems (e.g. Vercel) are read-only except /tmp; the DB is
// ephemeral there. For persistent production data use a hosted database.
const dbPath = process.env.VERCEL ? path.join('/tmp', 'pos.sqlite') : 'pos.sqlite';
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS restaurant_tables (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, zone TEXT NOT NULL, capacity INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available','occupied','reserved','billing','cleaning')),
 waiter TEXT, active_order_id INTEGER, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS menu_items (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price REAL NOT NULL,
 image TEXT, description TEXT, available INTEGER NOT NULL DEFAULT 1, inventory_id INTEGER,
 modifiers TEXT DEFAULT '[]', created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS inventory (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, quantity REAL NOT NULL DEFAULT 0, unit TEXT NOT NULL,
 low_stock_threshold REAL NOT NULL DEFAULT 0, out_of_stock INTEGER NOT NULL DEFAULT 0, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
 id INTEGER PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, table_id INTEGER, type TEXT NOT NULL DEFAULT 'dine-in',
 status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','sent','paid','cancelled')), waiter TEXT,
 subtotal REAL NOT NULL DEFAULT 0, tax REAL NOT NULL DEFAULT 0, service_charge REAL NOT NULL DEFAULT 0, discount REAL NOT NULL DEFAULT 0, total REAL NOT NULL DEFAULT 0,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(table_id) REFERENCES restaurant_tables(id)
);
CREATE TABLE IF NOT EXISTS order_items (
 id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, menu_item_id INTEGER, name TEXT NOT NULL, price REAL NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 1, modifiers TEXT DEFAULT '[]', notes TEXT, FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS transactions (
 id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, method TEXT NOT NULL, amount REAL NOT NULL, tendered REAL, change_due REAL DEFAULT 0,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(order_id) REFERENCES orders(id)
);
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM restaurant_tables').get().n;
if (!count) {
 const seed = db.transaction(() => {
  const inv = db.prepare('INSERT INTO inventory (name,quantity,unit,low_stock_threshold) VALUES (?,?,?,?)');
  const ids = {};
  [['Burger patties',26,'pcs',8],['Pizza dough',14,'pcs',5],['Chicken breast',4,'kg',2],['Cola',38,'cans',12],['Cheesecake',3,'slices',4],['Cheese',5,'kg',2]].forEach(x => { ids[x[0]] = inv.run(...x).lastInsertRowid; });
  const table = db.prepare('INSERT INTO restaurant_tables (name,zone,capacity,status,waiter) VALUES (?,?,?,?,?)');
  [['T1','Main Dining',2,'available',null],['T2','Main Dining',4,'occupied','Maya'],['T3','Main Dining',4,'reserved',null],['T4','Main Dining',6,'cleaning',null],['P1','Patio',2,'available',null],['P2','Patio',4,'available',null],['B1','Bar',2,'occupied','Leo'],['B2','Bar',2,'available',null]].forEach(x => table.run(...x));
  const menu = db.prepare('INSERT INTO menu_items (name,category,price,image,description,inventory_id,modifiers) VALUES (?,?,?,?,?,?,?)');
  const mods = JSON.stringify(['No onions','Extra cheese (+$1.50)','Medium rare','Gluten-free']);
  [['Crispy Calamari','Appetizers',10.50,'🦑','Lemon aioli',null],['Bruschetta','Appetizers',8.00,'🍞','Tomato & basil',null],['Classic Burger','Mains',15.50,'🍔','Brioche, fries',ids['Burger patties']],['Margherita Pizza','Mains',14.00,'🍕','Fresh mozzarella',ids['Pizza dough']],['Grilled Chicken','Mains',18.00,'🍗','Seasonal vegetables',ids['Chicken breast']],['Cola','Drinks',3.50,'🥤','Chilled can',ids['Cola']],['Lemonade','Drinks',4.50,'🍋','Freshly squeezed',null],['Cheesecake','Desserts',7.50,'🍰','Berry compote',ids['Cheesecake']]].forEach(x => menu.run(...x, mods));
 }); seed();
}
module.exports = db;
