export default {
    search,
    params
};

function search(href:string){
    let questionMark = href.indexOf("?"),query=href;
    if(questionMark!==-1){
        query = href.substr(questionMark+1);
    }

    if(query.includes("#")){
        query = query.substr(0,query.indexOf("#"));
    }

    return Object.fromEntries((new URLSearchParams(query)).entries());
}

function params(key:string=""){
    const p = search(location.href);
    return key?p[key]:p;
}
