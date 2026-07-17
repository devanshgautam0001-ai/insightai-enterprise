import { auth } from './firebase.ts';

async function getHeaders(url?: string): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // For the sync endpoint, always use the fresh Firebase ID token to verify and get/refresh the JWT
  const isSyncUrl = url && (url.endsWith('/auth/sync') || url.endsWith('/auth/login'));

  if (!isSyncUrl) {
    try {
      const jwt = localStorage.getItem('insightai_jwt');
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
        return headers;
      }
    } catch (e) {
      console.error("Failed to retrieve custom JWT from localStorage:", e);
    }
  }

  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
      return headers;
    } catch (e) {
      console.error("Failed to retrieve Firebase ID token:", e);
    }
  }

  return headers;
}

export const api = {
  async get<T = any>(url: string, params?: Record<string, string>): Promise<T> {
    const headers = await getHeaders(url);
    let finalUrl = url;
    if (params) {
      const query = new URLSearchParams(params).toString();
      finalUrl = `${url}?${query}`;
    }

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (json && json.success === false && json.error) {
        throw new Error(json.error.message || `HTTP error! status: ${response.status}`);
      }
      const errMessage = json?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errMessage);
    }

    if (json && typeof json === 'object' && 'success' in json) {
      if (json.success === false) {
        throw new Error(json.error?.message || "An unexpected error occurred");
      }
      return json.data;
    }

    return json;
  },

  async post<T = any>(url: string, body: any): Promise<T> {
    const headers = await getHeaders(url);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (json && json.success === false && json.error) {
        throw new Error(json.error.message || `HTTP error! status: ${response.status}`);
      }
      const errMessage = json?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errMessage);
    }

    if (json && typeof json === 'object' && 'success' in json) {
      if (json.success === false) {
        throw new Error(json.error?.message || "An unexpected error occurred");
      }
      return json.data;
    }

    return json;
  },

  async put<T = any>(url: string, body: any): Promise<T> {
    const headers = await getHeaders(url);
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (json && json.success === false && json.error) {
        throw new Error(json.error.message || `HTTP error! status: ${response.status}`);
      }
      const errMessage = json?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errMessage);
    }

    if (json && typeof json === 'object' && 'success' in json) {
      if (json.success === false) {
        throw new Error(json.error?.message || "An unexpected error occurred");
      }
      return json.data;
    }

    return json;
  }
};
