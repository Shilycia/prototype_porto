<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Karir &amp; Sertifikat</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon :icon="addCircleOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Segment Selector -->
      <ion-toolbar class="segment-toolbar">
        <ion-segment v-model="activeTab" class="custom-segment">
          <ion-segment-button value="experience">
            <ion-icon :icon="briefcaseOutline" />
            <ion-label>Pengalaman ({{ experiences.length }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="certificates">
            <ion-icon :icon="ribbonOutline" />
            <ion-label>Sertifikat ({{ certificates.length }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <ion-spinner name="crescent" color="primary" />
        <p>Memuat data...</p>
      </div>

      <!-- ================= TAB 1: PENGALAMAN ================= -->
      <div v-else-if="activeTab === 'experience'">
        <div v-if="experiences.length === 0" class="empty-state glass-panel">
          <ion-icon :icon="briefcaseOutline" class="empty-icon" />
          <h3>Belum Ada Pengalaman</h3>
          <p>Tambahkan riwayat karir dan peran profesional Anda.</p>
          <ion-button size="small" class="add-btn-small" @click="openAddModal">
            <ion-icon :icon="addOutline" slot="start" />
            Tambah Pengalaman
          </ion-button>
        </div>

        <div v-else class="items-list">
          <div
            v-for="exp in experiences"
            :key="exp.id"
            class="item-card glass-panel"
          >
            <div class="item-card-header">
              <span class="date-badge">
                {{ formatYear(exp.tanggal_mulai) }} – {{ exp.tanggal_selesai ? formatYear(exp.tanggal_selesai) : 'Present' }}
              </span>
              <span v-if="!exp.tanggal_selesai" class="ongoing-badge">ONGOING</span>
            </div>

            <h3 class="item-title">{{ exp.nama_pengalaman }}</h3>
            <p class="item-desc">{{ exp.deskripsi }}</p>

            <div class="item-actions">
              <ion-button
                size="small"
                fill="clear"
                class="edit-action-btn"
                @click="openEditExperience(exp)"
              >
                <ion-icon :icon="createOutline" slot="start" />
                Edit
              </ion-button>
              <ion-button
                size="small"
                fill="clear"
                color="danger"
                @click="confirmDeleteExperience(exp)"
              >
                <ion-icon :icon="trashOutline" slot="start" />
                Hapus
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 2: SERTIFIKAT ================= -->
      <div v-else-if="activeTab === 'certificates'">
        <div v-if="certificates.length === 0" class="empty-state glass-panel">
          <ion-icon :icon="ribbonOutline" class="empty-icon" />
          <h3>Belum Ada Sertifikat</h3>
          <p>Unggah kredensial atau lisensi profesional Anda.</p>
          <ion-button size="small" class="add-btn-small" @click="openAddModal">
            <ion-icon :icon="addOutline" slot="start" />
            Tambah Sertifikat
          </ion-button>
        </div>

        <div v-else class="items-list">
          <div
            v-for="cert in certificates"
            :key="cert.id"
            class="item-card glass-panel"
          >
            <div class="cert-header">
              <div class="cert-icon-box">
                <ion-icon :icon="ribbonOutline" />
              </div>
              <div class="cert-meta">
                <span class="cert-publisher">{{ cert.penerbit || 'Lembaga Penerbit' }}</span>
                <span class="cert-date" v-if="cert.tanggal">
                  {{ new Date(cert.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) }}
                </span>
              </div>
            </div>

            <h3 class="item-title">{{ cert.nama_sertifikat }}</h3>

            <div class="cert-url-box" v-if="cert.file_url">
              <ion-icon :icon="linkOutline" />
              <a :href="resolveMediaUrl(cert.file_url)" target="_blank" class="cert-link">Buka Berkas / Kredensial</a>
            </div>

            <div class="item-actions">
              <ion-button
                size="small"
                fill="clear"
                class="edit-action-btn"
                @click="openEditCertificate(cert)"
              >
                <ion-icon :icon="createOutline" slot="start" />
                Edit
              </ion-button>
              <ion-button
                size="small"
                fill="clear"
                color="danger"
                @click="confirmDeleteCertificate(cert)"
              >
                <ion-icon :icon="trashOutline" slot="start" />
                Hapus
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="custom-fab" @click="openAddModal">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>

      <!-- Modal Tambah / Edit Pengalaman -->
      <ion-modal :is-open="isExpModalOpen" @didDismiss="isExpModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ isEditingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isExpModalOpen = false">Batal</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <form @submit.prevent="saveExperience" class="modal-form">
            <div class="form-group">
              <label class="form-label">Posisi &amp; Instansi *</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="expForm.nama_pengalaman"
                  placeholder="Contoh: Lead Creative Director — Studio X"
                  required
                />
              </ion-item>
            </div>

            <div class="form-group">
              <label class="form-label">Tanggal Mulai *</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="expForm.tanggal_mulai"
                  type="date"
                  required
                />
              </ion-item>
            </div>

            <div class="form-group">
              <div class="toggle-row">
                <label class="form-label">Masih Bekerja di Sini (Ongoing)?</label>
                <ion-toggle v-model="expForm.isOngoing" color="primary" />
              </div>
            </div>

            <div class="form-group" v-if="!expForm.isOngoing">
              <label class="form-label">Tanggal Selesai</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="expForm.tanggal_selesai"
                  type="date"
                />
              </ion-item>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Pekerjaan &amp; Tanggung Jawab *</label>
              <ion-item class="modal-input-item textarea-item" lines="none">
                <ion-textarea
                  v-model="expForm.deskripsi"
                  :rows="4"
                  placeholder="Jelaskan kontribusi dan lingkup pekerjaan..."
                  required
                />
              </ion-item>
            </div>

            <ion-button
              expand="block"
              type="submit"
              class="modal-submit-btn"
              :disabled="submitting"
            >
              <ion-spinner v-if="submitting" name="crescent" slot="start" />
              <span>{{ submitting ? 'Menyimpan...' : (isEditingExp ? 'Perbarui Pengalaman' : 'Simpan Pengalaman') }}</span>
            </ion-button>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Modal Tambah / Edit Sertifikat -->
      <ion-modal :is-open="isCertModalOpen" @didDismiss="isCertModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ isEditingCert ? 'Edit Sertifikat' : 'Tambah Sertifikat' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isCertModalOpen = false">Batal</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <form @submit.prevent="saveCertificate" class="modal-form">
            <div class="form-group">
              <label class="form-label">Nama Sertifikat *</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="certForm.nama_sertifikat"
                  placeholder="Contoh: Certified Colorist DaVinci Resolve"
                  required
                />
              </ion-item>
            </div>

            <div class="form-group">
              <label class="form-label">Penerbit / Organisasi</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="certForm.penerbit"
                  placeholder="Contoh: Blackmagic Design"
                />
              </ion-item>
            </div>

            <div class="form-group">
              <label class="form-label">Tanggal Penerbitan</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="certForm.tanggal"
                  type="date"
                />
              </ion-item>
            </div>

            <div class="form-group">
              <div class="field-header-row">
                <label class="form-label">Berkas / Kredensial *</label>
                <input
                  type="file"
                  ref="certFileInputRef"
                  accept="image/*,application/pdf"
                  style="display: none"
                  @change="handleCertFileUpload"
                />
                <ion-button
                  size="small"
                  fill="outline"
                  class="upload-btn"
                  :disabled="uploadingCert"
                  @click="triggerCertFileInput"
                >
                  <ion-spinner v-if="uploadingCert" name="crescent" slot="start" />
                  <ion-icon v-else :icon="cloudUploadOutline" slot="start" />
                  {{ uploadingCert ? 'Mengunggah...' : 'Upload Berkas / GDrive' }}
                </ion-button>
              </div>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="certForm.file_url"
                  placeholder="https://... atau upload berkas di atas"
                  required
                />
              </ion-item>
            </div>

            <ion-button
              expand="block"
              type="submit"
              class="modal-submit-btn"
              :disabled="submitting"
            >
              <ion-spinner v-if="submitting" name="crescent" slot="start" />
              <span>{{ submitting ? 'Menyimpan...' : (isEditingCert ? 'Perbarui Sertifikat' : 'Simpan Sertifikat') }}</span>
            </ion-button>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Alert Hapus Pengalaman -->
      <ion-alert
        :is-open="showExpDeleteAlert"
        header="Hapus Pengalaman"
        :message="`Yakin ingin menghapus '${selectedExpToDelete?.nama_pengalaman}'?`"
        :buttons="[
          { text: 'Batal', role: 'cancel' },
          { text: 'Hapus', role: 'destructive', handler: handleDeleteExperience }
        ]"
        @didDismiss="showExpDeleteAlert = false"
      />

      <!-- Alert Hapus Sertifikat -->
      <ion-alert
        :is-open="showCertDeleteAlert"
        header="Hapus Sertifikat"
        :message="`Yakin ingin menghapus '${selectedCertToDelete?.nama_sertifikat}'?`"
        :buttons="[
          { text: 'Batal', role: 'cancel' },
          { text: 'Hapus', role: 'destructive', handler: handleDeleteCertificate }
        ]"
        @didDismiss="showCertDeleteAlert = false"
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
import { useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonInput,
  IonTextarea,
  IonToggle,
  IonAlert,
  IonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  addCircleOutline,
  addOutline,
  briefcaseOutline,
  ribbonOutline,
  createOutline,
  trashOutline,
  linkOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import {
  experienceService,
  certificatesService,
  uploadService,
  resolveMediaUrl,
  ExperienceItem,
  CertificateItem,
} from '@/services/api';

const route = useRoute();

const activeTab = ref<'experience' | 'certificates'>('experience');
const experiences = ref<ExperienceItem[]>([]);
const certificates = ref<CertificateItem[]>([]);
const loading = ref(false);
const submitting = ref(false);

// Experience Modal State
const isExpModalOpen = ref(false);
const isEditingExp = ref(false);
const currentExpId = ref<number | null>(null);
const expForm = ref({
  nama_pengalaman: '',
  deskripsi: '',
  tanggal_mulai: new Date().toISOString().split('T')[0],
  tanggal_selesai: '',
  isOngoing: true,
});

// Certificate Modal State
const isCertModalOpen = ref(false);
const isEditingCert = ref(false);
const currentCertId = ref<number | null>(null);
const certForm = ref({
  nama_sertifikat: '',
  penerbit: '',
  tanggal: new Date().toISOString().split('T')[0],
  file_url: '',
});

// Delete alert states
const showExpDeleteAlert = ref(false);
const selectedExpToDelete = ref<ExperienceItem | null>(null);
const showCertDeleteAlert = ref(false);
const selectedCertToDelete = ref<CertificateItem | null>(null);

// Toast
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

const formatYear = (dateStr: string) => {
  return new Date(dateStr).getFullYear();
};

const loadData = async () => {
  loading.value = true;
  try {
    const [exps, certs] = await Promise.allSettled([
      experienceService.getAll(),
      certificatesService.getAll(),
    ]);

    if (exps.status === 'fulfilled') {
      experiences.value = Array.isArray(exps.value) ? exps.value : [];
    }
    if (certs.status === 'fulfilled') {
      certificates.value = Array.isArray(certs.value) ? certs.value : [];
    }
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal memuat data.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async (event: any) => {
  await loadData();
  event.target.complete();
};

const openAddModal = () => {
  if (activeTab.value === 'experience') {
    isEditingExp.value = false;
    currentExpId.value = null;
    expForm.value = {
      nama_pengalaman: '',
      deskripsi: '',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: '',
      isOngoing: true,
    };
    isExpModalOpen.value = true;
  } else {
    isEditingCert.value = false;
    currentCertId.value = null;
    certForm.value = {
      nama_sertifikat: '',
      penerbit: '',
      tanggal: new Date().toISOString().split('T')[0],
      file_url: '',
    };
    isCertModalOpen.value = true;
  }
};

const openEditExperience = (exp: ExperienceItem) => {
  isEditingExp.value = true;
  currentExpId.value = exp.id || null;
  expForm.value = {
    nama_pengalaman: exp.nama_pengalaman,
    deskripsi: exp.deskripsi,
    tanggal_mulai: exp.tanggal_mulai ? new Date(exp.tanggal_mulai).toISOString().split('T')[0] : '',
    tanggal_selesai: exp.tanggal_selesai ? new Date(exp.tanggal_selesai).toISOString().split('T')[0] : '',
    isOngoing: !exp.tanggal_selesai,
  };
  isExpModalOpen.value = true;
};

const openEditCertificate = (cert: CertificateItem) => {
  isEditingCert.value = true;
  currentCertId.value = cert.id || null;
  certForm.value = {
    nama_sertifikat: cert.nama_sertifikat,
    penerbit: cert.penerbit || '',
    tanggal: cert.tanggal ? new Date(cert.tanggal).toISOString().split('T')[0] : '',
    file_url: cert.file_url,
  };
  isCertModalOpen.value = true;
};

const saveExperience = async () => {
  if (!expForm.value.nama_pengalaman.trim() || !expForm.value.deskripsi.trim()) return;

  submitting.value = true;
  try {
    const payload: Partial<ExperienceItem> = {
      nama_pengalaman: expForm.value.nama_pengalaman.trim(),
      deskripsi: expForm.value.deskripsi.trim(),
      tanggal_mulai: new Date(expForm.value.tanggal_mulai).toISOString(),
      tanggal_selesai: expForm.value.isOngoing ? null : new Date(expForm.value.tanggal_selesai).toISOString(),
    };

    if (isEditingExp.value && currentExpId.value) {
      await experienceService.update(currentExpId.value, payload);
      toastMessage.value = 'Pengalaman berhasil diperbarui!';
    } else {
      await experienceService.create(payload);
      toastMessage.value = 'Pengalaman baru berhasil ditambahkan!';
    }

    toastColor.value = 'success';
    showToast.value = true;
    isExpModalOpen.value = false;
    await loadData();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menyimpan pengalaman.';
    showToast.value = true;
  } finally {
    submitting.value = false;
  }
};

const certFileInputRef = ref<HTMLInputElement | null>(null);
const uploadingCert = ref(false);

const triggerCertFileInput = () => {
  if (certFileInputRef.value) {
    certFileInputRef.value.value = '';
    certFileInputRef.value.click();
  }
};

const handleCertFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingCert.value = true;
  try {
    const res = await uploadService.uploadFile(file);
    certForm.value.file_url = res.url;
    toastColor.value = 'success';
    toastMessage.value = `Berkas berhasil diunggah ke ${res.provider === 'gdrive' ? 'Google Drive' : 'Penyimpanan'}!`;
    showToast.value = true;
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal mengunggah berkas.';
    showToast.value = true;
  } finally {
    uploadingCert.value = false;
  }
};

const saveCertificate = async () => {
  if (!certForm.value.nama_sertifikat.trim() || !certForm.value.file_url.trim()) return;

  submitting.value = true;
  try {
    const payload: Partial<CertificateItem> = {
      nama_sertifikat: certForm.value.nama_sertifikat.trim(),
      penerbit: certForm.value.penerbit.trim() || null,
      tanggal: certForm.value.tanggal ? new Date(certForm.value.tanggal).toISOString() : null,
      file_url: certForm.value.file_url.trim(),
    };

    if (isEditingCert.value && currentCertId.value) {
      await certificatesService.update(currentCertId.value, payload);
      toastMessage.value = 'Sertifikat berhasil diperbarui!';
    } else {
      await certificatesService.create(payload);
      toastMessage.value = 'Sertifikat baru berhasil ditambahkan!';
    }

    toastColor.value = 'success';
    showToast.value = true;
    isCertModalOpen.value = false;
    await loadData();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menyimpan sertifikat.';
    showToast.value = true;
  } finally {
    submitting.value = false;
  }
};

const confirmDeleteExperience = (exp: ExperienceItem) => {
  selectedExpToDelete.value = exp;
  showExpDeleteAlert.value = true;
};

const handleDeleteExperience = async () => {
  if (!selectedExpToDelete.value?.id) return;
  try {
    await experienceService.delete(selectedExpToDelete.value.id);
    toastColor.value = 'success';
    toastMessage.value = 'Pengalaman berhasil dihapus.';
    showToast.value = true;
    await loadData();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menghapus pengalaman.';
    showToast.value = true;
  } finally {
    selectedExpToDelete.value = null;
  }
};

const confirmDeleteCertificate = (cert: CertificateItem) => {
  selectedCertToDelete.value = cert;
  showCertDeleteAlert.value = true;
};

const handleDeleteCertificate = async () => {
  if (!selectedCertToDelete.value?.id) return;
  try {
    await certificatesService.delete(selectedCertToDelete.value.id);
    toastColor.value = 'success';
    toastMessage.value = 'Sertifikat berhasil dihapus.';
    showToast.value = true;
    await loadData();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menghapus sertifikat.';
    showToast.value = true;
  } finally {
    selectedCertToDelete.value = null;
  }
};

onMounted(() => {
  loadData();
  if (route.query.action === 'add') {
    openAddModal();
  }
});
</script>

<style scoped>
.segment-toolbar {
  --background: #090712;
  --border-color: rgba(168, 85, 247, 0.15);
  padding: 4px 10px;
}

.custom-segment {
  --background: rgba(18, 13, 36, 0.7);
  border-radius: 10px;
}

ion-segment-button {
  --color: #94a3b8;
  --color-checked: #c084fc;
  --indicator-color: rgba(168, 85, 247, 0.35);
  font-size: 13px;
  font-weight: 700;
  min-height: 38px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 70px;
}

.item-card {
  padding: 16px;
}

.item-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.date-badge {
  font-size: 12px;
  font-weight: 700;
  color: #c084fc;
}

.ongoing-badge {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  padding: 3px 6px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.item-title {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.item-desc {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.45;
  margin: 0 0 12px 0;
}

.cert-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.cert-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.cert-meta {
  display: flex;
  flex-direction: column;
}

.cert-publisher {
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cert-date {
  font-size: 11px;
  color: #94a3b8;
}

.cert-url-box {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a855f7;
  background: rgba(147, 51, 234, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.cert-link {
  color: #c084fc;
  text-decoration: none;
  font-weight: 600;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 8px;
}

.edit-action-btn {
  --color: #c084fc;
  font-size: 12px;
  font-weight: 700;
}

.custom-fab {
  --background: linear-gradient(135deg, #9333ea, #d946ef);
  --box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
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

.field-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.upload-btn {
  --color: #38bdf8;
  --border-color: rgba(56, 189, 248, 0.4);
  font-size: 11px;
  font-weight: 700;
  --border-radius: 8px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.modal-input-item {
  --background: rgba(18, 13, 36, 0.9);
  --border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
}

.textarea-item {
  padding-top: 6px;
  padding-bottom: 6px;
}

.modal-submit-btn {
  --background: linear-gradient(135deg, #9333ea, #d946ef);
  --border-radius: 12px;
  font-weight: 800;
  height: 48px;
  margin-top: 10px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  color: #64748b;
  margin-bottom: 12px;
}

.add-btn-small {
  --background: rgba(147, 51, 234, 0.3);
  --color: #c084fc;
  --border-radius: 8px;
  font-weight: 700;
  margin-top: 12px;
}
</style>
