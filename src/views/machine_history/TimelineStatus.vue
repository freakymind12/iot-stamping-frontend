<template>
  <CContainer>
    <a-timeline v-if="data.length > 0">
      <TimelineItem 
        v-for="(item, index) in data" 
        :key="index" 
        :status="item.status" 
        :condition="item.stop_condition" 
        :power="item.power" 
        :duration="item.duration" 
        :start="item.start" 
        :end="item.end" 
      />
    </a-timeline>
    <a-empty description="No Machine Status Log" v-else />
  </CContainer>
</template>

<script setup>
import TimelineItem from './TimelineItem.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  data:Array
})

</script>