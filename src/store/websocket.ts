// Simplified WebSocket for uni-app
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAccessStore } from './access';

export const useWebSocketStore = defineStore('websocket', () => {
  const socketTask = ref<any>(null);
  const isConnected = ref(false);

  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

  const connect = () => {
    const accessStore = useAccessStore();

    if (!accessStore.accessToken) {
      console.warn('No access token, cannot connect WebSocket');
      return false;
    }

    if (isConnected.value) {
      return true;
    }

    try {
      socketTask.value = uni.connectSocket({
        url: `${WS_URL}?token=${accessStore.accessToken}`,
        complete: () => { }
      });

      socketTask.value.onOpen(() => {
        isConnected.value = true;
        console.log('WebSocket connected');
      });

      socketTask.value.onClose(() => {
        isConnected.value = false;
        console.log('WebSocket closed');
      });

      socketTask.value.onError((error: any) => {
        console.error('WebSocket error:', error);
      });

      return true;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return false;
    }
  };

  const disconnect = () => {
    if (socketTask.value) {
      socketTask.value.close();
      socketTask.value = null;
      isConnected.value = false;
    }
  };

  const emit = (event: string, data?: any) => {
    if (!socketTask.value || !isConnected.value) {
      return false;
    }
    socketTask.value.send({
      data: JSON.stringify({ event, data })
    });
    return true;
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketTask.value?.onMessage((res: any) => {
      try {
        const message = JSON.parse(res.data);
        if (message.event === event) {
          callback(message.data);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message', e);
      }
    });
  };

  const connectionStatus = computed(() => {
    return isConnected.value ? 'connected' : 'disconnected';
  });

  function $reset() {
    disconnect();
  }

  return {
    $reset,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    emit,
    on
  };
});
