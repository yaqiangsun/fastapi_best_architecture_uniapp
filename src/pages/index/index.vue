<template>
  <view class="container">
    <view class="header">
      <text class="welcome-text">Welcome, {{ userInfo?.nickname || 'User' }}</text>
    </view>
    
    <view class="content">
      <view class="card-grid">
        <view class="card" @click="navigateTo('/pages/system/users')">
          <text class="card-icon">👥</text>
          <text class="card-title">Users</text>
        </view>
        
        <view class="card" @click="navigateTo('/pages/system/roles')">
          <text class="card-icon">🔐</text>
          <text class="card-title">Roles</text>
        </view>
        
        <view class="card" @click="navigateTo('/pages/system/depts')">
          <text class="card-icon">🏢</text>
          <text class="card-title">Departments</text>
        </view>
        
        <view class="card" @click="navigateTo('/pages/monitor/logs')">
          <text class="card-icon">📝</text>
          <text class="card-title">Logs</text>
        </view>
      </view>
    </view>
    <custom-tab-bar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useAccessStore } from '@/store/access';
import { useAuthStore } from '@/store/auth';
import CustomTabBar from '@/components/CustomTabBar.vue';

const userStore = useUserStore();
const accessStore = useAccessStore();
const authStore = useAuthStore();

const userInfo = ref<any>(null);

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

onMounted(async () => {
  // Check login status
  if (!accessStore.accessToken) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  // Fetch user info if not available
  if (!userStore.userInfo) {
    try {
      await authStore.fetchUserInfo();
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  }
  
  userInfo.value = userStore.userInfo;
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.header {
  background: $uni-color-primary-gradient;
  padding: 60rpx 40rpx 80rpx;
  color: $uni-text-color-inverse;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  box-shadow: $uni-shadow-lg;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400rpx;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 8s ease-in-out infinite;
  }
}

.welcome-text {
  font-size: 48rpx;
  font-weight: 800;
  display: block;
  margin-bottom: 10rpx;
  animation: slideUp 0.6s ease-out;
}

.subtitle-text {
  font-size: 28rpx;
  opacity: 0.9;
  animation: slideUp 0.6s ease-out 0.1s backwards;
}

.content {
  padding: 0 40rpx;
  margin-top: -60rpx;
  position: relative;
  z-index: 1;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.card {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 50rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: $uni-shadow-base;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.02);
  
  // Staggered animation for cards
  animation: scaleIn 0.5s ease-out backwards;
  
  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.4s; }
  &:nth-child(4) { animation-delay: 0.5s; }
  
  &:active {
    transform: scale(0.96);
    box-shadow: $uni-shadow-sm;
  }
}

.card-icon {
  font-size: 72rpx;
  margin-bottom: 24rpx;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $uni-text-color;
}
</style>
