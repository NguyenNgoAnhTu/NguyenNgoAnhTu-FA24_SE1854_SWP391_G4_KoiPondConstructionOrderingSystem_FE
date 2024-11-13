import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
type QuotationType = {
  quotationId: number;
  customerId: number;
  consultId: number;
  mainCost: number;
  subCost: number;
  vat: number;
  description: string;
  createDate: string; // Có thể đổi thành Date nếu cần
  isConfirm: boolean; // Thêm trường isConfirm
};

function Quotation() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState<QuotationType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationType | null>(null);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  
  const [profileForm] = Form.useForm();

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
        alert("No quotation selected for update");
        return;
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
      title: "CustomerId",
      dataIndex: "customerId",
      key: "customerId",
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
      title: "Created",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) => new Intl.DateTimeFormat('vi-VN').format(new Date(date)),
    },
    {
      title: "Updated",
      dataIndex: "updateDate",
      key: "updateDate",
      render: (date: string) => new Intl.DateTimeFormat('vi-VN').format(new Date(date)),
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
        <>
          <Button onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button onClick={() => handleDelete(record.quotationId)}>
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
    <div>
      <Table dataSource={datas} columns={columnsQuotation} />

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
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Quotation;







