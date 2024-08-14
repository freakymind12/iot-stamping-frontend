<template>
  <a-card class="widget">
    <a-card-grid style="width: 100%" v-for="(item, index) in title" :key="index">
      <a-statistic
        :title="item"
        :value="value[index]"
        :value-style="{ color: color[index] }"
        :suffix="suffix[index]"
        style="text-align: center; font-size: 1rem"
      />
    </a-card-grid>
  </a-card>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
defineProps({
  title: Array,
  value: Array,
  color: Array,
  suffix: Array,
})
</script>

<style scoped>
</style>

