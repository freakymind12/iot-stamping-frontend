<template>
  <VueDatePicker 
    v-model="month" 
    vertical 
    placeholder="Select Month Here"
    :teleport="true"
    month-picker
  />
</template>

<script setup>
import { ref } from 'vue';

const month = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

</script>