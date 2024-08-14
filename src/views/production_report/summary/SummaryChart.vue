<template>
    <CCol :md="4">
      <CCard class="mb-4">
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
import { provide, ref, watchEffect } from 'vue'

use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'light')

const props = defineProps({
  seriesData: Array,
  seriesName: Array,
  xAxis: Array,
  legend: Array,
  chartTitle: String,
  chartData: Object,
  xAxisName: String,
  chartType: Array,
  colorSeries: Array,
})

const labelOption = ref({
  show: true,
  position: 'top',
  formatter: '{c}  {name|{a}}',
  fontSize: 12,
  // rotate:30,
  rich: {
    name: {},
  },
  color: '#000000', // Mengganti warna tulisan label menjadi putih
  fontWeight:'Bold',
  fontFamily: 'Roboto, sans-serif', // Mengatur jenis font teks label
  // eslint-disable-next-line no-dupe-keys
  formatter: function (params) {
    // Menampilkan label hanya jika nilai data bukan 0
    if (params.value !== 0 && params.value >= 1000 && params.value < 1000000) {
      params.value = (params.value / 1000).toFixed(0)
      return params.value + 'K' // Menampilkan nilai data dalam ribuan
    } else if (params.value !== 0 && params.value >= 1000000 && params.value < 1000000000) {
      params.value = (params.value / 1000000).toFixed(1)
      return params.value + 'M' // Menampilkan nilai data dalam jutaan
    } else if (params.value !== 0 && params.value >= 1000000000) {
      params.value = (params.value / 1000000000).toFixed(1)
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
    left: 'center',
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
      // dataZoom: {
      //   yAxisIndex: 'none',
      // },
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
        fontSize:11,
        // rotate:270
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
        show: false
      },
      name: props.xAxisName,
    },
  ],
  series: [],
})

const updateChart = () => {
  // Reset option.value.series
  option.value.series = []
  option.value.legend.data = props.legend
  option.value.title.text = props.chartTitle
  option.value.xAxis[0].data = props.xAxis

  // props.yAxisName.forEach((data, index) =>{
  //   const yAxisObject = {
  //     type: 'value',
  //     axisLabel: {
  //       formatter: yformat,
  //       fontSize: 12,
  //     },
  //     splitLine: {
  //       show: false
  //     },
  //     name: props.yAxisName[index],
  //   }

  //   option.value.yAxis.push(yAxisObject)
  // })

  props.seriesData.forEach((data, index) => {
    const seriesObject = {
      name: props.seriesName[index],
      type: props.chartType[index],
      // barWidth: '50%',
      emphasis: {
        focus: 'series'
      },
      data: data,
      itemStyle:{
        color : props.colorSeries[index]
      }
    };

    if (props.chartType[index] === 'line') {
      seriesObject.label = labelOption;
      seriesObject.smooth = true
      seriesObject.lineStyle = {
        color: '#204678',
        width: 2,
        type: 'dashed'
      }
      seriesObject.itemStyle = {
        borderWidth: 6,
        color: '#204678'
      }
    }

    option.value.series.push(seriesObject);
  });

}

watchEffect(() => {
  updateChart()
})

</script>

<style scoped>
.chart {
  height: 40vh;
}
</style>