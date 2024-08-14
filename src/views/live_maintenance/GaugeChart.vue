<template>
  <CCol>
    <CCard>
      <CCardBody>
        <v-chart class="chart" :option="option" autoresize/>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script setup>
import { use } from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, provide } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts'

use([GaugeChart, CanvasRenderer])
provide(THEME_KEY, 'light')

const option = ref({
  series: [
    {
      type: 'gauge',
      min:0,
      max:3000000,
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.2, '#44ce1b'],
            [0.4, '#bbdb44'],
            [0.6, '#f7e379'],
            [0.8, '#f2a134'],
            [1, '#e51f1f']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'black'
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#000',
          width: 2
        }
      },
      splitLine: {
        distance: -30,
        length: 30,
        lineStyle: {
          color: '#000',
          width: 4
        }
      },
      axisLabel: {
        show:false,
        distance: 40,
        formatter: function (value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
          } else {
            return value.toString();
          }
        }
      },
      detail: {
        valueAnimation: true,
        formatter: function (value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
          } else {
            return value.toString();
          }
        },
        color: 'black'
      },
      data: [
        {
          value: 500000
        }
      ]
    }
  ]
});

</script>

<style scoped>
.chart {
  height: 40vh;
}
</style>