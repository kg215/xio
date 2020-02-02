import React,{useReducer,Reducer,useState, useRef, useCallback, useEffect} from "react";
import {connect} from "dva";
import {
    Form,
    Button,
    Radio,
    DatePicker,
    Input,
    Upload,
    message
} from "antd";
import moment from 'moment';

import {userAvatar} from "../../utils/client";
import Croper from "../../components/Croper";
import config from "../../config";

export default connect((state:any)=>{
    return {
        user:state.common.user,
        userUpdateLoading:state.web.userUpdated.loading
    }
},(dispatch:any)=>{
    return {
        fetchUser:()=>{
            dispatch({type:"common/fetchUser"});
        },
        userSetting:(payload:FormProps)=>{
            dispatch({type:"web/userSetting",payload});
        },
        avatar:(payload:string)=>{
            dispatch({type:"web/avatar",payload});
        }
    }
})(Setting);


interface FormProps{
    sex: number,
    nickname:string,
    birthday?:string,
    desc?:string
}
const initState={
    sex: 0,
    nickname:""
}

const reducers:Reducer<FormProps,any> = function(state,action){
    return {
        ...state,
        ...action
    }
}

interface SettingProps{
    userSetting:Function,
    user:{[key:string]:any},
    userUpdateLoading:boolean,
    avatar:(src:string)=>{},
    fetchUser:Function
}

function Setting({fetchUser,userSetting,user,userUpdateLoading,avatar}:SettingProps){

    const [form,dispatched] = useReducer(reducers,initState);
    const [croper,setCroper] = useState(false);
    const [error,setError] = useState("");
    const [headPic,setHeadPic] = useState(user.avatar);
    const [uploading,setUploading] = useState(false);

    useEffect(()=>{
        dispatched({
            sex: user.sex,
            nickname:  user.nickname,
            birthday: user.birthday,
            desc: user.desc
        });
    },[user]);

    const validate = useCallback(({nickname})=>{
        if(nickname.length>16){
            setError("长度不能超过16位");
            return false;
        }
        if(!nickname){
            setError("昵称不能空，老铁！");
            return false;
        }
        setError("");
        return true;
    },[]);

    const nickChange = useCallback(e=>{
        const nickname=e.target.value;
        validate({nickname});
        dispatched({nickname})
    },[]);

    const handleSubmit = useCallback(()=>{
        validate({nickname:form.nickname})&&userSetting(form);
    },[form]);

    return user.uid?<div className="user-setting">
        <Croper loading={uploading} submit={async (formData)=>{
            setUploading(true);
            const {error=[],data=[]} = await userAvatar(formData);
            error.lenght>0?message.error("上传失败"):avatar(data.pop());
            setUploading(false);
            setCroper(false);
            fetchUser();
        }} visible={croper} onClose={()=>setCroper(false)} src={headPic}></Croper>
        <div className="options">
            <div className="active">
                基本资料
            </div>
        </div>
        <div className="content">
            <Form>
                <div className="item avatar-item">
                    <div className="avatar">
                        <img src={user.avatar || config.user.avatar} />
                    </div>
                    <div className="change-avatar">
                        <Upload accept=".jpeg,.jpg,.png" showUploadList={false} customRequest={({file})=>{
                            setHeadPic(window.URL.createObjectURL(file));
                            setCroper(true);
                        }}>
                            <Button>
                                更换头像
                            </Button>
                        </Upload>
                    </div>
                </div>
                <Form.Item>
                    <div className="item">
                        <div className="item-title">
                            账号
                        </div>
                        <div className="item-opt">
                            {user.username}
                            <Button title="暂未开放" disabled={true} type="link">
                                修改密码
                            </Button>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item help={error?<span style={{color:"red"}}>{error}</span>:""} validateStatus={error?"error":"success"}>
                    <div className="item">
                        <div className="item-title">
                            昵称
                        </div>
                        <div className="item-opt">
                            <Input onChange={nickChange} defaultValue={user.nickname} />
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className="item">
                        <div className="item-title">
                            手机号
                        </div>
                        <div className="item-opt">
                            {user.phone}
                            <Button title="暂未开放" disabled={true} type="link">
                                修改绑定
                            </Button>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className="item">
                        <div className="item-title">
                            性别
                        </div>
                        <div className="item-opt">
                            <Radio.Group onChange={e=>dispatched({sex:e.target.value})} defaultValue={user.sex} value={form.sex}>
                                <Radio value={1}>男</Radio>
                                <Radio value={0}>女</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className="item">
                        <div className="item-title">
                            生日
                        </div>
                        <div className="item-opt">
                            <DatePicker defaultValue={user.birthday&&moment(user.birthday,"YYYY-MM-DD")} placeholder={"选择日期"} onChange={(date,dateString)=>dispatched({birthday:dateString})} />
                        </div>
                    </div>
                </Form.Item>
                <div className="item">
                    <div className="item-title">
                        描述
                    </div>
                    <div className="item-opt">
                        <Input.TextArea defaultValue={user.desc} onChange={e=>dispatched({desc:e.target.value})} rows={4} cols={56} />
                    </div>
                </div>
                <div className="submit-area">
                    <Button loading={userUpdateLoading} disabled={!!error} onClick={handleSubmit} type="primary">
                        保存
                    </Button>
                </div>
            </Form>
        </div>
    </div>:null
}