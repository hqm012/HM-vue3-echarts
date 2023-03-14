async function useRequest(url = "", method = "GET", data) {
    const baseURL = 'http://127.0.0.1:7777/api/';
    const res = await fetch(baseURL+url, {
        method,
        headers: {
            //全局请求头
            "Content-Type": "application/json",
            Authorization: "Bearer SOMEJWTTOKEN"
        },
        body: data ? JSON.stringify(data) : undefined,
    });
    
    //400状态处理
    if (res.status >= 400){
        const error = await res.json();
        const e = new Error(res.statusText);
        e.error = error;
        e.status = res.status;
        throw e;
    }
    
    const result = await res.json();
    return result
}
export default useRequest;