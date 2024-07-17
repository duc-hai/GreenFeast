import {
    Button,
    Col,
    Dropdown,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Table,
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
    printBill,
    viewDetailOrder,
  } from "./../../Services/OrderAPI";
  import {
    getAllArea,
    getCategory,
    getPromotion,
    getTable,
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
    const handleOpenListOrderDetail =() => {
      setIsModalCloseTable(true)
      fetchDataOrderDetail(tableSlugId)
    }
  const fetchDataOrderDetail = async (id) => {
    setLoadingDetail(true)
    try {
      const res = await viewDetailOrder(id);
      const resBill = await printBill(id);
      setExportBuill(resBill.data);
      setOrderDetail(res.data);
      setNameTable(res?.data?.table)
      setTableSlug(id)
    } catch (error) {
      console.log(error);
    }
    setLoadingDetail(false)
  };

  // thanh toan

  const onFinish = async () => {
    const values = form.getFieldsValue();

    try {
      if (values.payment_method === undefined) {
        message.error("Vui lòng chọn loại thanh toán");
        return;
      }
      await closeTable(tableSlug, values);
      await fetchData(area);
      message.success("Đóng bàn thành công");
    } catch (error) {
      console.log(error);
      message.error("Đóng bàn thất bại");
    }
    fetchData(area);
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

    const fetchTable = async (id) => {
      try {
        const res = await fetchTableCategory(id);
        setTableList(
          res.data?.map((item) => {
            return {
              key: item.slug,
              label: item._id,
              status: item.status,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchDataByKeywork = async (key) => {
      try {
        const res = await getMenuBySearch(key);
        setListMenu(res.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchDataByKeywork(textSearch);
    }, [textSearch]);
  
    useEffect(() => {
      if (area) {
        fetchTable(area);
      }
    }, [area]);
    useEffect(() => {
      const fetchArea = async () => {
        try {
          const res = await getAllArea();
          // const res = await getAllAreaOrder();
          setGetArea(
            res.data?.map((item) => {
              return {
                key: item.id,
                label: item.name,
              };
            })
          );
        } catch (error) {
          console.log(error);
        }
      };
      if(!!tableSlugId){
          Promise.all([
              fetchArea(),
              fetchPromotion(),
              fetchDataOrderDetail(tableSlugId)
          ])
      }
      else {
        window.location.replace('/')
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
        console.log(res);
        setListDataCate(
          res.data?.length > 0 &&
            res.data?.map((item) => getItem(item?.name, item?._id))
        );
      } catch (error) {
        console.log(error);
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
      console.log("click ", e);
      fetchDataByCate(e.key);
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
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Ghi chú (Nếu có)",
        dataIndex: "note",
        key: "note",
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
          title: "Tên món",
          dataIndex: "name",
          key: "name",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "Giá",
          dataIndex: "price",
          key: "price",
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
          key: "quantity",
        },
        {
          title: "Ghi chú (Nếu có)",
          dataIndex: "note",
          key: "note",
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
        window.location.reload();
        message.success("Đặt món thành công");
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
        message.error("Đặt món thất bại");
      }
      setLoading(false);
    };
    const handleSum =(dataPrice) => {

        const sum = dataPrice.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price;
          }, 0);
          return sum
    }
    return (
    <>
    <Header/>
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
  
          <div className="flex">
            <Menu
              onClick={onClick}
              className="ant-menu-custom display-menu-1"
              style={{
                width: 256,
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              items={listDataCate}
            />
  
            <div className="content bg-[#d4e3d3]">
              <div className="flex w-full justify-between items-end gap-3 py-3">
                
                <div className="flex flex-col w-20 gap-2">
                  <span className="font">Tên bàn </span>
                  <Input value={nameTable}disabled/>
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
              <div className="row">
                {getListMenu?.length > 0 &&
                  getListMenu?.map((item) => (
                    <div
                      className="col-md-4 col-sm-12 "
                      style={{ padding: 8 }}
                      key={item._id}
                    >
                      <div className="flex bgr-food bg-white">
                        <div
                          className="col-md-6 col-sm-12 cursor-pointer"
                          onClick={() => {
                            setIsModalOpenDetail(item);
                          }}
                        >
                          <img
                            className="h-[130px] aspect-video object-cover"
                            alt="logo"
                            src={item.image}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <span>{item?.name}</span>
                          <p>
                            Giá: <strong>{item?.price} Đ</strong>
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
                    ? order
                        ?.reduce((a, b) => a + b.price * b.quantity, 0)
                        .toLocaleString()
                    : 0}
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
        </Spin>
        <div className="modal">
        <Modal
    style={{minWidth:"650px"}}
          className="headerModal"
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
                  scroll={{ x: "max-content" }}
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
                    <Select.Option key={1} value={"Tiền mặt"}>
                      Tiền mặt
                    </Select.Option>
                    <Select.Option key={2} value={"Bank"}>
                      Bank
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
                        }
                      } catch (error) {
                        console.log(error);
                        message.error("Áp dụng khuyến mãi thất bại");
                      }
                    }}
                    showSearch
                    placeholder="Chọn khuyến mãi"
                    // options={optionPromotion}
                    options={
                      dataPromotion?.length > 0 &&
                      dataPromotion.map((item) => {
                        return {
                          value: item.id,
                          label: item.name,
                        };
                      })
                    }
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
                {orderDetail?.total?.toLocaleString("vi-VN", {}) ||
                  orderDetail?.subtotal?.toLocaleString("vi-VN", {})}{" "}
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
  