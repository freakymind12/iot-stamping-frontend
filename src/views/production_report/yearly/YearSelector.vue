<template>
  <VueDatePicker 
    v-model="year" 
    placeholder="Select Year Here"
    :teleport="true"
    year-picker
  />
</template>

<script setup>
import { ref } from 'vue';

const year = ref(new Date().getFullYear());

</script>