export async function api(url, options = {}) {
  const r = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!r.ok) {
    let message = 'Request failed';
    try {
      const body = await r.json();
      message = body.error || message;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return r.headers.get('content-type')?.includes('json') ? r.json() : r.text();
}

export const fetchTables = () => api('/api/tables');
export const patchTable = (id, body) =>
  api(`/api/tables/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const fetchMenu = () => api('/api/menu');
export const fetchInventory = () => api('/api/inventory');
export const fetchOrder = (id) => api(`/api/orders/${id}`);
export const createOrder = (body) =>
  api('/api/orders', { method: 'POST', body: JSON.stringify(body) });
export const addOrderItem = (orderId, body) =>
  api(`/api/orders/${orderId}/items`, { method: 'POST', body: JSON.stringify(body) });
export const removeOrderItem = (orderId, itemId) =>
  api(`/api/orders/${orderId}/items/${itemId}`, { method: 'DELETE' });
export const patchInventory = (id, body) =>
  api(`/api/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const payOrder = (orderId, payments) =>
  api(`/api/billing/${orderId}/pay`, { method: 'POST', body: JSON.stringify({ payments }) });
