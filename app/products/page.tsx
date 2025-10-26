/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
  Typography,
  Card,
  Tag,
  Avatar,
  Tooltip,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
// import axios from "axios";
import axiosInstance from "@/lib/axios"; 
import { Product, ProductListParams } from "@/types/product";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const { Search } = Input;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface ProductFormValues {
  product_title: string;
  product_price: number;
  product_description?: string;
  product_category?: string;
  product_image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Firebase Auth
  const { user, logout, getToken } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const params: ProductListParams = {
        page,
        limit,
        offset: (page - 1) * limit,
        ...(search && { search }),
      };

      const queryString = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        offset: params.offset.toString(),
        ...(params.search && { search: params.search }),
      });

      const response = await axiosInstance.get(`/api/products?${queryString}`,
        {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

      console.log('API Response:', response.data);

      // Pastikan data adalah array
      const productsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : [];
      
      setProducts(productsData);
      setTotal(response.data.pagination?.total || response.data.total || productsData.length);
    } catch (error: any) {
      console.error("Fetch error:", error);
      message.error(
        error.response?.data?.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, getToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCreate = () => {
    setModalType("create");
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setModalType("edit");
    setEditingProduct(product);
    form.setFieldsValue({
      product_title: product.product_title,
      product_price: product.product_price,
      product_description: product.product_description,
      product_category: product.product_category,
      product_image: product.product_image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    Modal.confirm({
      title: "Delete Product",
      content:
        "Are you sure you want to delete this product? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const token = await getToken();

          await axiosInstance.delete("/api/product", {
            data: { product_id: productId },
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });
          message.success("Product deleted successfully");
          fetchProducts();
        } catch (error: any) {
          console.error("Delete error:", error);
          message.error(
            error.response?.data?.message || "Failed to delete product"
          );
        }
      },
    });
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const token = await getToken();

      if (modalType === "create") {
        await axiosInstance.post("/api/product", values, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        message.success("Product created successfully");
      } else {
        await axiosInstance.put(
          "/api/product",
          {
            ...values,
            product_id: editingProduct?.product_id,
          },
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        message.success("Product updated successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (error: any) {
      console.error("Submit error:", error);
      message.error(
        error.response?.data?.message || `Failed to ${modalType} product`
      );
    }
  };

  // User menu dropdown
  const userMenuItems: MenuProps["items"] = [
    {
      key: "email",
      label: (
        <div style={{ padding: "4px 0" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Signed in as
          </Text>
          <div style={{ fontWeight: 500 }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
      danger: true,
    },
  ];

  const columns: ColumnsType<Product> = [
    {
      title: "Product",
      dataIndex: "product_title",
      key: "product_title",
      width: 300,
      render: (text: string, record: Product) => (
        <Space size="middle">
          <Avatar
            size={48}
            shape="square"
            src={record.product_image}
            icon={<AppstoreOutlined />}
            style={{
              backgroundColor: "#f0f2f5",
              border: "1px solid #d9d9d9",
            }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
            {record.product_category && (
              <Tag color="blue" style={{ margin: 0 }}>
                {record.product_category}
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      width: 150,
      sorter: (a, b) => a.product_price - b.product_price,
      render: (price: number) => (
        <Text strong style={{ fontSize: "15px", color: "#1890ff" }}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(price)}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">
            {text?.substring(0, 60) + (text?.length > 60 ? "..." : "") || "-"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.product_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header Card */}
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                  Product Dashboard
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  Technical Test Junior FE Dashboard Developer - Summit Global
                  Teknologi
                </Text>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#1890ff",
                      border: "2px solid white",
                    }}
                  />
                </Dropdown>

                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  style={{
                    borderRadius: 8,
                    height: 44,
                    paddingLeft: 24,
                    paddingRight: 24,
                    fontSize: 15,
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Add New Product
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Card */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Search Bar */}
            <div style={{ marginBottom: 24 }}>
              <Search
                placeholder="Search by product name, category, or description..."
                allowClear
                size="large"
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                onSearch={handleSearch}
                onChange={(e) => {
                  const timer = setTimeout(() => {
                    handleSearch(e.target.value);
                  }, 300);
                  return () => clearTimeout(timer);
                }}
                style={{ maxWidth: 500, borderRadius: 8 }}
              />
            </div>

            {/* Stats Bar */}
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 24,
                padding: 16,
                background: "#f5f7fa",
                borderRadius: 12,
              }}
            >
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Total Products
                </Text>
                <div
                  style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}
                >
                  {total}
                </div>
              </div>
              <div
                style={{
                  width: 1,
                  background: "#d9d9d9",
                  margin: "0 8px",
                }}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Current Page
                </Text>
                <div style={{ fontSize: 24, fontWeight: 600 }}>
                  {page} / {Math.ceil(total / limit) || 1}
                </div>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={products}
              rowKey="product_id"
              loading={loading}
              pagination={{
                current: page,
                pageSize: limit,
                total: total,
                onChange: (newPage) => setPage(newPage),
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} products`,
                style: { marginTop: 24 },
              }}
              scroll={{ x: 1000 }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </div>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span style={{ fontSize: 18, fontWeight: 500 }}>
              {modalType === "create" ? "Create New Product" : "Edit Product"}
            </span>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              label="Product Title"
              name="product_title"
              rules={[
                { required: true, message: "Please input product title!" },
              ]}
            >
              <Input placeholder="Enter product title" size="large" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="product_price"
              rules={[
                { required: true, message: "Please input product price!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter price"
                size="large"
                min={0}
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={((value: string | undefined) => {
                  const num = value?.replace(/Rp\s?|,/g, "");
                  return num ? parseFloat(num) : 0;
                }) as any}
              />
            </Form.Item>

            <Form.Item label="Category" name="product_category">
              <Input placeholder="Enter category (optional)" size="large" />
            </Form.Item>

            <Form.Item label="Description" name="product_description">
              <TextArea
                rows={4}
                placeholder="Enter description (optional)"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Image URL" name="product_image">
              <Input placeholder="Enter image URL (optional)" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button
                  size="large"
                  onClick={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ paddingLeft: 32, paddingRight: 32 }}
                >
                  {modalType === "create" ? "Create" : "Update"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}