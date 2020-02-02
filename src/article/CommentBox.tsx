
import React, { useState, useCallback } from "react";
import { Input, Button, message } from 'antd';
import classNames from "classnames";
const { TextArea } = Input;
import {connect} from "dva";
import client from "../utils/client";
import config from "../config";
import {Api} from "app";

interface CommentBoxProps{
    unshiftComment:Function,
    destoryComment?:Function,
    comment:Api.Comment,
    self?:Api.User,
    floor?:number
}
let CommentBox = connect((state:any)=>{
    return {
        self: state.common.user
    }
})(function ({
    unshiftComment,
    destoryComment,
    floor=0,
    comment:{
        id,
        pid,
        created_at,
        thumbs_up,
        comment="",
        reply=[],
        article_id,
        user={},
        reply_to,
        reply_user={}
    },
    self={}
}:CommentBoxProps){

    const [val,setVal] = useState("");
    const [up,setUp] = useState(false);
    const [showTextArea,setShowTextArea] = useState(false);
    const [commitLoading,setCommitLoading] = useState(false);
    const [complaintLoading,setComplaintLoading] = useState(false);
    const [thumbsUpLoading,setThumbsUpLoading] = useState(false);
    const [destroyLoading,setDestroyLoading] = useState(false);

    const cacel = useCallback(()=>{
        setShowTextArea(false);
    },[]);

    const commit = useCallback((reply_to)=>{
        setCommitLoading(true);
        client.sendComment({
            article_id,
            reply_to,
            pid:pid===0?id:pid,
            comment:val
        }).then(({data,error=[]})=>{
            if(error.length===0){
                setVal("");
                console.log(data);
                unshiftComment(data);
            }
        }).finally(()=>setCommitLoading(false));

    },[pid,article_id,val]);

    const thumpsUp = useCallback(()=>{
        if(!thumbsUpLoading){
            setThumbsUpLoading(true);
            setUp(!up);
            client.thumbsUpComment(id,!up).then(({error=[]})=>error.length!==0 && setUp(!up)).finally(()=>setThumbsUpLoading(false));
        }
    },[up,id,thumbsUpLoading])

    const complaint = useCallback(()=>{
        if(!complaintLoading){
            setComplaintLoading(true);
            client.complaint(id).then(({error=[]})=>error.length===0 && message.success("举报成功亲~")).finally(()=>setComplaintLoading(false));
        }
    },[id,complaintLoading])

    const destroy = useCallback(async (id,pid)=>{
        setDestroyLoading(true);
        await client.deleteComment(id).then(({error=[]})=>{
            if(error.length===0){
                destoryComment(id,pid);
            }else{
                setDestroyLoading(false);
            }
        });
    },[destoryComment]);

    return <div key={id} className="comment-box">
        <div className="avatar">
            <img src={user.avatar||config["user"]["avatar"]} alt="头像"/>
        </div>
        <div className="comment-content-box">
            {/* 楼主回复 */}
            <div className="comment-content">
                <div className="info">
                    <div className="time">
                        <div>{user.nickname}</div>
                        <div className="dot">·</div>
                        <div className="created_at">{created_at}</div>
                        {self.uid&&self.uid!==user.uid&&<div onClick={()=>setShowTextArea(!showTextArea)} className="reply">
                            <svg  viewBox="0 0 1024 1024"  width="18" height="18"><path d="M834.37778 716.13833l-85.74999 0c-11.879562 0-21.505803-9.657964-21.505803-21.441335 0-11.879562 9.625218-21.537526 21.505803-21.537526l85.74999 0c23.663956 0 42.97886-19.266809 42.97886-42.97886l0-429.788603c0-23.712051-19.314904-42.97886-42.97886-42.97886l-644.682905 0c-23.712051 0-42.97886 19.266809-42.97886 42.97886l0 429.788603c0 23.712051 19.266809 42.97886 42.97886 42.97886l365.224122 0c5.692652 0 11.17655 2.318812 15.173584 6.299473l193.46934 193.404871c8.394181 8.425903 8.394181 22.032806 0 30.379914-4.14132 4.204765-9.673313 6.347568-15.141862 6.347568-5.516644 0-11.048637-2.142803-15.189957-6.347568L546.029536 716.13833 189.694875 716.13833c-47.455825 0-86.005816-38.533618-86.005816-85.957721l0-429.788603c0-47.376007 38.549991-85.957721 86.005816-85.957721l644.682905 0c47.424102 0 85.957721 38.581714 85.957721 85.957721l0 429.788603C920.335501 677.604712 881.801882 716.13833 834.37778 716.13833L834.37778 716.13833zM318.631456 458.265168c-23.760147 0-42.97886-19.218714-42.97886-42.97886s19.218714-42.97886 42.97886-42.97886c23.712051 0 42.97886 19.218714 42.97886 42.97886S342.343507 458.265168 318.631456 458.265168L318.631456 458.265168zM512.004605 458.265168c-23.743774 0-42.97886-19.218714-42.97886-42.97886s19.235087-42.97886 42.97886-42.97886c23.760147 0 42.97886 19.218714 42.97886 42.97886S535.763728 458.265168 512.004605 458.265168L512.004605 458.265168zM705.441199 458.265168c-23.760147 0-42.97886-19.218714-42.97886-42.97886s19.218714-42.97886 42.97886-42.97886c23.712051 0 42.97886 19.218714 42.97886 42.97886S729.15325 458.265168 705.441199 458.265168L705.441199 458.265168z" fill="#0e0f15"></path></svg>
                        </div> || ""}
                    </div>
                    <div className="comment-opts">
                        <span onClick={complaint} className="complaint">
                            <svg viewBox="0 0 1024 1024" width="20" height="20"><path fill="#1296db" d="M912 848h-144V528c0-140.8-115.2-256-256-256s-256 115.2-256 256v320H112c-17.6 0-32 14.4-32 32s14.4 32 32 32h800c17.6 0 32-14.4 32-32s-14.4-32-32-32z m-592 0V528c0-105.6 86.4-192 192-192s192 86.4 192 192v320H320z" p-id="8811"></path><path d="M416 528c-17.6 0-32 14.4-32 32v192c0 17.6 14.4 32 32 32s32-14.4 32-32V560c0-17.6-14.4-32-32-32zM512 208c17.6 0 32-14.4 32-32V112c0-17.6-14.4-32-32-32s-32 14.4-32 32v64c0 17.6 14.4 32 32 32zM755.2 273.6l44.8-44.8c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-44.8 44.8c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 33.6 12.8 44.8 0zM275.2 273.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8l-44.8-44.8c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l44.8 44.8zM112 480h64c17.6 0 32-14.4 32-32s-14.4-32-32-32H112c-17.6 0-32 14.4-32 32s14.4 32 32 32zM848 480h64c17.6 0 32-14.4 32-32s-14.4-32-32-32h-64c-17.6 0-32 14.4-32 32s14.4 32 32 32z"></path></svg>
                            &nbsp;举报
                        </span>
                        <span onClick={thumpsUp} className="comment-thumbs-up">
                            <svg viewBox="0 0 1024 1024"  width="20" height="20"><path fill={up?"#1296DB":"#B3B3B3"} d="M812.2 370.3l-124.5-0.6c5.6-18.1 13.2-45.7 17.2-73.7 4.6-32.1 5.7-58.9 3-77.6-4.4-31-17.5-57.9-37.8-78-22.1-21.9-50.7-33.4-82.6-33.4h-1.6c-2 0.1-19.7 1.2-39 8.4-30.2 11.3-49.6 32.4-54.7 59.3l-0.6 3.1 0.1 3.2c0.9 34.2-8.9 95.1-15.7 117.9-1.6 5.5-13.6 24.1-33.9 42.4-20 18-40.5 28.8-55 28.8h-15.8c-6.4-14.2-20.8-24.2-37.4-24.2H147.4c-22.6 0-41 18.4-41 41v478.2c0 22.6 18.4 41 41 41H334c13.8 0 26-6.8 33.4-17.3h359.4c64.8 0 116-49.2 130.4-125.3 10.2-53.9 59.3-279.3 59.8-281.6l0.7-3.2v-3.2c-0.1-57.9-47.3-105.2-105.5-105.2z m-647.3 34.3h151.4c-0.5 2.5-0.7 5-0.7 7.6v435.5H164.9V404.6z m633.3 348c-7 37-29.5 76.5-71.5 76.5H375.6V430.2h11.5c38.1 0 72.8-24.1 95.2-44.3 25.3-22.8 45.4-50.2 51.2-69.7 7.9-26.4 18.5-89.8 18.2-132.3 4.7-11.8 29.2-16.2 36.8-16.9 38 0.5 55.9 31.2 60.1 59.8 0.9 6 2.3 24-3 60.5-5.9 40.6-21 82.3-21.1 82.7-4.9 13.5-3 28.5 5.1 40.3 8.1 11.8 21.5 19 35.9 19.1l146.6 0.7h0.2c24.1 0 44 18.9 45.4 42.6C851 503 808 700.9 798.2 752.6z"></path></svg>
                            &nbsp;{thumbs_up+Number(up)}
                        </span>
                    </div>
                </div>
                <div className="conent"> 
                    {reply_to!==0&&reply_to!=floor&&<span className="reply-nickname">
                        @{reply_user.nickname}
                    </span>}
                    {comment}

                    {
                        user.uid===self.uid&&<span onClick={()=>!destroyLoading&&destroy(id,pid)} className={
                            classNames("delete",{
                                "delete-ing":destroyLoading
                            })
                        }>
                            删除
                        </span>
                    }
                    
                </div>
                {showTextArea&&<div className="reply-box">
                    <TextArea value={val} onChange={(e)=>setVal(e.target.value)} placeholder={"@"+user.nickname} rows={4} />
                    <div className="reply-btn">
                        <Button onClick={cacel} size="small" type="ghost">
                            取消
                        </Button>
                        <Button size="small" loading={commitLoading} onClick={()=>commit(user.uid)} type="primary">
                            发送
                        </Button>
                    </div>
                </div>}
            </div>
            {/* 楼主楼内的讨论 */}
            {
                reply.length>0&&<div className="comment-reply">
                    {
                        reply.map((item)=>{
                            return <CommentBox floor={floor?floor:user.uid} destoryComment={destoryComment}  unshiftComment={unshiftComment} key={item.id} comment={item} />
                        })
                    }
                </div>
            }
        </div>
    </div>
});

export default CommentBox;

