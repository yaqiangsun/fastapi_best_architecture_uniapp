import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAccessStore } from './access';
import { useUserStore } from './user';
import { getCaptchaApi, loginApi, getUserInfoApi, getAccessCodesApi, logoutApi } from '@/api';
import type { LoginParams } from '@/api';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const loginLoading = ref(false);

  async function captcha() {
    const res = await getCaptchaApi();
    accessStore.setCaptchaUuid(res.uuid);
    return res.image;
  }

  async function authLogin(params: LoginParams, onSuccess?: () => void) {
    try {
      loginLoading.value = true;
      const res = await loginApi(params);
      const { access_token, session_uuid } = res;

      if (access_token) {
        accessStore.setAccessToken(access_token);
        accessStore.setAccessSessionUuid(session_uuid);

        // Fetch user info
        const userInfo = await fetchUserInfo();
        const accessCodes = await getAccessCodesApi();

        accessStore.setAccessCodes(accessCodes);

        uni.showToast({
          title: 'Login Success',
          icon: 'success'
        });

        if (onSuccess) {
          onSuccess();
        } else {
          uni.reLaunch({ url: '/pages/index/index' });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      loginLoading.value = false;
    }
  }

  async function fetchUserInfo() {
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  async function logout() {
    try {
      await logoutApi();
    } catch { }
    accessStore.setAccessToken(null);
    uni.reLaunch({ url: '/pages/login/index' });
  }

  return {
    loginLoading,
    captcha,
    authLogin,
    fetchUserInfo,
    logout
  };
});
