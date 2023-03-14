const responseHeaderMiddleware = async (ctx,next)=>{
    const contentType = 'application/json; charset=utf-8'
    ctx.set('Content-Type',contentType)
    ctx.set('Access-Control-Allow-Origin','*')
    ctx.set('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE')
    ctx.set("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE,x-requested-with,Authorization")
    await next()
}

module.exports = responseHeaderMiddleware