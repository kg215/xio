import React, { useEffect, useState, useCallback } from "react";
import { connect } from "dva";
import { Spin } from "antd";
import classnames from "classnames";
import {Api} from "app";

import AItem,{AItemProps} from "./Item";

interface ArticlesProps{
    articles:{[key:string]:any},
    fetchArticles:Function,
    loading:boolean,
    page:Api.Pager
}

function Articles({page,loading,articles,fetchArticles}:ArticlesProps){

    const [mouted,setMouted] = useState(false);
    const [reload,setReload] = useState(true);
    const [pageIndex,setPageIndex] = useState(1);
    const [tab,setTab] = useState("hot");
    const [search,setSearch] = useState({
        "sort":"desc",
        "field":"footstep"
    });
    
    useEffect(function(){
        setMouted(true);
    },[]);

    useEffect(()=>{
        switch (tab) {
            case "hot":
                setSearch({
                    "sort":"desc",
                    "field":"footstep"
                })
                break;
            case "new":
                setSearch({
                    "sort":"desc",
                    "field":"created_at"
                })
                break;
            default:
                break;
        }
    },[tab]);

    useEffect(()=>{
        mouted&&!loading&&fetchArticles({
            ...search,
            pageIndex
        },reload);
    },[search,pageIndex,reload]);

    const switchTab = useCallback((tab="hot")=>{
        if(!loading){
            setTab(tab);
            setPageIndex(1);
            setReload(true);
        }
    },[loading]);

    return <div className="articles">
        <div className="category">
            <span onClick={()=>switchTab("hot")} className={
                classnames("category-item",{
                    "checked":tab==="hot"
                })
            }>热门</span>
            <span onClick={()=>switchTab("new")} className={
                classnames("category-item",{
                    "checked":tab==="new"
                })
            }>最新</span>
        </div>
        {
           articles.map((item:AItemProps["article"])=>{
               return <AItem key={item.id}  article={item} />
           })
        }
        {
            (page&&page.total_page>pageIndex)||loading?<div onClick={()=>{
                if(!loading){
                    setReload(false);
                    setPageIndex(pageIndex+1);
                }
            }} className="more">
                {loading?<Spin />:"加载更多"}
            </div>:""
        }
    </div>
}
 
export default connect((state:any)=>{
    return {
        //@ts-ignore
        articles:state.web.articles.list,
        page:state.web.articles.page,
        loading:state.web.articles.loading
    }
},(dispatch:any)=>{
    return {
        fetchArticles:(payload:{
            "sort":"desc"|"asc",
            "field":"footstep"|"created_at"
        },reload:boolean)=>dispatch({type:"web/fetchArticles",payload,reload})
    }
})(Articles);