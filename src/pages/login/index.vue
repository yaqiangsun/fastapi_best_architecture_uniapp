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
            placeholder="验证码"
            :disabled="authStore.loginLoading"
          />
          <view class="captcha-container" @click="handleCaptchaClick">
            <!-- Loading state -->
            <view v-if="captchaLoading" class="captcha-loading">
              <view class="loading-spinner"></view>
            </view>
            <!-- Captcha image -->
            <image 
              v-else-if="captchaImage && !captchaError" 
              :src="captchaImage" 
              class="captcha-image" 
              mode="aspectFit"
            />
            <!-- Error state -->
            <view 
              v-else-if="captchaError"
              class="captcha-error"
            >
              <text class="retry-text">点击重试</text>
            </view>
            <!-- Placeholder -->
            <view v-else class="captcha-placeholder">
              <text class="placeholder-text">加载中...</text>
            </view>
            <!-- Refresh hint overlay -->
            <view v-if="!captchaLoading" class="refresh-hint">
              <text class="hint-icon">↻</text>
            </view>
          </view>
        </view>
        
        <button 
          class="login-button" 
          :disabled="authStore.loginLoading || captchaLoading"
          @click="handleLogin"
        >
          {{ authStore.loginLoading ? '登录中...' : '登录' }}
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
const captchaError = ref(false);
const captchaLoading = ref(false);
let refreshDebounceTimer: number | null = null;

// Debounced captcha refresh to prevent rapid clicking
const handleCaptchaClick = () => {
  if (captchaLoading.value) return;
  
  if (refreshDebounceTimer) {
    clearTimeout(refreshDebounceTimer);
  }
  
  refreshDebounceTimer = setTimeout(() => {
    refreshCaptcha();
  }, 300);
};

const refreshCaptcha = async () => {
  if (captchaLoading.value) return;
  
  try {
    captchaLoading.value = true;
    captchaError.value = false;
    captchaImage.value = '';
    
    const imageData = await authStore.captcha();
    loginForm.value.uuid = accessStore.captchaUuid;
    // Clear captcha input when refreshing
    loginForm.value.captcha = '';
    // Convert base64 captcha to display
    captchaImage.value = `data:image/png;base64,${imageData}`;
  } catch (error) {
    console.error('Failed to load captcha', error);
    captchaError.value = true;
    uni.showToast({
      title: '验证码加载失败',
      icon: 'none'
    });
  } finally {
    captchaLoading.value = false;
  }
};

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password || !loginForm.value.captcha) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }

  try {
    await authStore.authLogin(loginForm.value);
  } catch (error) {
    // Auto refresh captcha on login failure
    console.log('Login failed, refreshing captcha...');
    refreshCaptcha();
  }
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
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
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
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
  }
}

.captcha-container {
  position: relative;
  width: 200rpx;
  height: 88rpx;
  border-radius: 12rpx;
  overflow: hidden;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.captcha-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
}

.captcha-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.captcha-error {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  border: 2rpx dashed #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff5f5;
}

.retry-text {
  color: #ff6b6b;
  font-size: 24rpx;
}

.captcha-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: #999;
  font-size: 24rpx;
}

.refresh-hint {
  position: absolute;
  top: 4rpx;
  right: 4rpx;
  width: 32rpx;
  height: 32rpx;
  background-color: rgba(102, 126, 234, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.captcha-container:hover .refresh-hint {
  opacity: 1;
}

.hint-icon {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
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
  transition: opacity 0.3s;
  
  &:disabled {
    opacity: 0.6;
  }
  
  &:active:not(:disabled) {
    opacity: 0.9;
  }
}
</style>
