const API_BASE_URL = "https://trecco.onrender.com";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Se o corpo for FormData, não definir Content-Type manualmente
  const isFormData = options.body instanceof FormData;

  return fetch(url, {
    ...options,
    headers: {
      // só define Content-Type json se não for FormData
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
}
