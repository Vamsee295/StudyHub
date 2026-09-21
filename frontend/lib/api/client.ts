const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

let _cachedToken: string | null = null;
let _cachedTokenTime: number = 0;
const TOKEN_CACHE_DURATION = 60 * 1000; // 60s in-memory cache

export function invalidateTokenCache() {
  _cachedToken = null;
  _cachedTokenTime = 0;
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  const now = Date.now();
  if (_cachedToken && now - _cachedTokenTime < TOKEN_CACHE_DURATION) {
    return _cachedToken;
  }

  const legacyToken = localStorage.getItem('pathward_access_token');
  if (legacyToken) {
    _cachedToken = legacyToken;
    _cachedTokenTime = now;
    return legacyToken;
  }

  // Use Supabase client to ensure token is refreshed if expired


  try {
    const { supabase } = await import('@/lib/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      _cachedToken = session.access_token;
      _cachedTokenTime = now;
      return session.access_token;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export const apiClient = {
  async get(endpoint: string, options: RequestInit = {}) {
    return fetchAPI(endpoint, { ...options, method: 'GET' });
  },
  
  async post(endpoint: string, data: unknown, options: RequestInit = {}) {
    return fetchAPI(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },
  
  async put(endpoint: string, data: unknown, options: RequestInit = {}) {
    return fetchAPI(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },
  
  async delete(endpoint: string, options: RequestInit = {}) {
    return fetchAPI(endpoint, { ...options, method: 'DELETE' });
  },
  
  async patch(endpoint: string, data: unknown, options: RequestInit = {}) {
    return fetchAPI(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }
};

async function fetchAPI(endpoint: string, options: RequestInit) {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  let response: Response;
  try {
    console.log(`[API CLIENT] Fetching ${API_URL}${endpoint} with token: ${headers.has('Authorization') ? 'Present' : 'Missing'}`);
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store', // Fix Next.js aggressive caching for API calls
    });
    console.log(`[API CLIENT] Response from ${endpoint}: ${response.status}`);
  } catch (err: any) {
    console.warn(`[API] Failed to reach backend at ${API_URL}${endpoint}:`, err);
    throw new Error(err.message || 'Unable to connect to the backend server. Please verify the backend is running at http://localhost:8000');
  }

  if (!response.ok) {
    console.log(`[API CLIENT] Error from ${endpoint}: ${response.status}`);
    if (response.status === 401) {
      invalidateTokenCache();
    }
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (e) {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  return response.json();
}
