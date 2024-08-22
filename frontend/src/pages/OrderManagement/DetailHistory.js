import { useState } from "react";
import { getOrderHistoryDetailAtRestaurant } from "../../Services/OrderAPI";
import { Button, Modal, Spin, Table } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const DetailHistory = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const fetchDetailHistory = async (idDetail) => {
    setLoading(true);
    try {
      const res = await getOrderHistoryDetailAtRestaurant(idDetail);
      console.log(res);
      setDataDetail(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
    fetchDetailHistory(id);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      align: "center",
      width: 50,
      responsive: ["sm"],
      render: (text, _, index) => <span>{index + 1}</span>,
    },
    {
      title: "Món ăn",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      width: 100,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      align: "center",
      width: 100,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 140,
      align: "center",
      responsive: ["sm"],
    },
  ];
  return (
    <>
      <span onClick={handleOpen}>
        <FileSearchOutlined />
      </span>
      <Modal
        open={isOpen}
        width={800}
        onCancel={handleClose}
        footer={[
          <Button onClick={handleClose} type="primary">
            Đóng
          </Button>,
        ]}
      >
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-column  gap-2 max-h-96 overflow-auto">
            <div>
              <p>
                <span className="font-semibold">Bàn : </span>
                <span>{dataDetail?.table}</span>
              </p>
              <p>
                <span className="font-semibold">Thời gian vào : </span>
                <span>
                  {dayjs(dataDetail?.checkin).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </p>
              <p>
                <span className="font-semibold">Thời gian vào : </span>
                <span>
                  {dayjs(dataDetail?.checkout).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </p>
            </div>
            <div className="flex flex-column  gap-2">
              {dataDetail?.order_detail?.map(
                (item) =>
                  item?.menu.length > 0 && (
                    <div>
                      <p className="font-semibold">
                        {item?.order_person?.name}
                      </p>
                      <div>
                        <p className="font-semibold">Chi tiết món ăn</p>
                        <Table
                          columns={columns}
                          dataSource={item?.menu}
                          pagination={false}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold ">Tổng tiền :</p>
                <p className="font-semibold">
                  {dataDetail?.subtotal.toLocaleString()} Đ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold ">Giảm giá :</p>
                <p className="font-semibold text-green-600">
                  {dataDetail?.discount?.toLocaleString()} Đ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold ">Số tiền phải thanh toán :</p>
                <p className="font-semibold text-red-600">
                  {(
                    dataDetail?.subtotal + dataDetail?.discount
                  )?.toLocaleString()}{" "}
                  Đ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold ">Phương thức thanh toán :</p>
                <p className="font-semibold ">{dataDetail?.payment_method}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DetailHistory;
