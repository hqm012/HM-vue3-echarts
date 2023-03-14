const path = require('path')
const fileUtils = require('../utils/file_utils')

const responseDataMiddleware = async (ctx,next)=>{
    const url = ctx.request.url
    let filePath = url.replace('/api','')
    filePath = '../data' + filePath + '.json'
    filePath = path.join(__dirname,filePath)
    try {
        const ret = await fileUtils.getFileJsonData(filePath)
        // const data = {
        //     code: '200',
        //     data: ret
        // }
        ctx.response.body = ret
    } catch (error) {
        const errorMsg = {
            code: '400',
            message: error,
        }
        ctx.response.body = errorMsg
    }
    console.log(filePath);
    await next()
}

module.exports = responseDataMiddleware