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
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useAccessStore } from '@/store/access';
import { useAuthStore } from '@/store/auth';

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
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx 40rpx;
  color: white;
}

.welcome-text {
  font-size: 36rpx;
  font-weight: bold;
}

.content {
  padding: 40rpx;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.95);
  }
}

.card-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}
</style>
