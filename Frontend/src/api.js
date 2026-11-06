const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(`Cannot reach the Go backend at ${API_BASE_URL}. Is it running?`);
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

export async function getInfo() {
  return request('/info');
}

export async function getPending() {
  return (await request('/pending')) ?? [];
}

export async function getChain() {
  return (await request('/chain')) ?? [];
}

export async function addTransaction(data) {
  return request('/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
}

export async function mineBlock() {
  return request('/mine');
}

export async function searchBlockchain(query) {
  return (await request(`/search?q=${encodeURIComponent(query)}`)) ?? [];
}
