import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAccessStore = defineStore('access', () => {
    const accessToken = ref(uni.getStorageSync('accessToken') || '');
    const accessSessionUuid = ref('');
    const accessCodes = ref<string[]>([]);
    const loginExpired = ref(false);
    const captchaUuid = ref('');

    const isAccessChecked = computed(() => !!accessToken.value);

    function setAccessToken(token: string | null) {
        accessToken.value = token || '';
        if (token) {
            uni.setStorageSync('accessToken', token);
        } else {
            uni.removeStorageSync('accessToken');
        }
    }

    function setAccessSessionUuid(uuid: string | null) {
        accessSessionUuid.value = uuid || '';
    }

    function setAccessCodes(codes: string[]) {
        accessCodes.value = codes;
    }

    function setLoginExpired(expired: boolean) {
        loginExpired.value = expired;
    }

    function setCaptchaUuid(uuid: string) {
        captchaUuid.value = uuid;
    }

    return {
        accessToken,
        accessSessionUuid,
        accessCodes,
        loginExpired,
        captchaUuid,
        isAccessChecked,
        setAccessToken,
        setAccessSessionUuid,
        setAccessCodes,
        setLoginExpired,
        setCaptchaUuid
    };
});
