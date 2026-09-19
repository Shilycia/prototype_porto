<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Manajemen Karya</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon :icon="addCircleOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Category Filter Toolbar -->
      <ion-toolbar class="category-toolbar">
        <ion-segment
          v-model="selectedCategory"
          :scrollable="true"
          class="custom-segment"
        >
          <ion-segment-button
            v-for="cat in categories"
            :key="cat"
            :value="cat"
          >
            <ion-label>{{ cat }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Searchbar -->
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Cari karya..."
        class="custom-searchbar"
      />

      <!-- Loading State -->
      <div v-if="loading && works.length === 0" class="loading-state">
        <ion-spinner name="crescent" color="primary" />
        <p>Memuat koleksi karya...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredWorks.length === 0" class="empty-state glass-panel">
        <ion-icon :icon="imagesOutline" class="empty-icon" />
        <h3>Tidak Ada Karya</h3>
        <p v-if="searchQuery">Tidak ditemukan karya dengan kata kunci "{{ searchQuery }}"</p>
        <p v-else>Belum ada karya yang diunggah dalam kategori ini.</p>
        <ion-button size="small" class="add-btn-small" @click="openAddModal">
          <ion-icon :icon="addOutline" slot="start" />
          Tambah Karya Baru
        </ion-button>
      </div>

      <!-- Works List -->
      <div v-else class="works-list">
        <div
          v-for="work in filteredWorks"
          :key="work.id"
          class="work-card glass-panel"
        >
          <!-- Media Preview Image -->
          <div class="card-media-wrap">
            <img
              v-if="work.media_urls && work.media_urls.length > 0"
              :src="work.media_urls[0]"
              :alt="work.nama_karya"
              class="card-img"
              @error="(e: any) => e.target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600'"
            />
            <div v-else class="card-no-media">
              <ion-icon :icon="imageOutline" />
              <span>No Media</span>
            </div>
            <span class="media-count-badge" v-if="work.media_urls && work.media_urls.length > 1">
              {{ work.media_urls.length }} Media
            </span>
          </div>

          <!-- Content Details -->
          <div class="card-body">
            <div class="card-header-row">
              <span class="badge-tag">{{ work.kategori || 'Creative' }}</span>
              <span class="card-date" v-if="work.tanggal_pembuatan">
                {{ new Date(work.tanggal_pembuatan).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) }}
              </span>
            </div>

            <h3 class="card-title">{{ work.nama_karya }}</h3>
            <p class="card-desc">{{ work.deskripsi }}</p>

            <div v-if="work.log_proses" class="process-log-preview">
              <span class="log-label">Log:</span> {{ work.log_proses }}
            </div>

            <!-- Card Actions -->
            <div class="card-actions-row">
              <ion-button
                size="small"
                fill="clear"
                class="edit-action-btn"
                @click="openEditModal(work)"
              >
                <ion-icon :icon="createOutline" slot="start" />
                Edit
              </ion-button>

              <ion-button
                size="small"
                fill="clear"
                color="danger"
                class="delete-action-btn"
                @click="confirmDelete(work)"
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

      <!-- Modal Tambah / Edit Karya -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ isEditing ? 'Edit Karya' : 'Tambah Karya Baru' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Batal</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <form @submit.prevent="saveWork" class="modal-form">
            <!-- Nama Karya -->
            <div class="form-group">
              <label class="form-label">Nama Karya *</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="form.nama_karya"
                  placeholder="Contoh: Neon Solitude: Urban Night"
                  required
                />
              </ion-item>
            </div>

            <!-- Kategori -->
            <div class="form-group">
              <label class="form-label">Kategori *</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-select
                  v-model="form.kategori"
                  placeholder="Pilih Kategori"
                  interface="action-sheet"
                >
                  <ion-select-option value="Photography">Photography</ion-select-option>
                  <ion-select-option value="Cinematography">Cinematography</ion-select-option>
                  <ion-select-option value="Design">Design</ion-select-option>
                  <ion-select-option value="Editorial">Editorial</ion-select-option>
                  <ion-select-option value="Motion Graphics">Motion Graphics</ion-select-option>
                  <ion-select-option value="Architecture">Architecture</ion-select-option>
                </ion-select>
              </ion-item>
            </div>

            <!-- Tanggal Pembuatan -->
            <div class="form-group">
              <label class="form-label">Tanggal Pembuatan</label>
              <ion-item class="modal-input-item" lines="none">
                <ion-input
                  v-model="form.tanggal_pembuatan"
                  type="date"
                />
              </ion-item>
            </div>

            <!-- Deskripsi -->
            <div class="form-group">
              <label class="form-label">Deskripsi Karya *</label>
              <ion-item class="modal-input-item textarea-item" lines="none">
                <ion-textarea
                  v-model="form.deskripsi"
                  :rows="3"
                  placeholder="Jelaskan konsep dan keunikan visual karya ini..."
                  required
                />
              </ion-item>
            </div>

            <!-- Log Proses -->
            <div class="form-group">
              <label class="form-label">Catatan Log / Proses Produksi</label>
              <ion-item class="modal-input-item textarea-item" lines="none">
                <ion-textarea
                  v-model="form.log_proses"
                  :rows="2"
                  placeholder="Teknik kamera, software, pencahayaan, atau gear yang digunakan..."
                />
              </ion-item>
            </div>

            <!-- Media URLs List -->
            <div class="form-group">
              <div class="media-header-row">
                <label class="form-label">Foto / Media Karya</label>
                <div class="media-actions">
                  <input
                    type="file"
                    ref="mediaFileInputRef"
                    accept="image/*,video/*"
                    style="display: none"
                    @change="handleMediaUpload"
                  />
                  <ion-button
                    size="small"
                    fill="outline"
                    class="upload-btn"
                    :disabled="uploadingMedia"
                    @click="triggerMediaInput"
                  >
                    <ion-spinner v-if="uploadingMedia" name="crescent" slot="start" />
                    <ion-icon v-else :icon="cloudUploadOutline" slot="start" />
                    {{ uploadingMedia ? 'Mengunggah...' : 'Upload File / GDrive' }}
                  </ion-button>
                  <ion-button
                    size="small"
                    fill="clear"
                    class="add-url-btn"
                    @click="addMediaUrlField"
                  >
                    <ion-icon :icon="addOutline" slot="start" />
                    URL
                  </ion-button>
                </div>
              </div>

              <div
                v-for="(url, idx) in form.media_urls"
                :key="idx"
                class="media-url-row"
              >
                <ion-item class="modal-input-item flex-1" lines="none">
                  <ion-input
                    v-model="form.media_urls[idx]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </ion-item>
                <ion-button
                  fill="clear"
                  color="danger"
                  @click="removeMediaUrlField(idx)"
                  :disabled="form.media_urls.length <= 1"
                >
                  <ion-icon :icon="trashOutline" />
                </ion-button>
              </div>

              <!-- Preview Media Thumbnail -->
              <div
                v-if="form.media_urls[0]"
                class="media-preview-box"
              >
                <img
                  :src="form.media_urls[0]"
                  alt="Preview"
                  class="preview-img"
                  @error="(e: any) => e.target.style.display = 'none'"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <ion-button
              expand="block"
              type="submit"
              class="modal-submit-btn"
              :disabled="submitting"
            >
              <ion-spinner v-if="submitting" name="crescent" slot="start" />
              <span>{{ submitting ? 'Menyimpan...' : (isEditing ? 'Perbarui Karya' : 'Simpan Karya') }}</span>
            </ion-button>
          </form>
        </ion-content>
      </ion-modal>

      <!-- Alert Hapus -->
      <ion-alert
        :is-open="showDeleteAlert"
        header="Konfirmasi Hapus"
        :message="`Yakin ingin menghapus karya '${selectedWorkToDelete?.nama_karya}'? Tindakan ini tidak dapat dibatalkan.`"
        :buttons="[
          { text: 'Batal', role: 'cancel' },
          { text: 'Hapus', role: 'destructive', handler: handleDeleteWork }
        ]"
        @didDismiss="showDeleteAlert = false"
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
import { ref, computed, onMounted } from 'vue';
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
  IonSearchbar,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  addCircleOutline,
  addOutline,
  cloudUploadOutline,
  imagesOutline,
  imageOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { worksService, uploadService, WorkItem } from '@/services/api';

const route = useRoute();

const categories = [
  'All',
  'Photography',
  'Cinematography',
  'Design',
  'Editorial',
  'Motion Graphics',
  'Architecture',
];

const works = ref<WorkItem[]>([]);
const loading = ref(false);
const submitting = ref(false);
const selectedCategory = ref('All');
const searchQuery = ref('');

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentEditId = ref<number | null>(null);

const form = ref({
  nama_karya: '',
  kategori: 'Photography',
  deskripsi: '',
  tanggal_pembuatan: new Date().toISOString().split('T')[0],
  log_proses: '',
  media_urls: [''],
});

// Delete alert state
const showDeleteAlert = ref(false);
const selectedWorkToDelete = ref<WorkItem | null>(null);

// Toast feedback
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

const filteredWorks = computed(() => {
  return works.value.filter((w) => {
    const matchCategory =
      selectedCategory.value === 'All' ||
      w.kategori?.toLowerCase() === selectedCategory.value.toLowerCase();
    const matchSearch =
      !searchQuery.value ||
      w.nama_karya.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.deskripsi?.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

const loadWorks = async () => {
  loading.value = true;
  try {
    const data = await worksService.getAll();
    works.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal memuat daftar karya.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async (event: any) => {
  await loadWorks();
  event.target.complete();
};

const openAddModal = () => {
  isEditing.value = false;
  currentEditId.value = null;
  form.value = {
    nama_karya: '',
    kategori: 'Photography',
    deskripsi: '',
    tanggal_pembuatan: new Date().toISOString().split('T')[0],
    log_proses: '',
    media_urls: [''],
  };
  isModalOpen.value = true;
};

const openEditModal = (work: WorkItem) => {
  isEditing.value = true;
  currentEditId.value = work.id || null;
  form.value = {
    nama_karya: work.nama_karya,
    kategori: work.kategori || 'Photography',
    deskripsi: work.deskripsi,
    tanggal_pembuatan: work.tanggal_pembuatan
      ? new Date(work.tanggal_pembuatan).toISOString().split('T')[0]
      : '',
    log_proses: work.log_proses || '',
    media_urls:
      work.media_urls && work.media_urls.length > 0
        ? [...work.media_urls]
        : [''],
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const mediaFileInputRef = ref<HTMLInputElement | null>(null);
const uploadingMedia = ref(false);

const triggerMediaInput = () => {
  if (mediaFileInputRef.value) {
    mediaFileInputRef.value.value = '';
    mediaFileInputRef.value.click();
  }
};

const handleMediaUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingMedia.value = true;
  try {
    const res = await uploadService.uploadFile(file);
    if (form.value.media_urls.length === 1 && !form.value.media_urls[0]) {
      form.value.media_urls[0] = res.url;
    } else {
      form.value.media_urls.push(res.url);
    }
    toastColor.value = 'success';
    toastMessage.value = `Berhasil diunggah ke ${res.provider === 'gdrive' ? 'Google Drive' : 'Penyimpanan'}!`;
    showToast.value = true;
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal mengunggah berkas.';
    showToast.value = true;
  } finally {
    uploadingMedia.value = false;
  }
};

const addMediaUrlField = () => {
  form.value.media_urls.push('');
};

const removeMediaUrlField = (idx: number) => {
  if (form.value.media_urls.length > 1) {
    form.value.media_urls.splice(idx, 1);
  }
};

const saveWork = async () => {
  if (!form.value.nama_karya.trim() || !form.value.deskripsi.trim()) return;

  submitting.value = true;
  try {
    const payload: Partial<WorkItem> = {
      nama_karya: form.value.nama_karya.trim(),
      kategori: form.value.kategori,
      deskripsi: form.value.deskripsi.trim(),
      tanggal_pembuatan: form.value.tanggal_pembuatan
        ? new Date(form.value.tanggal_pembuatan).toISOString()
        : null,
      log_proses: form.value.log_proses.trim() || null,
      media_urls: form.value.media_urls.filter((u) => u.trim() !== ''),
    };

    if (isEditing.value && currentEditId.value) {
      await worksService.update(currentEditId.value, payload);
      toastMessage.value = 'Karya berhasil diperbarui!';
    } else {
      await worksService.create(payload);
      toastMessage.value = 'Karya baru berhasil ditambahkan!';
    }

    toastColor.value = 'success';
    showToast.value = true;
    closeModal();
    await loadWorks();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menyimpan karya.';
    showToast.value = true;
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (work: WorkItem) => {
  selectedWorkToDelete.value = work;
  showDeleteAlert.value = true;
};

const handleDeleteWork = async () => {
  if (!selectedWorkToDelete.value?.id) return;

  try {
    await worksService.delete(selectedWorkToDelete.value.id);
    toastColor.value = 'success';
    toastMessage.value = 'Karya berhasil dihapus.';
    showToast.value = true;
    await loadWorks();
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Gagal menghapus karya.';
    showToast.value = true;
  } finally {
    selectedWorkToDelete.value = null;
  }
};

onMounted(() => {
  loadWorks();
  if (route.query.action === 'add') {
    openAddModal();
  }
});
</script>

<style scoped>
.category-toolbar {
  --background: #090712;
  --border-color: rgba(168, 85, 247, 0.15);
  padding: 4px 0;
}

.custom-segment {
  --background: transparent;
}

ion-segment-button {
  --color: #94a3b8;
  --color-checked: #c084fc;
  --indicator-color: rgba(168, 85, 247, 0.25);
  font-size: 12px;
  font-weight: 700;
  min-height: 34px;
}

.custom-searchbar {
  --background: rgba(18, 13, 36, 0.7);
  --color: #ffffff;
  --placeholder-color: #64748b;
  --icon-color: #c084fc;
  --border-radius: 12px;
  padding: 0;
  margin-bottom: 16px;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 70px;
}

.work-card {
  overflow: hidden;
}

.card-media-wrap {
  width: 100%;
  height: 180px;
  position: relative;
  background: #000;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-no-media {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 6px;
  font-size: 12px;
  background: rgba(147, 51, 234, 0.08);
}

.card-no-media ion-icon {
  font-size: 32px;
}

.media-count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.card-body {
  padding: 16px;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-date {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.card-title {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.card-desc {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.4;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.process-log-preview {
  font-size: 11px;
  color: #a855f7;
  background: rgba(147, 51, 234, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-label {
  font-weight: 800;
  color: #c084fc;
}

.card-actions-row {
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

.delete-action-btn {
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

.media-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.media-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.upload-btn {
  --color: #38bdf8;
  --border-color: rgba(56, 189, 248, 0.4);
  font-size: 11px;
  font-weight: 700;
  --border-radius: 8px;
}

.add-url-btn {
  --color: #c084fc;
  font-size: 11px;
  font-weight: 700;
}

.media-url-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.media-preview-box {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  margin-top: 8px;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
