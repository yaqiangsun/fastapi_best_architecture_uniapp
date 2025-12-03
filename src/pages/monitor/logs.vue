<template>
  <view class="container">
    <view class="filter-bar">
      <picker mode="selector" :range="logTypes" @change="onTypeChange">
        <view class="picker">
          <text>Type: {{ logTypes[selectedType] }}</text>
        </view>
      </picker>
    </view>

    <view class="log-list">
      <view 
        v-for="(log, index) in logs" 
        :key="index" 
        class="log-card"
        @click="viewLogDetail(log)"
      >
        <view class="log-header">
          <view :class="['log-type', getLogTypeClass(log.type)]">
            {{ log.type || 'INFO' }}
          </view>
          <text class="log-time">{{ formatTime(log.created_time) }}</text>
        </view>
        
        <view class="log-content">
          <text class="log-user">User: {{ log.username || 'System' }}</text>
          <text class="log-message">{{ log.msg || log.summary || 'No message' }}</text>
          <text v-if="log.ip" class="log-ip">IP: {{ log.ip }}</text>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!loading && logs.length === 0" class="empty">
      <text>No logs found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getLoginLogListApi } from '@/api/log';
import type { LoginLogParams } from '@/api/log';

const logs = ref<any[]>([]);
const loading = ref(false);
const logTypes = ['All', 'Login', 'Operation', 'Error'];
const selectedType = ref(0);

const loadLogs = async () => {
  try {
    loading.value = true;
    const params: LoginLogParams = {
      page: 1,
      size: 50
    };
    const result = await getLoginLogListApi(params);
    logs.value = Array.isArray(result) ? result : (result as any)?.items || [];
  } catch (error) {
    console.error('Failed to load logs', error);
    uni.showToast({
      title: 'Failed to load logs',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const onTypeChange = (e: any) => {
  selectedType.value = e.detail.value;
  loadLogs();
};

const formatTime = (time: string) => {
  if (!time) return '-';
  const date = new Date(time);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const getLogTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    'INFO': 'info',
    'WARN': 'warning',
    'ERROR': 'error',
    'SUCCESS': 'success'
  };
  return typeMap[type] || 'info';
};

const viewLogDetail = (log: any) => {
  uni.showModal({
    title: 'Log Detail',
    content: JSON.stringify(log, null, 2),
    showCancel: false
  });
};

onMounted(() => {
  loadLogs();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding: 30rpx;
}

.filter-bar {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: $uni-shadow-sm;
  animation: fadeIn 0.6s ease-out;
}

.picker {
  padding: 24rpx;
  background: $uni-bg-color-hover;
  border-radius: $uni-border-radius-base;
  transition: all 0.3s ease;
  
  &:active {
    background: #e5e7eb;
  }
  
  text {
    font-size: 28rpx;
    color: $uni-text-color;
    font-weight: 500;
  }
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.log-card {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 36rpx;
  box-shadow: $uni-shadow-sm;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease-out backwards;
  
  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.log-type {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
  
  &.info {
    background: #eff6ff;
    color: $uni-color-info;
  }
  
  &.warning {
    background: #fffbeb;
    color: $uni-color-warning;
  }
  
  &.error {
    background: #fef2f2;
    color: $uni-color-error;
  }
  
  &.success {
    background: #ecfdf5;
    color: $uni-color-success;
  }
}

.log-time {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
  font-family: monospace;
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.log-user {
  font-size: 28rpx;
  color: $uni-text-color;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &::before {
    content: '👤';
    margin-right: 10rpx;
    font-size: 24rpx;
  }
}

.log-message {
  font-size: 28rpx;
  color: $uni-text-color-grey;
  line-height: 1.6;
}

.log-ip {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  
  &::before {
    content: '🌐';
    margin-right: 10rpx;
    font-size: 20rpx;
  }
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 40rpx;
  color: $uni-text-color-placeholder;
  font-size: 28rpx;
  animation: fadeIn 0.5s ease-out;
}
</style>
