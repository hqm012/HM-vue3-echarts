export default class SocketService {
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    ws = null
    connected = false
    connectRetryCount = 0
    connect() {
        if (!window.WebSocket) {
            return console.log('浏览器不支持websocket');
        }
        this.ws = new WebSocket('ws://localhost:9998')
        this.ws.onopen = () => {
            console.log('服务器连接成功');
            this.connected = true
            this.connectRetryCount = 0
        }
        // 链接失败或连接后断开会调用
        this.ws.onclose = () => {
            console.log('连接服务器失败');
            this.connected = false
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, this.connectRetryCount * 500)
        }
        this.ws.onmessage = msg => {
            console.log('从服务器获取到了数据');
            // console.log(msg.data);
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data)
                    this.callBackMapping[socketType].call(this, realData)
                } else if (action === 'fullScreen') {

                } else if (action === 'themeChange') {

                }
            }
        }
    }

    callBackMapping = {}
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = callBack
    }

    sendRetryCount = 0
    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500)
        }
    }
}