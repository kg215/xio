import React, { useState,useEffect, useCallback } from "react";
import { Input, Button, Spin } from 'antd';
const { TextArea } = Input;
import client from "../utils/client";
import CommentBox from "./CommentBox";
interface CommentProps{
    commit:(data:any)=>Promise<any>,
    pid?:number,
    articleId:number
}

export default Comment;

function Comment({commit,pid=0,articleId=void 0}:CommentProps){
    const [val,setVal] = useState("");
    const [commitLoading,setCommitLoading]=useState(false);
    const [commentsLoading,setCommentsLoading]=useState(false);
    const [comments,setComments] = useState([]);
    const [pageIndex,setPageIndex] = useState(1);
    const [totalPage,setTotalPage] = useState(1);

    const getComments = useCallback(()=>{
        if(articleId){
            setCommentsLoading(true);
            client.comment({article_id:articleId,pageIndex}).then(({data={list:[]}}:any)=>{
                setComments([
                    ...comments,
                    ...data.list
                ]);
                setTotalPage(data.total_page);
            }).finally(()=>setCommentsLoading(false));
        }
    },[pageIndex]);

    const destoryComment = useCallback((id,pid=0)=>{
        let newComment = comments;
        if(pid===0){
            newComment = newComment.filter((item)=>item.id!==id);
        }else{
            newComment = newComment.map((item)=>{
                return {
                    ...item,
                    reply:item.reply.filter((one:any)=>one.id!==id)
                };
            });
        }
        
        setComments(newComment);
    },[comments]);
    const unshiftComment = useCallback((data)=>{
        let newComment = comments;
        if(data.pid===0){
            newComment.unshift(data);
        }else{
            newComment = comments.map((comment)=>{
                if(comment.id===data.pid){
                    return {
                        ...comment,
                        reply:[
                            data,
                            ...comment.reply
                        ]
                    }
                }
                return comment
            });
        }
        setComments(newComment);
    },[comments]);

    useEffect(()=>{
        articleId&&getComments();
    },[pageIndex]);

    const iCommit = useCallback(()=>{
        setCommitLoading(true);
        commit({
            comment:val,
            pid
        }).then(({data,error=[]})=>{
            if(error.length===0){
                setVal("");
                unshiftComment(data);
            }
        }).finally(()=>setCommitLoading(false));
    },[val,pid]);

    return <div className="comment">
        <TextArea value={val} onChange={(e)=>setVal(e.target.value)} placeholder="各位看官，说点啥吧~" rows={4} />
        <div className="send-comment">
            <Button loading={commitLoading} onClick={iCommit} type="primary">
                发送 ~
            </Button>
        </div>
        <div className="content">
            <div className="title">
                全部评论
            </div>
            {
                comments.map((item)=>{
                    return <CommentBox destoryComment={destoryComment} floor={item.user.uid} unshiftComment={unshiftComment} key={item.id} comment={item} />
                })
            }
            {commentsLoading||totalPage>pageIndex?<div onClick={()=>setPageIndex(pageIndex+1)} className="more-comment">
                {commentsLoading?<Spin />:"查看更多"} 
            </div>:""}
        </div>
    </div>

}

