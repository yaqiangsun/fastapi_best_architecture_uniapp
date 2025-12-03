<template>
  <view class="app">
    <router-view />
  </view>
</template>

<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { createPinia } from 'pinia';

const pinia = createPinia();

onLaunch(() => {
  console.log('App Launch');
});
</script>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: $uni-text-color;
}

.app {
  width: 100%;
  min-height: 100vh;
}

/* Global Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
