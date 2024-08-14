<template>
  <CContainer fluid>
    <CRow>
      <CCol xs="8">
        <h3>Yearly Report</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine" />
      </CCol>
      <CCol xs="2">
        <YearSelector v-model="selectedYear" />
      </CCol>
    </CRow>
  </CContainer>
  <CRow>
    <YearlyChart
      :seriesData="[
        fiscalProduction.ok,
        fiscalProduction.ng,
        fiscalProduction.dummy,
        fiscalProduction.reject_setting,
      ]"
      :seriesName="['Good Product', 'RIP', 'Dummy', 'Reject Setting']"
      :xAxis="fiscalProduction.year_month"
      :legend="['Good Product', 'RIP', 'Dummy', 'Reject Setting']"
      :chartTitle="selectedMachine"
      :xAxisName="['Pin', '']"
      chartType="line"
      :colorSeries="[
        'rgba(64, 165, 120, 0.7)',
        'rgba(238, 66, 102, 0.7)',
        'rgba(51, 153, 255, 0.7)',
        'rgba(255, 210, 63, 0.7)',
      ]"
    />
    <CCol>
      <ProductionWidget
        :value="valueA"
        :title="widgetProps.titleA"
        :color="[
          'rgba(64, 165, 120, 0.7)',
          'rgba(238, 66, 102, 0.7)',
          'rgba(51, 153, 255, 0.7)',
          'rgba(255, 210, 63, 0.7)',
        ]"
        :suffix="['pin', 'pin', 'pin', 'pin']"
      />
    </CCol>
  </CRow>
  <CRow>
    <YearlyChart
      :seriesData="[
        fiscalProduction.production_time,
        fiscalProduction.stop_time,
        fiscalProduction.dandori_time,
        fiscalProduction.kadoritsu,
      ]"
      :seriesName="['Production Time', 'Stop Time', 'Dandori Time', 'Kadoritsu']"
      :xAxis="fiscalProduction.year_month"
      :legend="['Production Time', 'Stop Time', 'Dandori Time', 'Kadoritsu']"
      :chartTitle="selectedMachine"
      :xAxisName="['Minutes', 'Percent']"
      chartType="line"
      :yAxisIndex="[0, 0, 0, 1]"
      :colorSeries="[
        'rgba(64, 165, 120, 0.7)',
        'rgba(238, 66, 102, 0.7)',
        'rgba(255, 210, 63, 0.7)',
        'rgba(51, 153, 255, 0.7)',
      ]"
    />
    <CCol>
      <ProductionWidget
        :value="valueB"
        :title="widgetProps.titleB"
        :color="[
          'rgba(64, 165, 120, 0.7)',
          'rgba(238, 66, 102, 0.7)',
          'rgba(255, 210, 63, 0.7)',
          'rgba(51, 153, 255, 0.7)',
        ]"
        :suffix="['min', 'min', 'min', '%']"
      />
    </CCol>
  </CRow>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import MachineSelector from '../daily_weekly/MachineSelector.vue'
import YearSelector from './YearSelector.vue'
import YearlyChart from './YearlyChart.vue'
import axios from 'axios'
import ProductionWidget from './component/ProductionWidget.vue'

const widgetProps = {
  titleA: ['Good Product', 'RIP', 'Dummy', 'Reject Setting'],
  titleB: ['Production Time', 'Stop Time', 'Dandori Time', 'Average Kadoritsu'],
}

const selectedMachine = ref('STAMPING LINE 1')
const selectedYear = ref(new Date().getFullYear())
const fiscalProduction = ref({
  ok: [],
  ng: [],
  reject_setting: [],
  dummy: [],
  production_time: [],
  stop_time: [],
  dandori_time: [],
  year_month: [],
  kadoritsu:[],
})

const valueA = computed(() => [
  totalArray(fiscalProduction.value.ok),
  totalArray(fiscalProduction.value.ng),
  totalArray(fiscalProduction.value.dummy),
  totalArray(fiscalProduction.value.reject_setting),
])

const valueB = computed(() => [
  totalArray(fiscalProduction.value.production_time),
  totalArray(fiscalProduction.value.stop_time),
  totalArray(fiscalProduction.value.dandori_time),
  averageArray(fiscalProduction.value.kadoritsu)
])


// eslint-disable-next-line no-unused-vars
const ppm = computed(() => [
  totalArray(fiscalProduction.value.ok),
  calculatePPM(totalArray(fiscalProduction.value.ng), totalArray(fiscalProduction.value.ok)),
  calculatePPM(totalArray(fiscalProduction.value.dummy), totalArray(fiscalProduction.value.ok)),
  calculatePPM(
    totalArray(fiscalProduction.value.reject_setting),
    totalArray(fiscalProduction.value.ok),
  ),
])
// hitung ppm
const calculatePPM = (a, b) => {
  a = Number(a.replace(/,/g, ''))
  b = Number(b.replace(/,/g, ''))
  const ppm = Math.round((a / (a + b)) * 1000000)
  return isNaN(ppm) ? '0' : ppm.toLocaleString()
}

onMounted(() => {
  fetchFiscalProduction(selectedYear.value, selectedMachine.value)
})

watch([selectedYear, selectedMachine], ([newYear, newMachine]) => {
  fetchFiscalProduction(newYear, newMachine)
})

const fetchFiscalProduction = async (selectedYear, selectedMachine) => {
  try {
    const response = await axios.get(
      `http://192.168.148.125:5000/productions/fiscal?year=${selectedYear}&id_machine=${selectedMachine}`,
    )
    fiscalProduction.value = response.data.data
  } catch (error) {
    console.error('Error fetching production data:', error)
  }
}

const totalArray = (numbers) => {
  return numbers.reduce((sum, value) => sum + value, 0).toLocaleString()
}

const averageArray = (arr) => {
  const total = totalArray(arr);
  return (total / arr.length).toFixed(1).toLocaleString(); 
}

</script>

<style scoped>
.row {
  margin-bottom: 1rem;
}
</style>
