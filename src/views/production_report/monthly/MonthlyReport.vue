<template>
  <CContainer fluid>
    <CRow>
      <CCol xs="8">
        <h3>Monthly Report</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine"/>
      </CCol>
      <CCol xs="2">
        <MonthSelector v-model="selectedMonth"/>
      </CCol>
    </CRow>
  </CContainer>
  <CRow>
    <PieChart chartTitle="Output" unit="Pin" :seriesData="formatData(dataProduction, 'ok')" :totalData="Number(totalProduction.ok).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Kadoritsu" unit="%" :seriesData="formatData(dataProduction, 'kadoritsu')" :totalData="avgKadoritsu.toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Sales" unit="Rp." :seriesData="formatData(dataProduction, 'sales')" :totalData="Number(totalProduction.sales).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
  </CRow>
  <CRow>
    <PieChart chartTitle="Dummy" unit="Pin" :seriesData="formatData(dataProduction, 'dummy')" :totalData="Number(totalProduction.dummy).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Reject Setting" unit="Pin" :seriesData="formatData(dataProduction, 'reject_setting')" :totalData="Number(totalProduction.reject_setting).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Reject In Process" unit="Pin" :seriesData="formatData(dataProduction, 'rip')" :totalData="Number(totalProduction.rip).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
  </CRow>
  <CRow>
    <PieChart chartTitle="Stop Time" unit="Minutes" :seriesData="formatData(dataProduction, 'stop_time')" :totalData="Number(totalProduction.stop_time).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Production Time" unit="Minutes" :seriesData="formatData(dataProduction, 'production_time')" :totalData="Number(totalProduction.production_time).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    <PieChart chartTitle="Dandori Time" unit="Minutes" :seriesData="formatData(dataProduction, 'dandori_time')" :totalData="Number(totalProduction.dandori_time).toLocaleString()" :source="[selectedMachine, selectedMonth]"/>
    
  </CRow>
</template>


<script setup>
import MonthSelector from './MonthSelector.vue';
import MachineSelector from '../daily_weekly/MachineSelector.vue';
import PieChart from './PieChart.vue';
import axios from 'axios';
import { onBeforeMount, ref, watch } from 'vue';

const selectedMonth = ref({month: new Date().getMonth(), year: new Date().getFullYear()});
const selectedMachine = ref('STAMPING LINE 1');
const dataProduction = ref()
const avgKadoritsu = ref(0)
const totalProduction = ref({
    "ok": "0",
    "rip": "0",
    "reject_setting": "0",
    "dummy": "0",
    "stop_time": "0", 
    "sales" : "0",
    "production_time" : "0",
    "dandori_time" : "0"
})

watch([selectedMachine, selectedMonth], ([newMachineValue, newMonthValue]) => {
  getProductionByMachineMonth(newMonthValue, newMachineValue)
  getTotalProductionByMonth(newMonthValue, newMachineValue)
});

onBeforeMount(async() => {
  await getProductionByMachineMonth(selectedMonth.value, selectedMachine.value);
  await getTotalProductionByMonth(selectedMonth.value, selectedMachine.value);
});

const formatData = (data, key1) => {
    if (!Array.isArray(data)) {
          return [];
      }
    return data.map(entry => ({
        value: parseInt(entry[key1]),
        name: entry.name
    }));
}

const getAverageKadoritsu = (data) => {
  const totalKadoritsu = data.reduce((sum, item) => sum + parseFloat(item.kadoritsu), 0);
  const average = (totalKadoritsu / data.length).toFixed(1);
  return isNaN(average) || !isFinite(average) ? 0 : average;
}

const getProductionByMachineMonth = async (selectedMonth, selectedMachine) => {
  try {
    const { year, month } = selectedMonth;
    const url = `http://192.168.148.125:5000/productions/monthly?year=${year}&month=${month+1}&id_machine=${selectedMachine}`;
    const response = await axios.get(url);
    dataProduction.value = response.data.data
    avgKadoritsu.value = getAverageKadoritsu(dataProduction.value)
  } catch (error) {
    console.error('Error fetching production data:', error);
  }
}

const getTotalProductionByMonth = async (selectedMonth, selectedMachine) => {
  try {
    const { year, month } = selectedMonth;
    const url = `http://192.168.148.125:5000/productions/monthly/total?year=${year}&month=${month+1}&id_machine=${selectedMachine}`;
    const response = await axios.get(url);
    if (response.data.data.length != 0){
      totalProduction.value = response.data.data[0]
    }else{
      totalProduction.value = {
        "ok": "0",
        "rip": "0",
        "reject_setting": "0",
        "dummy": "0",
        "stop_time": "0",
        "sales":"0",
        "production_time":"0",
        "dandori_time":"0"
      }
    }
    
  } catch (error) {
    console.error('Error fetching production data:', error);
  }
}

</script>

<style scoped>
.row{
  margin-bottom: 1rem;
}
</style>