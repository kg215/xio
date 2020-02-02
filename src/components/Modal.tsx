import React, { FC, PropsWithChildren, ReactElement, useEffect, useState, useCallback } from  "react";
import ReactDom from "react-dom";
import {StyleProps} from "../types/style";

interface ModalProps extends StyleProps{
    visible:boolean,
    onClose:()=>void
}

let Modal:FC<PropsWithChildren<ModalProps>> = function ({visible=false,onClose=()=>{},children}):ReactElement{

    let [mouted,setMouted] = useState<boolean>(false),
    [iVisible,setVisible] = useState<boolean>(visible);

    useEffect(function(){
        setMouted(true);
    },[]);

    const open=useCallback(()=>{
        setVisible(true);
    },[]);

    const close=useCallback(()=>{
        setVisible(false);
        onClose();
    },[]);

    
    useEffect(function(){
        mouted&&(visible?open():close());
    },[visible]);
    return iVisible&&ReactDom.createPortal(<div className="modal-layer">
        <div className="modal-mask"></div>
        <div className="modal-content">
            {children}
            <span onClick={close} className="close">
                <img src="../asset/img/close.png" alt="关闭"/>
            </span>
        </div>
    </div>,document.querySelector("#modal"))
}

interface BodyProps extends StyleProps{
    size?:"large"|"middle"|"default"|"small"
};

let Body:FC<PropsWithChildren<BodyProps>> = function({style,size="default",children}):ReactElement{
    return <div style={style} className={"modal-body__"+size}>
        {children}
    </div>
}

interface HeaderProps extends StyleProps{
    
};

let Header:FC<PropsWithChildren<HeaderProps>> = function({style,children}):ReactElement{
    return <div style={style} className="modal-header">
        {children}
    </div>
}

interface FooterProps extends StyleProps{
    
};

let Footer:FC<PropsWithChildren<FooterProps>> = function({style,children}):ReactElement{
    return <div style={style} className="modal-footer">
        {children}
    </div>
}

Modal.displayName="Modal";

export default Object.assign(Modal,{
    Body,
    Header,
    Footer
});

