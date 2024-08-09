import { BellOutlined } from "@ant-design/icons"
import {  Popover } from "antd"
import { useEffect, useState } from "react"
import { fetchDataNotifi, getQuantityNotifi } from "../../Services/Notification"


  
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
    
    
    },[])
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