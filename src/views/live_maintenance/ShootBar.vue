<template>
  <CCol :class="barStatus" class="shoot-bar"> 
    <CRow class="bar-name">
      <CCol class="text-center" style="font-size: 16px; margin-bottom: .5rem; font-family: Arial, Helvetica, sans-serif; font-weight: 700;">
        {{ barName }} <span v-if="barTarget1 === 0 && barTarget2 === 0"> (Not Used) </span>
      </CCol>
    </CRow>
    <CRow>
      <CCol class="bar-name" style="font-weight: 700;">
        Actual
      </CCol>
      <CCol class="bar-name text-end" style="font-weight: 700;">
        {{ shootCount.toLocaleString() }}
      </CCol>
    </CRow>
    <CRow>
      <CCol class="bar-name" style="font-weight: 700;">
        Target 1
      </CCol>
      <CCol class="bar-name text-end" style="font-weight: 700;">
        {{ barTarget1.toLocaleString() }}
      </CCol>
    </CRow>
    <CRow>
      <CCol class="bar-name" style="font-weight: 700;">
        Target 2
      </CCol>
      <CCol class="bar-name text-end" style="font-weight: 700;">
        {{ barTarget2.toLocaleString() }}
      </CCol>
    </CRow>
    <CProgress :height="25"  variant='striped' animated :color="colorBar" :value="barValue" class="mb-1">{{ barValue }}%</CProgress>
    <CRow v-if="props.toggleIcon">
      <CCol class="bar-name text-center" style="font-weight: 700;">
        Last Maintenance Time
        <CListGroup flush >
          <CListGroupItem color="success" style=" font-weight: 400; text-align: center;" >{{props.lastMaintenance}}</CListGroupItem>
        </CListGroup>
      </CCol>
    </CRow>
  </CCol>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  barName:  {
    type:String,
    default:'Actual Shoot'
  },
  shootCount: {
    type:Number,
    default:0
  },
  barTarget1:  {
    type:Number,
    default:0
  },
  barTarget2:  {
    type:Number,
    default:0
  },
  toggleIcon:Boolean,
  lastMaintenance:{
    type:String
  }

})
const colorBar = ref('dark')

const barValue = computed(() => {
  return props.barTarget2 ? parseFloat((props.shootCount / props.barTarget2 * 100).toFixed(1)) : 0;
});


const barStatus = computed(() => {
  if (props.shootCount < props.barTarget1) {
    return 'bg-success';
  } 
  if (props.shootCount < props.barTarget2) {
    return 'bg-warning';
  } 
  if (props.barTarget1 === 0 && props.barTarget2 === 0) {
    return 'bg-light';
  } 
  return 'bg-danger';
});


</script>

<style scoped>
.bar-name{
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: .2rem;
}

.shoot-bar{
  border: 0.5px solid black;
  position: relative;
  transition: transform 0.3s ease, z-index 0.3s ease;
  margin: .5rem; 
  padding: .6rem; 
  border-radius: .4rem;
}

.shoot-bar:hover{
  transform: scale(1.05);
  z-index: 1;
}
</style>