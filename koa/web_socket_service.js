const path = require('path')
const fileUtils = require('./utils/file_utils')
// 1.引入 websocket
const WebSocket = require('ws')

// 2.创建websocket对象
const wss = new WebSocket.Server({
  port: 9998
})

// 服务端开启了监听
module.exports.listen = () => {
  // 对客户端连接事项进行监听，client代表的是客户端连接 socket对象
  wss.on('connection', client => {
    // console.log('有客户端连接成功');

    // 监听客户端向服务端发送数据
    client.on('message', async msg => {
      // console.log('客户端发送数据给服务端了：', msg);

      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        // trend seller map rank hot stock
        let filePath = `./data/${payload.chartName}.json`
        filePath = path.join(__dirname, filePath)
        // 读取到文件内容
        const result = await fileUtils.getFileJsonData(filePath)
        // 根据请求的路径返回对应的内容
        payload.data = result
        // 返回给客户端
        client.send(JSON.stringify(payload))
      } else {
        // 原封不动的将所接收到的数据转发给处于连接状态的每一个客户端
        // 所有客户端的连接 wss.clients
        wss.clients.forEach(client => {
          client.send(msg)
        })
      }

      // client.send('hello 我是后端')
    })
  })

}

