import { Button, Table } from "antd"

import { getPrintBillKitchen } from "../../../Services/PrintBil"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { PrinterFilled,  } from "@ant-design/icons"

const BillKitchen =() => {
    const [dataBill,setDataBill] = useState([])
    const [pagination,setPagination] = useState({
        page:1,
        size:10,
        totalItem:0
    })
    const [totalItems,setTotalItems] =useState(0)
    const fetchPrintBillKitchen =async(page) =>{
    try {
        const res = await getPrintBillKitchen(page)
        setDataBill(res?.data)
        setTotalItems(res?.paginationResult?.totalItems)
    }
    catch (err) {
        console.log(err)
     }
    }

    const handlePrintBill =(url) => {
        console.log(url)
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
        title: 'STT',
        dataIndex: 'name',
        render: (text,record,index) => <p>{index + 1}</p>,
    },
    {
        title: 'Bàn',
        dataIndex: 'tableId',
        render: (text,record,index) => <p>{text}</p>,
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        render: (text,record,index) => <p>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</p>,
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
            Quản phiếu in bếp 
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
export default BillKitchen