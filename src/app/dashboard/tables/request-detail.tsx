import { Table, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { toast } from "react-toastify";

function RequestDetailTable() {
  const [requestDetails, setRequestDetails] = useState([]);
  const [request, setRequest] = useState<RequestType[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pondDesignTemplate, setPondDesignTemplate] = useState<PondDesignTemplateType[]>([]);
  const [showPondDesignTemplateModal, setShowPondDesignTemplateModal] = useState(false);

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


  const handleConsult = () => {
    navigate("/admin/forms/form-consult");
  };

  const requestDetailColumns = [
    { title: "Request Detail ID", dataIndex: "requestDetailId", key: "requestDetailId" },
    {
      title: "Request ID", dataIndex: ["request", "id"], key: "requestId",
      render: (requestId: any) => (
        <>
        <span>{requestId}</span>
          <Button
            style={{
              marginLeft: "20px",
              backgroundColor: "LightGray",
              color: "Black",
              border: "1px solid black"
            }}
            onClick={() => fetchRequestId(requestId)}
          >
            View Detail
          </Button>
        </>
      ),
    },
    { title: "Pond Design Template ID", dataIndex: ["pondDesignTemplate", "pondDesignTemplateId"], key: "pondDesignTemplateId",
      render: (pondDesignTemplateId: any) => (
      <>
      <span>{pondDesignTemplateId}</span>
        <Button
          style={{
            marginLeft: "20px",
            backgroundColor: "LightGray",
            color: "Black",
            border: "1px solid black"
          }}
          onClick={() => fetchPondDesignTemplate(pondDesignTemplateId)}
        >
          View Detail
        </Button>
      </>
    ), },
    { title: "Note", dataIndex: "note", key: "note", render: (text: any) => text || "null" }, // Nếu `note` không có giá trị, hiển thị "null"}, 
    {
      title: "Actions",
      key: "actions",
      render: (text: any) => (
        <Button
          type="primary"
          style={{ backgroundColor: "LimeGreen", color: "white" }}
          onClick={handleConsult}
        >
          Consult
        </Button>
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
        width={2000} // Tăng chiều rộng modal lên 2000px (có thể điều chỉnh theo nhu cầu)
        style={{
          maxWidth: "90%", // Đảm bảo modal không quá lớn so với màn hình
          top: 20, // Điều chỉnh vị trí dọc nếu cần
        }}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table dataSource={pondDesignTemplate} columns={columnsPondDesignTemplate}></Table>
      </Modal>
    </div>
  );
}

export default RequestDetailTable;
