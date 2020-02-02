export as namespace Editor;


export default class Editor{
    create: any;
    constructor(ele: HTMLElement,textEle?: HTMLElement);
    customConfig:{
        onchange:(html:string)=>void,
        uploadImgServer:string,
        uploadFileName:string,
        withCredentials:boolean,
        uploadImgHeaders:Object,
        customUploadImg:(files:FileList, insert:(src:string)=>void)=>void,
        customAlert:(info:string)=>void
    }
    txt:{
        html:(html:string)=>void
    }
}


