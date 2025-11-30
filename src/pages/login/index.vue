<template>
  <view class="login-container">
    <view class="login-box">
      <view class="logo-section">
        <text class="app-title">FastAPI Admin</text>
        <text class="app-subtitle">Mobile Application</text>
      </view>
      
      <view class="form-section">
        <view class="input-group">
          <input 
            v-model="loginForm.username" 
            class="input-field" 
            type="text" 
            placeholder="Username"
            :disabled="authStore.loginLoading"
          />
        </view>
        
        <view class="input-group">
          <input 
            v-model="loginForm.password" 
            class="input-field" 
            type="password" 
            placeholder="Password"
            :disabled="authStore.loginLoading"
          />
        </view>
        
        <view class="captcha-group">
          <input 
            v-model="loginForm.captcha" 
            class="captcha-input" 
            type="text" 
            placeholder="Captcha"
            :disabled="authStore.loginLoading"
          />
          <image 
            v-if="captchaImage" 
            :src="captchaImage" 
            class="captcha-image" 
            mode="aspectFit"
            @click="refreshCaptcha"
          />
        </view>
        
        <button 
          class="login-button" 
          :disabled="authStore.loginLoading"
          @click="handleLogin"
        >
          {{ authStore.loginLoading ? 'Logging in...' : 'Login' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useAccessStore } from '@/store/access';

const authStore = useAuthStore();
const accessStore = useAccessStore();

const loginForm = ref({
  username: '',
  password: '',
  captcha: '',
  uuid: ''
});

const captchaImage = ref('');

const refreshCaptcha = async () => {
  try {
    const imageData = await authStore.captcha();
    loginForm.value.uuid = accessStore.captchaUuid;
    // Convert base64 captcha to display
    captchaImage.value = `data:image/png;base64,${imageData}`;
  } catch (error) {
    console.error('Failed to load captcha', error);
  }
};

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password || !loginForm.value.captcha) {
    uni.showToast({
      title: 'Please fill in all fields',
      icon: 'none'
    });
    return;
  }

  await authStore.authLogin(loginForm.value);
};

onMounted(() => {
  // Check if already logged in
  if (accessStore.accessToken) {
    uni.reLaunch({ url: '/pages/index/index' });
    return;
  }
  refreshCaptcha();
});
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.login-box {
  width: 100%;
  max-width: 600rpx;
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;
}

.app-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.app-subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.form-section {
  width: 100%;
}

.input-group {
  margin-bottom: 30rpx;
}

.input-field {
  width: 100%;
  height: 88rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  box-sizing: border-box;
  
  &:focus {
    border-color: #667eea;
  }
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.captcha-input {
  flex: 1;
  height: 88rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.captcha-image {
  width: 200rpx;
  height: 88rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 12rpx;
  border: none;
  
  &:disabled {
    opacity: 0.6;
  }
}
</style>
