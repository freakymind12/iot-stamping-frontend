<template>
  <CCol :sm="props.size">
    <CWidgetStatsF style="font-size: .75rem;" :color="props.color" :title="props.title" :value="props.value">
      <template #icon>
        <CIcon :icon="props.icon" :size="props.iconSize"/>
      </template>
    </CWidgetStatsF>
  </CCol>
</template>

<script setup>
const props=defineProps({
  size:{
    type:Number,
    default:3
  },
  icon:{
    type:String,
    default:'cil-settings'
  },
  iconSize:{
    type:String,
    default:'xl'
  },
  color:{
    type:String,
    default:'success'
  },
  title:{
    type:String,
    default:'Title'
  },
  value:{
    type:String,
    default:'Rp.1000'
  },
})

</script>

<style scoped>

</style>