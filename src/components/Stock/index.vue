<script setup>
import { inject, onMounted, onBeforeUnmount, ref, computed } from 'vue';
import useRequest from '@/composables/useRequest'

const echarts = inject('echarts')
const stock_chart = ref(null)
let chartInstance = null

const initChart = () => {
    chartInstance = echarts.init(stock_chart.value, 'chalk')
    chartInstance.on('mouseover', () => {
        clearInterval(timer.value)
    })
    chartInstance.on('mouseout', () => {
        startInterval()
    })
}

const allData = ref([])
const currentIndex = ref(0)
const renderData = computed(() => allData.value.slice(currentIndex.value * 5, (currentIndex.value + 1) * 5))
const getData = async () => {
    const res = await useRequest('/stock')
    allData.value = res
    updataChart()
    updataChartData()
    screenAdapter()
}

const updataChart = () => {
    const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['60%', '75%']
    ]
    const colorArr = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8b11c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf']
    ]
    const labelColor = ['#4ff778', '#e5dd45', '#e8821c', '#5052ee', '#23e5e5']
    const series = renderData.value.map((item, index) => {
        return {
            type: 'pie',
            radius: [110, 100],
            center: centerArr[index],
            datasetIndex: index,
            // hoverAnimation: false,   //5.0已弃用，可以用但报警告
            emphasis: {
                scale: false
            },
            label: {
                position: 'center',
                // color: labelColor[index]
            },
            labelLine: {
                show: false
            },
        }
    })
    const option = {
        title: {
            text: '▎库存和销量分析',
            left: 20,
            top: 20
        },
        // 使用dataset后颜色不会配置，我放弃了
        // color: [].concat.apply([], colorArr.map(i => ([{
        //     type: 'linear',
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [{
        //         offset: 0, color: i[0] // 0% 处的颜色
        //     }, {
        //         offset: 1, color: i[1] // 100% 处的颜色
        //     }],
        // }, 'grey']))),
        series
    }
    // console.log(option);
    chartInstance.setOption(option)
}

const updataChartData = () => {
    const dataset = renderData.value.map((item, index) => {
        return {
            source: [
                [item.name + '\n\n' + item.sales, item.stock],
                ['', item.sales],
            ]
        }
    })
    const option = {
        dataset
        /**
          [
            {
                source: [
                    [renderData.value[0].name, renderData.value[0].stock],
                    [renderData.value[0].name, renderData.value[0].sales]
                ]
            },
            {
                source: [
                    [renderData.value[1].name, renderData.value[1].stock],
                    [renderData.value[1].name, renderData.value[1].sales]
                ]
            },
            {
                source: [
                    [renderData.value[2].name, renderData.value[2].stock],
                    [renderData.value[2].name, renderData.value[2].sales]
                ]
            },
            {
                source: [
                    [renderData.value[3].name, renderData.value[3].stock],
                    [renderData.value[3].name, renderData.value[3].sales]
                ]
            },
            {
                source: [
                    [renderData.value[4].name, renderData.value[4].stock],
                    [renderData.value[4].name, renderData.value[4].sales]
                ]
            }
        ]
         */

    }
    chartInstance.setOption(option)
}

const screenAdapter = () => {
    const titleFonstSize = stock_chart.value.offsetWidth / 100 * 3.6
    const innerRadius = titleFonstSize * 2
    const outterRadius = innerRadius * 1.125
    const adapterOption = {
        title: {
            textStyle: {
                fontSize: titleFonstSize
            }
        },
        series: Array.of(1, 2, 3, 4, 5).map(i => {
            return {
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleFonstSize / 2
                }
            }
        })
    }
    // console.log(adapterOption);
    chartInstance.setOption(adapterOption)
    chartInstance.resize()
}

const timer = ref(null)
const startInterval = () => {
    if (timer.value) {
        clearInterval(timer.value)
    }
    timer.value = setInterval(() => {
        currentIndex.value = Math.abs(--currentIndex.value)
        updataChartData()
    }, 5000)
}

onMounted(() => {
    initChart()
    getData()
    window.addEventListener('resize', screenAdapter)
    startInterval()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', screenAdapter)
    clearInterval(timer.value)
})
defineExpose({
    screenAdapter
})
</script>

<template>
    <div class="stock_container">
        <div class="stock_chart" ref="stock_chart"></div>
    </div>
</template>

<style scoped>
.stock_chart,
.stock_container {
    width: 100%;
    height: 100%;
}
</style>