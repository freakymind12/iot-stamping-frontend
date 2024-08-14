<template>
  <CCol sm="10">
    <CCard class="mb-2">
      <CCardBody>
        <v-chart class="chart" :option="option" autoresize/>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script setup>
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
])

import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, watchEffect, computed } from 'vue'

use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'light')

const props = defineProps({
  seriesData: Array,
  seriesName: Array,
  xAxis: Array,
  legend: Array,
  chartTitle: String,
  chartData: Object,
  xAxisName: Array,
  chartType: {
    type: String,
    default : 'line'
  },
  colorSeries: Array,
  yAxisIndex:Array
})

const yAxisIndex = computed(() => {
    if (!props.yAxisIndex || props.yAxisIndex.length === 0) {
      return props.seriesName.map(() => 0);
    }
    return props.yAxisIndex;
  });


const labelOption = ref({
  show: true,
  position: 'top',
  formatter: '{c}  {name|{a}}',
  fontSize: 10,
  rotate:30,
  rich: {
    name: {},
  },
  color: '#000000', // Mengganti warna tulisan label menjadi putih
  // fontWeight:'Bold',
  fontFamily: 'Roboto, sans-serif', // Mengatur jenis font teks label
  // eslint-disable-next-line no-dupe-keys
  formatter: function (params) {
    // Menampilkan label hanya jika nilai data bukan 0
    if (params.value !== 0 && params.value >= 1000 && params.value < 1000000) {
      params.value = (params.value / 1000).toFixed(0)
      return params.value + 'K' // Menampilkan nilai data dalam ribuan
    } else if (params.value !== 0 && params.value >= 1000000 && params.value < 1000000000) {
      params.value = (params.value / 1000000).toFixed(0)
      return params.value + 'M' // Menampilkan nilai data dalam jutaan
    } else if (params.value !== 0 && params.value >= 1000000000) {
      params.value = (params.value / 1000000000).toFixed(0)
      return params.value + 'B' // Menampilkan nilai data dalam miliar
    } else if (params.value !== 0) {
      return params.value // Menampilkan nilai data
    } else {
      return '' // Menampilkan label kosong jika nilai data adalah 0
    }
  },
})

const yformat = function (value) {
  var newValue = value
  if (value >= 1000000000) {
    newValue = (value / 1000000000).toFixed(0) + 'B'
  } else if (value >= 1000000) {
    newValue = (value / 1000000).toFixed(0) + 'M'
  } else if (value >= 1000) {
    newValue = (value / 1000).toFixed(0) + 'K'
  }
  return newValue
}

const option = ref({
  color: props.colorSeries,
  title: {
    text: props.chartTitle,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: props.legend,
    bottom:'0%'
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: true },
      magicType: { type: ['line', 'bar'] },
      saveAsImage: {},
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: props.xAxis,
      axisLabel:{
        fontSize:10
      }
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: yformat,
        fontSize: 12,
      },
      splitLine: {
        show: true
      },
      name: props.xAxisName[0],
    },
    {
      type: 'value',
      axisLabel: {
        formatter: yformat,
        fontSize: 12,
      },
      splitLine: {
        show: true
      },
      name: props.xAxisName[1],
    }
  ],
  
  series: [],
})



const updateChart = () => {
  // Reset option.value.series
  option.value.series = []
  option.value.legend.data = props.legend
  option.value.title.text = props.chartTitle
  option.value.xAxis[0].data = props.xAxis

  // Loop through props.seriesData and push each series to option.value.series
  props.seriesData.forEach((data, index) => {
    option.value.series.push({
      name: props.seriesName[index], // Use seriesName prop for series name
      yAxisIndex: yAxisIndex.value[index],
      type: props.chartType, // Assuming the type is always 'line'
      lineStyle: {
        width: 5,
        // color: colors[index % colors.length]
      },
      emphasis: {
        focus: 'series'
      },
      smooth: true,
      label: labelOption,
      data: data, // Use the data from props.seriesData
    })
  })
}

watchEffect(() => {
  updateChart()
})
</script>

<style scoped>
.chart {
  height: 41vh;
}
</style>
