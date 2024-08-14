<!-- SelectorMachine.vue -->
<template>
  <CFormSelect
    aria-label="Default select example"
    :options="machines"
    v-model="selectedMachine"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  addOption: Object,
})
const selectedMachine = ref('')
const machines = ref([])

onMounted(() => {
  fetchDataMachine()
})

const fetchDataMachine = () => {
  axios
    .get('http://192.168.148.125:5000/machine')
    .then((response) => {
      const formattedData = response.data.data.map((item) => ({
        label: item.id_machine,
        value: item.id_machine,
      }))
      if (props.addOption) {
        formattedData.unshift(props.addOption)
      }
      machines.value = formattedData
    })
    .catch((error) => {
      console.log('Error fetching data:', error)
    })
}
</script>
