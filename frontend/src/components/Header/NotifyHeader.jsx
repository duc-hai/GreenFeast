import { BellOutlined } from "@ant-design/icons"
import {  Popover } from "antd"
import { useEffect, useState } from "react"
import { fetchDataNotifi } from "../../Services/Notification"


  
const NotifyContent =({data}) => {
    return (
        <div className="flex flex-col gap-3 max-w-64 divide-y divide-slate-200">
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
    const handleClick=() => {
        setIsOpen(pre =>!pre)
    }

    const fetchDataNotifyHeader =async() => {
      const res =  await fetchDataNotifi()
      setData(res?.data || [])
    } 
    useEffect(() => {
      fetchDataNotifyHeader()
    },[])
return (
    <Popover content={<NotifyContent data={data}/>} title={false} trigger="click" visible={isOpen}>
   <BellOutlined size={24} onClick={handleClick}/>
  </Popover>
) 
}
export default NotifyHeader