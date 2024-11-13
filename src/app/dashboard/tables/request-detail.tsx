import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { toast } from "react-toastify";

function RequestDetailTable() {
  const [requestDetails, setRequestDetails] = useState([]);
  const [request, setRequest] = useState<RequestType[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pondDesignTemplate, setPondDesignTemplate] = useState<PondDesignTemplateType[]>([]);
  const [showPondDesignTemplateModal, setShowPondDesignTemplateModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<{ requestDetailId: number } | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  type RequestType = {
    id: number;
    customerId: number;
    addres: string;
    note: string;
    description: string;
    createDate: string; // Có thể đổi thành Date nếu cần
    createBy: string;
  };

  type PondDesignTemplateType = {
    minSize: number;
    maxSize: number;
    waterVolume: number;
    minDepth: number;
    maxDepth: number;
    shape: string;
    filtrationSystem: string;
    phLevel: number;
    waterTemperature: number;
    pondLiner: string;
    pondBottom: string;
    decoration: string;
    minEstimatedCost: number;
    maxSizmaxEstimatedCoste: number;
    imageUrl: string;
    description: string;
    note: string;
  };

  const handleUpdate = (record: any) => {
    setSelectedRequestDetail(record);
    form.setFieldsValue({
      note: record.note,
      pondDesignTemplateId: record.pondDesignTemplate?.pondDesignTemplateId
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSave = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedRequestDetail) {
        toast.error("The request detail not exist!");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/requestDetail/${selectedRequestDetail.requestDetailId}`,
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
        toast.error("Failed to update request detail");
        return;
      }

      toast.success("Request detail updated successfully!");
      setShowUpdateModal(false);
      fetchRequestDetails();
    } catch (err) {
      toast.error("Error updating request detail");
      console.error(err);
    }
  };

  // Thêm hàm delete
  const handleDelete = async (requestDetailId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/requestDetail/${requestDetailId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to delete request detail");
        return;
      }

      toast.success("Request detail deleted successfully!");
      fetchRequestDetails();
    } catch (err) {
      toast.error("Error deleting request detail");
      console.error(err);
    }
  };


  const navigate = useNavigate();

  const fetchRequestDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/requestDetail", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        toast.error("Network response was not ok");
      }

      const data = await response.json();
      setRequestDetails(data);
    } catch (err) {
      alert(err);
    }
  };

  const fetchRequestId = async (requestId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/request/get-Request-by-id/${requestId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("Network response was not ok");
      }

      const data = await response.json();
      setRequest([data]);
      setShowRequestModal(true);
    } catch (err) {
      alert(err);
    }
  };

  const fetchPondDesignTemplate = async (pondDesignTemplateId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/pondDesignTemplate/get-PondDesignTemplate-by-id/${pondDesignTemplateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("Network response was not ok");
      }

      const data = await response.json();
      setPondDesignTemplate([data]);
      setShowPondDesignTemplateModal(true);
    } catch (err) {
      alert(err);
    }
  };


  const handleConsult = (record: any) => {
    // Get the customer ID from the request
    const customerId = record.request.customer.customerId;
    const requestDetailId = record.requestDetailId;
    // Navigate with state containing the customer ID
    navigate("/admin/forms/form-consult", {
      state: { customerId, requestDetailId }
    });
  };

  const requestDetailColumns = [
    { title: "Request Detail ID", dataIndex: "requestDetailId", key: "requestDetailId" },
    {
      title: "Request ID", dataIndex: ["request", "id"], key: "requestId",
      render: (requestId: any) => (
        <>
          <span>{requestId}</span>
          <Button
            icon={<EyeOutlined />}
            style={{
              marginLeft: "10px",
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
            onClick={() => fetchRequestId(requestId)}
          >
          </Button>
        </>
      ),
    },
    {
      title: "Pond Design Template ID", dataIndex: ["pondDesignTemplate", "pondDesignTemplateId"], key: "pondDesignTemplateId",
      render: (pondDesignTemplateId: any) => (
        <>
          <span>{pondDesignTemplateId}</span>
          <Button
            icon={<EyeOutlined />}
            style={{
              marginLeft: "10px",
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
            onClick={() => fetchPondDesignTemplate(pondDesignTemplateId)}
          >
          </Button>
        </>
      ),
    },
    { title: "Note", dataIndex: "note", key: "note", render: (text: any) => text || "null" }, // Nếu `note` không có giá trị, hiển thị "null"}, 
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Consult Button */}
          <Button
            icon={<EditOutlined />}
            style={{
              backgroundColor: "white",
              color: "#52c41a",
              border: "1px solid #52c41a",
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
              e.currentTarget.style.backgroundColor = "#52c41a";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#52c41a";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => handleConsult(record)}
            title="Consult"
          />

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
            title="Confirm delete"
            description="Are you sure you want to delete this request detail?"
            onConfirm={() => handleDelete(record.requestDetailId)}
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

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const columnsRequest = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
    },
    {
      title: "Create By",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "Customer ID",
      dataIndex: ["customer", "customerId"], // Accessing nested customerId 
      key: "customerId",
    },
    {
      title: "RequestId",
      dataIndex: "id",
      key: "requestId",
    },

  ];


  const columnsPondDesignTemplate = [
    {
      title: "Min Size",
      dataIndex: "minSize",
      key: "minSize",
    },
    {
      title: "Max Size",
      dataIndex: "maxSize",
      key: "maxSize",
    },
    {
      title: "Water Volume",
      dataIndex: "waterVolume",
      key: "waterVolume",
    },
    {
      title: "Min Depth",
      dataIndex: "minDepth",
      key: "minDepth",
    },
    {
      title: "Max Depth",
      dataIndex: "maxDepth",
      key: "maxDepth",
    },
    {
      title: "Shape",
      dataIndex: "shape",
      key: "shape",
    },
    {
      title: "Filtration System",
      dataIndex: "filtrationSystem",
      key: "filtrationSystem",
    },
    {
      title: "ph Level",
      dataIndex: "phLevel",
      key: "phLevel",
    },
    {
      title: "Water Temperature",
      dataIndex: "waterTemperature",
      key: "waterTemperature",
    },
    {
      title: "Pond Liner",
      dataIndex: "pondLiner",
      key: "pondLiner",
    },
    {
      title: "Pond Bottom",
      dataIndex: "pondBottom",
      key: "pondBottom",
    },
    {
      title: "Decoration",
      dataIndex: "decoration",
      key: "decoration",
    },
    {
      title: "Min EstimatedCost",
      dataIndex: "minEstimatedCost",
      key: "minEstimatedCost",
    },
    {
      title: "Max EstimatedCost",
      dataIndex: "maxEstimatedCost",
      key: "maxEstimatedCost",
    },
    {
      title: "Image Url",
      dataIndex: "imageUrl",
      key: "imageUrl",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <div>
      <h1>Request Details:</h1>
      <Table dataSource={requestDetails} columns={requestDetailColumns} rowKey="requestDetailId" />
      <Modal
        open={showRequestModal}
        title="View Request"
        onCancel={() => setShowRequestModal(false)}
        onOk={() => setShowRequestModal(false)}
        width={1000} // Tăng chiều rộng modal lên 1000px (có thể điều chỉnh theo nhu cầu)
        style={{
          maxWidth: "90%", // Đảm bảo modal không quá lớn so với màn hình
          top: 20, // Điều chỉnh vị trí dọc nếu cần
        }}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table dataSource={request} columns={columnsRequest}></Table>
      </Modal>
      <Modal
        open={showPondDesignTemplateModal}
        title="View Pond Design Template"
        onCancel={() => setShowPondDesignTemplateModal(false)}
        onOk={() => setShowPondDesignTemplateModal(false)}
        width="90%" // Tăng chiều rộng modal lên 2000px (có thể điều chỉnh theo nhu cầu)
        style={{
          maxWidth: "1200px", // Đảm bảo modal không quá lớn so với màn hình
          top: 20, // Điều chỉnh vị trí dọc nếu cần
        }}
        bodyStyle={{ overflowX: "auto" }} // Thêm thanh cuộn ngang nếu cần
      >
        <Table dataSource={pondDesignTemplate} columns={columnsPondDesignTemplate} scroll={{ x: true }}></Table>
      </Modal>
      <Modal
        title="Update Request Detail"
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
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
        <Form form={form} layout="vertical" name="updateRequestDetailForm">
          <Form.Item
            name="pondDesignTemplateId"
            label="Pond Design Template ID"
            rules={[{ required: true, message: "Please input the pond design template ID!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            rules={[{ required: true, message: "Please input the note!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RequestDetailTable;
