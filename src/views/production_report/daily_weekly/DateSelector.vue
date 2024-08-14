<template>
  <VueDatePicker 
    v-model="date" 
    range
    :max-range="props.maxRange" 
    :min-range="props.minRange" 
    :enable-time-picker="false" 
    vertical 
    placeholder="Select Date Here"
    :teleport="true"
  />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  minRange:{
    type:String,
    default:'6'
  },
  maxRange:{
    type:String,
    default:'60'
  }
})


const currentDate = new Date();
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() , 2);
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); 
const formattedStartDate = startDate.toISOString().split('T')[0]; 
const formattedEndDate = endDate.toISOString().split('T')[0]; 
const date = ref([formattedStartDate, formattedEndDate]);

</script>