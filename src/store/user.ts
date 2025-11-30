import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<any>(null);

    function setUserInfo(info: any) {
        userInfo.value = info;
    }

    return { userInfo, setUserInfo };
});
