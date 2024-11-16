import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, message, Upload } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { EyeOutlined } from '@ant-design/icons';


type QuotationType = {
  quotationId: number;
  customerId: number;
  consultId: number;
  mainCost: number;
  subCost: number;
  vat: number;
  description: string;
  url: string;
  createDate: string; // Có thể đổi thành Date nếu cần
  isConfirm: boolean; // Thêm trường isConfirm
};
type CustomerType = {
  customerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  // Add other customer fields as needed
};

function Quotation() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState<QuotationType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationType | null>(null);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [profileForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
const [customerDetail, setCustomerDetail] = useState<CustomerType | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/quotation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDatas(data);
    } catch (err) {
      alert(err);
    }
  };
  const fetchCustomerDetail = async (customerId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/customer/getCustomerById/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
  
      const data = await response.json();
      setCustomerDetail(data);
      setShowCustomerModal(true);
    } catch (error) {
      toast.error('Error fetching customer details');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (record: QuotationType) => {
    setSelectedQuotation(record);
    form.setFieldsValue(record);
    setShowModal(true);
  };

  const handleUpdateSave = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedQuotation) {
        toast.error("No quotation selected for update");
        return;
      }
      let newFileUrl = selectedQuotation.url;

      // Xử lý upload file nếu có file mới
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;

        // Upload file mới
        newFileUrl = await handleUploadFile(file);

        // Xóa file cũ nếu có
        if (selectedQuotation.url) {
          await deleteOldFile(selectedQuotation.url);
        }
      }

      const requestBody = {
        description: values.description,
        mainCost: values.mainCost,
        subCost: values.subCost,
        vat: values.vat,
      };

      const response = await fetch(
        `http://localhost:8080/api/quotation/${selectedQuotation.quotationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Quotation updated successfully!");
      setShowModal(false);
      toast.success("Quotation updated!");
      fetchData();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedQuotation(null);
  };

  const handleDelete = async (quotationId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/quotation/${quotationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the quotation");
      }

      console.log("Quotation deleted successfully!");
      toast.success("Quotation deleted!");
      fetchData();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleConfirm = async (quotationId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/quotation/confirmQuotation/${quotationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm the quotation");
      }

      console.log("Quotation confirmed successfully!");
      toast.success("Quotation confirmed!");
      fetchData(); // Tải lại dữ liệu sau khi xác nhận
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleCreateDesignProfile = (quotationId: number) => {
    profileForm.setFieldsValue({ quotationId });
    setShowCreateProfileModal(true);
  };

  const handleCreateProfileSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/designProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create design profile");
      }

      toast.success("Design profile created successfully!");


      setShowCreateProfileModal(false);
      navigate('/admin/tables/design-profile-manager');
    } catch (error) {
      console.error(error);
      toast.error("Failed to create design profile");
    }
  };
  const handleUploadFile = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const fileName = `quotations/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      // Lấy URL download
      const url = await getDownloadURL(snapshot.ref);

      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Hàm xóa file cũ trên Firebase
  const deleteOldFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting old file:", error);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props = async (file: any, onSuccess: any, onError: any) => {
    try {
      setUploading(true);
      const url = await handleUploadFile(file);
      setFileUrl(url);
      onSuccess("ok");
    } catch (error) {
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  const columnsQuotation = [
    {
      title: "QuotationID",
      dataIndex: "quotationId",
      key: "quotationId",
    },
    {
      title: "ConsultId",
      dataIndex: "consultId",
      key: "consultId",
    },
    {
      // title: "CustomerId",
      // dataIndex: "customerId",
      // key: "customerId",
      title: "Customer",
    dataIndex: "customerId",
    key: "customerId",
    render: (customerId: number) => (
      <Button 
        type="link" 
        onClick={() => fetchCustomerDetail(customerId)}
      >
        {<EyeOutlined />}
      </Button>
    ),
      
    },
    {
      title: "MainCost",
      dataIndex: "mainCost",
      key: "mainCost",
    },
    {
      title: "SubCost",
      dataIndex: "subCost",
      key: "subCost",
    },
    {
      title: "TotalCost",
      dataIndex: "total", // Cần có cách tính tổng ở phía backend
      key: "total",
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Created",
      dataIndex: "createDate",
      key: "createDate",
      
    },
    {
      title: "Updated",
      dataIndex: "updateDate",
      key: "updateDate",
    
    },
    {
      title: "Is Confirmed",
      dataIndex: "isConfirm", // Thêm trường isConfirm
      key: "isConfirm",
      render: (text: boolean) => (text ? "Yes" : "No"), // Hiển thị Yes/No
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: any, record: QuotationType) => (
    //     <>
    //       <Button onClick={() => handleUpdate(record)}>
    //         Update
    //       </Button>
    //       <Button onClick={() => handleDelete(record.quotationId)}>
    //         Delete
    //       </Button>

    //       {!record.isConfirm ? (
    //         <Button onClick={() => handleConfirm(record.quotationId)}>
    //           Confirm
    //         </Button>
    //       ) : (
    //         <Button
    //           onClick={() => handleCreateDesignProfile(record.quotationId)}
    //           type="primary"
    //           style={{ backgroundColor: "green" }}
    //         >
    //           Create Design Profile
    //         </Button>
    //       )}

    //     </>
    //   ),
    // }
    <>
    <Button 
      onClick={() => handleUpdate(record)}
      disabled={record.isConfirm}
      style={{ marginRight: '8px' }}
    >
      Update
    </Button>
    <Button 
      onClick={() => handleDelete(record.quotationId)}
      disabled={record.isConfirm}
      style={{ marginRight: '8px' }}
    >
      Delete
    </Button>

    {!record.isConfirm ? (
      <Button onClick={() => handleConfirm(record.quotationId)}>
        Confirm
      </Button>
    ) : (
      <Button
        onClick={() => handleCreateDesignProfile(record.quotationId)}
        type="primary"
        style={{ backgroundColor: "green" }}
      >
        Create Design Profile
      </Button>
    )}
  </>
),
}
  ];

  return (
    
        <div style={{ margin: '20px', overflow: 'hidden' }}>
    <div style={{ overflowX: 'auto' }}>
      <Table 
        dataSource={datas} 
        columns={columnsQuotation}
        scroll={{ x: 1300 }} // Điều chỉnh giá trị này tùy theo tổng width của các cột
        pagination={{
          pageSize: 10,
          position: ['bottomCenter']
        }}
      />
    </div>
      <Modal
      title="Customer Details"
      open={showCustomerModal}
      onCancel={() => setShowCustomerModal(false)}
      footer={[
        <Button key="close" onClick={() => setShowCustomerModal(false)}>
          Close
        </Button>
      ]}
    >
      {customerDetail && (
        <div style={{ padding: '10px' }}>
          <p><strong>Customer ID:</strong> {customerDetail.customerId}</p>
          <p><strong>Name:</strong> {customerDetail.name}</p>
          <p><strong>Email:</strong> {customerDetail.email}</p>
          <p><strong>Phone Number:</strong> {customerDetail.phoneNumber}</p>
          
        </div>
      )}
    </Modal>
      <Modal
        title="Update Quotation"
        visible={showModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleUpdateSave(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="updateQuotationForm">
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mainCost"
            label="Main Cost"
            rules={[{ required: true, message: "Please input the main cost!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="subCost"
            label="Sub Cost"
            rules={[{ required: true, message: "Please input the sub cost!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="vat"
            label="VAT"
            rules={[{ required: true, message: "Please input the VAT!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
        <Form.Item
          label="Upload PDF"
          name="fileUrl"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload a file!" }]}
        >
          <Upload
            accept=".pdf"
            customRequest={({ file, onSuccess, onError }) =>
              props(file, onSuccess, onError)
            }
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Upload PDF</Button>
          </Upload>
        </Form.Item>
      </Modal>
      <Modal
        title="Create Design Profile"
        visible={showCreateProfileModal}
        onCancel={() => setShowCreateProfileModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowCreateProfileModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              profileForm
                .validateFields()
                .then((values) => {
                  handleCreateProfileSubmit(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Form form={profileForm} layout="vertical" name="createProfileForm">
          <Form.Item
            name="quotationId"
            label="Quotation ID"
            rules={[{ required: true, message: "Quotation ID is required!" }]}
          >
            <Input readOnly />
          </Form.Item>
          {/* <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input readOnly />
          </Form.Item> */}
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            rules={[{ required: true, message: "Please input the note!" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Upload PDF"
            name="fileUrl"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              accept=".pdf"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              customRequest={({ file, onSuccess, onError }) =>
                props(file, onSuccess, onError)
              }
              listType="text"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload PDF
              </Button>
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
}

export default Quotation;







