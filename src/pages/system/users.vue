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
  background: $uni-bg-color-grey;
  padding: 30rpx;
}

.header {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
  padding: 30rpx;
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  box-shadow: $uni-shadow-sm;
  animation: fadeIn 0.6s ease-out;
}

.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 30rpx;
  border: 2rpx solid transparent;
  background: $uni-bg-color-hover;
  border-radius: $uni-border-radius-base;
  font-size: 28rpx;
  transition: all 0.3s ease;
  
  &:focus {
    background: $uni-bg-color;
    border-color: $uni-color-primary;
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  }
}

.search-btn {
  height: 80rpx;
  padding: 0 40rpx;
  background: $uni-color-primary-gradient;
  color: $uni-text-color-inverse;
  border-radius: $uni-border-radius-base;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.96);
    opacity: 0.9;
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.user-card {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 30rpx;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid $uni-bg-color-hover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.user-username {
  font-size: 26rpx;
  color: $uni-text-color-grey;
}

.user-dept {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
  background: $uni-bg-color-hover;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  align-self: flex-start;
}

.user-status {
  display: flex;
  align-items: center;
}

.status-badge {
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
