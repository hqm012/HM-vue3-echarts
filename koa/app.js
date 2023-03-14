const Koa = require('koa')
const app = new Koa()

const responseDurationMiddleware = require('./middleware/koa_response_duration')
const responseHeaderMiddleware = require('./middleware/koa_response_header')
const responseDataMiddleware = require('./middleware/koa_response_data')

// 用于计算耗时最好第一层中间件
app.use(responseDurationMiddleware)

app.use(responseHeaderMiddleware)

app.use(responseDataMiddleware)

app.listen(7777)

const WebSocketService = require('./web_socket_service')
WebSocketService.listen()

