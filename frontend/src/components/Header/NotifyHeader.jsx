import { BellOutlined } from "@ant-design/icons"
import {  Popover } from "antd"
import { useEffect, useState } from "react"
import { fetchDataNotifi, getQuantityNotifi } from "../../Services/Notification"
import Cookies from "js-cookie";
import io from "socket.io-client";
  
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
  const [data,setData] = useState([])
  const [qualityNotify, setQualityNotify]=useState(0)
  const [loading,setLoading]=useState(false)
  const [socket, setSocket] = useState(null);
  const [numberNotify, setNumberNotify] =useState(false)
  const token = Cookies.get("accessToken");
  useEffect(() => {
    console.log(token);
    // Connect to the Socket.IO server
    const newSocket = io("http://localhost:5020/notification", {
      auth: {
        token: token,
      },
    });
    newSocket.on("notification", (message) => {
      console.log("Message received:", message);
      setNumberNotify(pre => !pre)
    });
    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      // Handle the error, maybe redirect to login or show a message
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);
    const handleClick=() => {
        setIsOpen(pre =>!pre)
    }

    const fetchQualityNotify =async() => {
        setLoading(true)
        try {
            const res =await getQuantityNotifi()
            console.log(res?.data)
            setQualityNotify(res?.data)
        }
        catch(err){
            console.log(err)
        }
        setLoading(false)
    }

    const fetchDataNotifyHeader =async() => {
      const res =  await fetchDataNotifi()
      setData(res?.data || [])
    } 
    useEffect(() => {
      Promise.all([
          fetchDataNotifyHeader(),
          fetchQualityNotify()
      ])
    
    
    },[numberNotify])
return (
 

    <Popover content={<NotifyContent data={data}/>} title={false} trigger="click" visible={isOpen}>
        <div className="relative">
            <BellOutlined size={40} onClick={handleClick}/>
            <div className="absolute right-0 bg-red-500 rounded-full text-xs w-4 h-4 flex justify-center items-center" style={{top:"-12px",right:"-8px"}}>
            <p >{qualityNotify}</p>
        </div>
    </div>
  </Popover>
   
) 
}
export default NotifyHeader