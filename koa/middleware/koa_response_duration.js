const responseDuration = async (ctx,next)=>{
    const start = Date.now()
    await next()
    const end = Date.now()
    const duration = end - start
    ctx.set('X-Response-Time',duration + 'ms')
}

module.exports = responseDuration