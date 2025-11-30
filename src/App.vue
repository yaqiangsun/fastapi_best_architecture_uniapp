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
  background: #f5f5f5;
}

.app {
  width: 100%;
  min-height: 100vh;
}
</style>
