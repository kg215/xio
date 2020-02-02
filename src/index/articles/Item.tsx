import React from "react";
import moment from "moment";
import { ArticleProps } from "app";

import {url} from "../../utils/url";

export default AItem;

export interface AItemProps{
    article:ArticleProps
}

function AItem({article}:AItemProps){
    let footstep = Number(article.footstep);
    return <div className="article-item">
        <div className="content">
            <div className="info">
                <div className={
                    footstep>100?"hot":"recommend"
                }>{
                    footstep>100?"热点":"推荐"
                }</div>
                {article.group&&<div className="module">{article.group.title}</div>}
                <div className="author">{article.nickname}</div>
                <div className="time">
                    {moment(article.created_at).format("YYYY-MM-DD H:mm")}
                </div>
            </div>
            <div className="title">
                <a href={url("/article.html?id="+article.id)}>{article.title}</a>
            </div>
           
            <div className="intro" dangerouslySetInnerHTML={{__html:article.intro}} />
            <div className="options">
                <span className="tag footstep">{footstep}</span>
                <span className="tag like">{Number(article.thumbs_up)}</span>
                <span className="tag star">{Number(article.star)}</span>
                <span className="tag comment">{Number(article.comment_count)}</span>
            </div>
        </div>
        {
            article.intro_img?<div className="summary-pic">
                <img src={article.intro_img} alt={article.title}/>
            </div>:""
        }
        
    </div>
}
