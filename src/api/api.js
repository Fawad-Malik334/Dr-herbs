/** @type {any} */
const meta = import.meta;

const viteEnv = (meta && meta.env) ? meta.env : {};

export const API_BASE_URL = viteEnv.VITE_API_BASE_URL || 'https://dr-herbs-backend.vercel.app';
//export const API_BASE_URL = viteEnv.VITE_API_BASE_URL || 'http://localhost:5005';

export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');

  if (!res.ok) {
    const message = (body && typeof body === 'object' && body.message) ? body.message : `Request failed (${res.status})`;
    /** @type {Error & { status?: number, data?: any }} */
    const err = new Error(message);
    err.status = res.status;
    err.data = body;
    throw err;
  }

  return body;
};

export const getAdminToken = () => {
  return localStorage.getItem('drherbs_admin_token');
};

export const withAdminAuth = (headers = {}) => {
  const token = getAdminToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const adminLogin = async ({ email, password }) => {
  return apiFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const listProducts = async (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch(`/api/products${suffix}`);
};

export const getProduct = async (id) => {
  return apiFetch(`/api/products/${id}`);
};

export const listReviews = async (productId) => {
  const qs = new URLSearchParams();
  qs.set('product_id', String(productId || ''));
  return apiFetch(`/api/reviews?${qs.toString()}`);
};

export const createReview = async (payload) => {
  return apiFetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const createProduct = async (payload) => {
  return apiFetch('/api/products', {
    method: 'POST',
    headers: withAdminAuth(),
    body: JSON.stringify(payload)
  });
};

export const updateProduct = async (id, payload) => {
  return apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: withAdminAuth(),
    body: JSON.stringify(payload)
  });
};

export const deleteProduct = async (id) => {
  return apiFetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: withAdminAuth()
  });
};

export const createOrder = async (payload) => {
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const listAdminOrders = async () => {
  return apiFetch('/api/orders/admin', {
    headers: withAdminAuth()
  });
};

export const updateAdminOrder = async (id, payload) => {
  return apiFetch(`/api/orders/admin/${id}/status`, {
    method: 'PUT',
    headers: withAdminAuth(),
    body: JSON.stringify(payload)
  });
};

export const getFacebookPixelReport = async (adCode) => {
  const qs = new URLSearchParams();
  qs.set('ad_code', String(adCode || ''));
  return apiFetch(`/api/marketing/facebook-pixel?${qs.toString()}`, {
    headers: withAdminAuth(),
  });
};
