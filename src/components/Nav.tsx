import React,{PropsWithChildren,ReactElement} from "react";

interface NavProps{
    href:string
}

function Nav({href,children}:PropsWithChildren<NavProps>):ReactElement{

    return <a href={"/#"+href}>
        <div className="nav-col">
            {children}
        </div>
    </a>
}

export default Nav;