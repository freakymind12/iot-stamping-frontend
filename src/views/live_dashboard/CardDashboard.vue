<template>
  <div class="container-card-monitoring">
    <CCard class="mb-0" style="border: 0.5px solid black; border-radius: 2px;">
      <CCardBody :class="[cardClasses, 'card-body-monitoring']" @click="handleCardClick()" >
        <CRow class="mb-3">
          <CCol sm="4" class="big-font d-flex">{{ props.item[0] }}</CCol>
          <CCol sm="6" class="normal-font text-end"
            >Kanagata:
            <span v-for="(value, index) in props.item[5]" :key="index" class="small-font">{{
              value
            }}</span></CCol
          >
          <CCol sm="2" class="small-font text-end">
            <CSpinner size="sm" /> {{ props.item[1] }}
          </CCol>
        </CRow>
        <CRow class="mb-1">
          <CCol class="normal-font">
            {{ props.item[4][0] }}
          </CCol>
          <CCol v-if="props.item[4][1]" class="normal-font text-end">
            {{ props.item[4][1] }}
          </CCol>
        </CRow>
        <CRow class="mb-1">
          <CCol sm="4" class="normal-font"
            >Status Machine: <span class="small-font">{{ props.item[2] }}</span></CCol
          >
          <CCol sm="5" class="normal-font"
            >Output/Target:
            <span class="small-font"
              >{{ props.item[6][0].toLocaleString() }} /
              {{ props.item[7][0].toLocaleString() }} pin</span
            ></CCol
          >
          <CCol sm="3" class="normal-font"
            >Kadoritsu:
            <span
              :class="{
                'small-font': true,
                'pulse-text': props.item[11] < 75,
              }"
              >{{ props.item[11] }} %</span
            ></CCol
          >
        </CRow>
        <CRow class="mb-1">
          <CCol sm="4" v-if="props.item[2] == 'STOP'" class="normal-font"
            >Stop Cause: <span class="small-font">{{ props.item[3] }}</span></CCol
          >
          <CCol sm="4" v-else class="normal-font"
            >Speed:
            <span class="small-font">{{ props.item[14] }} SPM</span>
          </CCol>
          <CCol sm="5" class="normal-font"
            >Reject Setting: <span class="small-font">{{ props.item[12].toLocaleString() }} pin</span></CCol
          >
          <CCol sm="3" class="normal-font text-right"
            >Dandori Time: <span class="small-font">{{ props.item[15] }} min</span></CCol
          >
        </CRow>
        <CRow class="mb-1">
          <CCol class="normal-font">Alarm: </CCol>
          <CCol sm="5" v-if="props.item[2] == 'STOP'" class="normal-font"
            >Clocking Stop: <span class="small-font">{{ props.item[8] }}</span></CCol
          >
          <CCol sm="5" v-else class="normal-font"
            >Production Time:
            <span class="small-font">{{ props.item[10].toLocaleString() }} min</span></CCol
          >
          <CCol sm="3" class="normal-font"
            >Stop Time:
            <span class="small-font">{{ props.item[9].toLocaleString() }} min</span></CCol
          >
        </CRow>
        <CRow class="mb-0">
          <CCol
            v-if="props.item[13].length != 0"
            style="font-size: 0.8rem; font-weight: 600; font-family: Arial, Helvetica, sans-serif"
            >{{ props.item[13] }}
          </CCol>
          <CCol
            v-else
            style="font-size: 0.8rem; font-family: Arial, Helvetica, sans-serif"
            >[ No Alarm Detected ]</CCol
          >
        </CRow>
      </CCardBody>
    </CCard>
    <Transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <FooterCardDashboard :machine="props.item[0]" v-if="visibleFooter"/>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import FooterCardDashboard from './FooterCardDashboard.vue'

const visibleFooter = ref(false)

const props = defineProps({
  item: Array,
})

const cardClasses = computed(() => {
  if (props.item[1] === 'Disconnected') {
    return 'bg-secondary'
  }

  const bgClass = {
    RUN: 'bg-success',
    STOP: 'bg-danger',
    SETTING: 'bg-warning',
  }

  return bgClass[props.item[2]] || ''
})

const handleCardClick = () => {
  visibleFooter.value = !visibleFooter.value
}
</script>

<style scoped>
.container-card-monitoring {
  border: 0.5px solid #f3f4f7;
  cursor: pointer;
  position: relative; /* Untuk z-index */
  transition: transform 0.3s ease, z-index 0.3s ease; /* Menambahkan transisi */
}

.container-card-monitoring:hover {
  transform: scale(1.02); /* Membesar 10% saat hover */
  z-index: 1; /* Jika diperlukan, meningkatkan z-index saat hover */
}

.card-body-monitoring {
  font-family: Oswald;
  font-size: 20px;

}

.big-font {
  font-size: 2rem;
  font-weight: 700;
  transform: scaleY(2);
}

.normal-font {
  font-size: 1.3rem;
  font-weight: 600;
  transform: scaleY(1.2);
}

.small-font {
  font-size: 1rem;
  font-weight: 400;
}

.product-font {
  font-size: 1.2rem;
  font-weight: 600;
}

.pulse-text {
  display: inline-block;
  animation: pulse 1s infinite;
  transition: transform 0.2s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Atau jika menggunakan keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fade-enter-active {
  animation: fadeIn 0.5s forwards;
}

.fade-leave-active {
  animation: fadeOut 0.5s forwards;
}
</style>
