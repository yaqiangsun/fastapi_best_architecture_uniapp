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
  background: #f5f5f5;
  padding: 20rpx;
}

.filter-bar {
  background: white;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.picker {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  
  text {
    font-size: 28rpx;
    color: #333;
  }
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.log-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.log-type {
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;
  
  &.info {
    background: #e3f2fd;
    color: #2196f3;
  }
  
  &.warning {
    background: #fff3e0;
    color: #ff9800;
  }
  
  &.error {
    background: #ffebee;
    color: #f44336;
  }
  
  &.success {
    background: #e8f5e9;
    color: #4caf50;
  }
}

.log-time {
  font-size: 24rpx;
  color: #999;
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.log-user {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.log-message {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.log-ip {
  font-size: 24rpx;
  color: #999;
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
