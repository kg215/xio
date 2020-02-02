import React,{useState,useCallback, useEffect, Dispatch, MouseEventHandler, useRef, lazy } from "react";
import {connect} from "dva";
import {Icon} from "antd";
import classname from "classnames";
import {UserProps} from "app";

const Nav = lazy(()=>import(/*webpackChunkName:"Nav"*/"../components/Nav"));
const Auth = lazy(()=>import(/*webpackChunkName:"Auth"*/"../index/auth/Auth"));
import config from "../config";
import {redirectArticle} from "../utils/url";

interface HeaderProps {
    user:UserProps,
    logout:MouseEventHandler<HTMLDivElement>
}
function Header({user,logout}:HeaderProps){
    /**
     * 头像区域的ref对象
     */
    const userRef = useRef<HTMLDivElement>();
    /**
     * 头像下拉框 Boolean 值
     */
    const [userAvatarDown, setUserAvatarDown] = useState<boolean>(false);
    /**
     * 打开登陆框
     */
    const [loginModal,setLoginModal] = useState<boolean>(false);
    const login = useCallback(()=>{
        setLoginModal(true);
    },[]);
    /**
     * 监听头像以外的区域
     * 点击关闭头像下拉选项
     */
    useEffect(function(){
        window.addEventListener("click",function(e){
            const t = e.target as HTMLElement;
            if(userRef.current&&!userRef.current.contains(t)){
                setUserAvatarDown(false);
            }
        });
    },[]);

    let handleClickAvatarItem = useCallback((func:Function)=>{
        func();
        setUserAvatarDown(false);
    },[]);    

    return <div className="header">
        <div className="standard-size">
            <div className="logo">
                <a href="/#/web/recommend">
                    <img src='../asset/img/logo_small.png' alt="xio"/>
                </a>
            </div>
            <div className="nav">
                <Nav href="/web/recommend">推荐</Nav>
                {/* <Nav href="/web/recommend">文档</Nav>
                <Nav href="/web/recommend">团队</Nav>
                <Nav href="/web/recommend">讨论区</Nav>
                <Nav href="/web/recommend">许愿树</Nav> */}
            </div>
            <div className="search">
                <input id="search" type="text"/>
                <label htmlFor="search" className="sarch-btn" />
            </div>
            <div className="visitor">
                <Auth visible={loginModal} onClose={()=>setLoginModal(false)} />
                {
                    user.uid?<div className="user-box">
                        {/*登陆用户*/}
                        <div onClick={()=>redirectArticle("write")} className="write-article">
                            写文章
                        </div>
                        <div ref={userRef}>
                            <span className="user-avatar" onClick={()=>setUserAvatarDown(!userAvatarDown)}>
                                <img src={user.avatar || config.user.avatar} alt="头像"/>
                                <Icon className={classname({
                                    "user-avatar__down":!userAvatarDown,
                                    "user-avatar__up":userAvatarDown
                                })} type="caret-down" />
                            </span>
                            {userAvatarDown&&<div className="user-items">
                                <div onClick={()=>setUserAvatarDown(false)}>
                                    <a href={"/#/web/user?uid="+user.uid}>
                                        我的主页
                                    </a>
                                </div>
                                <div>
                                    我的收藏
                                </div>
                                <div onClick={()=>setUserAvatarDown(false)}>
                                    <a href={"/#/web/user/setting"}>
                                        设置
                                    </a>
                                </div>
                                <div onClick={()=>handleClickAvatarItem(logout)}>退出</div>
                            </div>}
                        </div>
                    </div>:<div className="anonymous-box">
                        {/*匿名用户*/}
                        <div onClick={login} className="login">
                            登陆
                        </div>
                        <a href="/#/auth?tab=register">
                            <div className="register">
                                注册
                            </div>
                        </a>
                    </div>
                }
            </div>
        </div>
    </div>
}

export default connect((state:any)=>{
    return {
        user:state.common.user
    }
},(dispatch: Dispatch<any>)=>{
    return {
        logout:()=>dispatch({type:"common/logout"})
    }
})(Header);