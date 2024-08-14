<template>
  <CCol>
    <CCard>
      <CCardBody>
        <v-chart class="chart" :option="option" autoresize />
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script setup>
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  GraphicComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  PieChart,
  GraphicComponent,
  CanvasRenderer,
])

import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, watchEffect } from 'vue'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'light')

const props = defineProps({
  seriesData: Array,
  chartTitle: String,
  totalData : {
    type:String,
    default: '0'
  },
  unit : {
    type: String,
    default: ''
  },
  source : Array,
})

const option = ref({
  color:['rgb(71, 147, 175)','rgb(255, 196, 112)','rgb(221, 87, 70)','rgb(139, 50, 44)','rgb(91, 188, 255)','rgb(126, 161, 255)'],
  title: {
    text: props.chartTitle,
    top: 0,
    left: 'center',
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return params.name
    },
    textStyle: {
      fontSize: 13,
      fontWeight: 'bold',
    },
  },
  legend: {
    orient: 'horizontal',
    top: 30,
  },
  series: [
    {
      type: 'pie',
      selectedMode: 'single',
      radius: ['15%', '40%'],
      labelLine: {
        length: 30,
      },
      label: {
        formatter: function (params) {
          const formattedValue = params.value.toLocaleString('id-ID')
          const percentValue = params.percent.toFixed(1)
          return formattedValue + '  {per|' + percentValue + '%}  '
        },
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4,
          },
        },
      },
      data: props.seriesData ,
    },
  ],
  graphic: [
    {
      type: 'text',
      left: 'center',
      bottom: 30,
      style: {
        text: 'Total : ' + props.totalData +' '+ props.unit,
        textAlign: 'center',
        font: 'bold' + ' 14px ' + 'Arial',
      },
    },
    {
      type: 'text',
      left: '0%',
      top: '0',
      style: {
        text: props.source[0],
        textAlign: 'center',
        font: ' 16px ' + 'Arial',
      },
    },
    {
      type: 'text',
      left: '0%',
      bottom: '0%',
      style: {
        text: props.source[1].year + '/' + props.source[1].month,
        textAlign: 'center',
        font: ' 14px ' + 'Arial',
      },
    }
  ],
})

const updateChart = () => {
  option.value.graphic[1].style.text = props.source[0]
  option.value.graphic[2].style.text = props.source[1].year + '/' + (props.source[1].month+1)
  option.value.series[0].data = props.seriesData
  option.value.title.text = props.chartTitle
  if(props.unit === 'Rp.'){
    option.value.graphic[0].style.text = 'Total : ' + props.unit + ' ' + props.totalData
  }else if(props.chartTitle === 'Kadoritsu'){
    option.value.graphic[0].style.text = 'Average : ' + props.totalData +' '+ props.unit
  }
  else{
    option.value.graphic[0].style.text = 'Total : ' + props.totalData +' '+ props.unit
  }
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
