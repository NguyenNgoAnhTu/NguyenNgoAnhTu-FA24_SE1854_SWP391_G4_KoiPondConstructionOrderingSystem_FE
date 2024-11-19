import { Button, Form, Input, Modal, Table, Popconfirm,Upload,Select } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";

// Add new type for Customer
type CustomerType = {
  customerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  // Add other customer fields as needed
};

type ConsultType = {
  id: number;
  customerId: number;
  description: string;
  consultDate: string;
  requestDetailId: number;
  createDate: string; // Có thể đổi thành Date nếu cần
  isCustomerConfirm: boolean; // Thêm trường isCustomerConfirm
  // customers: number;
  customers: { customerId: number }[];
};
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const handleUpload = (file: any, onSuccess: any, onError: any) => {
  const storageRef = ref(storage, `quotations/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    null,
    (error) => onError(error),
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onSuccess(downloadURL);
      } catch (error) {
        onError(error);
      }
    }
  );
};

function Consult() {
  const [consultData, setConsultData] = useState<ConsultType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [quotationForm] = Form.useForm();
  const [selectedConsult, setSelectedConsult] = useState<ConsultType | null>(null);
  const [selectedConsultId, setSelectedConsultId] = useState<number | null>(null);

  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [customerData, setCustomerData] = useState<CustomerType | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState<string>("");
  const navigate = useNavigate();
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
        toast.error("Failed to fetch consult data");
      }

      const data = await response.json();
      console.log(data);
      setConsultData(data);
    } catch (err) {
      alert(err);
    }
  };

  const fetchCustomerName = async (customerId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
  
      const customers = await response.json();
      const customer = customers.find((c: CustomerType) => c.customerId === customerId);
      
      if (customer) {
        setCustomerName(customer.name);
      }
    } catch (error) {
      toast.error('Error fetching customer details');
    }
  };

  // Add new function to fetch customer details
  const fetchCustomerDetails = async (customerId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }

      const customers = await response.json();
      const customer = customers.find((c: CustomerType) => c.customerId === customerId);
      
      if (customer) {
        setCustomerData(customer);
        setShowCustomerModal(true);
      } else {
        toast.error('Customer not found');
      }
    } catch (error) {
      toast.error('Error fetching customer details');
    }
  };

  useEffect(() => {
    fetchConsultData();
  }, []);
  // const handleFormCreate = async (values: any) => {

  //   try {
  //     const token = localStorage.getItem("token");
  //     console.log("Selected Customer ID:", selectedCustomerId);
  //     console.log("Selected Consult ID:", selectedConsultId);

  //     // Đảm bảo customerId được set khi click vào nút Create quotation
  //     if (!selectedCustomerId) {
  //       toast.error("Customer ID is missing!");
  //       return;
  //     }
  //     if (!selectedConsult) {
  //       toast.error("No consult selected!");
  //       return;
  //     }
  //     const requestBody = {
  //       customerId:  selectedConsult.customers[0].customerId,
  //       consultId: selectedConsultId,
  //       isConfirm: false, // Đặt giá trị mặc định là false
  //       description: values.description,
  //       mainCost: values.mainCost,
  //       subCost: values.subCost,
  //       vat: values.vat

  //     };
 
  
  
  const handleFormCreate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const url = values.url?.[0]?.response || values.url?.[0]?.url;

      if (!selectedConsult) {
        toast.error("No consult selected!");
        return;
      }

      const requestBody = {
        customerId: selectedCustomerId, // Sử dụng selectedCustomerId đã lưu
        consultId: selectedConsultId,
        isConfirm: false,
        description: values.description,
        mainCost: values.mainCost,
        subCost: values.subCost,
        vat: 10,
        url: url
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
      toast.success("Quotation created!");
      navigate('/admin/tables/table-quotation');
    } catch (err) {
      alert(err);
    }
  };

  const consultUpdate = (record: ConsultType) => {
    console.log("Selected Consult Record:", record);
    setSelectedConsult(record);

    console.log("Request Detail ID:", record.requestDetailId); // Kiểm tra giá trị của requestDetailId

    form.setFieldsValue({
      description: record.description,
      customerId: record.customers[1].customerId, // Lấy customerId từ mảng customers
      requestDetailId: record.requestDetailId,
      consultDate: record.consultDate,
    });

    setShowModal(true);
  }

  const consultUpdateSave = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedConsult) {
        toast.error("The consult not exist!");
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
        toast.error("Network response was not ok");
      }

      console.log("Consult updated successfully!");
      setShowModal(false);
      toast.success("Consult updated!");
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
        toast.error("Failed to delete the consult");
      }

      console.log("Consult deleted successfully!");
      toast.success("Consult deleted!");
      fetchConsultData();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        toast.error("Error Deleted!");
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
      toast.success("Consult confirmed!");
      fetchConsultData(); // Tải lại dữ liệu sau khi xác nhận

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        toast.error("Error Confirm");
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
      title: "Customer Info",
      dataIndex: "customerId",
      key: "customerId",
      render: (text: any, record: ConsultType) => (       
          <Button 
            type="link" 
            onClick={() => fetchCustomerDetails(record.customers[1].customerId)}
            icon={<EyeOutlined />}
          >
          </Button>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: any, record: ConsultType) => (
        <>
          <Button
            type="primary"
            danger
            style={{ backgroundColor: "blue", color: "white", marginRight: "3px" }}
            onClick={() => consultUpdate(record)}
          >
            Update
          </Button>

          <Popconfirm
            title="Confirm delete"
            color="white"
            okButtonProps={{ style: { background: "LimeGreen" } }}
            cancelButtonProps={{ style: { background: "red", color: "white" } }}
            description="Do you want to delete this consult?"
            onConfirm={() => consultDeleteSave(record.id)}
          >
            <Button type="primary" danger style={{ backgroundColor: "red", color: "white", marginRight: "3px" }}>
              Delete
            </Button>
          </Popconfirm>

          {!record.isCustomerConfirm ? (
            <Button
              type="primary"
              danger
              style={{ backgroundColor: "LimeGreen", color: "white", marginRight: "3px" }}
              onClick={() => consultConfirm(record.id)}
            >
              Confirm
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ backgroundColor: "orange", color: "white", marginRight: "3px" }}
              onClick={() => {
                const consultId = record.id;
                const customerId = record.customers[1].customerId;

                setSelectedConsult(record);
                setSelectedConsultId(consultId);
                setSelectedCustomerId(customerId);
                fetchCustomerName(customerId);

                quotationForm.setFieldsValue({
                  customerId: customerId,
                  description: '',
                  mainCost: 0,
                  subCost: 0,
                  vat: 10,
                 
                });

                setShowQuotationModal(true);
              }}
            >
              Create quotation
            </Button>
          )}
        </>
      )
    }
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
          >
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item
            name="requestDetailId"
            label="Request Detail ID"
            rules={[{ required: true, message: "Please input the Request Detail ID!" }]}
          >
            <Input type="number" disabled />
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
        title="Customer Details"
        open={showCustomerModal}
        onCancel={() => setShowCustomerModal(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setShowCustomerModal(false)}
          >
            Close
          </Button>
        ]}
      >
        {customerData && (
          <div>
            <p><strong>Customer ID:</strong> {customerData.customerId}</p>
            <p><strong>Name:</strong> {customerData.name}</p>
            <p><strong>Email:</strong> {customerData.email}</p>
            <p><strong>Phone:</strong> {customerData.phoneNumber}</p>
          </div>
        )}
      </Modal>

        {/* create quotation */}
      <Modal
        onCancel={() => setShowQuotationModal(false)} // Đóng modal khi hủy
        onOk={() => quotationForm.submit()}// Gửi form khi nhấn OK
        open={showQuotationModal} // Mở/đóng modal
        title="Create Quotation" // Tiêu đề modal
      >
        <Form
          form={quotationForm}
          onFinish={handleFormCreate} // Xử lý khi form được submit
          labelCol={{ span: 24 }} // Cài đặt chiều rộng label
        >
          <Form.Item
        label="Customer"
      >
        <Input value={customerName} disabled />
      </Form.Item>

          <Form.Item
            name="customerId"
            label="CustomerId"
          // rules={[{ required: true, message: "Please input the CustomerId!" }]}
          >
            <Input disabled />
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
{/* form cũ */}
          {/* <Form.Item
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
          </Form.Item> */}

          {/* form text cho sub cost rate */}
          {/* <Form.Item
  name="subRate"
  label="Sub Rate (%)"
  rules={[
    { required: true, message: "Please input the sub rate!" },
    ({ }) => ({
      validator(_, value) {
        if (value > 0 && value <= 100) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Sub Rate must be between 0 and 100!"));
      },
    }),
  ]}
>
  <Input 
    type="number" 
    onChange={(e) => {
      const mainCost = quotationForm.getFieldValue('mainCost');
      const subRate = parseFloat(e.target.value);
      if (mainCost && subRate) {
        const subCost = (mainCost * subRate) / 100;
        quotationForm.setFieldsValue({ subCost });
      }
    }}
  />
</Form.Item>

<Form.Item
  name="subCost"
  label="Sub Cost"
>
  <Input type="number" disabled />
</Form.Item> */}


{/* combo box */}
<Form.Item
  name="subRate"
  label="Sub Rate (%)"
  rules={[{ required: true, message: "Please select the sub rate!" }]}
>
  <Select
    onChange={(value) => {
      const mainCost = quotationForm.getFieldValue('mainCost');
      if (mainCost) {
        const subCost = (mainCost * value) / 100;
        quotationForm.setFieldsValue({ subCost });
      }
    }}
  >
    <Select.Option value={10}>10%</Select.Option>
    <Select.Option value={20}>20%</Select.Option>
    <Select.Option value={30}>30%</Select.Option>
  </Select>
</Form.Item>

<Form.Item
  name="subCost"
  label="Sub Cost"
>
  <Input type="number" disabled />
</Form.Item>

          <Form.Item
            name="vat"
            label="VAT"
            // rules={[
            //   { required: true, message: "Please input the VAT!" },
            //   ({ }) => ({
            //     validator(_, value) {
            //       if (value >= 0 && value <= 10) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(new Error("VAT must be greater than 0 and less than or equal to 10!"));
            //     },
            //   }),
            // ]}
          >
            <Input type="number" readOnly />
          </Form.Item>
          <Form.Item
        label="Upload PDF"
        name="url"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please upload a file!" }]}
      >
        <Upload
          accept=".pdf"
          customRequest={({ file, onSuccess, onError }) =>
            handleUpload(file, onSuccess, onError)
          }
          listType="text"
        >
          <Button icon={<UploadOutlined />}>Upload PDF</Button>
        </Upload>
      </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}

export default Consult;




