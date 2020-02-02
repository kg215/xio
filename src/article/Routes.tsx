import React, { useEffect, Suspense, lazy } from "react";
import { connect } from "dva";
import {
    HashRouter as Router,
    Route,
    Switch
} from "react-router-dom";

const Article = lazy(()=>import("./Article"));
const Write = lazy(()=>import("./Write"));

interface RoutesProps{
    fetchUser:Function
}

export default connect(void 0,(dispatch:any)=>{
    return {
        fetchUser(){
            dispatch({type:"common/fetchUser"});  
        }
    }
})(function({fetchUser}:RoutesProps){
    useEffect(()=>fetchUser(),[])
    return <Router>
        <Suspense fallback={<div></div>}>
            <Route exact path="/" component={Article} />
            <Switch>
                <Route path="/write" component={Write} />
            </Switch>
        </Suspense>
    </Router>
})