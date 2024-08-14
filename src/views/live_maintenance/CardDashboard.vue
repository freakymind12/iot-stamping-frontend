<template>
  <CCard class="border-dark">
    <CCardBody>
      <CRow class="d-flex justify-content-between align-items-center">
        <CCol class="big-font" sm="6">
          {{ cardName }}  
        </CCol>
        <CCol sm="auto">
          <span class="big-font">COUNTER SHOOT MONITOR</span>
        </CCol>
      </CRow>
      <CRow v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
        <template v-for="(item, index) in group" :key="index">
          <ShootBar
            :barName="item[0]"
            :shootCount="item[1]"
            :barTarget1="item[2]"
            :barTarget2="item[3]"
            :lastMaintenance="getLastMaintenance(item[0])"
            :toggleIcon="toggleIcon"
          >
          </ShootBar>
        </template>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script setup>
import ShootBar from './ShootBar.vue'
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
// import { useStore } from 'vuex';

const props = defineProps({
  item: Array,
  cardName: String,
})
const lastMaintenance = ref([])
const toggleIcon = ref(true)
// const store = useStore()

onMounted(() => {
  fetchData(props.cardName)
  // store.commit('toggleSidebar')
  console.log(groupedItems.value)
})

const groupedItems = computed(() => {
  const items = props.item;
  const result = [];
  // Membagi items menjadi grup 8 item per baris
  for (let i = 0; i < items.length; i += 9) {
    const group = items.slice(i, i + 9);
    // Menambahkan placeholder jika kurang dari 8 item
    while (group.length < 9) {
      group.push(['', 0, 0, 0]); // Menambahkan placeholder kosong
    }
    result.push(group);
  }
  return result;
});



const getLastMaintenance = (partName) => {
  const maintenance = lastMaintenance.value.find((item) => item.part === partName)
  return maintenance ? maintenance.created_at : 'No Record'
}

const fetchData = async (id_machine) => {
  try {
    const response = await axios.get(
      `http://192.168.148.125:5000/maintenance_part?id_machine=${id_machine}`,
    )
    lastMaintenance.value = response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
</script>

<style scoped>
.big-font {
  font-size: 1.8rem;
  font-weight: 600;
  font-family: Oswald;
}

.normal-font {
  font-size: 1rem;
  font-weight: 600;
  font-family: Oswald;
}
.hover-icon {
  transition: color 0.1s;
}

.hover-icon:hover {
  color: #0026ff; /* Ganti dengan warna yang Anda inginkan */
}
</style>
