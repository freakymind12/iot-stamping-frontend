<template>
  <p class="clock">{{ currentTime }}</p>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const currentTime = ref(getCurrentTime());

    function getCurrentTime() {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }

    function updateClock() {
      currentTime.value = getCurrentTime();
    }

    const intervalId = setInterval(updateClock, 1000);

    onMounted(() => {
      intervalId;
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      currentTime
    };
  }
};
</script>

<style>
.clock {
  padding-top: 1rem;
  text-align: center; /* Agar teks berada di tengah secara horizontal */
  display: flex; /* Menggunakan flexbox agar teks berada di tengah secara vertikal */
  align-items: center; /* Menyamakan teks ke tengah secara vertikal */
}
</style>