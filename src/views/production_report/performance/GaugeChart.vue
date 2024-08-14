<template>
  <CCol :md="3">
    <CCard class="mb-4">
      <CCardBody>
        <v-chart :style="styling" :option="option" autoresize />
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script setup>
import { use } from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { GraphicComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'

import { provide, ref, computed, watchEffect } from 'vue'
use([GaugeChart, CanvasRenderer, GraphicComponent])
provide(THEME_KEY, 'light')

const props = defineProps({
  height: {
    type: Number,
    default: 34,
  },
  chartTitle: {
    type: String,
    default: 'MONTHLY OEE',
  },
  oeeValue: {
    type: Object,
    default: () => ({
      availability: 0,
      oee: 0,
      productivity: 0,
      quality: 0,
    }),
  },
})

const styling = computed(() => ({
  height: `${props.height}vh`,
}))

const option = ref({
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false,
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#464646',
        },
      },
      axisLine: {
        lineStyle: {
          width: 60,
        },
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
        distance: 50,
      },
      data: [
        {
          value: props.oeeValue.availability,
          name: 'Availability',
          title: {
            offsetCenter: ['0%', '110%'],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '125%'],
          },
          // itemStyle: {
          //   color: 'rgba(123, 211, 234,1)',
          // },
        },
        {
          value: props.oeeValue.productivity,
          name: 'Productivity',
          title: {
            offsetCenter: ['80%', '110%'],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['80%', '125%'],
          },
          // itemStyle: {
          //   color: 'rgba(161, 238, 189,1)',
          // },
        },
        {
          value: props.oeeValue.quality,
          name: 'Quality',
          title: {
            offsetCenter: ['-80%', '110%'],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['-80%', '125%'],
          },
          // itemStyle: {
          //   color: 'rgba(238, 199, 89,1)',
          // },
        },
        {
          value: props.oeeValue.oee,
          name: 'OEE',
          title: {
            offsetCenter: ['0%', '-10%'],
            fontSize: 24,
            fontWeight:'bolder'
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '7%'],
          },
          // itemStyle: {
          //   color: 'rgba(237, 183, 237,1)',
          // },
        },
      ],
      title: {
        fontSize: 13,
      },
      detail: {
        width: 50,
        height: 14,
        fontSize: 14,
        color: 'inherit',
        borderColor: 'inherit',
        borderRadius: 20,
        borderWidth: 2,
        formatter: '{value}%',
      },
      radius: '80%',
    },
  ],
  graphic: [
    {
      type: 'text',
      left: 0,
      top: 0,
      style: {
        text: props.chartTitle,
        textAlign: 'center',
        font: 'bolder 16px sans-serif',
      },
    },
  ],
})


const updateChart = () => {
  option.value.series[0].data[0].value = props.oeeValue.availability
  option.value.series[0].data[1].value = props.oeeValue.productivity
  option.value.series[0].data[2].value = props.oeeValue.quality
  option.value.series[0].data[3].value = props.oeeValue.oee
}

watchEffect(() => {
  updateChart()
})

</script>
