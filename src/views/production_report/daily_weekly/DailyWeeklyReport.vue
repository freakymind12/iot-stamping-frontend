<template>
  <CContainer fluid>
    <CRow>
      <CCol xs="8">
        <h3>Daily & Weekly Report</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine" />
      </CCol>
      <CCol xs="2">
        <DateSelector v-model="selectedDate" />
      </CCol>
    </CRow>
  </CContainer>
  <!-- Widget -->
  <CRow>
    <!-- <DailyWeeklyWidget titleWidget="Good Product"/> -->
    <DailyWeeklyWidget
      :title="
        totalProduction.total_rs.toLocaleString() +
        ' Pin / ' +
        totalProduction.rs_ppm.toLocaleString() +
        ' PPM'
      "
      color="warning"
      data="Reject Setting"
    />
    <DailyWeeklyWidget
      :title="totalProduction.total_dummy + ' Pin / ' + totalProduction.dummy_ppm + ' PPM'"
      color="secondary"
      data="Dummy"
    />
    <DailyWeeklyWidget
      :title="totalProduction.total_stoptime + ' Minutes'"
      color="danger"
      data="Stop Time"
    />
    <DailyWeeklyWidget
      :title="totalProduction.total_rip + ' Pin / ' + totalProduction.rip_ppm + ' PPM'"
      color="info"
      data="RIP"
    />
    <DailyWeeklyWidget
      :title="totalProduction.total_ok + ' Pin'"
      color="success"
      data="Good Product"
    />
  </CRow>
  <!-- Charts -->
  <!-- Good Product & NG -->
  <CRow>
    <MultiChart
      :seriesData="[
        productionData.shift1.ok,
        productionData.shift2.ok,
        sumArrays(productionData.shift1.ok, productionData.shift2.ok),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Good Product"
      xAxisName="Pin"
    />
    <MultiChart
      :seriesData="[
        productionData.shift1.ng,
        productionData.shift2.ng,
        sumArrays(productionData.shift1.ng, productionData.shift2.ng),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Reject In Process"
      xAxisName="Pin"
    />
  </CRow>
  <!-- Stop Time & Production Time -->
  <CRow>
    <MultiChart
      :seriesData="[
        productionData.shift1.stop_time,
        productionData.shift2.stop_time,
        sumArrays(productionData.shift1.stop_time, productionData.shift2.stop_time),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Stop Time"
      xAxisName="Minutes"
    />
    <MultiChart
      :seriesData="[
        productionData.shift1.production_time,
        productionData.shift2.production_time,
        sumArrays(productionData.shift1.production_time, productionData.shift2.production_time),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Production Time"
      xAxisName="Minutes"
    />
  </CRow>
  <!-- Reject Setting & Dummy -->
  <CRow>
    <MultiChart
      :seriesData="[
        productionData.shift1.reject_setting,
        productionData.shift2.reject_setting,
        sumArrays(productionData.shift1.reject_setting, productionData.shift2.reject_setting),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Reject Setting"
      xAxisName="Pin"
    />
    <MultiChart
      :seriesData="[
        productionData.shift1.dummy,
        productionData.shift2.dummy,
        sumArrays(productionData.shift1.dummy, productionData.shift2.dummy),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Dummy"
      xAxisName="Pin"
    />
  </CRow>
  <!-- Dandori & Kadoritsu -->
  <CRow>
    <MultiChart
      :seriesData="[
        productionData.shift1.dandori_time,
        productionData.shift2.dandori_time,
        sumArrays(productionData.shift1.dandori_time, productionData.shift2.dandori_time),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Total']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Total']"
      chartTitle="Dandori Time"
      xAxisName="Minutes"
    />
    <MultiChart
      :seriesData="[
        productionData.shift1.kadoritsu,
        productionData.shift2.kadoritsu,
        avgArray(productionData.shift1.kadoritsu, productionData.shift2.kadoritsu),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Average']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Average']"
      chartTitle="Kadoritsu"
      xAxisName="Percent"
    />
  </CRow>
  <!-------------------------------->
  <!-- Bekidoritsu -->
  <CRow>
    <MultiChart
      :seriesData="[
        productionData.shift1.bekidoritsu,
        productionData.shift2.bekidoritsu,
        avgArray(productionData.shift1.bekidoritsu, productionData.shift2.bekidoritsu),
      ]"
      :seriesName="['Shift 1', 'Shift 2', 'Average']"
      :xAxis="productionData.date_range"
      :legend="['Shift 1', 'Shift 2', 'Average']"
      chartTitle="Bekidoritsu"
      xAxisName="Percent"
      :colSize="6"
    />
  </CRow>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import MultiChart from './MultiChart.vue'
import DateSelector from './DateSelector.vue'
import MachineSelector from './MachineSelector.vue'
import DailyWeeklyWidget from './DailyWeeklyWidget.vue'
import axios from 'axios'
import thousandSeparator from '../../../middleware/ThousandSeparator'

const selectedMachine = ref('STAMPING LINE 1')
const productionData = ref({
  date_range: [],
  shift1: {
    ok: [],
    ng: [],
    reject_setting: [],
    dummy: [],
    production_time: [],
    stop_time: [],
    dandori_time: [],
    kadoritsu: [],
    bekidoritsu: []
  },
  shift2: {
    ok: [],
    ng: [],
    reject_setting: [],
    dummy: [],
    production_time: [],
    stop_time: [],
    dandori_time: [],
    kadoritsu: [],
    bekidoritsu: []
  },
})
const totalProduction = ref({
  total_ok: 0,
  total_rip: 0,
  total_rs: 0,
  total_dummy: 0,
  rip_ppm: 0,
  rs_ppm: 0,
  dummy_ppm: 0,
})

const currentDate = new Date()
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2)
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
const selectedDate = ref([
  startDate.toISOString().split('T')[0],
  endDate.toISOString().split('T')[0],
])

watch([selectedMachine, selectedDate], ([newMachineValue, newDateValue]) => {
  fetchProductionTrend(formatDateArray(newDateValue), newMachineValue)
  fetchTotalProduction(formatDateArray(newDateValue), newMachineValue)
})

onBeforeMount(() => {
  fetchProductionTrend(selectedDate.value, selectedMachine.value)
  fetchTotalProduction(selectedDate.value, selectedMachine.value)
})

// merubah format date selector menjadi YYYY-MM-DD
const formatDateArray = (dates) => {
  return dates.map((dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  })
}

const sumArrays = (a1, a2) =>
  a1.map((value, index) => {
    const sum = value + a2[index]
    return Number.isInteger(sum) ? sum : sum.toFixed(1)
  })

const avgArray = (a1, a2) =>
  a1.map((value, index) => {
    const avg = (value + a2[index])/2
    return Number.isInteger(avg) ? avg : avg.toFixed(1)
  })

const fetchProductionTrend = async (selectedDate, selectedMachine) => {
  try {
    const [startDate, endDate] = selectedDate // Destructure array selectedDate menjadi startDate dan endDate
    const url = `http://192.168.148.125:5000/productions/date/trend?date_start=${startDate}&date_end=${endDate}&id_machine=${selectedMachine}`
    const response = await axios.get(url)
    productionData.value = response.data.data
  } catch (error) {
    console.error('Error fetching production data:', error)
  }
}

const fetchTotalProduction = async (selectedDate, selectedMachine) => {
  try {
    const [startDate, endDate] = selectedDate // Destructure array selectedDate menjadi startDate dan endDate
    const url = `http://192.168.148.125:5000/productions/date/ppm?date_start=${startDate}&date_end=${endDate}&id_machine=${selectedMachine}`
    const response = await axios.get(url)
    const formattedData = thousandSeparator(response.data.data)
    totalProduction.value = formattedData[0]
  } catch (error) {
    console.error('Error fetching production data:', error)
  }
}
</script>

<style scoped>
.row {
  margin-bottom: 1rem;
}
</style>
