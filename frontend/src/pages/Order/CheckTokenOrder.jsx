import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getOrderAtRestaurant } from "../../Services/AuthOrderAtRestaurant";
import { message, Modal, Skeleton, Spin } from "antd";
import Cookies from "js-cookie";
const CheckTokenOrder =() => {
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const navigate = useNavigate()
    useEffect(() => {
        console.log(token)
        if(token){
            fetchApiCheckToken(token)
        }
        else{
            message.error("Mã đặt bàn không hợp lệ, vui lòng quét lại QR")
        }
        const handleBeforeUnload = () => {
            Cookies.remove('tableSlug');
            Cookies.remove('nameTable');
          };
      
          window.addEventListener('beforeunload', handleBeforeUnload);
      
          return () => {
            // Xóa sự kiện 'beforeunload' khi component bị huỷ
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };
        // navigate('/order')
    },[])

    const fetchApiCheckToken =async(token) => {
        try {
            const res = await getOrderAtRestaurant(token)
            if(res?.status ==='error'){
                message.error("Mã đặt bàn không hợp lệ, vui lòng quét lại QR")
            }
           else {
            window.location.replace('/order/at-restaurant')
            // navigate("/order/at-restaurant")
            message.success(res?.message || "Đã tìm thấy bàn hợp lệ")
            Cookies.set('tableSlug', token,{expires:0.5/24});
            Cookies.set('nameTable', res?.data?._id,{expires:0.5/24});
           }
           console.log(res)
        }
        catch(err) {
            console.log(err)
            message.error("Mã đặt bàn không hợp lệ, vui lòng quét lại QR")
        }

    } 
    return (
        <div style={{display:"flex",justifyContent:'center',alignItems:"center",width:"100vw",height:"100vh",backgroundColor:'#cccccc'}} >
            <Spin></Spin>
        </div>
        
    )
}
export default CheckTokenOrder