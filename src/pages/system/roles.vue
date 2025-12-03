<template>
  <view class="container">
    <view class="header">
      <text class="title">Roles Management</text>
      <button class="add-btn" @click="showAddRole">+ Add</button>
    </view>

    <view class="role-list">
      <view 
        v-for="role in roles" 
        :key="role.id" 
        class="role-card"
      >
        <view class="role-header">
          <text class="role-name">{{ role.name }}</text>
          <view :class="['role-status', role.status === 1 ? 'active' : 'inactive']">
            {{ role.status === 1 ? 'Active' : 'Inactive' }}
          </view>
        </view>
        
        <view v-if="role.remark" class="role-remark">
          <text>{{ role.remark }}</text>
        </view>
        
        <view class="role-footer">
          <text class="role-time">Created: {{ formatTime(role.created_time) }}</text>
          <view class="role-actions">
            <text class="action-btn edit" @click="editRole(role)">Edit</text>
            <text class="action-btn delete" @click="deleteRole(role)">Delete</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!loading && roles.length === 0" class="empty">
      <text>No roles found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSysRoleListApi, deleteSysRoleApi } from '@/api/role';
import type { SysRoleParams } from '@/api/role';

const roles = ref<any[]>([]);
const loading = ref(false);

const loadRoles = async () => {
  try {
    loading.value = true;
    const params: SysRoleParams = {
      page: 1,
      size: 50
    };
    const result = await getSysRoleListApi(params);
    roles.value = Array.isArray(result) ? result : (result as any)?.items || [];
  } catch (error) {
    console.error('Failed to load roles', error);
    uni.showToast({
      title: 'Failed to load roles',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const formatTime = (time: string) => {
  return time ? new Date(time).toLocaleDateString() : '-';
};

const showAddRole = () => {
  uni.showToast({
    title: 'Add role feature coming soon',
    icon: 'none'
  });
};

const editRole = (role: any) => {
  uni.showModal({
    title: 'Edit Role',
    content: `Edit role: ${role.name}`,
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: 'Edit feature coming soon',
          icon: 'none'
        });
      }
    }
  });
};

const deleteRole = (role: any) => {
  uni.showModal({
    title: 'Delete Role',
    content: `Are you sure you want to delete ${role.name}?`,
    showCancel: true,
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteSysRoleApi([role.id]);
          uni.showToast({
            title: 'Role deleted',
            icon: 'success'
          });
          loadRoles();
        } catch (error) {
          uni.showToast({
            title: 'Delete failed',
            icon: 'none'
          });
        }
      }
    }
  });
};

onMounted(() => {
  loadRoles();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: $uni-bg-color-grey;
  padding: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.add-btn {
  padding: 16rpx 36rpx;
  background: $uni-color-primary-gradient;
  color: $uni-text-color-inverse;
  border-radius: $uni-border-radius-base;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 6rpx rgba(102, 126, 234, 0.2);
  }
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.role-card {
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

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.role-name {
  font-size: 34rpx;
  font-weight: 700;
  color: $uni-text-color;
}

.role-status {
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

.role-remark {
  margin-bottom: 24rpx;
  padding: 16rpx;
  background: $uni-bg-color-grey;
  border-radius: $uni-border-radius-sm;
  
  text {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    line-height: 1.6;
  }
}

.role-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1px solid $uni-bg-color-hover;
}

.role-time {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.role-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  border-radius: $uni-border-radius-sm;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &.edit {
    background: #eff6ff;
    color: $uni-color-info;
    
    &:active {
      background: #dbeafe;
    }
  }
  
  &.delete {
    background: #fef2f2;
    color: $uni-color-error;
    
    &:active {
      background: #fee2e2;
    }
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
