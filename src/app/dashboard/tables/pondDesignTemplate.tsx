import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ColumnsType } from 'antd/es/table';
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../../config/firebase";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

function PondDesignTemplateTable() {
  const [pondDesignTemplates, setPondDesignTemplates] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ pondDesignTemplateId: number } | null>(null);
  const [form] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();


  type PondDesignTemplateType = {
    pondDesignTemplateId: number;
    minSize: string;
    maxSize: string;
    waterVolume: string;
    minDepth: string;
    maxDepth: string;
    shape: string;
    filtrationSystem: string;
    phLevel: string;
    waterTemperature: string;
    pondLiner: string;
    pondBottom: string;
    decoration: string;
    minEstimatedCost: string;
    maxEstimatedCost: string;
    imageUrl: string;
    description: string;
    note: string;
  };

  // Thêm function upload ảnh
  const handleUpload = async (file: RcFile): Promise<string> => {
    const storageRef = ref(storage, `pond-designs/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const fetchPondDesignTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/pondDesignTemplate", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pond design templates");
      }

      const data = await response.json();
      setPondDesignTemplates(data);
    } catch (err) {
      toast.error("Error fetching pond design templates");
      console.error(err);
    }
  };

  const handleUpdate = (record: PondDesignTemplateType) => {
    setSelectedTemplate(record);
    form.setFieldsValue(record);
    setShowUpdateModal(true);
  };

  const handleUpdateSave = async (values: any) => {
    try {
      // Validate form values
      if (!validateFormValues(values)) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!selectedTemplate) {
        toast.error("No template selected!");
        return;
      }

      // Nếu có file ảnh mới, sử dụng URL mới
      if (imageUrl) {
        values.imageUrl = imageUrl;
      }

      const response = await fetch(
        `http://localhost:8080/api/pondDesignTemplate/${selectedTemplate.pondDesignTemplateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      toast.success("Template updated successfully!");
      setShowUpdateModal(false);
      setImageUrl(undefined);
      fetchPondDesignTemplates();
    } catch (err) {
      toast.error("Error updating template");
      console.error(err);
    }
  };

  const handleDelete = async (pondDesignTemplateId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/pondDesignTemplate/${pondDesignTemplateId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      toast.success("Template deleted successfully!");
      fetchPondDesignTemplates();
    } catch (err) {
      toast.error("Error deleting template");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPondDesignTemplates();
  }, []);

  const columns: ColumnsType<PondDesignTemplateType> = [
    {
      title: "ID",
      dataIndex: "pondDesignTemplateId",
      key: "pondDesignTemplateId",
      width: 10,
      fixed: 'left'
    },
    {
      title: "Min Size",
      dataIndex: "minSize",
      key: "minSize",
      width: 20,
      align: 'center'
    },
    {
      title: "Max Size",
      dataIndex: "maxSize",
      key: "maxSize",
      width: 20,
      align: 'center'
    },
    {
      title: "Water Volume",
      dataIndex: "waterVolume",
      key: "waterVolume",
      width: 20,
      align: 'center'
    },
    {
      title: "Min Depth",
      dataIndex: "minDepth",
      key: "minDepth",
      width: 20,
      align: 'center'
    },
    {
      title: "Max Depth",
      dataIndex: "maxDepth",
      key: "maxDepth",
      width: 20,
      align: 'center'
    },
    {
      title: "Shape",
      dataIndex: "shape",
      key: "shape",
      width: 30,
      align: 'center'
    },
    {
      title: "Filtration System",
      dataIndex: "filtrationSystem",
      key: "filtrationSystem",
      width: 30,
      align: 'center'
    },
    {
      title: "pH Level",
      dataIndex: "phLevel",
      key: "phLevel",
      width: 30,
      align: 'center'
    },
    {
      title: "Water Temperature",
      dataIndex: "waterTemperature",
      key: "waterTemperature",
      width: 30,
      align: 'center'
    },
    {
      title: "Pond Liner",
      dataIndex: "pondLiner",
      key: "pondLiner",
      width: 30,
      align: 'center'
    },
    {
      title: "Pond Bottom",
      dataIndex: "pondBottom",
      key: "pondBottom",
      width: 30,
      align: 'center'
    },
    {
      title: "Decoration",
      dataIndex: "decoration",
      key: "decoration",
      width: 30,
      align: 'center'
    },
    {
      title: "Min Cost",
      dataIndex: "minEstimatedCost",
      key: "minEstimatedCost",
      width: 20,
      align: 'center'
    },
    {
      title: "Max Cost",
      dataIndex: "maxEstimatedCost",
      key: "maxEstimatedCost",
      width: 20,
      align: 'center'
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 30,
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="Pond design"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      )
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 20,
      align: 'center',
      render: (record: PondDesignTemplateType) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Update Button */}
          <Button
            icon={<EditOutlined />}
            style={{
              backgroundColor: "white",
              color: "#1890ff",
              border: "1px solid #1890ff",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#1890ff";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#1890ff";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => handleUpdate(record)}
            title="Update"
          />

          {/* Delete Button */}
          <Popconfirm
            title="Delete Template"
            description="Are you sure you want to delete this template?"
            onConfirm={() => handleDelete(record.pondDesignTemplateId)}
            okButtonProps={{ style: { background: "LimeGreen" } }}
            cancelButtonProps={{ style: { background: "red", color: "white" } }}
          >
            <Button
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: "white",
                color: "#ff4d4f",
                border: "1px solid #ff4d4f",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4d4f";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#ff4d4f";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="Delete"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Thêm function validation chung cho cả Add và Update
  const validateFormValues = (values: any) => {
    if (Number(values.maxSize) <= Number(values.minSize)) {
      toast.error('Maximum size must be greater than minimum size!');
      return false;
    }
    if (Number(values.maxDepth) <= Number(values.minDepth)) {
      toast.error('Maximum depth must be greater than minimum depth!');
      return false;
    }
    if (Number(values.maxEstimatedCost) <= Number(values.minEstimatedCost)) {
      toast.error('Maximum cost must be greater than minimum cost!');
      return false;
    }
    return true;
  };

  const handleAdd = async (values: any) => {
    try {
      // Validate form values
      if (!validateFormValues(values)) {
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      // Kiểm tra imageUrl
      if (!imageUrl) {
        toast.error("Please upload an image!");
        return;
      }
      // Thêm imageUrl vào values
      values.imageUrl = imageUrl;
      const response = await fetch(
        "http://localhost:8080/api/pondDesignTemplate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add template");
      }

      toast.success("Template added successfully!");
      setShowAddModal(false);
      addForm.resetFields();
      setImageUrl(undefined);
      fetchPondDesignTemplates();
    } catch (err: any) {
      toast.error(err.message || "Error adding template");
      console.error("Add template error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Thêm xử lý cho upload
  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    try {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.originFileObj) {
        const url = await handleUpload(info.file.originFileObj);
        setImageUrl(url);
        // Cập nhật giá trị form
        addForm.setFieldValue('imageUrl', url);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  // Trong phần Form.Item của imageUrl, thay thế Input bằng Upload component
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Thêm các hàm validation helper
  const validateNumber = (_: any, value: string) => {
    if (isNaN(Number(value))) {
      return Promise.reject('Please input number!');
    }
    if (Number(value) < 0) {
      return Promise.reject('Value must be greater than 0!');
    }
    return Promise.resolve();
  };

  const validateCost = (_: any, value: string) => {
    if (isNaN(Number(value))) {
      return Promise.reject('Please input number!');
    }
    if (Number(value) <= 0) {
      return Promise.reject('Cost must be greater than 0!');
    }
    return Promise.resolve();
  };


  return (
    <div style={{
      position: 'relative',
      zIndex: 0,
      maxWidth: 'calc(100vw - 280px)',  // Adjusted to account for new margins
      overflowX: 'auto',
      paddingBottom: '16px'
    }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: "#52c41a" }}
        >
          Add New Template
        </Button>
      </div>
      <h1>Pond Design Templates</h1>
      <Table
        dataSource={pondDesignTemplates}
        columns={columns}
        rowKey="pondDesignTemplateId"
        scroll={{ x: 2500, y: 500 }}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter']
        }}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: -1,
        }}
      />

      {/* Add Modal */}
      <Modal
        title="Add New Pond Design Template"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        width="90%"
        style={{
          maxWidth: "1200px",
          top: 20,
          zIndex: 1000
        }}
        styles={{ body: { overflowX: "auto" } }}
        footer={[
          <Button
            key="cancel"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "LimeGreen", color: "white" }}
            onClick={() => addForm.submit()}
          >
            Add
          </Button>,
        ]}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            name="minSize"
            label="Min Size"
            rules={[
              { required: true, message: 'Please input minimum size!' },
              { validator: validateNumber },
              { max: 1000, message: 'Size cannot exceed 1000!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maxSize"
            label="Max Size"
            rules={[
              { required: true, message: 'Please input maximum size!' },
              { validator: validateNumber },
              { max: 1000, message: 'Size cannot exceed 1000!' }
            ]}
            dependencies={['minSize']}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="waterVolume"
            label="Water Volume"
            rules={[
              { required: true, message: 'Please input water volume!' },
              { validator: validateNumber }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="minDepth"
            label="Min Depth"
            rules={[
              { required: true, message: 'Please input minimum depth!' },
              { validator: validateNumber },
              { max: 10, message: 'Depth cannot exceed 10!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maxDepth"
            label="Max Depth"
            rules={[
              { required: true, message: 'Please input maximum depth!' },
              { validator: validateNumber },
              { max: 10, message: 'Depth cannot exceed 10!' }
            ]}
            dependencies={['minDepth']}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="shape"
            label="Shape"
            rules={[{ required: true, message: 'Please input shape!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="filtrationSystem"
            label="Filtration System"
            rules={[{ required: true, message: 'Please input filtration system!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phLevel"
            label="pH Level"
            rules={[
              { required: true, message: 'Please input pH level!' },
              { validator: validateNumber },
              { min: 0, max: 14, message: 'pH must be between 0-14!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="waterTemperature"
            label="Water Temperature"
            rules={[
              { required: true, message: 'Please input water temperature!' },
              { validator: validateNumber },
              { min: 0, max: 40, message: 'Temperature must be between 0-40!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pondLiner"
            label="Pond Liner"
            rules={[{ required: true, message: 'Please input pond liner!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pondBottom"
            label="Pond Bottom"
            rules={[{ required: true, message: 'Please input pond bottom!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="decoration"
            label="Decoration"
            rules={[{ required: true, message: 'Please input decoration!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="minEstimatedCost"
            label="Min Estimated Cost"
            rules={[
              { required: true, message: 'Please input minimum cost!' },
              { validator: validateCost }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maxEstimatedCost"
            label="Max Estimated Cost"
            rules={[
              { required: true, message: 'Please input maximum cost!' },
              { validator: validateCost }
            ]}
            dependencies={['minEstimatedCost']}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image"
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  toast.error('You can only upload image files!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  toast.error('Image must smaller than 2MB!');
                }
                return isImage && isLt2M;
              }}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                form.getFieldValue('imageUrl') ? (
                  <img src={form.getFieldValue('imageUrl')} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="note"
            label="Note"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Pond Design Template"
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        width="90%"
        style={{
          maxWidth: "1200px",
          top: 20,
        }}
        styles={{ body: { overflowX: "auto" } }}
        footer={[
          <Button
            key="cancel"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => setShowUpdateModal(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "LimeGreen", color: "white" }}
            onClick={() => form.submit()}
          >
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateSave}
        >
          <Form.Item name="minSize" label="Min Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxSize" label="Max Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="waterVolume" label="Water Volume" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="minDepth" label="Min Depth" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxDepth" label="Max Depth" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shape" label="Shape" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="filtrationSystem" label="Filtration System" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phLevel" label="pH Level" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="waterTemperature" label="Water Temperature" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="pondLiner" label="Pond Liner" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="pondBottom" label="Pond Bottom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="decoration" label="Decoration" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="minEstimatedCost" label="Min Estimated Cost" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxEstimatedCost" label="Max Estimated Cost" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="Image"
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  toast.error('You can only upload image files!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  toast.error('Image must smaller than 2MB!');
                }
                return isImage && isLt2M;
              }}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                form.getFieldValue('imageUrl') ? (
                  <img src={form.getFieldValue('imageUrl')} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="note" label="Note" >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PondDesignTemplateTable;