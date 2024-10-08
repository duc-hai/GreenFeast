import {
  Button,
  Input,
  Modal,
  Pagination,
  Rate,
  Select,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { Menu } from "antd";
import "./index.css";
import { useEffect, useState } from "react";
import {
  createOrderOnline,
  fetchMenuOrder,
  getCategoryOrder,
  getMenuByCategory,
  getMenuBySearch,
  getMenuList,
  getMenuRecommend,
  getPromotion,
  postPayment,
} from "../../Services/OrderAPI";
import { getAllArea } from "../../Services/ManagementServiceAPI";
import Header from "../../components/Header";
import Search from "antd/es/transfer/search";
import {
  getListDistrict,
  getListProvince,
  getListWard,
  postShipFee,
} from "../../Services/AddressApi";
import RatingMenu from "./RatingMenu";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
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
  const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const [us, setUs] = useState(JSON.parse(sessionStorage.getItem("user")));
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
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsWard, setOptionsWard] = useState([]);
  const [shipFee, setShipFee] = useState(0);
  const [dataWard, setDataWard] = useState([]);
  const [listPromotion, setListPromotion] = useState([]);

  const [promotionId, setPromotionID] = useState(null);

  const [isRating, setIsRating] = useState({ data: null, isOpen: false });
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    isShow: false,
  });
  const [tagShow, setTagShow] = useState("Khai vị");
  const [tab, setTab] = useState(1);
  const convertOption = (dataOption, keyValue, keyLabel) => {
    let valueOptions = [...dataOption]?.map((item) => ({
      value: Number(item[keyValue]),
      label: item[keyLabel],
    }));
    return valueOptions;
  };
  const onSearch = (e) => {
    setTextSearch(e.target.value);
  };
  const handleChange = (value) => {
    console.log(value);
    setPayment_method(value);
  };

  const handleChangeProvince = (option) => {
    setDelivery((pre) => ({
      ...pre,
      province: option,
      district: "",
      ward: "",
    }));
    setOptionsWard([]);
  };
  const handleChangWard = (option) => {
    let tempTude = [...dataWard].find(
      (item) => Number(item?.id) === Number(option?.value)
    );

    setDelivery((pre) => ({
      ...pre,
      ward: option,
      latitude: tempTude.latitude,
      longitude: tempTude.longitude,
    }));
  };
  // api thanh toan
  const fetchPayment = async (data) => {
    localStorage.setItem("dataBody", JSON.stringify(data));
    try {
      const res = await postPayment(data);
      console.log(res);
      localStorage.setItem("res", JSON.stringify(res));
      if (res?.status === "success" && !!res?.data?.vnpUrl) {
        message.success("Chuyển hướng đến trang thanh toán");
        // navigate("/payment/vnpay_return");
        window.open(res?.data?.vnpUrl, "_self");

        console.log(data);
        // localStorage.setItem("rating", JSON.stringify(isRating));
        // setIsRating((pre) => ({ ...pre, isOpen: true }));
        //rating
        // window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  //get promotion
  const convertOptionPromotion = (data) => {
    let tempOptions = data?.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return tempOptions;
  };
  const fetchPromotion = async () => {
    try {
      const res = await getPromotion();

      // let tempOption = res?.data?.map((item) => ({
      //   value: item._id,
      //   label: item.name,
      // }));
      setListPromotion(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  // get address

  const fetchDataProvince = async () => {
    try {
      const res = await getListProvince();
      let tempOptions = convertOption(res?.data, "id", "name");
      setOptionsProvince(tempOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataDistrict = async (id) => {
    try {
      const res = await getListDistrict(id);
      let tempOptions = convertOption(res?.data, "id", "name");

      setOptionsDistrict(tempOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataWard = async (id) => {
    try {
      const res = await getListWard(id);
      setDataWard(res?.data);
      let tempOptions = convertOption(res?.data, "id", "name");

      setOptionsWard(tempOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShipFee = async (data) => {
    try {
      const res = await postShipFee({
        longitude: data?.longitude,
        latitude: data?.latitude,
      });
      if (res?.data?.shippingFee) {
        setShipFee(res?.data?.shippingFee);
      } else {
        message.error(res?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  ////////
  useEffect(() => {
    fetchDataDistrict(79);
  }, []);

  useEffect(() => {
    if (!!delivery?.district?.value) {
      fetchDataWard(delivery?.district?.value);
    }
  }, [delivery?.district?.value]);

  useEffect(() => {
    if (!!delivery?.ward?.value) {
      fetchShipFee(delivery);
    }
  }, [delivery?.ward?.value]);

  ///////////////////
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
    Promise.all([fetchArea(), fetchDataProvince(), fetchPromotion()]);
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

  const convertPercentToNumber = (percentageString) => {
    let numberValue = parseFloat(percentageString.replace("%", ""));
    if (numberValue < 0) return numberValue * -1;
    return numberValue;
  };
  const handleMoneyOrder = (dataOrder) => {
    let value = 0;
    if (dataOrder?.length > 0) {
      value = dataOrder?.reduce((a, b) => a + b.price * b.quantity, 0);
    }

    return value;
  };

  const handlePromotion = (dataOrder) => {
    let value = handleMoneyOrder(dataOrder);
    let disCountValue = 0;
    let discountPercent = 0;
    if (payment_method === "bank") {
      discountPercent = discountPercent + 5;
    }
    if (promotionId) {
      let tempDiscount = listPromotion.find((item) => item._id === promotionId);

      if (tempDiscount) {
        discountPercent =
          convertPercentToNumber(tempDiscount?.promotion_value) +
          discountPercent;
      }
    }
    disCountValue = value * (discountPercent / 100);

    return disCountValue;
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
    setTagShow(
      listDataCate.find(
        (item) => item?.key === e?.key || item?.key === Number(e?.key)
      )?.label
    );
    if (e?.key === "recommend") {
      //call api recommend
      fetchMenuReCommend();
    } else if (e?.key === "all") {
      fetchMenuList(1, pagination.size);
      setPagination((pre) => ({ ...pre, isShow: true }));
    } else {
      setPagination((pre) => ({ ...pre, page: 1, isShow: false }));
      fetchDataByCate(e?.key);
    }
  };

  const columnsOrder = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex flex-col justify-center items-center gap-1">
          <a>{text}</a>
          <Input
            className="sm:hidden"
            placeholder="Ghi chú"
            value={order.find((item) => item.id === record.id)?.note || ""}
            onChange={(e) => {
              setOrder((preOrder) => {
                const index = preOrder.findIndex((i) => i.id === record.id);
                if (index === -1) {
                  return [...preOrder];
                }
                preOrder[index].note = e.target.value;
                return [...preOrder];
              });
            }}
          />
        </div>
      ),
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
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      responsive: ["sm"],
      render: (_, record) => (
        <Input
          placeholder="Ghi chú"
          value={order.find((item) => item.id === record.id)?.note || ""}
          onChange={(e) => {
            setOrder((preOrder) => {
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
    if (
      !delivery.name ||
      !delivery.phone_number ||
      !delivery?.address ||
      !delivery?.district ||
      !delivery?.ward
    ) {
      message.error("Vui lòng nhập thông tin giao hàng");
      return;
    }
    setLoading(true);
    try {
      let tempDelivery = {
        ...delivery,
        province: "Thành phố Hồ Chí Minh",
        district: delivery?.district?.label,
        ward: delivery?.ward?.label,
      };
      const res = await createOrderOnline({
        menu: order?.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          note: item.note,
        })),
        note: note,
        payment_method: payment_method,
        promotion_id: promotionId,
        delivery: tempDelivery,
        time_receive: null,
      });
      let dataBody = { orderId: res?.orderId, amount: res?.total };
      if (payment_method === "bank") {
        localStorage.setItem(
          "rating",
          JSON.stringify({
            orderId: res?.orderId,
            order: order?.map((item) => ({
              menuId: item.id,
              comment: "",
              rating: 0,
            })),
          })
        );
        setIsRating((pre) => ({
          ...pre,
          data: {
            orderId: res?.orderId,
            order: order?.map((item) => ({
              menuId: item.id,
              comment: "",
              rating: 0,
            })),
          },
        }));
        await fetchPayment(dataBody);
      }
      // if (res?.data?.length > 0) {
      //   res?.data?.map((item) => window.open(item, "_blank"));
      // }
      if (res?.status === "error") message.error(res.message);
      else {
        setOrder([]);
        message.success("Đặt món thành công");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      message.error("Đặt món thất bại");
    }
    setLoading(false);
  };
  const onShowSizeChange = (current, pageSize) => {
    fetchMenuList(current, pageSize);
    setPagination((pre) => ({ ...pre, page: current, size: pageSize }));
  };

  const handleNextTab = () => {
    setTab((pre) => Number(pre) + 1);
  };
  const handleBack = () => {
    setTab((pre) => pre - 1);
  };

  const handleCheckPromotion = (id) => {
    // khuyen maix
    const sumTemp = shipFee + handleMoneyOrder(order);
    const promotionItem = listPromotion.find((item) => item._id === id);
    if (promotionItem && promotionItem?.condition_apply < sumTemp) {
      message.success("Áp dụng mã khuyến mãi thành công");
      setPromotionID(id);
    } else {
      message.error("Bạn chưa đủ điều kiện áp dụng mã khuyến mãi này");
    }
  };
  return (
    <ProtectedRoute isAuth={us?._id}>
      <>
        <div className="mt-24">
          <Header />
        </div>
        {isRating?.isOpen && (
          <RatingMenu data={isRating.data} isOpen={isRating.isOpen} />
        )}
        <Spin spinning={loading}>
          <Modal
            title="Xác nhận đặt món"
            // className="modalCustom max-lg:w-64"
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            footer={[
              <div className="flex justify-between items-center">
                <Button type="text" onClick={handleBack} disabled={tab === 1}>
                  Quay lại
                </Button>
                {tab === 3 ? (
                  <div className="flex gap-1">
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                      type="text"
                    >
                      Hủy
                    </Button>
                    ,
                    <Button
                      type="primary"
                      onClick={handleOrder}
                      loading={loading}
                    >
                      Đặt món
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={handleNextTab}>
                    Tiếp
                  </Button>
                )}
              </div>,
            ]}
          >
            {tab === 1 && (
              <div className="py-3">
                <Table
                  columns={columnsOrder}
                  dataSource={order}
                  pagination={false}
                />
              </div>
            )}
            <div className="">
              {tab === 2 && (
                <div>
                  <span className="font-semibold text-base">
                    Thông tin giao hàng
                  </span>
                  <div className="flex flex-col gap-1">
                    <span>Họ và tên:</span>
                    <input
                      placeholder="Nhập họ và tên"
                      className="border none outline-none px-2 py-1 rounded-lg "
                      onChange={(e) => {
                        setDelivery({ ...delivery, name: e.target.value });
                      }}
                      value={delivery?.name || ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>Số điện thoại:</span>
                    <input
                      placeholder="Nhập số điện thoại"
                      className="border none outline-none px-2 py-1 rounded-lg"
                      onChange={(e) => {
                        setDelivery({
                          ...delivery,
                          phone_number: e.target.value,
                        });
                      }}
                      value={delivery?.phone_number || ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>Địa chỉ nhận hàng:</span>
                    <div className="flex gap-2 flex-col">
                      <Select
                        placeholder="Chọn huyện"
                        options={optionsDistrict}
                        value={delivery?.district?.value || null}
                        showSearch
                        onChange={(e, option) =>
                          setDelivery((pre) => ({
                            ...pre,
                            district: option,
                            ward: "",
                          }))
                        }
                      />
                      <Select
                        placeholder="Chọn xã"
                        options={optionsWard}
                        value={delivery?.ward?.value || null}
                        showSearch
                        onChange={(e, option) => handleChangWard(option)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <input
                        onChange={(e) =>
                          setDelivery((pre) => ({
                            ...pre,
                            address: e.target.value,
                          }))
                        }
                        value={delivery?.address || ""}
                        placeholder="Nhập địa chỉ chi tiết"
                        className="border none outline-none px-2 py-1 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
              {tab === 3 && (
                <div className="md:grid md:gap-6">
                  <div className="grid grid-col-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <span>Ghi chú:</span>
                      <input
                        placeholder="Nhập Ghi chú"
                        className="border none outline-none px-2 py-1 rounded-lg"
                        value={note}
                        onChange={(e) => {
                          setNote(e.target.value);
                        }}
                      />
                    </div>
                    <p className="grid grid-cols-2 gap-1">
                      <span>Hóa đơn tạm tính:</span>
                      <span className="font-semibold">
                        {handleMoneyOrder(order).toLocaleString()} VNĐ
                      </span>
                    </p>
                    <p className="grid grid-cols-2 gap-1">
                      <span>Phí ship :</span>
                      <span className="font-semibold">
                        {shipFee.toLocaleString()} VNĐ
                      </span>{" "}
                    </p>
                    <p className="grid grid-cols-2 gap-1">
                      <span>Khuyến mãi :</span>
                      <span className="font-semibold">
                        {handlePromotion(order).toLocaleString()} VNĐ
                      </span>{" "}
                    </p>
                    <p className="grid grid-cols-2 gap-1">
                      <span>Tổng tiền:</span>
                      <span className="font-semibold text-red-600">
                        {(
                          shipFee +
                          handleMoneyOrder(order) -
                          handlePromotion(order)
                        ).toLocaleString()}{" "}
                        VNĐ
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="grid grid-cols-1 gap-1  w-full">
                      <span>Loại thanh toán:</span>
                      <Select
                        defaultValue="bank"
                        onChange={handleChange}
                        options={[
                          {
                            value: "bank",
                            label: "Thanh toán online trực tuyến",
                          },
                          { value: "cod", label: "Thanh toán khi nhận hàng" },
                        ]}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-1  w-full">
                      <span>Khuyến mãi</span>
                      <Select
                        options={convertOptionPromotion(listPromotion) || []}
                        onChange={(e) => handleCheckPromotion(e)}
                        value={promotionId}
                      />
                    </div>
                  </div>
                </div>
              )}
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
              <div className="flex gap-3 items-center justify-between">
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

          <div className="flex max-sm:flex max-sm:flex-col bg-[#d4e3d3] h-full   ">
            <Menu
              onClick={onClick}
              className="min-w-48 max-md:hidden fixed top-24 overflow-auto   "
              style={{
                backgroundColor: "#E4E4D0",
                height: "calc(100vh - 100px)",
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="vertical"
              items={listDataCate}
            />
            <Menu
              onClick={onClick}
              className="sm:hidden max-sm:flex max-sm:flex-wrap "
              style={{
                backgroundColor: "#E4E4D0",
              }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="horizontal"
              items={listDataCate}
            />
            <div
              className="w-full bg-[#d4e3d3] flex"
              style={{ minHeight: "100vh" }}
            >
              <Tag className="fixed right-0 sm:hidden " color="volcano">
                {tagShow}
              </Tag>
              <div className="lg: px-4 max-sm:p-2 bg-[#d4e3d3]  md:ml-48 flex-1 ">
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
                <div>
                  {!loading && pagination.isShow && (
                    <Pagination
                      defaultCurrent={pagination.page}
                      total={Number(pagination.total) || 0}
                      onChange={onShowSizeChange}
                    />
                  )}
                </div>

                <div className="flex flex-wrap  gap-6 justify-center ">
                  {getListMenu?.length > 0 &&
                    getListMenu?.map((item) => (
                      <div
                        key={item._id}
                        className="flex-1 min-w-[340px] xl:grow-0 shrink "
                      >
                        <div className="flex gap-3 flex-wrap bgr-food bg-white max-[460px]::justify-center rounded-lg">
                          <div
                            className=" cursor-pointer "
                            onClick={() => {
                              setIsModalOpenDetail(item);
                            }}
                          >
                            <img
                              className="w-32 h-32 aspect-video object-cover rounded-lg"
                              alt="logo"
                              src={item.image}
                            />
                          </div>
                          <div className="flex flex-col gap-3 justify-between">
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
                                  {item?.price.toLocaleString()} VNĐ
                                </span>
                                <span className="font-semibold text-red-500">
                                  {item?.discount_price &&
                                    `${item?.discount_price.toLocaleString()} VNĐ`}
                                </span>
                              </span>
                            </p>

                            <p className="flex items-center">
                              <Rate
                                allowHalf
                                value={item?.rating_average || 0}
                              />
                              <span>{`(${item?.rating_count || 0})`}</span>
                            </p>

                            <p className="flex items-center gap-3 justify-center">
                              <button
                                className="bg-[#263A29] text-[#fff] w-6 h-6 flex items-center justify-center rounded-md"
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
                                          price:
                                            item?.discount_price || item.price,
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
                                {order?.find((i) => i.id === item._id)
                                  ?.quantity || 0}
                              </span>
                              <button
                                className="bg-[#263A29] text-[#fff] w-6 h-6 flex items-center justify-center rounded-md"
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
                                          price:
                                            item?.discount_price || item.price,
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
                <Draggable cancel=".no-drag">
                  <div className="fixed right-[50px] bottom-0 min-w-[300px] flex items-center flex-col justify-center bg-[#e4e4d0] h-[150px] gap-5 rounded-lg">
                    <span className="font-medium text-m">
                      Hóa đơn tạm tính:{" "}
                      {order?.length > 0
                        ? order
                            ?.reduce((a, b) => a + b.price * b.quantity, 0)
                            .toLocaleString()
                        : 0}
                      VNĐ
                    </span>
                    <Button
                      type="primary"
                      className="no-drag h-[40px] w-[140px]"
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
                </Draggable>
              </div>
            </div>
          </div>
          <div></div>
        </Spin>
      </>
    </ProtectedRoute>
  );
};
export default OrderOnline;
