import { Button, Col, Input, Row, Table } from "antd"
import { Form } from "react-router-dom"
import { getPrintBillBar, getPrintBillKitchen } from "../../../Services/PrintBil"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { PrinterFilled, PrinterOutlined } from "@ant-design/icons"

const BillBar =() => {
    const [dataBill,setDataBill] = useState([])
    const [pagination,setPagination] = useState({
        page:1,
        size:10
    })
    const [totalItems,setTotalItems] =useState(0)

    const fetchPrintBillKitchen =async(page) =>{
    try {
        const res = await getPrintBillBar(page)
        setDataBill(res?.data)
        setTotalItems(res?.paginationResult?.totalItems)
       
        
    }
    catch (err) {
        console.log(err)
     }
    }

    const handlePrintBill =(url) => {
        window.open(url, '_blank');
    }
    const handleChangePage =(page) => {
        setPagination(pre => ({...pre,page:page}))
    }
    useEffect(() => {
        fetchPrintBillKitchen(pagination.page)
    },[pagination.page])
    const columns = [
    {
        title: 'Tên phiếu in',
        dataIndex: 'name',
        render: (text,record,index) => <p>{`Phiếu in ${index}`}</p>,
    },
    {
        title: 'Bàn',
        dataIndex: 'age',
        render: (text,record,index) => <p>{`Bàn ${index}`}</p>,
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        render: (text,record,index) => <p>{dayjs(text).format("YYYY-MM-DD hh:mm:ss")}</p>,
    },
    {
        title: 'Hoạt động',
        dataIndex: 'url_ticket',
        render: (text,record,index) => <Button onClick={() => handlePrintBill(text)} className="justify-center flex items-center gap-1" type="primary">
            <PrinterFilled/>
            <span>Print</span>
             </Button>
    },
    ];
    return (
        <div className="content-component">
        <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
            <div className="text-xl font-semibold pl-2 text-white">
            Quản phiếu in pha chế 
            </div>
        </div>

        <br />
        <br />
        <Table
            columns={columns}
            dataSource={dataBill}
            pagination={{
                total:totalItems,
                pageSize:pagination.size,
                onChange: (page,pageSize) => handleChangePage(page)
            }}
            
            scroll={{ x: "max-content" }}
        />
        </div>
    )
}
export default BillBar