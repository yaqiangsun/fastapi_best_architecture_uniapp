<template>
  <view class="container">
    <view class="header">
      <text class="title">Departments</text>
    </view>

    <view class="dept-tree">
      <view 
        v-for="dept in departments" 
        :key="dept.id" 
        class="dept-card"
      >
        <view class="dept-info">
          <text class="dept-icon">🏢</text>
          <view class="dept-details">
            <text class="dept-name">{{ dept.name }}</text>
            <text class="dept-leader">Leader: {{ dept.leader || 'N/A' }}</text>
            <text class="dept-phone">{{ dept.phone || 'No phone' }}</text>
          </view>
        </view>
        
        <view :class="['dept-status', dept.status === 1 ? 'active' : 'inactive']">
          {{ dept.status === 1 ? 'Active' : 'Inactive' }}
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!loading && departments.length === 0" class="empty">
      <text>No departments found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSysDeptTreeApi } from '@/api/dept';
import type { SysDeptTreeParams } from '@/api/dept';

const departments = ref<any[]>([]);
const loading = ref(false);

const loadDepartments = async () => {
  try {
    loading.value = true;
    const params: SysDeptTreeParams = { status: 1 };
    const result = await getSysDeptTreeApi(params);
    departments.value = Array.isArray(result) ? result : (result as any)?.items || [];
  } catch (error) {
    console.error('Failed to load departments', error);
    uni.showToast({
      title: 'Failed to load departments',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDepartments();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.header {
  padding: 30rpx 20rpx;
  background: white;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.dept-tree {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dept-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.dept-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.dept-icon {
  font-size: 60rpx;
}

.dept-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dept-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.dept-leader {
  font-size: 26rpx;
  color: #666;
}

.dept-phone {
  font-size: 24rpx;
  color: #999;
}

.dept-status {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  
  &.active {
    background: #e8f5e9;
    color: #4caf50;
  }
  
  &.inactive {
    background: #ffebee;
    color: #f44336;
  }
}

.loading, .empty {
  text-align: center;
  padding: 100rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
