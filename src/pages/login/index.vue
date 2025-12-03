<template>
  <view class="login-container">
    <view class="bg-circles">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    <view class="login-box" :class="{ 'keyboard-open': isFocused }">
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
            :adjust-position="false"
            @click="handleFocus"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </view>
        
        <view class="input-group">
          <input 
            v-model="loginForm.password" 
            class="input-field" 
            type="password" 
            placeholder="Password"
            :disabled="authStore.loginLoading"
            :adjust-position="false"
            @click="handleFocus"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </view>
        
        <view class="captcha-group">
          <input 
            v-model="loginForm.captcha" 
            class="captcha-input" 
            type="text" 
            placeholder="验证码"
            :disabled="authStore.loginLoading"
            :adjust-position="false"
            @click="handleFocus"
            @focus="handleFocus"
            @blur="handleBlur"
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
  username: 'admin',
  password: '123456',
  captcha: '',
  uuid: ''
});

const captchaImage = ref('');
const captchaError = ref(false);
const captchaLoading = ref(false);
const isFocused = ref(false);
let refreshDebounceTimer: number | null = null;

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

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
  background: linear-gradient(-45deg, #667eea, #764ba2, #6B8DD6, #8E37D7);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding: 40rpx;
  position: relative;
  overflow: hidden;
}

.bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.circle-1 {
  width: 300rpx;
  height: 300rpx;
  top: -50rpx;
  left: -50rpx;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 400rpx;
  height: 400rpx;
  bottom: -100rpx;
  right: -100rpx;
  animation: float 10s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200rpx;
  height: 200rpx;
  top: 40%;
  left: 20%;
  background: rgba(255, 255, 255, 0.05);
  animation: float 12s ease-in-out infinite 2s;
}

.login-box {
  width: 100%;
  max-width: 600rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: slideUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &.keyboard-open {
    transform: translateY(-150rpx);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;
  animation: fadeIn 0.8s ease-out 0.2s backwards;
}

.app-title {
  font-size: 56rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: block;
  margin-bottom: 16rpx;
  letter-spacing: -1rpx;
}

.app-subtitle {
  font-size: 28rpx;
  color: #888;
  display: block;
  font-weight: 500;
  letter-spacing: 1rpx;
  text-transform: uppercase;
}

.form-section {
  width: 100%;
}

.input-group {
  margin-bottom: 36rpx;
  animation: fadeIn 0.8s ease-out 0.4s backwards;
}

.input-field {
  width: 100%;
  height: 96rpx;
  padding: 0 36rpx;
  font-size: 30rpx;
  background: #f5f7fa;
  border: 2rpx solid transparent;
  border-radius: 24rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;
  color: #333;
  
  &:focus {
    background: #fff;
    border-color: #667eea;
    box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background-color: #f0f2f5;
    color: #999;
  }
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 48rpx;
  animation: fadeIn 0.8s ease-out 0.5s backwards;
}

.captcha-input {
  flex: 1;
  height: 96rpx;
  padding: 0 36rpx;
  font-size: 30rpx;
  background: #f5f7fa;
  border: 2rpx solid transparent;
  border-radius: 24rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    background: #fff;
    border-color: #667eea;
    box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
  }
}

.captcha-container {
  position: relative;
  width: 220rpx;
  height: 96rpx;
  border-radius: 24rpx;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.captcha-image {
  width: 100%;
  height: 100%;
  background: #fff;
}

.captcha-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.captcha-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff5f5;
  border: 2rpx dashed #ff6b6b;
  border-radius: 24rpx;
  box-sizing: border-box;
}

.retry-text {
  color: #ff6b6b;
  font-size: 24rpx;
  font-weight: 500;
}

.captcha-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
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
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  background-color: rgba(102, 126, 234, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.captcha-container:hover .refresh-hint {
  opacity: 1;
  transform: scale(1);
}

.hint-icon {
  color: white;
  font-size: 20rpx;
  font-weight: bold;
}

.login-button {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 24rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 20rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  animation: fadeIn 0.8s ease-out 0.6s backwards;
  
  &:active:not(:disabled) {
    transform: translateY(2rpx) scale(0.98);
    box-shadow: 0 5rpx 10rpx rgba(102, 126, 234, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    background: linear-gradient(135deg, #a0a0a0 0%, #c0c0c0 100%);
    box-shadow: none;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30rpx, -30rpx); }
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
