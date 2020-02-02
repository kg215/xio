import React, { PropsWithChildren } from "react";
import classNames from "classnames";

interface RadiusBoxProps{
    border?:boolean,
    shadow?:boolean,
    title?:string,
    onClick?:Function
}

export default RadiusBox;

function RadiusBox({children,title,shadow=false,border=false,onClick=()=>{}}:PropsWithChildren<RadiusBoxProps>){

    return <div onClick={()=>onClick()} title={title} className={classNames("radius-box",{
        "radius-box-border":border,
        "radius-box-shadow":shadow
    })}>
        {children}
    </div>
}