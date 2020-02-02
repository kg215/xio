import React from "react";
import {Api} from "app";

import {redirectArticle} from "../../utils/url";

interface ArticleItemProps{
    article:Api.Article
}

export default function({article}:ArticleItemProps){

    return <div onClick={()=>redirectArticle("?id="+article.id)} className="article-item">
        <div className="title">
            {article.title}
        </div>
        <div className="intro" dangerouslySetInnerHTML={{__html:article.intro}} />

        <div className="statistics">
            <span>浏览：{article.footstep}</span>
            <span>点赞：{article.thumbs_up}</span>
        </div>
    </div>
}