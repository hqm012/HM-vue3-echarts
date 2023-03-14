<script setup>
import { reactive, ref, nextTick } from 'vue'
import Hot from '@/components/Hot/index.vue'
import Map from '@/components/Map/index.vue'
import Rank from '@/components/Rank/index.vue'
import Seller from '@/components/Seller/index.vue'
import Stock from '@/components/Stock/index.vue'
import Trend from '@/components/Trend/index.vue'

const fullScreenStatus = reactive({
  trend: false,
  seller: false,
  map: false,
  rank: false,
  hot: false,
  stock: false,
})
const trend = ref(null)
const map = ref(null)
const hot = ref(null)
const seller = ref(null)
const stock = ref(null)
const rank = ref(null)

const changeSize = async (value) => {
  fullScreenStatus[value] = !fullScreenStatus[value]
  await nextTick()
  eval(value).value.screenAdapter()
}

</script>

<template>
  <div class="wrapper">
    <div class="header">电商平台实时监控系统</div>
    <div class="trend" :class="fullScreenStatus.trend ? 'fullscreen' : ''">
      <Trend ref="trend"></Trend>
      <span @click="changeSize('trend')" class="iconfont enlargement"
        :class="fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
    <div class="map" :class="fullScreenStatus.map ? 'fullscreen' : ''">
      <Map ref="map"></Map>
      <span @click="changeSize('map')" class="iconfont enlargement"
        :class="fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
    <div class="hot" :class="fullScreenStatus.hot ? 'fullscreen' : ''">
      <Hot ref="hot"></Hot>
      <span @click="changeSize('hot')" class="iconfont enlargement"
        :class="fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
    <div class="seller" :class="fullScreenStatus.seller ? 'fullscreen' : ''">
      <Seller ref="seller"></Seller>
      <span @click="changeSize('seller')" class="iconfont enlargement"
        :class="fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
    <div class="rank" :class="fullScreenStatus.rank ? 'fullscreen' : ''">
      <Rank ref="rank"></Rank>
      <span @click="changeSize('rank')" class="iconfont enlargement"
        :class="fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
    <div class="stock" :class="fullScreenStatus.stock ? 'fullscreen' : ''">
      <Stock ref="stock"></Stock>
      <span @click="changeSize('stock')" class="iconfont enlargement"
        :class="fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt'"></span>
    </div>
  </div>
</template>

<style scoped>
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.wrapper {
  height: 100%;
  padding: 0 20px;
  background-color: #161522;

  display: grid;
  grid-template-rows: 8% 50% 10% 25%;
  grid-template-columns: 28% 42% 28%;
  justify-content: space-between;
  align-content: space-around;
  grid-template-areas:
    "header header header"
    "trend   map    hot"
    "seller  map   stock"
    "seller  rank  stock"
  ;
}

.wrapper>div {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.header {
  grid-area: header;
  background-image: url('@/assets/header_border_dark.png');
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  font-size: 20px;
  text-align: center;
  line-height: 80px;
}

.trend {
  grid-area: trend;
}

.map {
  grid-area: map;
}

.hot {
  grid-area: hot;
}

.seller {
  grid-area: seller;
}

.rank {
  grid-area: rank;
}

.stock {
  grid-area: stock;
}

.enlargement {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
}
</style>
