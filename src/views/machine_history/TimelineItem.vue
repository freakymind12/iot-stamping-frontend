<template>
  <a-timeline-item :color="color">
    <CRow>
      <CCol sm="5"
        >Status: <a-tag :color="color">{{ status }}</a-tag> Condition: <a-tag :color="color">{{ condition }}</a-tag></CCol
      >
      <CCol
        >Duration: <a-tag color="blue">{{ duration }} min</a-tag>
        <a-tag color="orange">{{ start }} to {{ end }}</a-tag></CCol
      >
    </CRow>
  </a-timeline-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: String,
  condition: String,
  power: String,
  duration: String,
  start: String,
  end: String,
})

const color = computed(() => {
  if (props.power === 'On' && props.status === 'Run') {
    return 'green'
  } else if (props.power === 'On' && props.status === 'Stop') {
    return 'red'
  } else if (props.power === 'Off') {
    return 'grey'
  }
  return 'dark'
})
</script>
