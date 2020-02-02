import React, { useState, useRef, useEffect, MutableRefObject, useCallback } from  "react";
import {Button, message} from "antd";

import Cropper from "react-cropper"
import 'cropperjs/dist/cropper.css';

import  Modal from "./Modal";

interface CroperProps{
    visible:boolean,
    submit:(file:any)=>void,
    loading?:boolean,
    onClose:()=>void,
    onScale?:()=>void,
    src:string,
    size?:number
}

export default function ({submit,loading=false,visible=false,size=280,onClose=()=>{},src="",...props}:CroperProps){
    let [crop,setCrop] = useState(void 0);

    useEffect(()=>{
        document.body.style.overflowY = visible?"hidden":"auto";
    },[visible]);

    let handleSubmit = useCallback(() => {
        crop.getCroppedCanvas().toBlob(async (blob: string | Blob) => {
            const formData = new FormData();
            formData.append('picture', blob, 'avatar');
            submit(formData);
        })
    },[crop]);
    return <Modal visible={visible} onClose={onClose}>
        <Modal.Header>
            上传图片
        </Modal.Header>
        <Modal.Body size="middle">
            <div className="cropper">
                <div className="tips">
                    图片宽度小于500，文件大小：1M以内，
                    支持图片格式：jpeg、jpg、png
                </div>
                <div className="cropper-main">
                    <Cropper
                        ref={c=>setCrop(c)}
                        src={src}
                        style={{height: 280, width: 280}}
                        aspectRatio={1}
                        guides={true}
                        autoCrop={true}
                        preview=".preview"
                    />
                    <div className="cropper-write">
                        <div className="preview" />
                        <div className="btn-group">
                            <Button disabled={loading} onClick={onClose}>取消</Button>
                            <Button loading={loading} onClick={handleSubmit} type="primary">上传</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
}