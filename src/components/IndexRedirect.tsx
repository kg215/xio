import React from "react";
import {RedirectProps,Route,Redirect} from "react-router"

export default IndexRedirect;
interface IndexRedirectProps{
    to:RedirectProps["to"]
}
function IndexRedirect({to}:IndexRedirectProps){


    return  <Route exact path="/">
        <Redirect to={to}/>
    </Route>  
}