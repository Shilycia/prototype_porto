<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Profil &amp; Pengaturan</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="loadAllData" :disabled="loading">
            <ion-icon :icon="refreshOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <!-- ================= 1. PROFIL DIRI ================= -->
      <div class="settings-card glass-panel">
        <div class="card-header">
          <div class="header-icon-box purple">
            <ion-icon :icon="personCircleOutline" />
          </div>
          <div>
            <h3 class="card-header-title">Data Profil Publik</h3>
            <p class="card-header-sub">Informasi nama dan bio di halaman web.</p>
          </div>
        </div>

        <!-- Avatar Preview -->
        <div class="avatar-preview-wrap">
          <img
            :src="resolveMediaUrl(profileForm.foto_profile) || '/favicon.png'"
            alt="Preview Foto"
            class="avatar-preview-img"
            @error="(e: any) => e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'"
          />
          <div class="avatar-meta">
            <span class="avatar-meta-title">Foto Profil Preview</span>
            <span class="avatar-meta-sub">Gunakan foto potret atau transparan</span>
            <input
              type="file"
              ref="profileFileInputRef"
              accept="image/*"
              style="display: none"
              @change="handleProfilePhotoUpload"
            />
            <ion-button
              size="small"
              fill="outline"
              class="upload-photo-btn"
              :disabled="uploadingPhoto"
              @click="triggerProfileFileInput"
            >
              <ion-spinner v-if="uploadingPhoto" name="crescent" slot="start" />
              <ion-icon v-else :icon="cloudUploadOutline" slot="start" />
              {{ uploadingPhoto ? 'Mengunggah...' : 'Upload Foto Baru / GDrive' }}
            </ion-button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="form-body">
          <div class="form-group">
            <label class="form-label">Nama Lengkap *</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="profileForm.nama"
                placeholder="Nama Anda"
                required
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">URL Foto Profil</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="profileForm.foto_profile"
                placeholder="/profile-transparent.png atau URL eksternal"
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">Deskripsi Diri / Bio Singkat *</label>
            <ion-item class="custom-input-item textarea-item" lines="none">
              <ion-textarea
                v-model="profileForm.deskripsi_diri"
                :rows="4"
                placeholder="Tuliskan bio profesional Anda..."
                required
              />
            </ion-item>
          </div>

          <ion-button
            expand="block"
            type="submit"
            class="save-btn"
            :disabled="savingProfile"
          >
            <ion-spinner v-if="savingProfile" name="crescent" slot="start" />
            <ion-icon v-else :icon="checkmarkOutline" slot="start" />
            <span>{{ savingProfile ? 'Menyimpan...' : 'Perbarui Profil' }}</span>
          </ion-button>
        </form>
      </div>

      <!-- ================= 2. KONTAK & JARINGAN ================= -->
      <div class="settings-card glass-panel" style="margin-top: 20px;">
        <div class="card-header">
          <div class="header-icon-box fuchsia">
            <ion-icon :icon="callOutline" />
          </div>
          <div>
            <h3 class="card-header-title">Saluran Kontak</h3>
            <p class="card-header-sub">Informasi kontak yang dapat dihubungi klien.</p>
          </div>
        </div>

        <form @submit.prevent="saveContact" class="form-body">
          <div class="form-group">
            <label class="form-label">Email Resmi</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="contactForm.email"
                type="email"
                placeholder="contact@diyul.creative"
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / Telepon</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="contactForm.nomor_telepon"
                placeholder="+6281234567890"
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">Instagram Username / Link</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="contactForm.instagram"
                placeholder="@diyul.raw"
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">Tautan LinkedIn</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="contactForm.linkedin"
                placeholder="https://linkedin.com/in/diyul-maulana"
              />
            </ion-item>
          </div>

          <div class="form-group">
            <label class="form-label">Basis Lokasi Studio</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input
                v-model="contactForm.basis_lokasi"
                placeholder="Jakarta Selatan, Indonesia"
              />
            </ion-item>
          </div>

          <ion-button
            expand="block"
            type="submit"
            class="save-btn"
            :disabled="savingContact"
          >
            <ion-spinner v-if="savingContact" name="crescent" slot="start" />
            <ion-icon v-else :icon="checkmarkOutline" slot="start" />
            <span>{{ savingContact ? 'Menyimpan...' : 'Perbarui Kontak' }}</span>
          </ion-button>
        </form>
      </div>

      <!-- ================= 3. KONFIGURASI API ================= -->
      <div class="settings-card glass-panel" style="margin-top: 20px;">
        <div class="card-header">
          <div class="header-icon-box cyan">
            <ion-icon :icon="serverOutline" />
          </div>
          <div>
            <h3 class="card-header-title">Server REST API</h3>
            <p class="card-header-sub">Alamat server backend yang dituju aplikasi mobile.</p>
          </div>
        </div>

        <div class="form-body">
          <div class="form-group">
            <label class="form-label">API Base URL</label>
            <ion-item class="custom-input-item" lines="none">
              <ion-input v-model="apiUrlInput" placeholder="http://localhost:3001" />
            </ion-item>
            <p class="hint-text">
              * Jika menguji di Android Emulator, gunakan <code>http://10.0.2.2:3001</code>. Jika di HP fisik melalui Wi-Fi, gunakan IP laptop (misal <code>http://192.168.1.5:3001</code>).
            </p>
          </div>

          <div class="api-btn-row">
            <ion-button size="small" class="save-btn" @click="saveApiUrl">
              Simpan URL API
            </ion-button>
            <ion-button size="small" fill="outline" color="medium" @click="resetApiUrl">
              Reset Default
            </ion-button>
          </div>
        </div>
      </div>

      <!-- ================= 4. SESI & LOGOUT ================= -->
      <div class="settings-card glass-panel" style="margin-top: 20px; margin-bottom: 50px;">
        <div class="card-header">
          <div class="header-icon-box" style="background: rgba(244, 63, 94, 0.15); color: #f43f5e;">
            <ion-icon :icon="logOutOutline" />
          </div>
          <div>
            <h3 class="card-header-title">Sesi Admin</h3>
            <p class="card-header-sub">Keluar dari akun admin pada perangkat ini.</p>
          </div>
        </div>

        <div class="form-body">
          <ion-button
            expand="block"
            color="danger"
            fill="outline"
            class="logout-btn"
            @click="showLogoutAlert = true"
          >
            <ion-icon :icon="logOutOutline" slot="start" />
            Keluar dari Sistem Admin
          </ion-button>
        </div>
      </div>

      <!-- Logout Alert Confirmation -->
      <ion-alert
        :is-open="showLogoutAlert"
        header="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sesi admin?"
        :buttons="[
          { text: 'Batal', role: 'cancel' },
          { text: 'Ya, Keluar', role: 'destructive', handler: handleLogout }
        ]"
        @didDismiss="showLogoutAlert = false"
      />

      <!-- Toast Feedback -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="2500"
        @didDismiss="showToast = false"
      />
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
  IonItem,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonAlert,
  IonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  refreshOutline,
  personCircleOutline,
  callOutline,
  serverOutline,
  logOutOutline,
  checkmarkOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import {
  profileService,
  contactService,
  authService,
  uploadService,
  getApiBaseUrl,
  setApiBaseUrl,
  resolveMediaUrl,
  AdminProfile,
  ContactInfo,
} from '@/services/api';

const router = useRouter();

const loading = ref(false);
const savingProfile = ref(false);
const savingContact = ref(false);

const profileId = ref<number | null>(null);
const profileForm = ref<Partial<AdminProfile>>({
  nama: '',
  deskripsi_diri: '',
  foto_profile: '',
});

const contactId = ref<number | null>(null);
const contactForm = ref<Partial<ContactInfo>>({
  email: '',
  nomor_telepon: '',
  instagram: '',
  linkedin: '',
  basis_lokasi: '',
});

const apiUrlInput = ref('http://localhost:3001');

// Alert & Toast
const showLogoutAlert = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

const loadAllData = async () => {
  loading.value = true;
  try {
    const [prof, contact] = await Promise.allSettled([
      profileService.get(),
      contactService.get(),
    ]);

    if (prof.status === 'fulfilled' && prof.value) {
      profileId.value = prof.value.id || null;
      profileForm.value = {
        nama: prof.value.nama,
        deskripsi_diri: prof.value.deskripsi_diri,
        foto_profile: prof.value.foto_profile || '',
      };
    }

    if (contact.status === 'fulfilled' && contact.value) {
      contactId.value = contact.value.id || null;
      contactForm.value = {
        email: contact.value.email || '',
        nomor_telepon: contact.value.nomor_telepon || '',
        instagram: contact.value.instagram || '',
        linkedin: contact.value.linkedin || '',
        basis_lokasi: contact.value.basis_lokasi || '',
      };
    }

    apiUrlInput.value = getApiBaseUrl();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal memuat pengaturan.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async (event: any) => {
  await loadAllData();
  event.target.complete();
};

const profileFileInputRef = ref<HTMLInputElement | null>(null);
const uploadingPhoto = ref(false);

const triggerProfileFileInput = () => {
  if (profileFileInputRef.value) {
    profileFileInputRef.value.value = '';
    profileFileInputRef.value.click();
  }
};

const handleProfilePhotoUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingPhoto.value = true;
  try {
    const res = await uploadService.uploadFile(file);
    profileForm.value.foto_profile = res.url;
    toastColor.value = 'success';
    toastMessage.value = `Foto profil berhasil diunggah ke ${res.provider === 'gdrive' ? 'Google Drive' : 'Penyimpanan'}!`;
    showToast.value = true;
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal mengunggah foto.';
    showToast.value = true;
  } finally {
    uploadingPhoto.value = false;
  }
};

const saveProfile = async () => {
  if (!profileForm.value.nama?.trim()) return;

  savingProfile.value = true;
  try {
    if (profileId.value) {
      await profileService.update(profileId.value, {
        nama: profileForm.value.nama.trim(),
        deskripsi_diri: profileForm.value.deskripsi_diri?.trim() || '',
        foto_profile: profileForm.value.foto_profile?.trim() || null,
      } as any);
      toastMessage.value = 'Profil berhasil diperbarui!';
    } else {
      toastMessage.value = 'ID profil tidak ditemukan di database.';
    }
    toastColor.value = 'success';
    showToast.value = true;
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal memperbarui profil.';
    showToast.value = true;
  } finally {
    savingProfile.value = false;
  }
};

const saveContact = async () => {
  savingContact.value = true;
  try {
    if (contactId.value) {
      await contactService.update(contactId.value, {
        email: contactForm.value.email?.trim() || null,
        nomor_telepon: contactForm.value.nomor_telepon?.trim() || null,
        instagram: contactForm.value.instagram?.trim() || null,
        linkedin: contactForm.value.linkedin?.trim() || null,
        basis_lokasi: contactForm.value.basis_lokasi?.trim() || null,
      });
      toastMessage.value = 'Data kontak berhasil diperbarui!';
    } else {
      toastMessage.value = 'ID kontak tidak ditemukan di database.';
    }
    toastColor.value = 'success';
    showToast.value = true;
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal memperbarui kontak.';
    showToast.value = true;
  } finally {
    savingContact.value = false;
  }
};

const saveApiUrl = () => {
  if (apiUrlInput.value.trim()) {
    setApiBaseUrl(apiUrlInput.value.trim());
    toastColor.value = 'success';
    toastMessage.value = `URL API disimpan: ${getApiBaseUrl()}`;
    showToast.value = true;
  }
};

const resetApiUrl = () => {
  apiUrlInput.value = 'http://localhost:3001';
  setApiBaseUrl('http://localhost:3001');
  toastColor.value = 'primary';
  toastMessage.value = 'URL API direset ke default (http://localhost:3001)';
  showToast.value = true;
};

const handleLogout = () => {
  authService.logout();
  router.replace('/login');
};

onMounted(() => {
  loadAllData();
});
</script>

<style scoped>
.settings-card {
  padding: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.header-icon-box.purple {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
}

.header-icon-box.fuchsia {
  background: rgba(217, 70, 239, 0.2);
  color: #f0abfc;
}

.header-icon-box.cyan {
  background: rgba(56, 189, 248, 0.2);
  color: #7dd3fc;
}

.card-header-title {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.card-header-sub {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.avatar-preview-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px dashed rgba(168, 85, 247, 0.3);
  margin-bottom: 16px;
}

.avatar-preview-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #000;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
  flex-shrink: 0;
}

.avatar-meta {
  display: flex;
  flex-direction: column;
}

.avatar-meta-title {
  font-size: 12px;
  font-weight: 700;
  color: #e2e8f0;
}

.avatar-meta-sub {
  font-size: 10px;
  color: #64748b;
}

.upload-photo-btn {
  --color: #38bdf8;
  --border-color: rgba(56, 189, 248, 0.4);
  font-size: 11px;
  font-weight: 700;
  --border-radius: 8px;
  margin-top: 6px;
  align-self: flex-start;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.custom-input-item {
  --background: rgba(8, 6, 13, 0.8);
  --border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 12px;
}

.textarea-item {
  padding-top: 6px;
  padding-bottom: 6px;
}

.save-btn {
  --background: linear-gradient(135deg, #9333ea, #d946ef);
  --border-radius: 12px;
  font-weight: 700;
  height: 44px;
  margin-top: 6px;
}

.hint-text {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  margin: 4px 0 0 0;
}

.hint-text code {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
  padding: 1px 4px;
  border-radius: 4px;
}

.api-btn-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.logout-btn {
  --border-radius: 12px;
  font-weight: 700;
  height: 46px;
}
</style>
