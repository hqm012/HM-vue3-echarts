<script setup>
import { inject, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import useRequest from '@/composables/useRequest'

const echarts = inject('echarts')
const seller_chart = ref(null)  //dom ref
const chartInstance = ref(null)     //echarts.init

// 初始化dom
const initChart = () => {
    chartInstance.value = echarts.init(seller_chart.value, 'chalk')
    chartInstance.value.on('mouseover', () => {
        clearInterval(timer.value)
    })
    chartInstance.value.on('mouseout', () => {
        handleInterval()
    })
}

// 初始化数据
const chartData = ref([])
const getData = async () => {
    let res = await useRequest('/seller')
    chartData.value = res.sort((a, b) => a.value - b.value)
    updataChart()
    updataChartData()
    handleInterval()
}

// 数据分页
const currentPage = ref(1)
const pageSize = ref(5)
const totalPage = computed(() => Math.ceil(chartData.value.length / pageSize.value))
const renderData = () => chartData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)

//数据轮播
const intervalFunction = () => {
    currentPage.value++;
    if (currentPage.value > totalPage.value) currentPage.value = 1;
    updataChartData()
}
const timer = ref(null)
const handleInterval = () => {
    if (timer.value) {
        clearInterval(timer.value)
    }
    timer.value = setInterval(intervalFunction, 5000)
}


// echart配置
const updataChart = () => {
    const titleFontSize = seller_chart.value.offsetWidth / 100 * 3.6
    const barWidth = seller_chart.value.offsetHeight / 16
    const option = {
        title: {
            text: '▎商家销售统计',
            textStyle: {
                fontSize: titleFontSize,
            },
            top: 20,
            left: 20,
        },
        grid: {
            top: '20%',
            left: '3%',
            bottom: '5%',
            right: '6%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    width: titleFontSize,
                    color: '#2d3443'
                }
            }
        },
        series: [
            {
                name: '商家销售统计',
                type: 'bar',
                barWidth: barWidth,
                label: {
                    show: true,
                    position: 'right',
                    color: '#fff'
                },
                itemStyle: {
                    borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: '#5052ee' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#ab6ee5' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ],

    }
    chartInstance.value.setOption(option)
}
const updataChartData = () => {
    const option = {
        dataset: {
            source: renderData()
        }
    }
    chartInstance.value.setOption(option)
}
const screenAdapter = () => {
    updataChart()
    chartInstance.value.resize()
}

onMounted(() => {
    initChart()
    getData()
    window.addEventListener('resize', screenAdapter)
})
onBeforeUnmount(() => {
    clearInterval(timer.value)
    window.removeEventListener('resize', screenAdapter)
})
defineExpose({
    screenAdapter
})

</script>

<template>
    <div class="seller_container">
        <div class="seller_chart" ref="seller_chart">
        </div>
    </div>
</template>

<style scoped>
.seller_container,
.seller_chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>