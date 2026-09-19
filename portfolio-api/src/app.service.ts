import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatusJson() {
    return {
      status: 'operational',
      service: 'Portfolio Core API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
      endpoints: [
        { path: '/profile', methods: ['GET', 'PATCH'], description: 'Informasi data profil publik dan bio' },
        { path: '/works', methods: ['GET', 'POST', 'PATCH', 'DELETE'], description: 'Katalog karya portofolio dan media' },
        { path: '/experience', methods: ['GET', 'POST', 'PATCH', 'DELETE'], description: 'Pengalaman kerja dan organisasi' },
        { path: '/certificates', methods: ['GET', 'POST', 'PATCH', 'DELETE'], description: 'Sertifikasi dan berkas kredensial' },
        { path: '/contact', methods: ['GET', 'PATCH'], description: 'Informasi kontak dan media sosial' },
        { path: '/upload', methods: ['POST', 'DELETE'], description: 'Layanan unggah berkas media (Google Drive / Cloud SSD)' },
        { path: '/auth/login', methods: ['POST'], description: 'Otentikasi admin JWT token' },
      ],
      storage: {
        provider: process.env.GOOGLE_REFRESH_TOKEN ? 'Google Drive (OAuth 2.0)' : 'Local Cloud Storage',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID ? 'Configured' : 'Default',
      },
    };
  }

  getLandingHtml(baseUrl: string): string {
    const uptimeSec = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const uptimeText = `${hours}j ${minutes}m ${uptimeSec % 60}d`;

    const isDriveActive = Boolean(process.env.GOOGLE_REFRESH_TOKEN);
    const storageName = isDriveActive ? 'Google Drive (OAuth 2.0)' : 'Cloud SSD Storage';
    const storageBadgeColor = isDriveActive ? '#3b82f6' : '#a855f7';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio Core API — System Operational</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #06050b;
      color: #e2e8f0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.25rem;
      position: relative;
      overflow-x: hidden;
    }
    .glow-1 {
      position: absolute;
      top: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 750px;
      height: 480px;
      background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(79, 70, 229, 0.08) 50%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
    }
    .glow-2 {
      position: absolute;
      bottom: -120px;
      right: 5%;
      width: 550px;
      height: 400px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
    }
    .container {
      width: 100%;
      max-width: 960px;
      position: relative;
      z-index: 10;
    }
    .hero-card {
      background: rgba(18, 14, 28, 0.75);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(168, 85, 247, 0.22);
      border-radius: 28px;
      padding: 2.75rem 2.5rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }
    .hero-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #a855f7, #06b6d4, #a855f7, transparent);
    }
    .badge-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 0.95rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
      animation: pulse 2s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(1.35); }
    }
    .version-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .hero-title {
      font-size: 2.35rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 30%, #e9d5ff 70%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }
    .hero-sub {
      color: #94a3b8;
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 680px;
      margin-bottom: 2rem;
    }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 1.25rem;
      padding-top: 1.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .spec-label {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
    }
    .spec-val {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .section-title {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .endpoints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .endpoint-card {
      background: rgba(18, 14, 28, 0.55);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 1.35rem 1.25rem;
      transition: all 0.22s ease-out;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-decoration: none;
      color: inherit;
    }
    .endpoint-card:hover {
      background: rgba(147, 51, 234, 0.1);
      border-color: rgba(168, 85, 247, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px -8px rgba(147, 51, 234, 0.25);
    }
    .endpoint-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .method-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
      letter-spacing: 0.05em;
    }
    .method-badge.post {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border-color: rgba(16, 185, 129, 0.3);
    }
    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.35rem;
    }
    .endpoint-desc {
      font-size: 0.8125rem;
      color: #94a3b8;
      line-height: 1.45;
    }
    .open-arrow {
      color: #a855f7;
      opacity: 0.4;
      transition: all 0.2s ease;
    }
    .endpoint-card:hover .open-arrow {
      opacity: 1;
      transform: translateX(3px);
      color: #c084fc;
    }
    .actions-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-top: 0.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.8rem 1.6rem;
      border-radius: 14px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #9333ea, #7e22ce);
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(147, 51, 234, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 28px rgba(147, 51, 234, 0.55);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.8125rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>

  <div class="container">
    <!-- Hero Card -->
    <div class="hero-card">
      <div class="badge-bar">
        <div class="status-badge">
          <span class="pulse-dot"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div>
        <span class="version-tag">PORTFOLIO API v1.0.0</span>
      </div>

      <h1 class="hero-title">Portfolio Core API & Services</h1>
      <p class="hero-sub">
        Pusat layanan backend RESTful berkinerja tinggi untuk sinkronisasi data Portofolio Web (Next.js) dan Aplikasi Admin Mobile (Capacitor & Vue).
      </p>

      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">Server Host</span>
          <span class="spec-val">Helipod.io Cloud</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Database</span>
          <span class="spec-val">Supabase PostgreSQL</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Media Storage</span>
          <span class="spec-val" style="color: ${storageBadgeColor}; font-weight: 700;">${storageName}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Uptime</span>
          <span class="spec-val">${uptimeText}</span>
        </div>
      </div>
    </div>

    <!-- Section: Endpoints -->
    <div class="section-header">
      <h2 class="section-title">
        <svg width="20" height="20" fill="none" stroke="#a855f7" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Endpoint Layanan API
      </h2>
      <a href="${baseUrl}/status" style="color: #a855f7; font-size: 0.8125rem; text-decoration: none; font-weight: 600;">Lihat Raw JSON &rarr;</a>
    </div>

    <div class="endpoints-grid">
      <a href="${baseUrl}/profile" target="_blank" class="endpoint-card">
        <div>
          <div class="endpoint-top">
            <span class="method-badge">GET / PATCH</span>
            <span class="open-arrow">&nearr;</span>
          </div>
          <div class="endpoint-path">/profile</div>
          <div class="endpoint-desc">Data profil utama, foto avatar, nama, dan deskripsi profesional.</div>
        </div>
      </a>

      <a href="${baseUrl}/works" target="_blank" class="endpoint-card">
        <div>
          <div class="endpoint-top">
            <span class="method-badge">GET / POST</span>
            <span class="open-arrow">&nearr;</span>
          </div>
          <div class="endpoint-path">/works</div>
          <div class="endpoint-desc">Daftar karya, video cinematography, fotografi, dan berkas proyek.</div>
        </div>
      </a>

      <a href="${baseUrl}/experience" target="_blank" class="endpoint-card">
        <div>
          <div class="endpoint-top">
            <span class="method-badge">GET / POST</span>
            <span class="open-arrow">&nearr;</span>
          </div>
          <div class="endpoint-path">/experience</div>
          <div class="endpoint-desc">Riwayat pengalaman kerja, posisi, dan deskripsi tanggung jawab.</div>
        </div>
      </a>

      <a href="${baseUrl}/certificates" target="_blank" class="endpoint-card">
        <div>
          <div class="endpoint-top">
            <span class="method-badge">GET / POST</span>
            <span class="open-arrow">&nearr;</span>
          </div>
          <div class="endpoint-path">/certificates</div>
          <div class="endpoint-desc">Daftar sertifikat keahlian dan berkas kredensial digital.</div>
        </div>
      </a>

      <a href="${baseUrl}/contact" target="_blank" class="endpoint-card">
        <div>
          <div class="endpoint-top">
            <span class="method-badge">GET / PATCH</span>
            <span class="open-arrow">&nearr;</span>
          </div>
          <div class="endpoint-path">/contact</div>
          <div class="endpoint-desc">Informasi kontak, WhatsApp, email, dan tautan sosial media.</div>
        </div>
      </a>

      <div class="endpoint-card" style="cursor: default;">
        <div>
          <div class="endpoint-top">
            <span class="method-badge post">POST MULTIPART</span>
          </div>
          <div class="endpoint-path">/upload</div>
          <div class="endpoint-desc">Layanan upload media berkas & gambar ke ${storageName}.</div>
        </div>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="actions-bar">
      <a href="${baseUrl}/status" class="btn btn-primary" target="_blank">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Status JSON API
      </a>
      <a href="${baseUrl}/profile" class="btn btn-secondary" target="_blank">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Uji Endpoint /profile
      </a>
    </div>

    <footer>
      &copy; ${new Date().getFullYear()} Shilycia Portfolio System. Hosted on Helipod.io.
    </footer>
  </div>
</body>
</html>`;
  }
}
