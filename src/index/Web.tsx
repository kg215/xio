import React, { Dispatch, useEffect, lazy, Suspense } from "react";
import {
    HashRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
import {connect} from "dva";


import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import NotFound from "../components/NotFound";
import IndexRedirect from "../components/IndexRedirect";

const Recommend = lazy(()=>import(/*webpackChunkName:"Recommend"*/"./recommend"));
const User = lazy(()=>import(/*webpackChunkName:"User"*/"./user"));
const Setting = lazy(()=>import(/*webpackChunkName:"Setting"*/"./user/setting"));
const Auth = lazy(()=>import(/*webpackChunkName:"Auth"*/"./auth"));
       

interface WebProps{
    fetchUser:Function
}

export default connect(void 0,(dispatch:Dispatch<any>)=>{
    return {
        fetchUser:()=>dispatch({type:"common/fetchUser"}),
    }
})(Web);

function Web({fetchUser}:WebProps){
    useEffect(function(){
        fetchUser();
    },[]);
    return <Router>
        <Suspense fallback={<div></div>}>  
            <Route path="/">
                <IndexRedirect to={{pathname:"/web/recommend"}} />
                <Switch>
                    <Route path="/auth" component={Auth} />
                    <Route path="/web">
                        <div className="web">
                            <IndexRedirect to={{pathname:"/web/recommend"}} />
                            <Header />
                            <Main>
                                <div className="standard-size">
                                    <Route path="/web/recommend" component={Recommend} />
                                    <Route exact path="/web/user" component={User} />
                                    <Route path="/web/user/setting" component={Setting} />
                                </div>
                            </Main>
                            <Footer>
                                <div className="standard-size">
                                    网站备案号：粤ICP备17055511号-1
                                </div>
                            </Footer>
                        </div>
                    </Route>
                    <Route component={NotFound}/>
                </Switch>
            </Route>
        </Suspense>
    </Router>
}


