import React,{FC, ReactElement, PropsWithChildren, useCallback, useEffect, useState, Ref} from "react";
import { StyleProps } from "../types/style";

interface FormProps extends StyleProps{}

let Form:FC<PropsWithChildren<FormProps>> = function({children,style}):ReactElement{

    return <div style={style} className="form">
        {children}
    </div>
}
Form.displayName="iForm";

interface ItemProps extends StyleProps{
}
let Item:FC<PropsWithChildren<ItemProps>> = function({children,style}):ReactElement{

    return <div style={style} className="form-item">
        {children}
    </div>
}

export interface InputProps extends StyleProps,Omit<
        React.InputHTMLAttributes<HTMLInputElement> &
        React.TextareaHTMLAttributes<HTMLTextAreaElement> &
        React.RefAttributes<null>,
        "onChange" | "size" | 'defaultValue'
    >{
    defaultValue?:string|number,
    value?:string|number,
    onChange?:(value:string,{event}:{event:React.ChangeEvent<HTMLInputElement>})=>void,
    icon?:ReactElement
}
let Input:FC<PropsWithChildren<InputProps>> = function(props):ReactElement{
    const {onChange=()=>{},children,style,ref,icon=void 0,defaultValue="",value="",type="text",...inputProps} = props;
    const [innerValue,setInnerValue] = useState<string|number>(defaultValue);

    useEffect(function () {
        setInnerValue(value);
    },[value]);

    const handleChange = useCallback(function (event) {
        let val = event.target.value;
        setInnerValue(val);
        onChange(val,{event});
    },[]);

    return <div style={style} className="form-input">
        {
            (children||icon)&&<span className="form-input__icon">
                {children || icon}
            </span>
        }
        <input {...inputProps} type={type} onChange={handleChange} ref={ref as Ref<HTMLInputElement>} value={String(innerValue)} />
    </div>
}
export default Object.assign(Form,{
    Item,
    Input
});