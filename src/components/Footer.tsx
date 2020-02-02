import React,{PropsWithChildren} from "react";

export default Footer;

function Footer(props:PropsWithChildren<{}>){
    
    return <div className="footer">
        {props.children}
    </div>
}