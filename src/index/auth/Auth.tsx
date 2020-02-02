import React, { Dispatch , useReducer , Reducer, useState, useCallback, useEffect } from "react";
import {Link} from "react-router-dom";
import {connect} from "dva";

import Form from "../../components/Form";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

interface AuthProps{
    visible:boolean,
    onClose:()=>void,
    login:Function,
    uid:number,
    loginLoading:boolean
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
        default:
            return state;
    }
}
export default connect((state:any)=>{
    return {
        uid:state.common.user.uid,
        loginLoading:state.common.login.loading,
    }
},(dispatch: Dispatch<any>)=>{
    return {
        login(data:FormProps){
            dispatch({type:"common/login",payload:data});
        }
    }
})(Auth);

function Auth({loginLoading,uid,login,visible=false,onClose=()=>{}}:AuthProps){

    const [form,dispatched] = useReducer(reducer,initState);
    const [ivisible,setVisible] = useState(visible);
    const [loginAct,setloginAct] = useState(false);

    useEffect(()=>{
        setVisible(visible);
    },[visible]);

    useEffect(()=>{
        if(loginAct&&uid){
            setloginAct(false);
            setVisible(false);
            onClose();
        }
    },[uid]);

    const ilogin = useCallback((form:FormProps)=>{
        login(form);
        setloginAct(true);
    },[]);

    return <Modal visible={ivisible} onClose={onClose}>
        <Modal.Header>
            用户登陆
        </Modal.Header>
        <Modal.Body size="small">
            <Form>
                <Form.Item>
                    <Form.Input placeholder="用户名/手机号" onChange={(val)=>dispatched({type:"u",val})}>
                        <img src="../../asset/img/username.png" alt="用户名/手机号"/>
                    </Form.Input>
                </Form.Item>
                <Form.Item>
                    <Form.Input placeholder="密码" onChange={(val)=>dispatched({type:"p",val})} type="password">
                        <img src="../../asset/img/password.png" alt="密码"/>
                    </Form.Input>
                </Form.Item>
                <Form.Item>
                    <Button loading={loginLoading} onClick={()=>ilogin(form)} type="rect__black">
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <AuthFooter />
        </Modal.Footer>
    </Modal>
}

export {AuthFooter};
function AuthFooter(){

    return <div className="auth-footer">
        <div style={{"justifyContent":"space-between"}}>
            <div>
                没有账号？
                <Link to="/auth?tab=register">
                    <Button type="link">注册</Button>
                </Link>
            </div>
            <div>
                <Button type="link">忘记密码</Button>
            </div>
        </div>
        {/* <div className="third-login">
            <div className="title">
                第三方登陆
            </div>
            <div className="auth-third">
                <a className="auth-obj" href="#">
                    <img src="../../asset/img/wechat.svg" alt="微信登陆"/>
                </a>
                <a className="auth-obj" href="#">
                    <img src="../../asset/img/github.svg" alt="github登陆"/>
                </a>
            </div>
        </div> */}
        {/* <div>
            注册登陆即代表同意
            <Button type="link">用户协议</Button>和<Button type="link">隐私政策</Button>
        </div> */}
    </div>
}