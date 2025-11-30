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
  background: #f5f5f5;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80rpx 40rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  border: 4rpx solid white;
  margin-bottom: 30rpx;
}

.username {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.email {
  font-size: 24rpx;
  opacity: 0.9;
}

.profile-content {
  padding: 40rpx;
}

.info-section {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 28rpx;
  color: #333;
}

.logout-button {
  width: 100%;
  height: 88rpx;
  background: #ff4d4f;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 12rpx;
  border: none;
}
</style>
