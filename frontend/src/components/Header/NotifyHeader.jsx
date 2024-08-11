import { BellOutlined } from "@ant-design/icons"
import {  Popover } from "antd"
import { useContext, useEffect, useState } from "react"
import { fetchDataNotifi, getQuantityNotifi } from "../../Services/Notification"
import Cookies from "js-cookie";
import io from "socket.io-client";
import { NotifyContext } from "../ContextNotify/ContextNotify";
  
const NotifyContent =({data}) => {
    return (
        <div className="flex flex-col gap-3 max-w-64 divide-y divide-slate-200 max-h-80 overflow-auto">
            {data.map(item => (
                <div className="pt-2" >
                    <p className="font-bold">{item.title}</p>
                    <p>{item.message}</p>
                </div>
            ))}
        </div>
    )
}
const NotifyHeader =() => {
    const [isOpen, setIsOpen] = useState(false)
    const { value, setValue } = useContext(NotifyContext);
  // const {value} =useContext(NotifyContent)
    const handleClick=() => {
        setIsOpen(pre =>!pre)
       
    }
useEffect(() => {
 console.log(value) 
},[])
    
return (
 

    <Popover content={<NotifyContent data={value?.listNotify ||[]}/>} title={false} trigger="click" visible={isOpen}>
        <div className="relative">
            <BellOutlined size={40} onClick={handleClick}/>
            <div className="absolute right-0 bg-red-500 rounded-full text-xs w-4 h-4 flex justify-center items-center" style={{top:"-12px",right:"-8px"}}>
            <p >{value?.numberNotify || 0}</p>
        </div>
    </div>
  </Popover>
   
) 
}
export default NotifyHeader