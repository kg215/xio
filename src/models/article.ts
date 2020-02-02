import {EffectsCommandMap} from "dva";
import {AnyAction} from "redux";

import client from "../utils/client";

const initState:any={
    error:{},
    addArticleGroup:{
        loading:false
    },
    articleGroup:{
        loading:false,
        list:{}
    },
    updateArticleGroup:{
        loading:false
    },
    destroyArticleGroup:{
        loading:false
    },
    changeModifyArticleGroupPid:{
        loading:false
    },
    articles:{
        loading:false,
        list:{}
    },
    storeArticle:{
        loading:false
    },
    destroyArticle:{
        loading:false
    },
    updateArticle:{
        loading:false
    },
    movedArticle:{
        loading:false
    }
}

export default {
    namespace:"article",
    state:initState,
    reducers:{
        addArticleGroup(state:any,action:AnyAction){
            return {
                ...state,
                addArticleGroup:{
                    ...state.addArticleGroup,
                    ...action.payload
                }
            }
        },
        articles(state:any,action:AnyAction){
            return {
                ...state,
                articles:{
                    ...state.articles,
                    ...action.payload
                }
            };
        },
        articleGroup(state:any,action:AnyAction){
            return {
                ...state,
                articleGroup:{
                    ...state.articleGroup,
                    ...action.payload
                }
            };
        },
        updateArticleGroup(state:any,action:AnyAction){
            return {
                ...state,
                updateArticleGroup:{
                    ...state.updateArticleGroup,
                    ...action.payload
                }
            };
        },
        destroyArticleGroup(state:any,action:AnyAction){
            return {
                ...state,
                destroyArticleGroup:{
                    ...state.destroyArticleGroup,
                    ...action.payload
                }
            };
        },
        destroyArticle(state:any,action:AnyAction){
            return {
                ...state,
                destroyArticle:{
                    ...state.destroyArticle,
                    ...action.payload
                }
            };
        },
        changeModifyArticleGroupPid(state:any,action:AnyAction){
            return {
                ...state,
                changeModifyArticleGroupPid:{
                    ...state.changeModifyArticleGroupPid,
                    ...action.payload
                }
            };
        },
        storeArticle(state:any,action:AnyAction){
            return {
                ...state,
                storeArticle:{
                    ...state.storeArticle,
                    ...action.payload
                }
            };
        },
        updateArticle(state:any,action:AnyAction){
            return {
                ...state,
                updateArticle:{
                    ...state.updateArticle,
                    ...action.payload
                }
            };
        },
        movedArticle(state:any,action:AnyAction){
            return {
                ...state,
                movedArticle:{
                    ...state.movedArticle,
                    ...action.payload
                }
            };
        }
    },
    effects:{
        *fetchArticleGroup(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'articleGroup' ,payload:{loading:true}});
            const {data={}} = yield call(client.articleGroup);
            yield put({ type: 'articleGroup' ,payload:{loading:false,list:data}});
        },
        *setArticleGroup(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'addArticleGroup' ,payload:{loading:true}});
            const {error=[]} = yield call(client.addArticleGroup, a.payload);
            yield put({ type: 'addArticleGroup' ,payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticleGroup'});
            }
        },
        *editArticleGroup(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'updateArticleGroup' ,payload:{loading:true}});
            let {id,...data} = a.payload;
            const {error=[]} = yield call(client.editArticleGroup, id, data);
            yield put({ type: 'updateArticleGroup' ,payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticleGroup'});
            }
        },
        *deleteArticleGroup(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'destroyArticleGroup' ,payload:{loading:true}});
            const {error=[]} = yield call(client.deleteArticleGroup, a.id);
            yield put({ type: 'destroyArticleGroup' ,payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticleGroup'});
            }
        },
        *deleteArticle(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'destroyArticle' ,payload:{loading:true}});
            const {error=[]} = yield call(client.deleteArticle, a.id);
            yield put({ type: 'destroyArticle' ,payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticles'});
            }
        },
        *modifyArticleGroupPid(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'changeModifyArticleGroupPid', payload:{loading:true}});
            let {id,pid} = a.payload;
            const {error=[]} = yield call(client.modifyArticleGroupPid, id, {pid});
            yield put({ type: 'changeModifyArticleGroupPid', payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticleGroup'});
            }
        },
        *modifyArticle(a:AnyAction,{ select, call, put }:EffectsCommandMap){
            yield put({ type: 'updateArticle', payload:{loading:true}});
            let {id,...data} = a.payload;
            const {error=[]} = yield call(client.modifyArticle, id, data);
            yield put({ type: 'updateArticle', payload:{loading:false}});
            if(Object.keys(error).length===0){
                let {list} = yield select((state:any)=>state.article.articles);
                yield put({ type: 'articles',payload:getNewArticles(list,{id,...data})});
            }
        },
        *fetchArticles(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'articles' ,payload:{loading:true}});
            const {data={}} = yield call(client.articles);
            yield put({ type: 'articles' ,payload:{loading:false,list:data}});
        },
        *addArticle(a:AnyAction,{ call, put }:EffectsCommandMap){
            yield put({ type: 'storeArticle', payload:{loading:true}});
            const {error=[]} = yield call(client.addArtcile, a.payload);
            yield put({ type: 'storeArticle', payload:{loading:false}});
            if(Object.keys(error).length===0){
                yield put({ type: 'fetchArticles'});
            }
        },
        *moveArticle(a:AnyAction,{ select, call, put }:EffectsCommandMap){
            yield put({ type: 'movedArticle', payload:{loading:true}});
            let {id,...data} = a.payload;
            const {error=[]} = yield call(client.moveArticle, id, data);
            yield put({ type: 'movedArticle', payload:{loading:false}});
            if(Object.keys(error).length===0){
                let {list} = yield select((state:any)=>state.article.articles);
                yield put({ type: 'articles',payload:getNewArticles(list,{id,...data})});
            }
        }
    }
}

function getNewArticles(list:any,{id,...articleNewData}:any){
    //@ts-ignore
    let oldData = Object.values(list).flat(1).find(item=>item.id==id);

    list[oldData["group_id"]].find((element: any,key: any) => {
        if(oldData["id"]==element.id){
            list[oldData["group_id"]].splice(key,1);
            return true;
        }
    });
    if(!list[articleNewData["group_id"]]){
        list[articleNewData["group_id"]]=[];
    }
    let {content,...data} = articleNewData;
    list[articleNewData["group_id"]].push({...oldData,...data,content:{...oldData.content,content}});
    //排个序
    list[articleNewData["group_id"]].sort(function(a:any,b:any){
       return a.id - b.id
    });
}






