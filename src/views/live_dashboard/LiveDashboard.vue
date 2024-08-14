<template>
  <div class="row">
    <div class="col-6 mb-3" v-for="(item, index) in data" :key="index">
      <CardDashboard :item="item"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CardDashboard from './CardDashboard.vue';

const data = ref([]);
let socket;

onMounted(() => {
  socket = new WebSocket('ws://192.168.148.125:1881/stamping_live'); // Sesuaikan dengan URL WebSocket Anda

  socket.onopen = () => {
    console.log('WebSocket connection established.');
  };

  socket.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    data.value = newData; // Memperbarui data dengan data yang diterima dari WebSocket
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
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
