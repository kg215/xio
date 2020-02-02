import {isDev} from "../config";

export function url(code:string) {
    return isDev?code:"/index.php"+code.replace(".html","");
}

export function api(code:string) {
    return "/index.php/api/web/"+code;
}

export function redirect(code:string="") {
    window.location.href = url("/#/"+code);
}
export function redirectIndex(code:string="") {
    window.location.href = url("/#/"+code);
}
export function  redirectArticle(code:string="") {
    window.location.href = url("/article.html/#/"+code);
}

export default {
    redirect,
    redirectIndex,
    redirectArticle,
    api,
    url
}