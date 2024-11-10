import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

type ConsultType = {
  id: number;
  customerId: number;
  description: string;
  consultDate: string;
  requestDetailId: number;
  createDate: string; // Có thể đổi thành Date nếu cần
  isCustomerConfirm: boolean; // Thêm trường isCustomerConfirm
  customers: number;
};

function Consult() {
  const [consultData, setConsultData] = useState<ConsultType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedConsult, setSelectedConsult] = useState<ConsultType | null>(null);
  const [selectedConsultId, setSelectedConsultId] = useState<number | null>(null);
  
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  const fetchConsultData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/consult", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch consult data");
      }

      const data = await response.json();
      console.log(data);
      setConsultData(data);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchConsultData();
  }, []);
  const handleFormCreate = async (values: any) => {
    
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        customerId: values.customerId,
        consultId: selectedConsultId,
        isConfirm: false, // Đặt giá trị mặc định là false
        description: values.description,
        mainCost: values.mainCost,
        subCost: values.subCost,
        vat: values.vat
        
      };
      
        const response = await fetch("http://localhost:8080/api/quotation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      // 
      if (!response.ok) {
        // Kiểm tra xem response có phải JSON không
        const text = await response.text(); 
        try {
          const errorData = JSON.parse(text); // Parse JSON nếu có thể
          console.error("Error response:", errorData);
          throw new Error(`Network response was not ok: ${errorData.message || "Unknown error"}`);
        } catch (e) {
          console.error("Non-JSON error response:", text); // Log nếu không phải JSON
          throw new Error(`Network response was not ok: ${text}`);
        }
      }
      console.log("Quotation created successfully!");
      setShowQuotationModal(false);
      alert("Quotation created!");
    } catch (err) {
      alert(err);
    }
  };



  const consultUpdate = (record: ConsultType) => {
    console.log("Selected Consult Record:", record);
    console.log("Request Detail ID:", record.requestDetailId); //
    setSelectedConsult(record);

  
    form.setFieldsValue({
      description: record.description,
      customerId: record.customerId,
      requestDetailId: record.requestDetailId, // Đảm bảo tên trường trùng khớp
      consultDate: record.consultDate,
    });

    console.log("Request Detail ID:", record.requestDetailId); // Kiểm tra giá trị của requestDetailId

    setShowModal(true);
  }

  const consultUpdateSave = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedConsult) {
        alert("The consult not exist!");
        return;
      }

      const requestBody = {
        description: values.description,
        customerId: values.customerId,
        requestDetailId: values.requestDetailId,
        consultDate: values.consultDate,
      };


      // Thêm dòng log ở đây để kiểm tra requestBody
      console.log("Request Body:", requestBody);

      const response = await fetch(
        `http://localhost:8080/api/consult/${selectedConsult.id}`,
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
        const errorText = await response.text(); // Nhận phản hồi dưới dạng văn bản
        console.error("Server Error:", errorText);
        throw new Error("Network response was not ok");
      }

      console.log("Consult updated successfully!");
      setShowModal(false);
      alert("Consult updated!");
      fetchConsultData();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error Update!");
      }
    }
  };
  

  const consultCancel = () => {
    setShowModal(false);
    setSelectedConsult(null);
  };

  const consultDeleteSave = async (consultId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/consult/${consultId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the consult");
      }

      console.log("Consult deleted successfully!");
      alert("Consult deleted!");
      fetchConsultData();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error Deleted!");
      }
    }
  };

  const consultConfirm = async (consultId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/consult/confirmConsult/${consultId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm the consult");
      }

      console.log("Consult confirmed successfully!");
      alert("Consult confirmed!");
      fetchConsultData(); // Tải lại dữ liệu sau khi xác nhận
      
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error Confirm");
      }
    }
  };
  
      
    
  
  const columns = [
    { title: "Consult ID", dataIndex: "id", key: "id" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Consult Date", dataIndex: "consultDate", key: "consultDate" },
    { title: "Create Date", dataIndex: "createDate", key: "createDate" },
    {
      title: "Customer Confirmed",
      dataIndex: "isCustomerConfirm",
      key: "isCustomerConfirm",
      render: (text: boolean) => (text ? "Confirmed" : "Not confirmed"), // Hiển thị Yes/No
    },
    {
      title: "Request Detail ID",
      dataIndex: ["requestDetail", "requestDetailId"], // Accessing nested requestDetail ID
      key: "requestDetailId",
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      render: (text: any, record: ConsultType) =>
        record.customers && Array.isArray(record.customers) && record.customers.length > 0
          ? record.customers[1].customerId
          : "N/A",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: any, record: ConsultType) => (
        <>
          <Button type="primary" danger style={{ backgroundColor: "blue", color: "white", marginRight: "3px" }} onClick={() => consultUpdate(record)}>
            Update
          </Button>

          {/* Tạo xác nhận có xóa hay không */}
          <Popconfirm title="Confirm delete" color="white" okButtonProps={{style: {background: "LimeGreen"}}} cancelButtonProps={{style: {background: "red", color: "white"}}} description="Do you want to delete this consult?" onConfirm={() => consultDeleteSave(record.id)}>
          <Button type="primary" danger style={{ backgroundColor: "red", color: "white", marginRight: "3px" }}>
            Delete</Button>
          </Popconfirm>
          
            
          <Button
            type="primary"
            style={{ backgroundColor: "orange", color: "white", marginRight: "3px" }}
            onClick={() => {
              setSelectedConsultId(record.id);
              
              setShowQuotationModal(true);
            }}
          >
            Create quotation
          </Button>
        

          {!record.isCustomerConfirm && ( // Hiển thị nút Confirm nếu chưa xác nhận
            <Button type="primary" danger style={{ backgroundColor: "LimeGreen", color: "white", marginRight: "3px" }} onClick={() => consultConfirm(record.id)}>
              Confirm
            </Button>
          )}
        </>
      ),
      
    },
  ];

  return (
    <div>
      <h1>Consults</h1>
      <Table dataSource={consultData} columns={columns} rowKey="consultId" />
      <Modal
        title="Update Consult"
        open={showModal}
        onCancel={consultCancel}
        footer={[
          <Button key="cancel" 
          style={{ backgroundColor: "red", color: "white" }} 
          onClick={consultCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            //type="primary"
            style={{ backgroundColor: "LimeGreen", color: "white" }}
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  consultUpdateSave(values);
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
        <Form form={form} layout="vertical" name="updateConsultForm">
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerId"
            label="Customer ID"
            rules={[{ required: true, message: "Please input the customer ID!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="requestDetailId"
            label="Request Detail ID"
            rules={[{ required: true, message: "Please input the Request Detail ID!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="consultDate"
            label="Consult Date"
            rules={[
              { required: true, message: "Please input the consult date!" },
              {
                pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, // Định dạng YYYY-MM-DDTHH:MM:SS
                message: "Please enter the date in YYYY-MM-DDTHH:MM:SS format!",
              },
            ]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
      
     
      <Modal
  onCancel={() => setShowQuotationModal(false)} // Đóng modal khi hủy
  onOk={() => form.submit()} // Gửi form khi nhấn OK
  open={showQuotationModal} // Mở/đóng modal
  title="Create Quotation" // Tiêu đề modal
>
  <Form
    form={form}
    onFinish={handleFormCreate} // Xử lý khi form được submit
    labelCol={{ span: 24 }} // Cài đặt chiều rộng label
  >
          {/* <Form.Item
            name="customerId"
            label="CustomerId"
            rules={[{ required: true, message: "Please input the CustomerId!" }]}
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
          </Form.Item> */}

<Form.Item
  name="customerId"
  label="CustomerId"
  rules={[{ required: true, message: "Please input the CustomerId!" }]}
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

<Form.Item
  name="mainCost"
  label="Main Cost"
  rules={[
    { required: true, message: "Please input the main cost!" },
    ({ }) => ({
      validator(_, value) {
        if (value > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Main Cost must be greater than 0!"));
      },
    }),
  ]}
>
  <Input type="number" />
</Form.Item>

<Form.Item
  name="subCost"
  label="Sub Cost"
  rules={[
    { required: true, message: "Please input the sub cost!" },
    ({ }) => ({
      validator(_, value) {
        if (value > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Sub Cost must be greater than 0!"));
      },
    }),
  ]}
>
  <Input type="number" />
</Form.Item>

<Form.Item
  name="vat"
  label="VAT"
  rules={[
    { required: true, message: "Please input the VAT!" },
    ({ }) => ({
      validator(_, value) {
        if (value >= 0 && value <= 10) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("VAT must be greater than 0 and less than or equal to 10!"));
      },
    }),
  ]}
>
  <Input type="number" />
</Form.Item>
        </Form>
</Modal>

    </div>
  );
}

export default Consult;
