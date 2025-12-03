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
  background: $uni-bg-color-grey;
  padding: 30rpx;
}

.header {
  padding: 30rpx;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  margin-bottom: 30rpx;
  box-shadow: $uni-shadow-sm;
  animation: fadeIn 0.6s ease-out;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: $uni-text-color;
}

.dept-tree {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.dept-card {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 36rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: $uni-shadow-sm;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease-out backwards;
  
  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
}

.dept-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.dept-icon {
  font-size: 64rpx;
  background: $uni-bg-color-hover;
  width: 100rpx;
  height: 100rpx;
  border-radius: $uni-border-radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dept-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dept-name {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.dept-leader {
  font-size: 26rpx;
  color: $uni-text-color-grey;
}

.dept-phone {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.dept-status {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
  
  &.active {
    background: #ecfdf5;
    color: $uni-color-success;
  }
  
  &.inactive {
    background: #fef2f2;
    color: $uni-color-error;
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
