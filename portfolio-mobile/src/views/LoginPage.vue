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
          <h1 class="brand-title text-gradient">shilycia's DEV</h1>
          <p class="brand-subtitle">Portfolio Management Studio</p>
          <span class="badge-tag">SECURE ACCESS // ADMIN CMS</span>
        </div>

        <!-- Login Form Card -->
        <div class="glass-panel form-card">
          <h2 class="form-title">Masuk ke Sistem</h2>
          <p class="form-desc">Masukkan kredensial akun admin untuk mengelola portofolio.</p>

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
        </div>

        <!-- Security Footer Badge -->
        <div class="security-badge">
          <span class="security-dot" />
          <span>TERENKRIPSI &bull; HELIPOD SECURE NETWORK</span>
        </div>
      </div>

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
} from '@ionic/vue';
import {
  shieldCheckmarkOutline,
  personOutline,
  lockClosedOutline,
  logInOutline,
} from 'ionicons/icons';
import { authService } from '@/services/api';

const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('danger');

onMounted(() => {
  // If already authenticated, redirect to dashboard
  if (authService.isAuthenticated()) {
    router.replace('/tabs/dashboard');
  }
});

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
    }, 400);
  } catch (err: any) {
    toastColor.value = 'danger';
    toastMessage.value = err.message || 'Username atau password salah.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
}

.glow-orb {
  position: absolute;
  top: 15%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(217, 70, 239, 0.1) 60%, transparent 80%);
  filter: blur(40px);
  pointer-events: none;
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}

.logo-circle {
  width: 76px;
  height: 76px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.35), rgba(6, 182, 212, 0.25));
  border: 1px solid rgba(168, 85, 247, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 0 35px rgba(147, 51, 234, 0.4);
}

.logo-icon {
  font-size: 40px;
  color: #c084fc;
}

.brand-title {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #ffffff 40%, #e9d5ff 70%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 14px 0;
  font-weight: 500;
}

.badge-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
}

.form-card {
  width: 100%;
  max-width: 380px;
  padding: 28px 22px;
  text-align: left;
  border-radius: 24px;
  border: 1px solid rgba(168, 85, 247, 0.25);
  background: rgba(18, 14, 28, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.6);
}

.form-title {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.form-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 22px 0;
  line-height: 1.5;
}

.custom-input-item {
  --background: rgba(8, 6, 13, 0.75);
  --border-radius: 14px;
  --padding-start: 14px;
  border: 1px solid rgba(168, 85, 247, 0.22);
  border-radius: 14px;
  margin-bottom: 14px;
  transition: all 0.2s ease;
}

.custom-input-item:focus-within {
  border-color: #c084fc;
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.25);
}

.input-icon {
  color: #c084fc;
  font-size: 20px;
  margin-right: 10px;
}

.login-btn {
  --background: linear-gradient(135deg, #9333ea, #c026d3);
  --border-radius: 14px;
  --box-shadow: 0 0 25px rgba(147, 51, 234, 0.45);
  font-weight: 700;
  margin-top: 22px;
  height: 50px;
  font-size: 15px;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.05em;
}

.security-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}
</style>
