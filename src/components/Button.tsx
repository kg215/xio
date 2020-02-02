import React, { PropsWithChildren, DetailedHTMLFactory, HTMLAttributes } from "react";
import classname from "classnames";

interface ButtonProps extends HTMLAttributes<HTMLDivElement>{
    type?:"default"|"simple"|"simple__border"|"link"|"rect__black",
    loading?:boolean,
    disabled?:boolean
}

function Button({children,disabled=false,loading=false,onClick=()=>void 0,type="default",...props}:PropsWithChildren<ButtonProps>){
    return <div onClick={(e)=>{!disabled&&!loading&&onClick(e)}} className={
        classname("button",{
            ["button-"+type]:!!type,
            "button-disabled":loading||disabled
        })
    } {...props}>
        <div>
            {
                loading&&<img className="loading-img" src="../asset/img/loading.png" />
            }
            {children}
        </div>
    </div>
}

export default Button;