<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon aria-hidden="true" :icon="gridOutline" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="works" href="/tabs/works">
          <ion-icon aria-hidden="true" :icon="imagesOutline" />
          <ion-label>Karya</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="experience" href="/tabs/experience">
          <ion-icon aria-hidden="true" :icon="briefcaseOutline" />
          <ion-label>Karir</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import {
  gridOutline,
  imagesOutline,
  briefcaseOutline,
  personCircleOutline,
} from 'ionicons/icons';
</script>

<style scoped>
.custom-tab-bar {
  --background: #0d0819;
  --border-color: rgba(168, 85, 247, 0.18);
  border-top: 1px solid rgba(168, 85, 247, 0.18);
  height: 58px;
}

ion-tab-button {
  --color: #64748b;
  --color-selected: #c084fc;
}

ion-tab-button ion-icon {
  font-size: 22px;
  margin-bottom: 3px;
}

ion-tab-button ion-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
