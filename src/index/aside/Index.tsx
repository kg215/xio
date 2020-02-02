import React from "react";
import {connect} from "dva";
import {Api} from "app";

import config from "../../config";

export default connect((state:any)=>{
    return {
        user:state.common.user
    }
})(Aside);
interface AsideProps{
    user:Api.User
}
function Aside({user}:AsideProps){

    return <div className="aside">
        <div className='user-info'>
            <a href={"/#/web/user?uid="+user.uid}>
                <img className="avatar" src={user.avatar || config.user.avatar} alt="头像" />
            </a>
            <div className="trends">
                <a href={"/#/web/user?uid="+user.uid}>文章</a>
                <span>收藏</span>
                <span>粉丝</span>
            </div>
        </div>
        <div className="wechatqr">
            <div>
                <img src={"/src/asset/img/wechat_qrcode.jpg"} alt="微信公众号" />
            </div>
            <div>
                关注微信公众号，获取更多资源
            </div>
        </div>
        <div className="tags">
            <div className="title">标签</div>
            <div className="tag-item">
                <div className="tag">Vue</div>
                <div className="tag">Webpack</div>
                <div className="tag">Babel</div>
                <div className="tag">React</div>
                <div className="tag">Javascript</div>
                <div className="tag">PHP</div>
                <div className="tag">Laravel</div>
                <div className="tag">Mysql</div>
                <div className="tag">微信开发</div>
                <div className="tag">HTML5</div>
                <div className="tag">CSS3</div>
            </div>
        </div>
        
    </div>
}