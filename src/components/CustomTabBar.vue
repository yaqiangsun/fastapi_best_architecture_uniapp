<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in list" 
      :key="index" 
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(item, index)"
    >
      <view class="icon-container">
        <view class="icon" :class="{ 'icon-active': currentIndex === index }">
          <!-- Home Icon -->
          <text v-if="index === 0" class="icon-text">🏠</text>
          
          <!-- Profile Icon -->
          <text v-if="index === 1" class="icon-text">👤</text>
        </view>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const list = [
  {
    pagePath: 'pages/index/index',
    text: 'Home'
  },
  {
    pagePath: 'pages/profile/index',
    text: 'Profile'
  }
];

const currentIndex = ref(0);

const updateCurrentIndex = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route || '';
    const index = list.findIndex(item => route.includes(item.pagePath));
    if (index !== -1) {
      currentIndex.value = index;
    }
  }
};

const switchTab = (item: any, index: number) => {
  if (currentIndex.value === index) return;
  
  uni.switchTab({
    url: '/' + item.pagePath
  });
};

onMounted(() => {
  updateCurrentIndex();
});

onShow(() => {
  updateCurrentIndex();
});
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  z-index: 999;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.icon-container {
  position: relative;
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.icon-text {
  font-size: 44rpx;
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.5;
}

.icon-active .icon-text {
  filter: grayscale(0%);
  opacity: 1;
  transform: translateY(-4rpx) scale(1.1);
  text-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.tab-text {
  font-size: 22rpx;
  color: #9ca3af;
  font-weight: 500;
  transition: all 0.3s ease;
  
  .active & {
    color: #667eea;
    font-weight: 600;
  }
}
</style>
