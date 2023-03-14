<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import useRequest from '@/composables/useRequest'
import chinaJson from '@/assets/map/china.json'
import { getProvinceMapInfo } from '@/utils/map_utils.js'

const echarts = inject('echarts')
const map_chart = ref(null)
let chartInstance = null
const initChart = () => {
    chartInstance = echarts.init(map_chart.value, 'chalk')
    echarts.registerMap('china', chinaJson)
    chartInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        // console.log(import.meta);    //读取该文件的模块路径
        if (provinceInfo.key) {
            const areaData = await getAreaData(provinceInfo.path)
            echarts.registerMap(provinceInfo.key, { ...areaData })
            chartInstance.setOption({
                geo: {
                    map: provinceInfo.key
                }
            })
        }
    })
}

const getAreaData = (path) => import(/* @vite-ignore */path)

const updataChart = () => {
    const titleFontSize = map_chart.value.offsetWidth / 100 * 3.6
    const option = {
        title: {
            text: "▎商家分布",
            left: 20,
            top: 20,
            textStyle: {
                fontSize: map_chart.value.offsetWidth / 100 * 2.5,
            }
        },
        legend: {
            left: '5%',
            bottom: '5%',
            orient: 'vertical',
            itemWidth: titleFontSize,
            itemHeight: titleFontSize,
            itemGap: titleFontSize,
            textStyle: {
                fontSize: titleFontSize / 2
            }
        },
        geo: {
            type: 'map',
            map: 'china',
            top: "5%",
            bottom: "5%",
            itemStyle: {
                areaColor: '#2E72BF',
                borderColor: '#333'
            }
        },
    }
    chartInstance.setOption(option)
}
const updataChartData = () => {
    const option = {
        series: seriesArr.value
    }
    chartInstance.setOption(option)
}

const allData = ref([])
const seriesArr = ref([])   //放弃使用dataset，有点复杂不会弄。。。
const getData = async () => {
    const res = await useRequest('/map')
    allData.value = res
    seriesArr.value = res.map(i => ({
        type: 'effectScatter',
        rippleEffect: {
            scale: 5,
            brushType: 'stroke'
        },
        name: i.name,
        data: i.children,
        coordinateSystem: 'geo',//在地图使用散点需要加上这项
    }))
    updataChartData()
}

const screenAdapter = () => {
    updataChart()
    chartInstance.resize()
}

onMounted(() => {
    getData()
    initChart()
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
    <div class="map_container">
        <div class="map_chart" ref="map_chart" @dblclick="updataChart">

        </div>
    </div>
</template>

<style scoped>
.map_container,
.map_chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>