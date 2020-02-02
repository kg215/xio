import { message } from 'antd';

import api from "./api";
import { redirectIndex } from "./url";

/**
 * 错误消息提示
 * @param r 
 */
function report(r:any,tips:boolean|string=true) {
    let {error={}} = r;
    error = Object.values(error);
    if(error.length>0){
        let msg = error.shift();
        msg = Array.isArray(msg)?msg.shift():msg;
        message.error(msg);
        return r;
    }
    tips&&message.success(tips===true?"保存成功":tips);
    return false;
}

/**
 * 
 * @param data 
 * {
 *    username: string,
 *    password: string
 * }
 * @param index 是否跳转到首页
 */
export async function login(data:any,index=true){
    const r = await api.post("web/login",data);
    localStorage.setItem("login","0");
    !report(r,false)&&index&&redirectIndex();
    return r;
}

/**
 * 
 * @param data 
 * {
 *    username: string,
 *    password: string,
 *    phone: string
 * }
 * @param index 是否跳转到首页
 */
export async function register(data:any,index=true){
    const r = await api.post("web/register",data);
    localStorage.setItem("login","0");
    !report(r,false)&&index&&redirectIndex();
    return r;
}

/**
 * 登出
 */
export async function logout(){
    const r = await api.get("web/logout");
    r.success && localStorage.removeItem("logout");
    return r;
}

/**
 * 获取自己的信息
 */
export async function user() {
    return await api.get("web/user/info");
}

/**
 * 获取其它用户的信息
 */
export async function userinfo(id:number) {
    return await api.get("user/info/"+id);
}

export async function userSetting(data:any) {
    const r = await api.post("web/user/setting",data);
    report(r);
    return r;
}
/**
 * 上传头像
 * @param data 
 */
export async function userAvatar(data:any) {
    const r = await api.post("web/user/avatar",data);
    report(r);
    return r;
}

/**
 * 万能上传
 * @param img 
 */
export async function upload(img:FormData) {
    const r = await api.post("web/upload",img);
    report(r,false);
    return r;
}


/**
 * 文章分组
 * @param data 
 */
export async function articleGroup() {
    const r = await api.get("web/article/group");
    report(r,false);
    return r;
}

/**
 * 添加文章分组
 * @param data 
 */
export async function addArticleGroup(data:any) {
    const r = await api.post("web/article/group",data);
    report(r,false);
    return r;
}

/**
 * 更新分组标题
 * @param id 
 * @param data 
 */
export async function editArticleGroup(id:number,data:{title:string}) {
    const r = await api.put("web/article/group/"+id,data);
    report(r,false);
    return r;
}

/**
 * 删除分组标题
 * @param id 
 * @param data 
 */
export async function deleteArticleGroup(id:number) {
    const r = await api.delete("web/article/group/"+id);
    report(r,false);
    return r;
}

/**
 * 修改分组所属父级
 * @param id 
 * @param data 
 */
export async function modifyArticleGroupPid(id:number,data:{pid:number}) {
    const r = await api.put("web/article_group/pid/"+id,data);
    report(r,false);
    return r;
}


export interface AddArticleProps{
    title:"",
    group_id:0,
    content:"",
    disabled:0
}

/**
 * 添加文章
 * @param data 
 */
export async function addArtcile(data:AddArticleProps) {
    const r = await api.post("web/user/articles",data);
    report(r,data.disabled?"发布成功":"保存成功,文章发布后可见");
    return r;
}


/**
 * 获取我的文章
 */
export async function articles() {
    const r = await api.get("web/user/articles");
    report(r,false);
    return r;
}
/**
 * 获取全部文章
 */
export async function articlesList(id:string|number=void 0,data?:any) {
    const code = id?"articles/"+id:"articles";
    const r = await api.get(code,data);
    report(r,false);
    return r;
}

/**
 * 文章点赞/取消
 * @param id 
 */
export async function thumbsUpArticle(id:number) {
    const r = await api.get("articles/thumbs_up/"+id);
    report(r,false);
    return r;
}

/**
 * 文章收藏/取消
 * @param id 
 */
export async function collectArticle(id:number) {
    const r = await api.get("articles/star/"+id);
    report(r,false);
    return r;
}

/**
 * 删除文章
 * @param id 
 */
export async function deleteArticle(id:number) {
    const r = await api.delete("web/user/articles/"+id);
    report(r,false);
    return r;
}

/**
 * 修改文章
 * @param id 
 * @param data 
 */
export async function modifyArticle(id:number,data:{[key:string]:any}) {
    const r = await api.put("web/user/articles/"+id,data);
    report(r,data.disabled?"发布成功":"保存成功,文章发布后可见");
    return r;
}

/**
 * 修改文章
 * @param id 
 * @param data 
 */
export async function moveArticle(id:number,data:{group_id:number}) {
    const r = await api.put("web/user/articles/move/"+id,data);
    report(r,false);
    return r;
}


export interface ApiCommentProps{
    article_id:number|string
    pageIndex?:number,
    pageSize?:number
}
/**
 * 文章评论列表
 * @param id 
 */
export async function comment(data:ApiCommentProps) {
    const r = await api.get("comment",data);
    report(r,false);
    return r;
}

/**
 * 发送评论或回复
 * @param data 
 */
export async function sendComment(data:any) {
    const r = await api.post("comment/send",data);
    report(r,false);
    return r;
}

/**
 * 给评论点赞
 * @param id  要点赞的评论id
 * @param up  true代表点赞 false代表取消
 */
export async function thumbsUpComment(id:number,up:boolean|number) {
    const r = await api.get("comment/thumbs_up/"+id,{up:Number(up)});
    report(r,false);
    return r;
}

/**
 * 给评论点赞
 * @param id  要点赞的评论id
 */
export async function complaint(id:number) {
    const r = await api.get("comment/complaint/"+id);
    report(r,false);
    return r;
}
/**
 * 删除评论
 * @param id 
 */
export async function deleteComment(id:number) {
    const r = await api.delete("comment/"+id);
    report(r,false);
    return r;
}

export default {
    login,
    register,
    user,
    userSetting,
    userAvatar,
    logout,
    addArticleGroup,
    articleGroup,
    editArticleGroup,
    deleteArticleGroup,
    modifyArticleGroupPid,
    articles,
    articlesList,
    addArtcile,
    deleteArticle,
    modifyArticle,
    moveArticle,
    upload,
    sendComment,
    complaint,
    thumbsUpComment,
    comment,
    deleteComment
}

