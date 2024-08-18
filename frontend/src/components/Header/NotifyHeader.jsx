import { BellOutlined } from "@ant-design/icons"
import {  Button, Popover } from "antd"
import {  useContext, useEffect, useState } from "react"
import { SocketContext } from "../../context/SocketContext"
import Cookies from "js-cookie";
import io from "socket.io-client";
const token = Cookies.get("accessToken");
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
    const { socket } = useContext(SocketContext);

    const handleClick=() => {
        setIsOpen(pre =>!pre)

        
    }
    const handleStart = () => {
        socket.emit("thang", "Start");
        console.log("test")
      };
useEffect(()=> {
    
    socket.on('notification', (msg)=> {
        console.log(msg)
    })
},[socket])
    
    return (
        <>
        <Popover content={<NotifyContent data={ []}/>} title={false} trigger="click" visible={isOpen}>
            <div className="relative">
                <BellOutlined size={40} onClick={handleClick}/>
                <div className="absolute right-0 bg-red-500 rounded-full text-xs w-4 h-4 flex justify-center items-center" style={{top:"-12px",right:"-8px"}}>
                <p >{ 0}</p>
            </div>
        </div>
    </Popover>
    {/* <Button type="primary" onClick={handleStart}>test</Button> */}
        </>
    ) 
}
export default NotifyHeader