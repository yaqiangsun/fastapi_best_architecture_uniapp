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
  background: #f5f5f5;
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.add-btn {
  padding: 15rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20rpx;
  font-size: 28rpx;
  border: none;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.role-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.role-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.role-status {
  padding: 8rpx 20rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  
  &.active {
    background: #e8f5e9;
    color: #4caf50;
  }
  
  &.inactive {
    background: #ffebee;
    color: #f44336;
  }
}

.role-remark {
  margin-bottom: 20rpx;
  
  text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
  }
}

.role-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0f0f0;
}

.role-time {
  font-size: 24rpx;
  color: #999;
}

.role-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  
  &.edit {
    background: #e3f2fd;
    color: #2196f3;
  }
  
  &.delete {
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
