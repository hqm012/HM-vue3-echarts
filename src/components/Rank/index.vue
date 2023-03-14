<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import useRequest from '@/composables/useRequest'

const echarts = inject('echarts')
const rank_chart = ref(null)
let chartInstance = null
const initChart = () => {
    chartInstance = echarts.init(rank_chart.value, 'chalk')
    chartInstance.on('mouseover', () => {
        clearInterval(timeId.value)
    })
    chartInstance.on('mouseout', () => {
        startInterval()
    })
}

const allData = ref([])
const getData = async () => {
    const res = await useRequest('/rank')
    allData.value = res
    allData.value = allData.value.sort((a, b) => {
        return b.value - a.value
    })
    updataChart()
    updataChartData()
    screenAdapter()
    startInterval()
}

const updataChart = () => {
    const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5'],
    ]
    const option = {
        title: {
            text: '▎地区销售',
            left: 20,
            top: 20,
        },
        grid: {
            top: '30%',
            left: '10%',
            right: '5%',
            bottom: '10%',
            containLable: true,
        },
        tooltip: {
            show: true
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value'
        },
        series: {
            name: '地区销售',
            type: 'bar',
            itemStyle: {
                color: arg => {
                    let targetColorArr = null
                    if (arg.value.value > 300) {
                        targetColorArr = colorArr[0]
                    } else if (arg.value.value > 200) {
                        targetColorArr = colorArr[1]
                    } else {
                        targetColorArr = colorArr[2]
                    }
                    return {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: targetColorArr[0] // 0% 处的颜色
                        }, {
                            offset: 1, color: targetColorArr[1] // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        },
        dataZoom: {
            show: false,
            start: dataZoomStart.value,
            end: dataZoomEnd.value,
        },
    }
    chartInstance.setOption(option)
}

const updataChartData = () => {
    const option = {
        dataset: {
            source: allData.value
        }
    }
    chartInstance.setOption(option)
}

const screenAdapter = () => {
    chartInstance.resize()
    const titleFontSize = rank_chart.value.offsetWidth / 100 * 3.6
    const AdapterOption = {
        title: {
            textStyle: {
                fontSize: rank_chart.value.offsetWidth / 100 * 2.5
            }
        },
        series: {
            barWidth: titleFontSize,
            itemStyle: {
                borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
        }
    }
    chartInstance.setOption(AdapterOption)
}

const dataZoomStart = ref(0)
const dataZoomEnd = ref(50)
const timeId = ref(null)
const startInterval = () => {
    timeId.value && clearInterval(timeId.value)
    timeId.value = setInterval(() => {
        dataZoomStart.value += 10
        if (dataZoomStart.value > 50) dataZoomStart.value = 0
        dataZoomEnd.value += 10
        if (dataZoomEnd.value > 100) dataZoomEnd.value = 50
        const option = {
            dataZoom: {
                show: false,
                start: dataZoomStart.value,
                end: dataZoomEnd.value,
            }
        }
        chartInstance.setOption(option)
    }, 2000)
}

onMounted(() => {
    initChart()
    getData()
    window.addEventListener('resize', screenAdapter)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', screenAdapter)
    clearInterval(timeId.value)
})
defineExpose({
    screenAdapter
})
</script>

<template>
    <div class="rank_container">
        <div class="rank_chart" ref="rank_chart"></div>
    </div>
</template>

<style scoped>
.rank_container,
.rank_chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>