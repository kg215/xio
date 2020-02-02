import axios,{AxiosRequestConfig} from "axios";

import config from "../config";
import {redirectIndex} from "./url";

axios.defaults.baseURL = config["domain"]+"api/";

axios.interceptors.response.use(({data})=>data,({request,response})=>{
    if(response.status===401){
        localStorage.removeItem("login");
        /* 权限验证失败 */
        let url = request.url;
        /* 公共接口不跳转登陆 */
        let hash = window.location.hash,
        index = hash.indexOf("?"),
        key = index===-1?hash.substr(1):hash.substr(1,index-1);
        !config.publicView.includes(key) && !config.publicApi.includes(url) &&  redirectIndex("auth");
    }
    /* 把错误统一返回给调用者 */
    return Promise.reject(response);
});


const api = async function(code:string,opts:AxiosRequestConfig={
    method:"GET"
}):Promise<any>{
    return await axios({
        url:code,
        withCredentials:true,
        ...opts
    }).catch(e=>{
        return {error:e.data?(e.data.error||e.data):[]};
    });
}

api.get = function (code:string,params?:AxiosRequestConfig["params"]):any{
    return api(code,{params,method:"GET"});
}

api.post = function (code:string,data?:AxiosRequestConfig["data"]):any{
    return api(code,{data,method:"POST"});
}

api.delete = function (code:string,params?:AxiosRequestConfig["params"]):any{
    return api(code,{params,method:"DELETE"});
}

api.patch = function (code:string,data?:AxiosRequestConfig["data"]):any{
    return api(code,{data,method:"PATCH"});
}

api.put = function (code:string,data?:AxiosRequestConfig["data"]):any{
    return api(code,{data,method:"PUT"});
}



export default api;




