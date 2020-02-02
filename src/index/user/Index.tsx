import React, { useEffect, useState, useCallback } from "react";
import {Spin} from "antd";
import ArticleItem from "./ArticleItem";
import {RouteComponentProps} from "react-router-dom";
import {Api} from "app";

import config from "../../config";
import parser from "../../utils/parser";
import {userinfo,articlesList} from "../../utils/client";


export default User;

function User({location,user}:RouteComponentProps&{user:Api.User}){

    let params = parser.search(location.search),
    uid = params["uid"];

    const [userInfo,setUserInfo] = useState<Api.User>({uid:0});
    const [pageIndex,setPageIndex] = useState<number>(1);
    const [articles,setArticles] = useState([]);
    const [articleLoading,setArticleLoading] = useState(true);
    const [totalPage,setTotalPage] = useState(0);

    const getArticles = useCallback(()=>{
        setArticleLoading(true);
        uid&&articlesList(void 0,{
            uid,
            pageIndex:pageIndex+1,
            pageSize:3
        }).then(({page={},data=[]}:{page:Api.Pager,data:Api.Article[]})=>{
            setArticles([
                ...articles,
                ...data
            ]);
            setPageIndex(pageIndex+1);
            setTotalPage(page.total_page);
        }).finally(()=>setArticleLoading(false));
    },[uid,pageIndex,articles]);

    useEffect(()=>{
        getArticles();
    },[]);

    useEffect(()=>{
        uid&&userinfo(uid).then(({error=[],data})=>{
            if(error.length===0){
                setUserInfo(data);
            }
        });
    },[]);

    return userInfo.uid?<div className="user">
        <div className="info">
            <div className="avatar">
                <img src={userInfo.avatar || config.user.avatar} />
            </div>
            <div className="medal">
                <div className="medal-item">
                    <div>文章</div><div className="count">{Number(userInfo.articles_count)}</div>
                </div>
                <div className="medal-item">
                    <div>粉丝</div><div className="count">0</div>
                </div>
                <div className="medal-item">
                    <div>点赞</div><div className="count">{Number(userInfo.thumbs_up.article)}</div>
                </div>
            </div>
            <div className="userinfo">
                <div className="userinfo-item">
                    昵称：{userInfo.nickname}
                </div>
                <div className="userinfo-item">
                    性别：{userInfo.sex===0?"女":"男"}
                </div>
            </div>
        </div>
        <div className="content">
            {
                articles.length>0?articles.map((item:any)=>{
                    return <ArticleItem key={item.id} article={item} />
                }):<div className="nothing">
                    这个楞逼啥都没写 ~
                </div>
            }

            {(totalPage>pageIndex || articleLoading)?<div onClick={getArticles} className="more">
                {articleLoading?<Spin />:"加载更多"}
            </div>:""}
        </div>
    </div>:<div className="user-loading">
        <Spin />
    </div>
}