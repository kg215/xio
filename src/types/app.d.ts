export as namespace App;

export interface UserProps{
    uid:number,
    username?:string,
    nickname?:string,
    avatar?:string,
    email?:string,
    [key: string]: any
}

export interface ModelStateProps{
    error?:object,
    user?:UserProps,
    [key: string]: any
}

export interface ArticleProps{
    id:number,
    title:string,
    intro:string,
    intro_img:string,
    nickname:string,
    footstep:number|string,
    thumbs_up:number|string,
    star:number|string,
    comment_count:number,
    created_at:string,
    group:{
        title:string
    }
}

export namespace Api{
    export interface Pager{
        page_index?:number,
        page_size?:number,
        total?:number,
        total_page?:number
    }
    export interface User{
        uid?:number,
        username?:string,
        nickname?:string,
        avatar?:string,
        email?:string,
        articles_count?:number,
        sex?:number,
        thumbs_up?:{
            article?:number,
            comment?:number
        }
    }
    export interface Comment{
        id?:number,
        created_at?:string,
        thumbs_up?:number,
        comment?:string,
        article_id?:number,
        pid?:number,
        uid?:number,
        reply_to?:number,
        user?:User,
        reply_user?:User,
        reply?:Comment[]
    }
    export interface ArticleGroup{
        id?:number,
        title?:string,
        pid?:number,
        sort?:number,
        path?:string,
        uid?:number
    }
    export interface Article{
        id?:number,
        title?:string,
        intro?:string,
        group_id?:number,
        module_id?:number,
        uid?:number,
        nickname?:string,
        disabled?:number
        star?:number,
        thumbs_up?:number,
        footstep?:number,
        comment_count?:number,
        user?:UserProps,
        group?:ArticleGroup
    }
}