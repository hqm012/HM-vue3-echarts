<script setup>
import { RouterView } from 'vue-router'
import { provide } from 'vue';
import * as echarts from 'echarts'
import chalk from '@/assets/theme/chalk'
import SocketService from './utils/socket_service'

echarts.registerTheme('chalk', chalk)
provide('echarts', echarts)
provide('socket', SocketService.Instance)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
