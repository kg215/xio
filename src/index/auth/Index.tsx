import React,{useCallback,useReducer,Reducer, useState, useEffect} from "react";
import { Form, Icon, Input, Button} from 'antd';
import { RouteProps } from "react-router";
import { Link } from "react-router-dom";
import classname from "classnames";
import { connect } from "dva";

import parser from "../../utils/parser";
import { redirectIndex } from "../../utils/url";

export default connect((state:any)=>{

    return {
        user:state.common.user,
        loginLoading:state.common.login.loading,
        registerLoading:state.web.register.loading,
    }
},(dispatch:any)=>{
    return {
        login(data:FormProps){
            dispatch({type:"common/login",payload:data});
        },
        register(data:FormProps){
            dispatch({type:"web/register",payload:data});
        }
    }
})(Authoriztion);

interface AuthoriztionProps{
    login:Function,
    register:Function,
    loginLoading:boolean,
    registerLoading:boolean,
    user:{[key:string]:any}
}
interface FormProps{
    username:string,
    password:string
}

const initState = {
    username:"",
    password:""
};
const reducer:Reducer<FormProps,any> = function (state, action){
    switch (action.type) {
        case 'u':
            return {...state,username: action.val};
        case 'p':
            return {...state,password: action.val};
        case 'ph':
            return {...state,phone: action.val};
        default:
            return state;
    }
}

function Authoriztion({location,login,register,loginLoading,registerLoading,user}:RouteProps&AuthoriztionProps){
    const urlParams = parser.search(location.search),tab=urlParams.tab||"login";
    const [data, dispatch] = useReducer(reducer, initState);
    const loginSubmit = useCallback(async ()=>{
        login(data);
    },[data]);
    const registerSubmit = useCallback(async ()=>{
        register(data);
    },[data]);

    useEffect(()=>{
        user.uid&&redirectIndex();
    },[user]);

    return <div className="authoriztion">
        <div className="authoriztion-box">
            <div className="tab">
                <Link to="/auth?tab=login">
                    <div className={classname({"active":tab==="login"})}>登陆</div>
                </Link>
                <div> o </div>
                <Link to="/auth?tab=register">
                <div className={classname({"active":tab==="register"})}>注册</div>
                </Link>
                
            </div>
            <div className="data">   
                <Form className="login-form">
                    <Form.Item>
                        <Input
                            onChange={(e)=>dispatch({type:"u",val:e.target.value})}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder={tab==="register"?"用户名":"用户名/手机号"}
                        />
                    </Form.Item>
                    {
                        tab==="register"&&<Form.Item>
                            <Input
                                onChange={(e)=>dispatch({type:"ph",val:e.target.value})}
                                prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="手机号"
                            />
                        </Form.Item>
                    }
                    <Form.Item>
                        <Input.Password
                            onChange={(e)=>dispatch({type:"p",val:e.target.value})}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        {/* <a className="login-form-forgot" href="">
                            忘记密码
                        </a> */}
                        <Button loading={loginLoading||registerLoading} onClick={tab==="register"?registerSubmit:loginSubmit} type="primary" htmlType="submit">
                            {tab==="register"?"注册":"登陆"}
                        </Button>
                        {/* <a href="">注册</a> */}
                    </Form.Item>
                </Form>
            </div>
            <div className="contract">
                注册登陆即代表同意
                <Button type="link">用户协议</Button>和<Button type="link">隐私政策</Button>
            </div>
        </div>
    </div>
}
