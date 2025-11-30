<template>
  <view class="container">
    <view class="header">
      <input 
        v-model="searchForm.username" 
        class="search-input" 
        placeholder="Search by username"
        @confirm="loadUsers"
      />
      <button class="search-btn" @click="loadUsers">Search</button>
    </view>

    <view class="user-list">
      <view 
        v-for="user in users" 
        :key="user.id" 
        class="user-card"
        @click="viewUserDetail(user)"
      >
        <view class="user-info">
          <image 
            :src="user.avatar || '/static/default-avatar.png'" 
            class="user-avatar"
            mode="aspectFill"
          />
          <view class="user-details">
            <text class="user-nickname">{{ user.nickname }}</text>
            <text class="user-username">@{{ user.username }}</text>
            <text class="user-dept">{{ user.dept?.name || 'No Dept' }}</text>
          </view>
        </view>
        
        <view class="user-status">
          <view :class="['status-badge', user.status === 1 ? 'active' : 'inactive']">
            {{ user.status === 1 ? 'Active' : 'Inactive' }}
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!loading && users.length === 0" class="empty">
      <text>No users found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSysUserListApi } from '@/api/core/user';
import type { SysUserParams } from '@/api/core/user';

const users = ref<any[]>([]);
const loading = ref(false);
const searchForm = ref<SysUserParams>({
  username: '',
  page: 1,
  size: 20
});

const loadUsers = async () => {
  try {
    loading.value = true;
    const result = await getSysUserListApi(searchForm.value);
    users.value = Array.isArray(result) ? result : (result as any)?.items || [];
  } catch (error) {
    console.error('Failed to load users', error);
    uni.showToast({
      title: 'Failed to load users',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const viewUserDetail = (user: any) => {
  uni.showModal({
    title: user.nickname,
    content: `Username: ${user.username}\nEmail: ${user.email || 'N/A'}\nPhone: ${user.phone || 'N/A'}`,
    showCancel: false
  });
};

onMounted(() => {
  loadUsers();
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
  gap: 20rpx;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: white;
  border-radius: 12rpx;
}

.search-input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.search-btn {
  height: 70rpx;
  padding: 0 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.user-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.user-username {
  font-size: 26rpx;
  color: #666;
}

.user-dept {
  font-size: 24rpx;
  color: #999;
}

.user-status {
  display: flex;
  align-items: center;
}

.status-badge {
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
