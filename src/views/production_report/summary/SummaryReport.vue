<template>
  <CContainer fluid>
    <CRow>
      <CCol xs="10">
        <h3>Summary Report</h3>
      </CCol>
      <CCol xs="2">
        <YearSelector v-model="selectedYear"/>
      </CCol>
    </CRow>
  </CContainer>
  <CRow>
    <SummaryChart 
      :seriesData="[data.ok, data.ok]"
      :seriesName="['Good Product','Good Product']"
      :xAxis="data.year_month"
      :legend="['Good Product','Good Product']"
      chartTitle="Good Product"
      xAxisName="Pin"
      :chartType="['bar','line']"
      :colorSeries="['#A1EEBD']"
    />
    <SummaryChart 
      :seriesData="[data.ng, data.ng]"
      :seriesName="['RIP','RIP']"
      :xAxis="data.year_month"
      :legend="['RIP','RIP']"
      chartTitle="Reject In Process"
      xAxisName="Pin"
      :chartType="['bar','line']"
      :colorSeries="['#FF8080']"
    />
    <SummaryChart 
      :seriesData="[data.reject_setting, data.reject_setting]"
      :seriesName="['Reject Setting','Reject Setting']"
      :xAxis="data.year_month"
      :legend="['Reject Setting','Reject Setting']"
      chartTitle="Reject Setting"
      xAxisName="Pin"
      :chartType="['bar','line']"
      :colorSeries="['#FFCF96']"
    />
    <SummaryChart 
      :seriesData="[data.dummy, data.dummy]"
      :seriesName="['Dummy','Dummy']"
      :xAxis="data.year_month"
      :legend="['Dummy','Dummy']"
      chartTitle="Dummy"
      xAxisName="Pin"
      :chartType="['bar','line']"
      :colorSeries="['#FFCF96']"
    />
    <!-- <SummaryChart 
      :seriesData="[data.production_time, data.production_time]"
      :seriesName="['Production Time','Production Time']"
      :xAxis="data.year_month"
      :legend="['Production Time','Production Time']"
      chartTitle="Production Time"
      xAxisName="Min"
      :chartType="['bar','line']"
      :colorSeries="['#abdfff']"
    />
    <SummaryChart 
      :seriesData="[data.dandori_time, data.dandori_time]"
      :seriesName="['Dandori Time','Dandori Time']"
      :xAxis="data.year_month"
      :legend="['Dandori Time','Dandori Time']"
      chartTitle="Dandori Time"
      xAxisName="Min"
      :chartType="['bar','line']"
      :colorSeries="['#abdfff']"
    />
    <SummaryChart 
      :seriesData="[data.stop_time, data.stop_time]"
      :seriesName="['Stop Time','Stop Time']"
      :xAxis="data.year_month"
      :legend="['Stop Time','Stop Time']"
      chartTitle="Stop Time"
      xAxisName="Min"
      :chartType="['bar','line']"
      :colorSeries="['#abdfff']"
    /> -->
    <SummaryChart 
      :seriesData="[data.kadoritsu, data.kadoritsu]"
      :seriesName="['Kadoritsu','Kadoritsu']"
      :xAxis="data.year_month"
      :legend="['Kadoritsu','Kadoritsu']"
      chartTitle="Kadoritsu"
      xAxisName="%"
      :chartType="['bar','line']"
      :colorSeries="['#6E5773']"
    />
    <SummaryChart 
      :seriesData="[sales.sales, sales.sales]"
      :seriesName="['Sales','Sales']"
      :xAxis="sales.year_month"
      :legend="['Sales','Sales']"
      chartTitle="Sales"
      xAxisName="IDR"
      :chartType="['bar','line']"
      :colorSeries="['#5AB2FF']"
    />
    <SummaryChart 
      :seriesData="[sales.reject_cost, sales.reject_cost]"
      :seriesName="['Reject Cost','Reject Cost']"
      :xAxis="sales.year_month"
      :legend="['Reject Cost','Reject Cost']"
      chartTitle="Reject Cost"
      xAxisName="IDR"
      :chartType="['bar','line']"
      :colorSeries="['#5AB2FF']"
    />
  </CRow>

</template>


<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import YearSelector from '../yearly/YearSelector.vue';
import SummaryChart from './SummaryChart.vue'
import axios from 'axios';

const selectedYear = ref(new Date().getFullYear());
const data = ref({})
const sales = ref({})

watch([selectedYear], ([newYear]) => {
  fetchSummaryProduction(newYear)
  fetchSummarySalesAndRejectCost(newYear)
})

onBeforeMount(() => {
  fetchSummaryProduction(selectedYear.value)
  fetchSummarySalesAndRejectCost(selectedYear.value)
})

const fetchSummaryProduction = async (selectedYear) => {
  try {
    const url = `http://192.168.148.125:5000/productions/fiscal?year=${selectedYear}`
    const response = await axios.get(url)
    data.value = response.data.data
  } catch (error) {
    console.error('Error fetching summary production', error)
  }
}

const fetchSummarySalesAndRejectCost = async (selectedYear) =>{
  try {
    const url = `http://192.168.148.125:5000/productions/fiscal/sales?year=${selectedYear}`
    const response = await axios.get(url)
    sales.value = response.data.data
  } catch (error) {
    console.error('Error fetching summary sales', error)
  }
}



</script>



<style scoped>
.container-fluid{
  margin-bottom: 1rem;
}
</style>