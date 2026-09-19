<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <div class="login-wrapper">
        <!-- Cosmic Ambient Glow -->
        <div class="glow-orb" />

        <!-- Logo / Branding Section -->
        <div class="brand-section">
          <div class="logo-circle">
            <ion-icon :icon="shieldCheckmarkOutline" class="logo-icon" />
          </div>
          <h1 class="brand-title text-gradient">DIYUL ADMIN</h1>
          <p class="brand-subtitle">Portfolio Content Management System</p>
          <span class="badge-tag">MOBILE SUITE // V1.0</span>
        </div>

        <!-- Login Form Card -->
        <div class="glass-panel form-card">
          <h2 class="form-title">Masuk ke Sistem</h2>
          <p class="form-desc">Masukkan kredensial admin untuk mengelola portofolio.</p>

          <form @submit.prevent="handleLogin">
            <ion-item class="custom-input-item" lines="none">
              <ion-icon :icon="personOutline" slot="start" class="input-icon" />
              <ion-input
                v-model="username"
                type="text"
                placeholder="Username Admin"
                required
                autocomplete="username"
              />
            </ion-item>

            <ion-item class="custom-input-item" lines="none">
              <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon" />
              <ion-input
                v-model="password"
                type="password"
                placeholder="Kata Sandi"
                required
                autocomplete="current-password"
              />
            </ion-item>

            <ion-button
              expand="block"
              type="submit"
              class="login-btn"
              :disabled="loading"
            >
              <ion-spinner v-if="loading" name="crescent" slot="start" />
              <ion-icon v-else :icon="logInOutline" slot="start" />
              <span>{{ loading ? 'Memverifikasi...' : 'Masuk Dashboard' }}</span>
            </ion-button>
          </form>

          <!-- Quick Fill Button for testing convenience -->
          <div class="demo-cred-box">
            <p class="demo-cred-text">Akun Default (dari database seed):</p>
            <ion-button
              fill="clear"
              size="small"
              class="quick-fill-btn"
              @click="fillDefaultCredentials"
            >
              <ion-icon :icon="flashOutline" slot="start" />
              Gunakan: admin / adminpassword123
            </ion-button>
          </div>

          <!-- API URL Indicator -->
          <div class="api-status-box" @click="openApiConfigAlert" style="cursor: pointer;" title="Klik untuk mengubah URL API">
            <span class="api-dot" />
            <span class="api-text">API: {{ apiUrl }} ✏️</span>
          </div>
        </div>
      </div>

      <!-- Change API URL Alert -->
      <ion-alert
        :is-open="isApiAlertOpen"
        header="Konfigurasi URL API"
        sub-header="Masukkan alamat backend server"
        message="Untuk Android Emulator gunakan: http://10.0.2.2:3001. Untuk HP fisik gunakan IP Wi-Fi laptop atau URL Cloud (HTTPS)."
        :inputs="alertInputs"
        :buttons="alertButtons"
        @didDismiss="handleAlertDismiss"
      />

      <!-- Toast Alert -->
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="3000"
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
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonAlert,
} from '@ionic/vue';
import {
  shieldCheckmarkOutline,
  personOutline,
  lockClosedOutline,
  logInOutline,
  flashOutline,
} from 'ionicons/icons';
import { authService, getApiBaseUrl, setApiBaseUrl } from '@/services/api';

const router = useRouter();

const username = ref('admin');
const password = ref('adminpassword123');
const loading = ref(false);
const apiUrl = ref('');

const isApiAlertOpen = ref(false);
const alertInputs = ref<any[]>([]);
const alertButtons = [
  {
    text: 'Batal',
    role: 'cancel',
  },
  {
    text: 'Simpan',
    role: 'confirm',
  },
];

const openApiConfigAlert = () => {
  alertInputs.value = [
    {
      name: 'url',
      type: 'text',
      placeholder: 'http://10.0.2.2:3001',
      value: apiUrl.value,
    },
  ];
  isApiAlertOpen.value = true;
};

const handleAlertDismiss = (ev: CustomEvent) => {
  isApiAlertOpen.value = false;
  if (ev.detail.role === 'confirm' && ev.detail.data?.values?.url) {
    const newUrl = ev.detail.data.values.url.trim();
    if (newUrl) {
      setApiBaseUrl(newUrl);
      apiUrl.value = getApiBaseUrl();
      toastColor.value = 'success';
      toastMessage.value = `URL API berhasil diubah: ${apiUrl.value}`;
      showToast.value = true;
    }
  }
};

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('danger');

onMounted(() => {
  apiUrl.value = getApiBaseUrl();
  // If already authenticated, redirect to dashboard
  if (authService.isAuthenticated()) {
    router.replace('/tabs/dashboard');
  }
});

const fillDefaultCredentials = () => {
  username.value = 'admin';
  password.value = 'adminpassword123';
};

const handleLogin = async () => {
  if (!username.value || !password.value) return;

  loading.value = true;
  try {
    const res = await authService.login(username.value, password.value);
    toastColor.value = 'success';
    toastMessage.value = res.message || 'Login berhasil! Mengalihkan ke dashboard...';
    showToast.value = true;

    setTimeout(() => {
      router.replace('/tabs/dashboard');
    }, 500);
  } catch (error: any) {
    toastColor.value = 'danger';
    toastMessage.value = error.message || 'Gagal login. Periksa username dan password.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  max-width: 420px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.glow-orb {
  position: absolute;
  top: -40px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.28) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: -1;
}

.brand-section {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-circle {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(217, 70, 239, 0.2));
  border: 1.5px solid rgba(168, 85, 247, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.35);
}

.logo-icon {
  font-size: 38px;
  color: #c084fc;
}

.brand-title {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.06em;
  margin: 0 0 6px 0;
}

.brand-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 12px 0;
}

.form-card {
  width: 100%;
  padding: 26px 20px;
  text-align: left;
}

.form-title {
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.form-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 20px 0;
}

.custom-input-item {
  --background: rgba(8, 6, 13, 0.7);
  --border-radius: 12px;
  --padding-start: 14px;
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 12px;
  margin-bottom: 14px;
  transition: border-color 0.2s;
}

.custom-input-item:focus-within {
  border-color: #c084fc;
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.2);
}

.input-icon {
  color: #c084fc;
  font-size: 20px;
  margin-right: 10px;
}

.login-btn {
  --background: linear-gradient(135deg, #9333ea, #d946ef);
  --border-radius: 12px;
  --box-shadow: 0 0 25px rgba(147, 51, 234, 0.4);
  font-weight: 700;
  margin-top: 20px;
  height: 48px;
}

.demo-cred-box {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

.demo-cred-text {
  font-size: 11px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.quick-fill-btn {
  --color: #c084fc;
  font-size: 12px;
  font-weight: 600;
}

.api-status-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.api-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.api-text {
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
}
</style>
