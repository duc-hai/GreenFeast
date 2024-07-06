import { Button, Input, Modal, Select, Spin, Table, message } from "antd";
import { Menu } from "antd";
import "./index.css";
import { useEffect, useState } from "react";
import {
  createOrderOnline,
  fetchMenuOrder,
  getCategoryOrder,
  getMenuByCategory,
  getMenuBySearch,
} from "../../Services/OrderAPI";
import { getAllArea } from "../../Services/ManagementServiceAPI";
import Header from "../../components/Header";
import Search from "antd/es/transfer/search";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const OrderOnline = () => {
  const [us, setUs] = useState({});
  const user = sessionStorage.getItem("user");
  const [getArea, setGetArea] = useState([]);
  const [listDataCate, setListDataCate] = useState([]);
  const [getListMenu, setListMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(0);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [delivery, setDelivery] = useState({});
  const [note, setNote] = useState("");
  const [payment_method, setPayment_method] = useState("bank");
  const onSearch = (e) => {
    setTextSearch(e.target.value);
  };
  const handleChange = (value) => {
    setPayment_method(value);
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
    const fetchArea = async () => {
      try {
        const res = await getAllArea();
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
    fetchArea();
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

  const handleOrder = async () => {
    if (order?.length === 0 || !order) {
      message.error("Vui lòng chọn món");
      return;
    }
    if (!delivery.name || !delivery.phone_number || !delivery.address) {
      message.error("Vui lòng nhập thông tin giao hàng");
      return;
    }
    setLoading(true);
    try {
      const res = await createOrderOnline({
        menu: order?.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          note: item.note,
        })),
        note: note,
        payment_method: payment_method,
        delivery: delivery,
        time_receive: null,
      });
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

  return (
    <>
      <Header />
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
          <div className="">
            <span className="font-semibold text-base">Thông tin giao hàng</span>
            <div className="grid gap-x-6 gap-y-3 grid-cols-2 mt-3">
              <div className="flex flex-col gap-1">
                <span>Họ và tên:</span>
                <input
                  placeholder="Nhập họ và tên"
                  className="border none outline-none px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    setDelivery({ ...delivery, name: e.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span>Số điện thoại:</span>
                <input
                  placeholder="Nhập số điện thoại"
                  className="border none outline-none px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    setDelivery({ ...delivery, phone_number: e.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span>Địa chỉ nhận hàng:</span>
                <input
                  placeholder="Nhập địa chỉ nhận hàng"
                  className="border none outline-none px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    setDelivery({ ...delivery, address: e.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span>Ghi chú:</span>
                <input
                  placeholder="Nhập Ghi chú"
                  className="border none outline-none px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span>Loại thanh toán:</span>
                <Select
                  defaultValue="bank"
                  style={{ width: 320 }}
                  onChange={handleChange}
                  options={[
                    { value: "bank", label: "Thanh toán online" },
                    { value: "cod", label: "Thanh toán khi nhận hàng" },
                  ]}
                />
              </div>
            </div>
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
              <div></div>
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
                Tổng tiền:{" "}
                {order?.length > 0
                  ? order
                      ?.reduce((a, b) => a + b.price * b.quantity, 0)
                      .toLocaleString()
                  : 0}
                đ
              </span>
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
      </Spin>
    </>
  );
};
export default OrderOnline;
