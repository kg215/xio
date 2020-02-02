import React, { useRef, useEffect, useState, useCallback, useReducer, Reducer } from "react";
import {Tree, Icon, Menu, Dropdown , Modal , message, Input, Popconfirm, TreeSelect } from "antd";

import Editor from "wangeditor";
import key from "keymaster";
import className from "classnames";
import {connect} from "dva";

import Header from "../components/Header";
import {upload} from "../utils/client";


const {TreeNode} = Tree;

interface ContextMenuProps{
    id:number,
    title:string,
    type?:"group"|"article",
    addArticle?:Function,
    addGroup?:Function,
    editArticleGroup?:Function,
    deleteArticleGroup?:Function,
    deleteArticle?:Function
}

const ContextMenu = connect(void 0,(dispatch:any)=>{
    return {
        editArticleGroup:(payload:{id:number,title:string})=>dispatch({type:"article/editArticleGroup",payload}),
        deleteArticleGroup:(id:number)=>dispatch({type:"article/deleteArticleGroup",id}),
        deleteArticle:(id:number)=>dispatch({type:"article/deleteArticle",id}),
    }
})(function ({id,deleteArticle,deleteArticleGroup,editArticleGroup,title,type="group",addArticle=()=>{},addGroup=()=>{}}:ContextMenuProps){
    const isGroup = type==="group";
    const [showDel,setShowDel] = useState(false);
    const [edit,setEdit] = useState(false);
    const [val,setVal] = useState(title);
    const inputRef = useRef();

    useEffect(()=>{
        setVal(title);
    },[title]);

    const del = useCallback((e)=>{
        Modal.confirm({
            okText:"确认",
            cancelText:"取消",
            content:"确认删除",
            onOk:()=>{
                type==="group"&&deleteArticleGroup(id);
                type==="article"&&deleteArticle(id);
            }
        });
    },[id]);

    //提交分组修改
    const commit = useCallback((e)=>{
        setEdit(false);
        setVal(e.target.value);
        editArticleGroup({id,title:e.target.value});
    },[]);

    useEffect(()=>{
        //@ts-ignore
        edit && inputRef.current.focus();
    },[edit]);
    return <Dropdown overlay={<Menu>
        {isGroup&&<Menu.Item onClick={()=>addArticle(id)}>添加文章</Menu.Item>}
        {isGroup&&<Menu.Item onClick={()=>addGroup()}>添加分组</Menu.Item>}
        <Menu.Item onClick={del}>删除</Menu.Item>
    </Menu>} trigger={['contextMenu']}>
        <div onMouseMove={()=>setShowDel(true)} onMouseLeave={()=>{setShowDel(false)}} className="i-tree-node">
            {
                isGroup&&<div onDoubleClick={()=>setEdit(true)} className="context-menu__title">
                    {!edit&&<b title="双击修改">{val}</b>}
                    {edit&&<input ref={inputRef} onBlur={commit} defaultValue={val} type="text"/>}
                </div>
            }
            {
                !isGroup&&<div className="context-menu__title">
                    {val}
                </div>
            }
            <div onClick={del}  className={className({
                "context-menu__delete":!showDel,
                "context-menu__delete_show":showDel
            })}>
                <Icon type="delete" />
            </div>
        </div>
    </Dropdown>
})

interface WriteProps{
    articleGroup:{
        loading:boolean,
        list:{[key:string]:articleGroupList[]}
    },
    articles:any,
    setArticleGroup:any,
    fetchArticleGroup:any,
    modifyArticleGroupPid:any,
    fetchArticles:any,
    addArticle:any,
    modifyArticle:any,
    moveArticle:any,
    updateLoading:boolean,
    storeLoading:boolean
}

export default connect((state:any)=>{
    return {
        articleGroup:state.article.articleGroup,
        articles:state.article.articles,
        updateLoading:state.article.updateArticle.loading,
        storeLoading:state.article.storeArticle.loading,
    }
},(dispatch:any)=>{
    return {
        setArticleGroup:(payload:any)=>{
            dispatch({type:"article/setArticleGroup",payload})
        },
        fetchArticleGroup(){
            dispatch({type:"article/fetchArticleGroup"});
        },
        modifyArticleGroupPid(payload:any){
            dispatch({type:"article/modifyArticleGroupPid",payload})
        },
        fetchArticles(){
            dispatch({type:"article/fetchArticles"})
        },
        addArticle(payload:any){
            dispatch({type:"article/addArticle",payload})
        },
        modifyArticle(payload:any){
            dispatch({type:"article/modifyArticle",payload})
        },
        moveArticle(payload:any){
            dispatch({type:"article/moveArticle",payload})
        }
    }
})(Write);

interface articleGroupList{
    id:number,
    uid:number,
    title:string,
    path:string,
    children:articleGroupList[]
}


interface initStateProps{
    id?:number,
    title:string,
    group_id:number,
    content:string,
    disabled:0|1
}

const initState:initStateProps = {
    title:"",
    group_id:0,
    content:"",
    disabled:0
}

const reducers:Reducer<initStateProps,any> = function(state,action){
    switch (action.type) {
        case "add":
            state.id&&delete state.id;
            return {
                ...state,
                ...action.payload
            }
        case "update":
            return {
                ...state,
                ...action.payload
            }
        default:
            return {
                ...state,
                ...action.payload
            };
    }
}


function Write({
    articles,
    moveArticle,
    modifyArticle,
    fetchArticles,
    addArticle,
    articleGroup,
    modifyArticleGroupPid,
    setArticleGroup,
    fetchArticleGroup,
    updateLoading,
    storeLoading
}:WriteProps){
    
    const [groupTitle,setGroupTitle] = useState("");
    const [form,dispatched] = useReducer(reducers,initState);
    const [editor,setEditor] = useState();
    const toolbar = useRef();
    const text = useRef();
    const addGroupRef = useRef<HTMLDivElement>();

    useEffect(()=>{
        async function initFetch(){
            await fetchArticleGroup();
            fetchArticles();
        };
        initFetch();
    },[]);

    /*ctrl+s保存事件*/
    useEffect(()=>{
        key.unbind('ctrl+s');
        key('ctrl+s', ()=>{ 
            storeArticle(form);
            return false;
        });
    },[form]);
    
    useEffect(()=>{
        let editor = new Editor(toolbar.current as HTMLElement, text.current as HTMLElement);
        editor.customConfig.customUploadImg = async function (files, insert) {
            let formData = new FormData();
            formData.append("picture",files[0]);
            upload(formData).then(({data=[]})=>{
                insert(data.pop());
            });
        }
        editor.customConfig.onchange = (html) => {
            dispatched({
                payload:{
                    content:html
                }
            });
        }
        editor.create();
        setEditor(editor);
    },[toolbar,text]);


    /*添加分组*/
    const addGroup = useCallback(async (title="",pid=0)=>{
        if(!groupTitle&&!title){
            return message.error("请输入内容");
        }
        await setArticleGroup({
            pid,
            title:title||groupTitle
        });
        setGroupTitle("");
    },[groupTitle]);
    /*鼠标右击菜单*/
    const contextMenuAddGroup = (pid=0)=>{
        let val="";
        Modal.confirm({
            cancelText:"取消",
            okText:"确认",
            icon:false,
            title:"添加分组",
            width:300,
            content:<Input onChange={(e)=>val=e.target.value} />,
            onCancel:()=>setGroupTitle(""),
            onOk:()=>addGroup(val,pid)
        });
    };

    /*循环遍历group生成tree*/
    const pullArticle = useCallback((list:any[]=[])=>{
        return list.map((item)=>{
            return <TreeNode switcherIcon={<Icon type="file" />} title={<ContextMenu id={item.id} title={item.title} type="article" />} key={item.group_id+"-article-"+item.id} />
        })
    },[]);
    const loopGroup = useCallback((list:articleGroupList[]=[])=>{
        let articleList = articles.list;
        return Object.values(list).map((item:articleGroupList)=>{
            return <TreeNode isLeaf={false} title={<ContextMenu id={item.id} addArticle={(v:string)=>dispatched({
                    type:'add',
                    payload:{group_id:Number(v)}
                })} addGroup={()=>contextMenuAddGroup(item.id)} title={item.title} />} key={String(item.id)}>
                {articleGroup.list[item.id]&&loopGroup(articleGroup.list[item.id])}
                {articleList[item.id]&&pullArticle(articleList[item.id])}
            </TreeNode>
        })
    },[articleGroup.list,articles.list]);
    
    /*循环遍历group生成tree select*/
    const loopGroupSelector = useCallback((list:articleGroupList[]=[])=>{
        return Object.values(list).map((item:articleGroupList)=>{
            return <TreeNode value={item.id} title={item.title} key={String(item.id)}>
                {articleGroup.list[item.id]&&loopGroupSelector(articleGroup.list[item.id])}
            </TreeNode>
        })
    },[articleGroup.list]);

    /* 添加或修改文章 */
    const storeArticle = useCallback(async (form)=>{
        if(form.id){
            modifyArticle(form);
        }else{
            addArticle(form);
        }
    },[]);

    return <div className="article write">
        <Header />
        <div className="main">
            {/* 左边标题tree */}
            <div className="titles">
                <div className="search">
                    <input type="text"/>
                    <span className="search-btn" title="搜索">
                        <Icon type="search" />
                    </span>
                </div>
                <div className="tree">
                    <Tree
                        showLine
                        switcherIcon={<Icon type="caret-down" />}
                        draggable
                        blockNode
                        onDrop={({node, dragNode})=>{
                            let id = dragNode.props.eventKey,
                            pid = node.props.eventKey,
                            dragIsArticle=id.includes("-article-"),
                            pidIsGroup=!pid.includes("-article-");
                            if(id&&pid){
                                !dragIsArticle&&modifyArticleGroupPid({id,pid});
                                dragIsArticle&&pidIsGroup&&moveArticle({id:id.split("-article-").pop(),group_id:pid});
                            }
                        }}
                        onSelect={(selectedKeys,{selectedNodes,nativeEvent})=>{
                            //@ts-ignore
                            if(addGroupRef.current.contains(nativeEvent.target)) return ;
                            let node:any = selectedNodes.pop();
                            if(node){
                                let key = node.key;
                                if(key.includes("-article-")){
                                    let infoIds = key.split("-article-"),
                                    id = infoIds.pop(),
                                    group_id = infoIds.pop(),
                                    info = articles["list"][group_id].find((item:any)=>item.id==id),
                                    content = info.content&&info.content.content;
                                    editor.txt.html(content);
                                    dispatched({
                                        type:"update",
                                        payload:{
                                            id,
                                            group_id,
                                            title:info.title,
                                            content,
                                            disabled:info.disabled
                                        }
                                    });
                                }else{
                                    editor.txt.clear()
                                    dispatched({
                                        type:"add",
                                        payload:{
                                            title:"",
                                            disabled:0,
                                            content:"",
                                            group_id:Number(selectedKeys.pop())
                                        }
                                    });
                                }
                            }
                        }}
                        defaultExpandedKeys={['0']}
                        onRightClick={()=>false}
                    >
                        <TreeNode switcherIcon={<Icon type="read" />} title={<Dropdown overlay={<Menu>
                            <Menu.Item onClick={()=>addArticle()}>添加文章</Menu.Item>
                            <Menu.Item onClick={()=>contextMenuAddGroup()}>添加分组</Menu.Item>
                        </Menu>} trigger={['contextMenu']}>
                            <div className="i-tree-node">
                                <div className="context-menu__title">
                                    <b>我的文章</b>
                                </div>
                                <div ref={addGroupRef}>
                                    <Popconfirm
                                        title={<Input value={groupTitle} onChange={(e)=>setGroupTitle(e.target.value)} style={{marginLeft:10}} />}
                                        icon={<Icon type="cluster" style={{fontSize:24}} />}
                                        onConfirm={()=>addGroup()}
                                        onCancel={()=>setGroupTitle("")}
                                        cancelText="取消"
                                        okText="确认"
                                    >
                                        <Icon style={{fontSize:18}} type="plus" />
                                    </Popconfirm>
                                </div>
                            </div>
                        </Dropdown>} key="0">
                            {
                                loopGroup(articleGroup.list[0])
                            }
                            {
                                pullArticle(articles.list[0])
                            }
                        </TreeNode>
                    </Tree>
                </div>
                
            </div>

            {/* 写文章 */}
            <div className="content">
                <div className="title">
                    <input onChange={e=>dispatched({
                        type:form.id?'update':'add',
                        payload:{
                            title:e.target.value
                        }
                    })} value={form.title} placeholder="输入标题" />
                </div>
                <div className="tools">
                    <div className="tool-item group-selector">
                        <TreeSelect
                            showSearch
                            value={form.group_id}
                            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                            placeholder="请选择分类"
                            size="small"
                            treeDefaultExpandAll
                            onChange={v=>dispatched({
                                type:form.id?'update':'add',
                                payload:{
                                    group_id:v
                                }
                            })}
                        >
                            <TreeNode value="0" title="我的文章" key="0">
                                {loopGroupSelector(articleGroup.list[0])}
                            </TreeNode>
                        </TreeSelect>
                    </div>
                    <div className="tool-item" onClick={()=>{
                        if(!updateLoading&&!storeLoading){
                            dispatched({payload:{disabled:Number(!form.disabled)}});
                            storeArticle({
                                ...form,
                                disabled:Number(!form.disabled)
                            });
                        }
                    }} title={form.disabled?"取消发布":"发布"}>
                        {
                            (updateLoading||storeLoading)?<Icon type="loading" />:(
                                form.disabled?<Icon type="file-text" />:<Icon type="file-unknown" />
                            )
                        }
                    </div>
                    <div className="tool-item" onClick={()=>storeArticle(form)} title="保存 ctrl+s">
                        <Icon type="save" />
                    </div>
                    <div className="tool-item" title="标签">
                        <Icon type="tag" />
                    </div>
                    <div className="tool-item" title="预览">
                        <Icon type="file-word" />
                    </div>
                </div>
                <div className="editor">
                    <div className="editor-toolbar" ref={toolbar}></div>
                    <div className="editor-text" ref={text}></div>
                </div>
            </div>
        </div>
    </div>
}


