<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="custom-toolbar">
        <div class="header-brand-wrap">
          <div class="header-logo-badge">
            <span class="header-logo-text">&gt;_</span>
          </div>
          <div class="header-text-wrap">
            <h1 class="header-title">shilycia's DEV</h1>
            <span class="header-badge">PORTFOLIO CMS</span>
          </div>
        </div>
        <ion-buttons slot="end">
          <ion-button class="header-refresh-btn" @click="loadData" :disabled="loading">
            <ion-icon :icon="refreshOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Welcome Profile Banner -->
      <div class="glass-panel profile-banner">
        <div class="profile-left">
          <div class="avatar-ring">
            <img
              :src="resolveMediaUrl(profile?.foto_profile) || '/favicon.png'"
              alt="Profile"
              class="avatar-img"
              @error="(e: any) => e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'"
            />
          </div>
          <div class="profile-info">
            <div class="status-indicator">
              <span class="pulse-dot" />
              <span class="status-text">ADMIN ONLINE</span>
            </div>
            <h2 class="profile-name">{{ profile?.nama || 'Diyul Maulana' }}</h2>
            <p class="profile-bio line-clamp-1">{{ profile?.deskripsi_diri || 'Creative Director & Multimedia Artist' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card glass-panel" @click="router.push('/tabs/works')">
          <div class="metric-icon-wrap purple">
            <ion-icon :icon="imagesOutline" />
          </div>
          <div class="metric-value">{{ worksCount }}</div>
          <div class="metric-label">Total Karya</div>
          <div class="metric-arrow">
            <span>Kelola</span>
            <ion-icon :icon="chevronForwardOutline" />
          </div>
        </div>

        <div class="metric-card glass-panel" @click="router.push('/tabs/experience')">
          <div class="metric-icon-wrap fuchsia">
            <ion-icon :icon="briefcaseOutline" />
          </div>
          <div class="metric-value">{{ experiencesCount }}</div>
          <div class="metric-label">Pengalaman</div>
          <div class="metric-arrow">
            <span>Kelola</span>
            <ion-icon :icon="chevronForwardOutline" />
          </div>
        </div>

        <div class="metric-card glass-panel" @click="router.push('/tabs/experience')">
          <div class="metric-icon-wrap cyan">
            <ion-icon :icon="ribbonOutline" />
          </div>
          <div class="metric-value">{{ certificatesCount }}</div>
          <div class="metric-label">Sertifikat</div>
          <div class="metric-arrow">
            <span>Kelola</span>
            <ion-icon :icon="chevronForwardOutline" />
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-title-wrap">
        <h3 class="section-title">Aksi Cepat</h3>
      </div>

      <div class="quick-actions-grid">
        <ion-button
          expand="block"
          class="action-btn"
          @click="router.push('/tabs/works?action=add')"
        >
          <ion-icon :icon="addCircleOutline" slot="start" />
          Tambah Karya
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          class="action-btn-outline"
          @click="router.push('/tabs/experience?action=add')"
        >
          <ion-icon :icon="addOutline" slot="start" />
          Tambah Karir
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          class="action-btn-outline"
          @click="router.push('/tabs/settings')"
        >
          <ion-icon :icon="createOutline" slot="start" />
          Edit Profil & Kontak
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          class="action-btn-outline"
          @click="openWebPortfolio"
        >
          <ion-icon :icon="openOutline" slot="start" />
          Lihat Web Publik
        </ion-button>
      </div>

      <!-- Recent Works Preview -->
      <div class="section-title-wrap" style="margin-top: 24px;">
        <h3 class="section-title">Karya Terbaru</h3>
        <ion-button fill="clear" size="small" class="see-all-btn" @click="router.push('/tabs/works')">
          Lihat Semua
        </ion-button>
      </div>

      <div v-if="loading && recentWorks.length === 0" class="loading-state">
        <ion-spinner name="crescent" color="primary" />
        <p>Memuat ringkasan data...</p>
      </div>

      <div v-else-if="recentWorks.length === 0" class="empty-state glass-panel">
        <ion-icon :icon="folderOpenOutline" class="empty-icon" />
        <p>Belum ada karya yang diunggah.</p>
      </div>

      <div v-else class="recent-list">
        <div
          v-for="work in recentWorks"
          :key="work.id"
          class="recent-item glass-panel"
          @click="router.push('/tabs/works')"
        >
          <div class="thumb-wrap">
            <img
              v-if="work.media_urls && work.media_urls.length > 0"
              :src="resolveMediaUrl(work.media_urls[0])"
              :alt="work.nama_karya"
              class="item-thumb"
              @error="(e: any) => e.target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=100'"
            />
            <div v-else class="item-thumb-placeholder">
              <ion-icon :icon="imageOutline" />
            </div>
          </div>
          <div class="item-details">
            <span class="item-category">{{ work.kategori || 'Creative' }}</span>
            <h4 class="item-name">{{ work.nama_karya }}</h4>
            <p class="item-desc line-clamp-1">{{ work.deskripsi }}</p>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="item-arrow" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  refreshOutline,
  imagesOutline,
  briefcaseOutline,
  ribbonOutline,
  chevronForwardOutline,
  addCircleOutline,
  addOutline,
  createOutline,
  openOutline,
  folderOpenOutline,
  imageOutline,
} from 'ionicons/icons';
import {
  profileService,
  worksService,
  experienceService,
  certificatesService,
  resolveMediaUrl,
  AdminProfile,
  WorkItem,
} from '@/services/api';

const router = useRouter();

const loading = ref(false);
const profile = ref<AdminProfile | null>(null);
const worksCount = ref(0);
const experiencesCount = ref(0);
const certificatesCount = ref(0);
const recentWorks = ref<WorkItem[]>([]);

const loadData = async () => {
  loading.value = true;
  try {
    const [prof, works, exps, certs] = await Promise.allSettled([
      profileService.get(),
      worksService.getAll(),
      experienceService.getAll(),
      certificatesService.getAll(),
    ]);

    if (prof.status === 'fulfilled' && prof.value) {
      profile.value = prof.value;
    }
    if (works.status === 'fulfilled' && Array.isArray(works.value)) {
      worksCount.value = works.value.length;
      recentWorks.value = works.value.slice(0, 4);
    }
    if (exps.status === 'fulfilled' && Array.isArray(exps.value)) {
      experiencesCount.value = exps.value.length;
    }
    if (certs.status === 'fulfilled' && Array.isArray(certs.value)) {
      certificatesCount.value = certs.value.length;
    }
  } catch (err) {
    console.error('Failed loading dashboard:', err);
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async (event: any) => {
  await loadData();
  event.target.complete();
};

const openWebPortfolio = () => {
  window.open('http://localhost:3000', '_blank');
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.profile-banner {
  padding: 18px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.22), rgba(18, 13, 36, 0.85));
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, #a855f7, #d946ef);
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.4);
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: #000;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.status-text {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #4ade80;
}

.profile-name {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2px 0;
}

.profile-bio {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 22px;
}

.metric-card {
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.metric-card:active {
  transform: scale(0.96);
}

.metric-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.metric-icon-wrap.purple {
  background: rgba(147, 51, 234, 0.25);
  color: #c084fc;
}

.metric-icon-wrap.fuchsia {
  background: rgba(217, 70, 239, 0.25);
  color: #f0abfc;
}

.metric-icon-wrap.cyan {
  background: rgba(56, 189, 248, 0.25);
  color: #7dd3fc;
}

.metric-value {
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 6px;
}

.metric-arrow {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: #a855f7;
  font-weight: 700;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #e2e8f0;
  margin: 0;
}

.see-all-btn {
  --color: #c084fc;
  font-size: 12px;
  font-weight: 700;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.action-btn {
  --background: linear-gradient(135deg, #9333ea, #d946ef);
  --border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  height: 44px;
}

.action-btn-outline {
  --border-color: rgba(168, 85, 247, 0.4);
  --border-radius: 12px;
  --color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  height: 44px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 12px;
  cursor: pointer;
}

.thumb-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #000;
}

.item-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 24px;
  background: rgba(147, 51, 234, 0.1);
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-category {
  font-size: 10px;
  font-weight: 800;
  color: #c084fc;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-name {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}

.item-arrow {
  color: #64748b;
  font-size: 18px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 30px 16px;
  color: #94a3b8;
  font-size: 13px;
}

.empty-icon {
  font-size: 38px;
  color: #64748b;
  margin-bottom: 8px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.custom-toolbar {
  --background: rgba(14, 10, 24, 0.9);
  --border-color: rgba(168, 85, 247, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 4px 8px;
}

.header-brand-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-logo-badge {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #9333ea, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(147, 51, 234, 0.5);
}

.header-logo-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
}

.header-text-wrap {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  color: #ffffff;
  line-height: 1.15;
}

.header-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #c084fc;
  line-height: 1.2;
}

.header-refresh-btn {
  --color: #c084fc;
}
</style>
