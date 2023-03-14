import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 重置样式
import 'normalize.css'

// 字体文件
import './assets/font/iconfont.css'

import './assets/main.css'

import SocketService from './utils/socket_service'
// 开启websocket
SocketService.Instance.connect()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
