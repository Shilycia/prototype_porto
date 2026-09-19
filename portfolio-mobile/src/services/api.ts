// API Client & Storage Services for Admin Mobile App

const DEFAULT_API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('porto_api_url') || DEFAULT_API_URL;
  }
  return DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    localStorage.setItem('porto_api_url', cleanUrl);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('porto_admin_token');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('porto_admin_token', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('porto_admin_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, error);
    throw error;
  }
}

// -------------------------------------------------------------
// Interfaces
// -------------------------------------------------------------

export interface AdminProfile {
  id?: number;
  nama: string;
  deskripsi_diri: string;
  foto_profile?: string;
  updated_at?: string;
}

export interface WorkItem {
  id?: number;
  nama_karya: string;
  deskripsi: string;
  tanggal_pembuatan?: string | null;
  log_proses?: string | null;
  media_urls: string[];
  dokumen_url?: string | null;
  kategori?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExperienceItem {
  id?: number;
  nama_pengalaman: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CertificateItem {
  id?: number;
  nama_sertifikat: string;
  file_url: string;
  tanggal?: string | null;
  penerbit?: string | null;
  created_at?: string;
}

export interface ContactInfo {
  id?: number;
  nomor_telepon?: string | null;
  email?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  basis_lokasi?: string | null;
}

// -------------------------------------------------------------
// Services
// -------------------------------------------------------------

export const authService = {
  async login(username: string, password: string): Promise<{ access_token: string; message: string }> {
    const res = await request<{ access_token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  logout(): void {
    removeAuthToken();
  },

  isAuthenticated(): boolean {
    return isAuthenticated();
  },
};

export const profileService = {
  async get(): Promise<AdminProfile | null> {
    const data = await request<AdminProfile[]>('/profile');
    return data && data.length > 0 ? data[0] : null;
  },

  async update(id: number, data: Partial<AdminProfile>): Promise<AdminProfile> {
    return await request<AdminProfile>(`/profile/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export const worksService = {
  async getAll(): Promise<WorkItem[]> {
    return await request<WorkItem[]>('/works');
  },

  async getById(id: number): Promise<WorkItem> {
    return await request<WorkItem>(`/works/${id}`);
  },

  async create(data: Partial<WorkItem>): Promise<WorkItem> {
    return await request<WorkItem>('/works', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<WorkItem>): Promise<WorkItem> {
    return await request<WorkItem>(`/works/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/works/${id}`, {
      method: 'DELETE',
    });
  },
};

export const experienceService = {
  async getAll(): Promise<ExperienceItem[]> {
    return await request<ExperienceItem[]>('/experience');
  },

  async create(data: Partial<ExperienceItem>): Promise<ExperienceItem> {
    return await request<ExperienceItem>('/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<ExperienceItem>): Promise<ExperienceItem> {
    return await request<ExperienceItem>(`/experience/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/experience/${id}`, {
      method: 'DELETE',
    });
  },
};

export const certificatesService = {
  async getAll(): Promise<CertificateItem[]> {
    return await request<CertificateItem[]>('/certificates');
  },

  async create(data: Partial<CertificateItem>): Promise<CertificateItem> {
    return await request<CertificateItem>('/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<CertificateItem>): Promise<CertificateItem> {
    return await request<CertificateItem>(`/certificates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/certificates/${id}`, {
      method: 'DELETE',
    });
  },
};

export const contactService = {
  async get(): Promise<ContactInfo | null> {
    const data = await request<ContactInfo[]>('/contact');
    return data && data.length > 0 ? data[0] : null;
  },

  async update(id: number, data: Partial<ContactInfo>): Promise<ContactInfo> {
    return await request<ContactInfo>(`/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export interface UploadResponse {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  provider: 'gdrive' | 'local';
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const baseUrl = getApiBaseUrl();
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Gagal mengunggah file.');
    }

    return await res.json();
  },

  async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    return await request<{ success: boolean; message: string }>(`/upload/${fileId}`, {
      method: 'DELETE',
    });
  },
};

