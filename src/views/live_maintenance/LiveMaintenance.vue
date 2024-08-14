<template>
  <div class="row">
    <div class="mb-3" v-for="(machineData, machineName) in data" :key="machineName">
      <CardDashboard :item="machineData" :cardName="machineName"/>
    </div>
  </div>
  <ToastNotif :color="toastData.color" :body="toastData.body" :toastVisible="toastData.visible" :placement="toastData.placement" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CardDashboard from './CardDashboard.vue';
import ToastNotif from '@/components/ToastNotif.vue'

const data = ref([]);
let socket;
const toastData = ref({})

onMounted(() => {
  socket = new WebSocket('ws://192.168.148.125:1881/stamping_maintenance'); // Sesuaikan dengan URL WebSocket Anda

  socket.onopen = () => {
    console.log('WebSocket connection established.');
    toastData.value.color='success'
    toastData.value.body='Success connect to websocket server 👍'
    toastData.value.visible=true
    toastData.value.placement="top-end"
  };

  socket.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    data.value = newData; // Memperbarui data dengan data yang diterima dari WebSocket
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    toastData.value.color='danger'
    toastData.value.body='Error to connect websocket server 👎'
    toastData.value.visible=true
    toastData.value.placement="top-end"
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };
});

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}

.col-6 {
  max-width: 100%;
}
</style>
