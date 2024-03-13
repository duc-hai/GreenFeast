import {
  Button,
  Dropdown,
  Input,
  Modal,
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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createOrder,
  fetchMenuOrder,
  fetchTableCategory,
  getMenuByCategory,
} from "./../../Services/OrderAPI";
import {
  getAllArea,
  getCategory,
  getTable,
} from "../../Services/ManagementServiceAPI";
import Header from "../../components/Header";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const Order = () => {
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
  const [loading, setLoading] = useState(false);

  const fetchTable = async (id) => {
    try {
      const res = await fetchTableCategory(id);
      setTableList(
        res.data?.map((item) => {
          return {
            key: item.slug,
            label: item._id,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (area) {
      fetchTable(area);
    }
  }, [area]);
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
      const res = await getCategory();
      setListDataCate(
        res.data?.length > 0 &&
          res.data?.map((item) => getItem(item?.name, item?.id))
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchMenu();
  }, []);

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

  console.log(order);
  const handleOrder = async () => {
    if (order?.length === 0 || !order) {
      message.error("Vui lòng chọn món");
      return;
    }
    if (!tableSlug) {
      message.error("Vui lòng chọn bàn");
      return;
    }

    try {
      await createOrder(
        tableSlug,
        order?.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          note: item.note,
        }))
      );
      message.success("Đặt món thành công");
    } catch (error) {
      console.log(error);
      message.error("Đặt món thất bại");
    }
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
            <Button type="primary" onClick={handleOrder}>
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
            <div className="flex w-full justify-between py-3">
              <div className="flex flex-col w-[48%] gap-2">
                <span className="font">Chọn tầng</span>
                <Select
                  name="gender"
                  placeholder="Chọn tầng"
                  allowClear
                  onChange={(value) => {
                    setArea(value);
                  }}
                >
                  {getArea?.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col w-[48%] gap-2">
                <span className="font">Chọn bàn</span>
                <Select
                  disabled={tableList?.length === 0}
                  name="gender"
                  placeholder="Chọn bàn"
                  allowClear
                  onChange={(value) => {
                    setTableSlug(value);
                  }}
                >
                  {tableList?.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="row">
              {getListMenu?.length > 0 &&
                getListMenu?.map((item) => (
                  <div
                    className="col-md-4 col-sm-12"
                    style={{ padding: 8 }}
                    key={item._id}
                  >
                    <div className="row bgr-food ">
                      <div className="col-md-6 col-sm-12">
                        <img
                          className="h-[130px] aspect-video object-cover"
                          alt="logo"
                          src={item.image}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>{item?.name}</p>
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
export default Order;
