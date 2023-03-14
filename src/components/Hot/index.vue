<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue';
import useRequest from '@/composables/useRequest'

const echarts = inject('echarts')
const hot_chart = ref(null)
let chartInstance = null
const initChart = () => {
    chartInstance = echarts.init(hot_chart.value, 'chalk')
}

const allData = ref([])
const getData = async () => {
    const res = await useRequest('/hotproduct')
    allData.value = res
    updataChart()
    updataChartData()
}

const updataChart = () => {
    const option = {
        title: {
            text: `▎热销商品的占比——${currentData.value.name}`,
            top: '5%',
            left: 20,
        },
        legend: {
            bottom: '3%',
            icon: 'circle',
        },
        tooltip: {
            formatter: (arg) => {
                // return arg.data.children.map(i => `${i.name}：${i.value}`).join('<br/>')  //两者皆可
                return arg.data.children.map(i => `<p>${i.name}：${i.value}</p>`).join('')
            }
        },
        series: {
            name: `${currentData.value.name}`,
            type: 'pie',
            label: {
                show: false
            },
            radius: 140,
            emphasis: {
                label: {
                    show: true
                },
                labelLine: {
                    show: false
                }
            }
        }
    }
    chartInstance.setOption(option)
}

const currentIndex = ref(0)
const currentData = computed(() => allData.value[Math.abs(currentIndex.value)])

const updataChartData = () => {
    const option = {
        dataset: {
            source: currentData.value.children
        }
    }
    chartInstance.setOption(option)
}

const changeCurrent = (value) => {
    value == 'left' ?
        currentIndex.value = (currentIndex.value - 1) % allData.value.length
        :
        currentIndex.value = (currentIndex.value + 1) % allData.value.length
    updataChart()
    updataChartData()
}

const screenAdapter = () => {
    const titleFontSize = hot_chart.value.offsetWidth / 100 * 3.6
    const adapterOption = {
        title: {
            textStyle: {
                fontSize: titleFontSize
            }
        },
        legend: {
            itemWidth: titleFontSize,
            itemHeight: titleFontSize,
            textStyle: {
                fontSize: titleFontSize / 1.5
            }
        }
    }
    chartInstance.setOption(adapterOption)
    chartInstance.resize()
}

onMounted(() => {
    initChart()
    getData()
    screenAdapter()
    window.addEventListener('resize', screenAdapter)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', screenAdapter)
})
defineExpose({
    screenAdapter
})
</script>

<template>
    <div class="hot_container">
        <div class="hot_chart" ref="hot_chart"></div>
        <span class="iconfont arr_left" @click="changeCurrent('left')">&#xe6ef;</span>
        <span class="iconfont arr_right" @click="changeCurrent('right')">&#xe6ed;</span>
    </div>
</template>

<style scoped>
.hot_container {
    position: relative;
}

.hot_container,
.hot_chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.arr_left,
.arr_right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    cursor: pointer;
    font-size: 50px;
}

.arr_left {
    left: 10%;
}

.arr_right {
    right: 10%;
}
</style>