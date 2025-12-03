<template>
  <view class="container">
    <view class="profile-header">
      <image 
        :src="userInfo?.avatar || '/static/default-avatar.png'" 
        class="avatar"
        mode="aspectFill"
      />
      <text class="username">{{ userInfo?.nickname || 'User' }}</text>
      <text class="email">{{ userInfo?.email || 'No email' }}</text>
    </view>
    
    <view class="profile-content">
      <view class="info-section">
        <view class="info-item">
          <text class="info-label">Username:</text>
          <text class="info-value">{{ userInfo?.username || '-' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">Phone:</text>
          <text class="info-value">{{ userInfo?.phone || '-' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">Department:</text>
          <text class="info-value">{{ userInfo?.dept || '-' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">Last Login:</text>
          <text class="info-value">{{ userInfo?.last_login_time || '-' }}</text>
        </view>
      </view>
      
      <button class="logout-button" @click="handleLogout">
        Logout
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { useAccessStore } from '@/store/access';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();

const userInfo = ref<any>(null);

const handleLogout = async () => {
  uni.showModal({
    title: 'Confirm Logout',
    content: 'Are you sure you want to logout?',
    success: async (res) => {
      if (res.confirm) {
        await authStore.logout();
      }
    }
  });
};

onMounted(async () => {
  if (!accessStore.accessToken) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

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
}

.profile-header {
  background: $uni-color-primary-gradient;
  padding: 80rpx 40rpx 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $uni-text-color-inverse;
  border-bottom-left-radius: 60rpx;
  border-bottom-right-radius: 60rpx;
  box-shadow: $uni-shadow-lg;
  position: relative;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20rpx;
    left: 0;
    right: 0;
    height: 40rpx;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(20rpx);
    z-index: -1;
  }
}

.avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  border: 8rpx solid rgba(255, 255, 255, 0.3);
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.username {
  font-size: 44rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
  animation: slideUp 0.6s ease-out 0.2s backwards;
}

.email {
  font-size: 28rpx;
  opacity: 0.9;
  font-weight: 400;
  animation: slideUp 0.6s ease-out 0.3s backwards;
}

.profile-content {
  padding: 0 40rpx;
  margin-top: -60rpx;
  position: relative;
  z-index: 1;
}

.info-section {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 10rpx 40rpx;
  margin-bottom: 40rpx;
  box-shadow: $uni-shadow-base;
  animation: slideUp 0.6s ease-out 0.4s backwards;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  font-weight: 500;
}

.info-value {
  font-size: 30rpx;
  color: $uni-text-color;
  font-weight: 600;
}

.logout-button {
  width: 100%;
  height: 96rpx;
  background: #fee2e2;
  color: $uni-color-error;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: $uni-border-radius-lg;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease-out 0.5s backwards;
  
  &:active {
    background: #fecaca;
    transform: scale(0.98);
  }
}
</style>
