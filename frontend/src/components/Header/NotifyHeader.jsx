import { BellOutlined } from "@ant-design/icons"
import {  Button, Popover } from "antd"
import {  useContext, useEffect, useState } from "react"
import { SocketContext } from "../../context/SocketContext"
import Cookies from "js-cookie";
import io from "socket.io-client";
import { fetchDataNotifi, getQuantityNotifi } from "../../Services/Notification";
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
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState({
        numberNotify: 0,
        listNotify: [],
      });
    const handleClick=() => {
        setIsOpen(pre =>!pre)
    }

    const fetchDataNotifyHeader = async () => {
        setLoading(true);
        try {
          const res = await fetchDataNotifi();
          setValue((pre) => ({ ...pre, listNotify: res?.data || [] }));
        } catch (err) {
          console.log(err);
        }
      };
      const fetchQualityNotify = async () => {
        setLoading(true);
        try {
          const res = await getQuantityNotifi();
          console.log(res?.data);
          setValue((pre) => ({ ...pre, numberNotify: res?.data }));
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      };
    useEffect(()=> {
        socket.on('notification', (msg)=> {
          console.log(msg)
          fetchDataNotifyHeader()
          fetchQualityNotify()
        })
    },[])
    useEffect(()=> {
        fetchDataNotifyHeader()
    },[])
    return (
        <>
        <Popover content={<NotifyContent data={value?.listNotify|| []}/>} title={false} trigger="click" visible={isOpen}>
            <div className="relative">
                <BellOutlined size={40} onClick={handleClick}/>
                <div className="absolute right-0 bg-red-500 rounded-full text-xs w-4 h-4 flex justify-center items-center" style={{top:"-12px",right:"-8px"}}>
                <p >{value?.numberNotify|| 0}</p>
            </div>
        </div>
    </Popover>
    {/* <Button type="primary" onClick={handleStart}>test</Button> */}
        </>
    ) 
}
export default NotifyHeader