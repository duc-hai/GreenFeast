import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  InputNumber,
  Upload,
  message,
  Radio,
  Image,
  Popconfirm,
  Switch,
  Rate,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./index.css";
import {
  deleteMn,
  getCategory,
  getMenu,
  getMenuByKey,
  updateMenu,
} from "../../Services/ManagementServiceAPI";
import axios from "axios";
import Search from "antd/es/transfer/search";
import { getMenuList } from "../../Services/OrderAPI";
const TableManagement = () => {
  const [listCate, setListCate] = useState([]);
  const [image, setImage] = useState(null);
  const [getListMenu, setListMenu] = useState([]);
  const [ishowPagination, setIsShowPagination] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });
  const [totalElement, setTotalElement] = useState(0);
  const [isEdit, setIsEdit] = useState(0);
  const [textSearch, setTextSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSearch = (e) => {
    setTextSearch(e.target.value);
  };
  const fetchMenu = async (page, size) => {
    setLoading(true);
    try {
      const res = await getMenuList(page, size);
      setListMenu(res.data);
      setTotalElement(res?.paginationResult?.totalItems);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const fetchDataByKeywork = async (key) => {
    try {
      const res = await getMenuByKey(key);
      setListMenu(res.data);
      setIsShowPagination(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchDataByKeywork(textSearch);
  // }, [textSearch]);

  // useEffect(() => {
  //   if (textSearch === "") {
  //     fetchMenu();
  //   }
  // }, [textSearch]);
  useEffect(() => {
    if (textSearch === "") {
      fetchMenu(pagination.page, pagination.size);
    }
  }, [pagination]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategory();
        setListCate(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const editMenu = (record) => {
    setIsEdit(record);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };
  const deleteMenu = async (record) => {
    try {
      await deleteMn(record.id);
      message.success("Xóa món thành công");
      setPagination((pre) => ({ ...pre, page: 1, size: 10 }));
    } catch (error) {
      console.log(error);
      message.error("Xóa món thất bại");
    }
  };
  const columns = [
    {
      title: "Mã món",
      dataIndex: "id",
      key: "id",
      render: (itemId) => <span className="font-semibold">{itemId}</span>,
    },
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name ",
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold">{price}</span>,
    },

    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <Image width={60} className="object-cover aspect-square" src={img} />
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating_average",
      key: "rating_average",
      render: (text, record) => (
        <span className="flex items-center gap-1">
          <Rate value={Number(text)} disabled allowHalf />
          {`(${record?.rating_count})`}
        </span>
      ),
    },
    {
      title: "Hoạt động",
      render: (_, record) => (
        <Space size="middle">
          <button onClick={() => editMenu(record)}>
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>

          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => {
              deleteMenu(record);
            }}
            onCancel={() => {}}
            okText="Đồng ý"
            cancelText="Hủy bỏ"
          >
            <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
          </Popconfirm>
          <Switch
            defaultChecked={record?.status}
            className="bg-slate-500"
            onClick={async () => {
              try {
                await updateMenu(record.id, { status: !record?.status });
                fetchMenu();
                message.success("Cập nhật trạng thái thành công");
              } catch (error) {
                console.log(error);
                message.error("Cập nhật trạng thái thất bại");
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    if (
      values.name === "" ||
      values.price === "" ||
      values.category_id === "" ||
      values.description === ""
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    console.log(image);
    try {
      if (isEdit !== 0) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category_id", parseInt(values.category_id));
        formData.append("description", values.description);
        if (image) {
          formData.append("image", image); // image is the File object
        } else {
          formData.append("image", isEdit.image);
        }
        formData.append("menu_type", values.menu_type);
        await axios.post(
          `http://localhost:4000/menu/update/${isEdit?.id}`,
          formData
        );

        message.success("Cập nhật món ăn thành công");
        setIsModalOpen(false);
        fetchMenu();
      } else {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category_id", parseInt(values.category_id));
        formData.append("description", values.description);
        formData.append("image", image); // image is the File object
        formData.append("menu_type", values.menu_type);
        await axios.post("http://localhost:4000/menu/create", formData);

        message.success("Tạo mới món ăn thành công");
        setIsModalOpen(false);
        fetchMenu();
      }
    } catch (error) {
      console.log(error);
      message.error("Thất bại");
    }
  };

  const onChangePagination = (page, size) => {
    console.log(page);
    console.log(size);
    setPagination((pre) => ({ ...pre, page: page, size: size }));
  };
  const [form] = Form.useForm();

  return (
    <>
      <div className="content-component">
        <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
          <div className="text-xl font-semibold pl-2 text-white">
            Quản lý thực đơn
          </div>
          <div className="pr-2">
            <Button
              type="primary"
              className="bg-[#263a29]"
              onClick={() => {
                setIsEdit(0);
                setIsModalOpen(true);
                form.resetFields();
              }}
            >
              Tạo mới món ăn
            </Button>
          </div>
        </div>
        <div className="py-3 flex items-center justify-end">
          <div className="w-[300px]">
            <Search
              placeholder="Tìm kiếm ..."
              allowClear
              onChange={onSearch}
              style={{ width: 250 }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={getListMenu}
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            total: totalElement,
            pageSize: pagination?.size,
            current: pagination?.page,
            onChange: (page, size) => onChangePagination(page, size),
          }}
        />

        <div className="modal">
          <Modal
            className="headerModal"
            title="Tạo mới đơn"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                ĐÓNG
              </Button>,
              <Button
                htmlType="submit"
                type="primary"
                // loading={loading}
                form="form"
                name="form"
              >
                GỬI
              </Button>,
            ]}
            bodyStyle={{ height: "1280" }}
          >
            <div className="ant_body">
              <Form
                layout="vertical"
                form={form}
                name="form"
                onFinish={onFinish}
              >
                <Row>
                  <Col span={24}>
                    <Form.Item name="id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Tên món" name="name">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Giá món" name="price">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Danh mục món ăn" name="category_id">
                      <Select
                        name="category_id"
                        placeholder="chọn hình thức nhận hàng"
                        // onChange={onGenderChange}
                        allowClear
                      >
                        {listCate?.length > 0 &&
                          listCate.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.id}>
                                {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Mô tả chi tiết" name="description">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <p className="mb-2">Hình ảnh</p>
                    <input
                      type="file"
                      onChange={(event) => {
                        setImage(event.target.files[0]);
                      }}
                    ></input>
                  </Col>
                  <Col span={24} className="mt-3">
                    <Form.Item name="menu_type">
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>Món ăn</Radio>
                        <Radio value={2}>Nước uống</Radio>
                        <Radio value={3}>Không</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default TableManagement;
