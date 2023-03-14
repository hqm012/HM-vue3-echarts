<script setup>
import { ref, inject, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import useRequest from '@/composables/useRequest'

const echarts = inject('echarts')
const trend_chart = ref(null)
// const chartInstance = ref(null)      //echarts实例不能是vue3响应式对象，否则有些类型的tooltip不显示
let chartInstance = null

const initChart = () => {
    chartInstance = echarts.init(trend_chart.value, 'chalk')
}

// 初始化数据
const allData = ref({})
const chartData = ref([])
const getChartData = async (res) => {
    // const res = await useRequest('/trend')
    // console.log(res);
    allData.value = res
    handleChartData()
    updataChart()
    updataChartData()
}
const handleChartData = () => {
    //数据处理，复杂数据使用dataset需要二维数组，这里顺便尝试使用seriesLayoutBy
    chartData.value = [
        ['月份', ...allData.value.common.month],
        [allData.value[choiceType.value].data[0].name, ...allData.value.map.data[0].data],
        [allData.value[choiceType.value].data[1].name, ...allData.value.map.data[1].data],
        [allData.value[choiceType.value].data[2].name, ...allData.value.map.data[2].data],
        [allData.value[choiceType.value].data[3].name, ...allData.value.map.data[3].data],
        [allData.value[choiceType.value].data[4].name, ...allData.value.map.data[4].data],
    ]
    // console.log(chartData.value);
}

// echarts配置
const updataChart = () => {
    const option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
        },
        yAxis: {

        },
        legend: {
            left: 20,
            top: '15%',
            icon: 'circle',
            itemWidth: titleFontSize.value,
            itemHeight: titleFontSize.value,
            itemGap: titleFontSize.value,
            textStyle: {
                fontSize: titleFontSize.value,
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '10%',
            top: '35%',
            right: '4%',
            bottom: '10%',
            // containLabel: true,  //设置了这个会不显示，未知bug+1
        },
        series: [
            { type: 'line', seriesLayoutBy: 'row', stack: 'stack1', areaStyle: { opacity: 0.1, } },
            { type: 'line', seriesLayoutBy: 'row', stack: 'stack1', areaStyle: { opacity: 0.1, } },
            { type: 'line', seriesLayoutBy: 'row', stack: 'stack1', areaStyle: { opacity: 0.1, } },
            { type: 'line', seriesLayoutBy: 'row', stack: 'stack1', areaStyle: { opacity: 0.1, } },
            { type: 'line', seriesLayoutBy: 'row', stack: 'stack1', areaStyle: { opacity: 0.1, } },
        ]
    }
    chartInstance.setOption(option)
}
const updataChartData = () => {
    const option = {
        dataset: {
            source: chartData.value,
        },
    }
    chartInstance.setOption(option)
}

// 标题点击切换
const openOl = ref(false)
const choiceType = ref('map')
const trendTitle = ref("地区销量趋势")
const handleChangeType = (record) => {
    choiceType.value = record.key
    trendTitle.value = record.text
    chartInstance.clear()   //不知道为什么仅触发updataChartData无效，所以完整的的setoption一遍，未知bug+1
    handleChartData()
    updataChart()
    updataChartData()
    openOl.value = !openOl.value
}

// 分辨率适配
const titleFontSize = ref(0)
const screenAdapter = () => {
    titleFontSize.value = trend_chart.value.offsetWidth / 100 * 3.6
    updataChart()
    chartInstance.resize()
}

//websocket
const socket = inject('socket')


onBeforeMount(() => {
    socket.registerCallBack('trendData', getChartData)
})
onMounted(() => {
    initChart()
    // getChartData()
    socket.send({
        action: 'getData',
        socketType: 'trendData',
        chartName: 'trend',
        value: ''
    })
    screenAdapter()
    window.addEventListener('resize', screenAdapter)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', screenAdapter)
    socket.unRegisterCallBack('trendData')
})
defineExpose({
    screenAdapter
})
</script>

<template>
    <div class="trend_container">
        <div class="trend_title">
            <span>{{ '▎' + trendTitle }}</span>
            <span class="iconfont title_icon" @click="openOl = !openOl">&#xe6eb;</span>
            <ol v-show="openOl">
                <li v-for="i in allData.type" :key="i.key" @click="handleChangeType(i)">{{ i.text }}</li>
            </ol>
        </div>
        <div class="trend_chart" ref="trend_chart"></div>
    </div>
</template>

<style scoped>
.trend_chart,
.trend_container {
    width: 100%;
    height: 100%;
}

.trend_container {
    position: relative;
}

ol {
    list-style: none;
    margin: 0;
    padding: 0;
}

li {
    text-indent: .6em;
    background-color: rgb(41, 52, 65);
}

.trend_title {
    position: absolute;
    z-index: 1;
    color: #fff;
    padding: 20px;
}

.trend_title,
.title_icon {
    font-size: v-bind(titleFontSize + 'px');
}
</style>