import {
    Button,
    Col,
    Dropdown,
    Form,
    Input,
    Modal,
    Pagination,
    Rate,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    message,
  } from "antd";
  import FoodComponent from "../../components/FoodCompoent";
  import { UserOutlined } from "@ant-design/icons";
  import { Menu } from "antd";
  import "./index.css";
  import { useEffect, useState } from "react";
  import {
      applyPromotion,
      closeTable,
    createOrder,
    fetchMenuOrder,
    fetchTableCategory,
    getAllAreaOrder,
    getCategoryOrder,
    getMenuByCategory,
    getMenuBySearch,
    getMenuList,
    getMenuRecommend,
    getPromotion,
    postPayment,
    printBill,
    viewDetailOrder,
  } from "./../../Services/OrderAPI";
  import {
    getAllArea,
  
  } from "../../Services/ManagementServiceAPI";
  import Header from "../../components/Header";
  import Search from "antd/es/transfer/search";
import dayjs from "dayjs";
import Cookies from "js-cookie";
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
 
  const OrderAtRestaurant = () => {
    const [us, setUs] = useState({});
    const user = sessionStorage.getItem("user");
    const [getArea, setGetArea] = useState([]);
    const [area, setArea] = useState();
    const [tableList, setTableList] = useState([]);
    const [tableSlug, setTableSlug] = useState();
    const [listDataCate, setListDataCate] = useState([]);
    const [getListMenu, setListMenu] = useState([]);
    const [order, setOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(0);
    const [loading, setLoading] = useState(false);
    const [textSearch, setTextSearch] = useState("");
    const tableSlugId =Cookies.get("tableSlug");
    const nameTableCheck =Cookies.get("nameTable");
    const onSearch = (e) => {
      setTextSearch(e.target.value);
    };

    // list view order
    const [form] = Form.useForm();
    const [nameTable, setNameTable] = useState("")
    const [dataPromotion, setDataPromotion] = useState([{}]);
    const [exportBuill, setExportBuill] = useState("");
    const [orderDetail, setOrderDetail] = useState({});
    const [isModalCloseTable, setIsModalCloseTable] = useState(false);
    const [loadingDetail,setLoadingDetail] =useState(false)
    const [optionPromotion, setOptionPromotion]=useState([])
    const [pagination, setPagination] = useState({
      page: 1,
      size: 10,
      total: 0,
      isShow: false,
    });
    const [sumMoney,setSumMoney]=useState(0)
    const [tagShow,setTagShow] =useState('Khai vị')
    const handleOpenListOrderDetail =() => {
      setIsModalCloseTable(true)
      fetchDataOrderDetail(tableSlugId)
    }
    const fetchBill =async(id) => {
      setLoadingDetail(true)
      try {
        const resBill = await printBill(id);
        setExportBuill(resBill.data);
      }
      catch (error) {
        console.log(error);
      }
      setLoadingDetail(false)
    }
  const fetchDataOrderDetail = async (id) => {
    setLoadingDetail(true)
    try {
      const res = await viewDetailOrder(id);
      setNameTable(res?.data?.table)
      setOrderDetail(res.data);
      setSumMoney(res?.data?.subtotal || 0)
      setTableSlug(id)
    } catch (error) {
      console.log(error);
    }
    setLoadingDetail(false)
  };

  // api thanh toan
  const fetchPayment =async(data) => {
    try {
      const res = await postPayment(data)
      console.log(res)
      if(res?.status ==='success' && (!!res?.data?.vnpUrl)){

        // message.success('Thanh toán thành công')
        // window.open(res?.data?.vnpUrl,'_blank')
        Cookies.remove('tableSlug');
            Cookies.remove('nameTable');
        window.open(res?.data?.vnpUrl,'_self')
      }
    }
    catch(err){
      console.log(err)
    }

  }


  // thanh toan

  const onFinish = async () => {
    const values = form.getFieldsValue();

    try {
      if (values.payment_method === undefined) {
        message.error("Vui lòng chọn loại thanh toán");
        return; 
      }
      // await closeTable(tableSlug, values);
      // await fetchData(area);
      let dataBody={orderId:orderDetail?._id,amount:orderDetail?.subtotal}
     
       await fetchPayment(dataBody)
      message.success("Đóng bàn thành công");
    } catch (error) {
      console.log(error);
      console.log(error)
      message.error(error?.response?.data?.message);
    }
    // fetchData(area);
    setIsModalCloseTable(false);
  };

  // khuyen mai
  const fetchPromotion = async () => {
    try {
      const res = await getPromotion();
      setDataPromotion(res.data);
      let tempOption = res?.data?.map(item => ({value:item._id,label:item.name}))
      setOptionPromotion(tempOption)
    } catch (error) {
      console.log(error);
    }
  };

  //////////////////////////////////

    // const fetchTable = async (id) => {
    //   try {
    //     const res = await fetchTableCategory(id);
    //     setTableList(
    //       res.data?.map((item) => {
    //         return {
    //           key: item.slug,
    //           label: item._id,
    //           status: item.status,
    //         };
    //       })
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
  
    const fetchDataByKeywork = async (key) => {
      try {
        const res = await getMenuBySearch(key);
        setListMenu(res.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      if (textSearch?.length > 0) {
        fetchDataByKeywork(textSearch);
      }
    }, [textSearch]);
  
    // useEffect(() => {
    //   if (area) {
    //     fetchTable(area);
    //   }
    // }, [area]);
    useEffect(() => {
      // const fetchArea = async () => {
      //   try {
      //     const res = await getAllArea();
      //     // const res = await getAllAreaOrder();
      //     setGetArea(
      //       res.data?.map((item) => {
      //         return {
      //           key: item.id,
      //           label: item.name,
      //         };
      //       })
      //     );
      //   } catch (error) {
      //     console.log(error);
      //   }
      // };
      if(!!tableSlugId){
          Promise.all([
              // fetchArea(),
              fetchPromotion(),
              fetchDataOrderDetail(tableSlugId),
              fetchBill(tableSlugId)
          ])
      }
      else {
        window.location.replace('/scan-qr')
        message.error("Mã đặt bàn không hợp lệ, vui lòng quét lại QR")
      }
    }, []);
    const fetchMenu = async () => {
      try {
        const res = await fetchMenuOrder();
        setListMenu(res.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchDataByCate = async (id) => {
      setLoading(true);
      try {
        const res = await getMenuByCategory(id);
        setListMenu(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCategoryOrder();
        console.log(res?.data);
        if (res.data?.length > 0) {
          let tempData = res.data?.map((item) => getItem(item?.name, item?._id));
  
          tempData = [
            ...[
              {
                key: "recommend",
                icon: undefined,
                children: undefined,
                label: "Đề xuất",
                type: undefined,
              },
              {
                key: "all",
                icon: undefined,
                children: undefined,
                label: "Tất cả",
                type: undefined,
              },
            ],
            ...tempData,
          ];
          setListDataCate([...tempData]);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
  
    const fetchMenuReCommend = async () => {
      setLoading(true);
      try {
        const res = await getMenuRecommend();
        setListMenu(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    const fetchMenuList = async (page, size) => {
      setLoading(true);
      try {
        const res = await getMenuList(page, size);
        console.log(res?.paginationResult?.totalItems);
        await setPagination((pre) => ({
          ...pre,
          total: res?.paginationResult?.totalItems,
        }));
        setListMenu(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    // useEffect(() => {
    //   if (!us) {
    //     message.error("Vui lòng đăng nhập");
    //     navigate("/login");
    //     return;
    //   }
    // }, [us]);
  
    // open url payment
 
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      if (textSearch === "") {
        fetchMenu();
      }
    }, [textSearch]);
  
    useEffect(() => {
      setUs(JSON.parse(user));
    }, [user]);
  
    const onClick = (e) => {
  
      setTagShow(listDataCate.find(item => item?.key === (e?.key) || (item?.key) === Number(e?.key))?.label)
     
      if (e?.key === "recommend") {
        //call api recommend
        fetchMenuReCommend();
        setPagination((pre) => ({ ...pre, isShow: false }));
      } else if (e?.key === "all") {
        fetchMenuList(1, pagination.size);
        setPagination((pre) => ({ ...pre, isShow: true }));
      } else{
        setPagination((pre) => ({ ...pre,page:1 ,isShow: false }));
        fetchDataByCate(e?.key);
      } 
    };
  
    const columnsOrder = [
      {
        title: "Tên món",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (text, record) => <span>{(text).toLocaleString()}đ</span>,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        responsive: ["sm"],
      },
      {
        title: "Tổng tiền",
        dataIndex: "quantity",
        key: "quantity",
        render: (text, record) => <span>{(record.price * record.quantity).toLocaleString()}đ</span>,
      },
      {
        title: "Ghi chú (Nếu có)",
        dataIndex: "note",
        key: "note",
        responsive: ["md"],
        render: (_, record) => (
          <Input
            placeholder="Ghi chú"
            onChange={(e) => {
              setOrder((preOrder) => {
                console.log(record);
                const index = preOrder.findIndex((i) => i.id === record.id);
                if (index === -1) {
                  return [...preOrder];
                }
                preOrder[index].note = e.target.value;
                return [...preOrder];
              });
            }}
          />
        ),
      },
    ];
    const columnsOrderOld = [
        {
          title: "Tên món ",
          dataIndex: "name",
          key: "name",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "Giá",
          dataIndex: "price",
          key: "price",
          render: (text, record) => <span>{(text).toLocaleString()}đ</span>,
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
          key: "quantity",
          responsive: ["sm"],
        },
        {
          title: "Tổng tiền",
          dataIndex: "quantity",
          key: "quantity",
          render: (text, record) => <span>{(record.price * record.quantity).toLocaleString()}đ</span>,
        },
        {
          title: "Ghi chú (Nếu có)",
          dataIndex: "note",
          key: "note",
          responsive: ["sm"],
          render: (_, record) => (
            <Input
              placeholder="Ghi chú"
              value={record?.note}
              disabled
            />
          ),
        },
      ];
    const handleOrder = async () => {
      if (order?.length === 0 || !order) {
        message.error("Vui lòng chọn món");
        
        return;
      }
      if (!tableSlug) {
        message.error("Vui lòng chọn bàn");
        return;
      }
      setLoading(true);
      try {
        const res = await createOrder(
          tableSlug,
          order?.map((item) => ({
            _id: item.id,
            quantity: item.quantity,
            note: item.note,
          }))
        );
        if (res?.data?.length > 0) {
          res.data?.map((item) => window.open(item, "_blank"));
        }
        // window.location.reload();
        message.success("Đặt món thành công");
        setOrder([])
        setSumMoney((order?.reduce((a, b) => a + b.price * b.quantity, 0) +sumMoney))
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
        message.error("Đặt món thất bại");
      }
      setLoading(false);
    };
    const handleSum =(dataPrice) => {

        const sum = dataPrice.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price* currentValue.quantity;
          }, 0);
          return sum
    }
    const onShowSizeChange = (current, pageSize) => {
      fetchMenuList(current, pageSize);
      setPagination((pre) => ({ ...pre, page: current, size: pageSize }));
    };
    return (
    <>
    <div className="mt-24">
        <Header />
      </div>
    {tableSlugId ?  
      <>

        <Spin spinning={loading}>
          
          <Modal
            title="Xác nhận đặt món"
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            width={900}
            footer={[
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                type="text"
              >
                Hủy
              </Button>,
              <Button type="primary" onClick={handleOrder} loading={loading}>
                Đặt món 
              </Button>,
            ]}
          >
            <div className="py-3">
              <Table
                columns={columnsOrder}
                dataSource={order}
                pagination={false}
              />
            </div>
          </Modal>
  
          <Modal
            title=<span className="text-2xl">{isModalOpenDetail?.name}</span>
            open={isModalOpenDetail ? true : false}
            onCancel={() => {
              setIsModalOpenDetail(0);
            }}
            width={900}
            footer={[
              <Button
                onClick={() => {
                  setIsModalOpenDetail(0);
                }}
                type="text"
              >
                Hủy
              </Button>,
            ]}
          >
            <div>
              <div className="flex gap-3 items-center">
                <img
                  className="h-[130px] aspect-video object-cover"
                  alt="logo"
                  src={isModalOpenDetail?.image}
                />
                <div className="flex flex-col gap-3">
                  <span className="text-lg">
                    Mô tả: <strong>{isModalOpenDetail?.description}</strong>
                  </span>
                  <span className="text-lg">
                    Giá:{" "}
                    <strong>
                      {isModalOpenDetail?.price?.toLocaleString("vi-en")} VNĐ
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </Modal>
  
          <div className="flex max-md:flex max-md:flex-col">
            <Menu
              onClick={onClick}
              className="w-48 h-full max-md:hidden fixed top-24"
              style={{
                backgroundColor:'#E4E4D0',
                
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="vertical"
              items={listDataCate}
            />
            <Menu
              onClick={onClick}
              className="md:hidden max-md:flex max-md:flex-wrap "
              style={{
                backgroundColor:'#E4E4D0',
               
                
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              
              mode="horizontal"
              items={listDataCate}
            />
            <div  className="w-full bg-[#d4e3d3] flex"
              style={{ minHeight: "100vh" }}>
              <Tag className="fixed right-0 sm:hidden " color="volcano">{tagShow}</Tag>
              
              <div  className="h-full lg: px-4 max-sm:p-2 bg-[#d4e3d3]  md:ml-48 flex-1">
                <div className="flex justify-between items-end gap-3 py-3 ">
                  <div className="flex flex-col w-20 gap-2">
                    <span className="font">Tên bàn </span>
                    <Input value={nameTable || nameTableCheck}disabled/>
                  </div>
                  <div>
                    <Search
                      placeholder="Tìm kiếm ..."
                      allowClear
                      onChange={onSearch}
                      style={{ width: 250 }}
                    />
                  </div>
                  
                </div>
                <div>
                {!loading && pagination.isShow && (
                  <Pagination
                    defaultCurrent={pagination.page}
                    total={Number(pagination.total) || 0}
                    onChange={onShowSizeChange}
                  />
                )}
              </div>
              <div className="flex flex-wrap  gap-6 justify-center">                {getListMenu?.length > 0 &&
                    getListMenu?.map((item) => (
                      <div
                      key={item._id}
                      className="flex-1 min-w-[340px] lg:grow-0 shrink content-start"
                      >
                        <div  className="flex gap-3 flex-wrap bgr-food bg-white max-[460px]::justify-center">
                          <div
                            className=" cursor-pointer"
                            onClick={() => {
                              setIsModalOpenDetail(item);
                            }}
                          >
                            <img
                            className="w-32 h-32 aspect-video object-cover"
                            alt="logo"
                            src={item.image}
                          />
                          </div>
                          <div className="flex flex-col gap-3">
                          <span className="max-w-40 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item?.name}
                          </span>
                          <p className="flex gap-2">
                              <span>Giá:</span>
                              <span className="flex flex-col">
                                <span
                                  className={`font-semibold ${
                                    !!item?.discount_price && "line-through"
                                  }`}
                                >
                                  {item?.price.toLocaleString()} Đ
                                </span>
                                <span className="font-semibold text-red-500">
                                  {item?.discount_price &&
                                    `${item?.discount_price.toLocaleString()} Đ`}
                                </span>
                              </span>
                            </p>
                            <p className="flex items-center">
                            
                            <Rate allowHalf value={item?.rating_average || 0} />
                            <span>{`(${item?.rating_count || 0})`}</span>
                          </p>
                            <p className="flex items-center gap-3">
                              <button
                                className="bg-[#263A29] text-[#fff] w-5 h-5 flex items-center justify-center"
                                onClick={() => {
                                  setOrder((preOrder) => {
                                    const index = preOrder.findIndex(
                                      (i) => i.id === item._id
                                    );
                                    if (index === -1) {
                                      return [
                                        ...preOrder,
                                        {
                                          key: item._id,
                                          id: item._id,
                                          quantity: 1,
                                          price: item.price,
                                          name: item.name,
                                        },
                                      ];
                                    }
                                    if (preOrder[index].quantity === 0) {
                                      message.error("Số lượng không hợp lệ");
                                      preOrder[index].quantity = 0;
                                    } else {
                                      preOrder[index].quantity -= 1;
                                    }
                                    return [...preOrder];
                                  });
                                }}
                              >
                                -
                              </button>
                              <span style={{ padding: "0px 8px" }}>
                                {order?.find((i) => i.id === item._id)?.quantity ||
                                  0}
                              </span>
                              <button
                                className="bg-[#263A29] text-[#fff] w-5 h-5 flex items-center justify-center"
                                onClick={() => {
                                  setOrder((preOrder) => {
                                    const index = preOrder.findIndex(
                                      (i) => i.id === item._id
                                    );
                                    if (index === -1) {
                                      return [
                                        ...preOrder,
                                        {
                                          key: item._id,
                                          id: item._id,
                                          quantity: 1,
                                          price: item.price,
                                          name: item.name,
                                        },
                                      ];
                                    }
                                    preOrder[index].quantity += 1;
                                    return [...preOrder];
                                  });
                                }}
                              >
                                +
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="fixed right-[50px] bottom-0 min-w-[300px] flex items-center flex-col justify-center bg-[#e4e4d0] h-[150px] gap-5">
                  <span className="font-medium text-xl">
                    Tổng tiền :{" "}
                    {order?.length > 0
                      ? (order
                          ?.reduce((a, b) => a + b.price * b.quantity, 0)+sumMoney)
                          .toLocaleString()
                      : (0 + sumMoney).toLocaleString()}
                      {/* {(order?.reduce((a, b) => a + b.price * b.quantity, 0) +sumMoney)
                          .toLocaleString()} */}
                    đ
                  </span>
                  <div className="grid gap-4 grid-cols-2">
                      <Button onClick={()=> handleOpenListOrderDetail()}  
                      className="h-[40px] w-[140px] bg-white">
                          Xem lại danh sách
                      </Button>
                  <Button
                    type="primary"
                    className="h-[40px] w-[140px]"
                    onClick={() => {
                      setOrder(order?.filter((item) => item.quantity > 0));
                      if (order?.length === 0 || !order) {
                        message.error("Vui lòng chọn món");
                        return;
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    Đặt món
                  </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
        <div className="modal">
        <Modal
          className="modalCustom max-lg:w-64"
          styles={{body:{height:"500px",overflowY:"auto",}}}
          title={`${
            orderDetail?.table ? `Mã bàn ${orderDetail?.table}` : "Bàn trống"
          } `}
         open={isModalCloseTable}
    
          onOk={() => {
            setIsModalCloseTable(false);
          }}
          onCancel={() => {
            setIsModalCloseTable(false);
          }}
          footer={[
            <Button
              htmlType="submit"
              type="primary"
              // loading={loading}
              style={{display:`${orderDetail?.order_detail?.length> 0 ? '' :'none'}`}}
              form="form"
              name="form"
              onClick={onFinish}
            >
              Thanh toán
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >{
          loadingDetail ?
          <div>
            <Spin/>
          </div>
        :

       
          <Form layout="vertical" form={form} name="form">
            {orderDetail?.order_detail?.length ? (
            orderDetail?.order_detail?.map(item => (
              item?.menu?.length > 0 &&
              <div className="ant_body" style={{margin:'0px 10px'}}>
                <div className="flex flex-col gap-1">
                  <span>
                    Thời gian đặt:{"  "}
                    <span className="font-semibold">
                      {dayjs(item.time).format("DD-MM-YYYY")}
                    </span>
                  </span>

                  <span>
                    Người đặt:{" "}
                    <span className="font-semibold">
                      {item?.order_person?.name}
                    </span>
                  </span>
                </div>
                <p className="py-2 font-semibold">Danh sách món</p>
                <Table
                  columns={columnsOrderOld}
                  pagination={false}
                  dataSource={
                   
                    item?.menu?.length > 0 &&
                    item.menu.map((item, index) => {
                      return { ...item, key: index };
                    })
                  }
                  
                />
                <p className="justify-end flex gap-2 mt-3">
                  <span>Giá:</span>
                  <span className="font-semibold text-green-700">
                    {handleSum([...item?.menu])?.toLocaleString("vi-VN", {})} VNĐ
                  </span>
                </p>
              </div>
            ))
            ) : (
              <div>
                <p>Bàn trống</p>
                <p>Vui lòng đặt món để được phục vụ nhanh nhất!</p>
              </div>
            )}
            {
           orderDetail?.order_detail?.length>0 &&
            <Row>
              <Col span={24}>
                <Form.Item label="Loại thanh toán" name="payment_method">
                  <Select
                    name="payment_method"
                    placeholder="Chọn loại thanh toán"
                    // onChange={onGenderChange}
                    allowClear
                  >
                    {/* <Select.Option key={1} value={"Tiền mặt"}>
                      Tiền mặt
                    </Select.Option> */}
                    <Select.Option key={2} value={"Bank"}>
                      Chuyển khoản
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Ghi chú" name="note">
                  <Input placeholder="Nhập note (Nếu có)" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Khuyến mãi" name="promotion">
                  <Select
                    style={{ width: 220 }}
                    onChange={async (value) => {
                      if (!value) message.error("Vui lòng chọn khuyến mãi");
                      try {
                        const res = await applyPromotion({
                          promotionId: value,
                          tableId: orderDetail?.table,
                        });
                        if (res.status === "success") {
                          message.success(res.message);
                          fetchDataOrderDetail(tableSlug);
                          fetchBill(tableSlug)
                        }
                      } catch (error) {
                        console.log(error);
                        message.error("Áp dụng khuyến mãi thất bại");
                      }
                    }}
                    showSearch
                    placeholder="Chọn khuyến mãi"
                    // options={optionPromotion}
                    options={optionPromotion||[]}
                    
                  />
                </Form.Item>
              </Col>
            </Row>
            }
      {
        orderDetail?.order_detail?.length > 0 &&
        <>
        
            <p className="justify-end flex gap-2 mb-3">
              <span>Số tiền được giảm giá:</span>
              <span className="font-semibold text-red-700">
                {orderDetail?.discount?.toLocaleString("vi-VN", {}) || 0} VNĐ
              </span>
            </p>
            <p className="justify-end flex gap-2 mb-3">
              <span>Số tiền phải thanh toán:</span>
              <span className="font-semibold text-green-700">
                {/* {orderDetail?.total?.toLocaleString("vi-VN", {}) ||
                  orderDetail?.subtotal?.toLocaleString("vi-VN", {})} */}
                  {orderDetail?.subtotal?.toLocaleString("vi-VN", {})}
                VNĐ
              </span>
            </p>
        </>
      }
          </Form>
           }
        </Modal>
      </div>

      </>
      : <Spin/>  
    }
        </>
    );
  };
  export default OrderAtRestaurant;
  