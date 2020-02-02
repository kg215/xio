import {EffectsCommandMap} from "dva";
import {AnyAction} from "redux";
import { Dispatch } from "react";
import { ModelStateProps } from "app";

import client from "../utils/client";




const initState:ModelStateProps={
    error:{},
    userUpdated:{
        loading:false
    },
    register:{
        loading:false
    },
    articles:{
        loading:false,
        list:[]
    }
}

const web = {
    namespace:'web',
    state:initState,
    reducers: {
        avatar(state:ModelStateProps,action:AnyAction){
            return {
                ...state,
                user:{
                    ...state.user,
                    avatar:action.payload
                }
            };
        },
        userUpdated(state:ModelStateProps,action:AnyAction){
            return {
                ...state,
                userUpdated:{
                    loading:action.payload
                }
            }
        },
        registered(state:ModelStateProps,action:AnyAction){
            return {
                ...state,
                register:action.payload
            };
        },
        articles(state:ModelStateProps,action:AnyAction){
            const list = action.reload?[]:[
                ...state.articles.list,
                ...action.payload.list || []
            ];
            return {
                ...state,
                articles:{
                    ...state.articles,
                    loading:action.payload.loading,
                    list,
                    page:action.payload.page
                }
            };
        }
    },
    effects: {
        *register(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'registered' ,payload:{loading:true}});
            const {data=void 0} = yield call(client.register,a.payload,false);
            yield put({ type: 'registered' ,payload:{loading:false}});
            if(data && data.success){
                yield put({ type: 'common/fetchUser' });
            }
        },
        *userSetting(action:AnyAction, { call, put }:EffectsCommandMap){
            yield put({ type: 'userUpdated' ,payload:true});
            const {data={}} = yield call(client.userSetting,action.payload);
            yield put({ type: 'userUpdated' ,payload:false});
            yield put({ type: 'common/user' ,payload:data});
        },
        *fetchArticles(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'articles' ,payload:{loading:true},reload:a.reload});
            const {page={},data=[]} = yield call(client.articlesList,void 0,a.payload);
            yield put({ type: 'articles' ,payload:{loading:false,list:data,page}});
        }
    },
    onError(e:Error, dispatch:Dispatch<any>){
        
    }
};


export default {
    web
}