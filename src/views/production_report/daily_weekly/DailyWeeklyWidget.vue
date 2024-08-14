<template>
    <CCol>
      <CWidgetStatsB
      class="mb-3"
      :color="color"
      inverse
      :progress="{ value: 85}"
      :text="text"
      :title="title"
      :value="data"/>
    </CCol>
</template>

<script setup>

const props = defineProps({
  title : String,
  data : String,
  color : String,
  text : String
})
</script>