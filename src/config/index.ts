const env = process.env.NODE_ENV;
export const isDev = env==="development";
export default {
    isDev,
    domain:"http://www.kg1995.top/index.php/",
    user:{
        avatar:"/src/asset/img/default_avatar.png"
    },
    publicApi:[
        "userinfo","login","register"
    ],
    publicView:[
        "/",
        "/web",
        "/web/recommend",
        "/auth"
    ]
}
