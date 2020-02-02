import {EffectsCommandMap} from "dva";
import {AnyAction} from "redux";

import { ModelStateProps } from "app";

import client from "../utils/client";


export const initState ={
    user:{
        loading:false,
        uid:0
    },
    login:{
        loading:false
    }
}

export const reducers = {
    user(state:ModelStateProps,action:AnyAction) {
        return {
            ...state,
            user:{
                ...state.user,
                ...action.payload
            }
        };
    },
    logined(state:ModelStateProps,action:AnyAction){
        return {
            ...state,
            login:action.payload
        };
    }
}

export const effects = {
    *fetchUser(action:AnyAction, { call, put }:EffectsCommandMap) {
        yield put({ type: 'user' ,payload:{loading:true}});
        const {data={}} = yield call(client.user);
        yield put({ type: 'user' ,payload:{loading:false,...data}});
    },
    *logout(action:AnyAction,{ call, put }:EffectsCommandMap){
        const {data=void 0} = yield call(client.logout);
        if(data && data.success){
            yield put({ type: 'user' ,payload:{uid:0,avatar:""}});
            yield put({ type: 'fetchUser'});
        }
    },
    *login(a:AnyAction,{ call, put }:EffectsCommandMap){
        yield put({ type: 'logined' ,payload:{loading:true}});
        const {data=void 0} = yield call(client.login,a.payload,false);
        yield put({ type: 'logined' ,payload:{loading:false}});
        if(data && data.success){
            yield put({ type: 'fetchUser' });
        }
    }
}

export default {
    namespace:'common',
    state:initState,
    reducers,
    effects
}