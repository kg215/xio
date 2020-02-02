import React,{PropsWithChildren} from "react";

export default Main;

function Main(props:PropsWithChildren<{}>){

    return <div className="main">
        {props.children}
    </div>
}