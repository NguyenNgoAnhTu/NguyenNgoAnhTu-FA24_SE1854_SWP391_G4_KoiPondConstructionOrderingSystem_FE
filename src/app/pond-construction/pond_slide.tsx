import { Table, Button, Modal, Form, Input, Card, Row, Col } from "antd";
import { useState, useEffect } from "react";

function Pond_slide() {
  const [datas, setDatas] = useState<PondDesignTemplateType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const customerId = localStorage.getItem("customerId");

  type PondDesignTemplateType = {
    pondDesignTemplateId: number;
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
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/pondDesignTemplate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setDatas(data);
    } catch (err) {
      alert(err);
    }
  };

  const handleFormCreate = async (values: any) => {
    try {
      if (!selectedId) {
        throw new Error("Please select a pond design template");
      }

      if (!customerId) {
        throw new Error("No customer ID found. Please login again.");
      }

      const token = localStorage.getItem("token");
      
      const requestBody = {
        customerId: customerId,
        description: values.description,
        address: values.address,
        note: values.note,
      };

      const response = await fetch("http://localhost:8080/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create service request");
      }

      const requestData = await response.json();
      
      const requestBodyRequestDetail = {
        pondDesignTemplateId: selectedId,
        requestId: requestData.id,
        customerId: customerId,
        note: values.note,
      };

      console.log("Sending request detail:", requestBodyRequestDetail);

      const responseRequestDetail = await fetch(
        "http://localhost:8080/api/requestDetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBodyRequestDetail),
        }
      );

      if (!responseRequestDetail.ok) {
        const errorData = await responseRequestDetail.json();
        throw new Error(errorData.message || "Failed to create request detail");
      }

      const requestDetailData = await responseRequestDetail.json();
      console.log("Request detail created:", requestDetailData);

      setShowModal(false);
      alert("Request sent successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Pond design templates:</h1>
      <Row gutter={[16, 16]}>
        {datas.map((data) => (
          <Col span={8} key={data.pondDesignTemplateId}>
            <Card
              hoverable
              cover={
                <img
                  alt="Pond Design"
                  src={data.imageUrl}                  
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              style={{ textAlign: "center" }}
            >
              <h2 style={{ margin: 0 }}>
                ${data.minEstimatedCost} - ${data.maxSizmaxEstimatedCoste}
              </h2>
              <h3>{data.description || "Pond Design"}</h3>
              <p>Min Size: {data.minSize} | Max Size: {data.maxSize}</p>
              <p>Water Volume: {data.waterVolume}</p>
              <p>Min Depth: {data.minDepth}</p>
              <p>Max Depth: {data.maxDepth}</p>
              <p>Shape: {data.shape}</p>
              <p>Filtration System: {data.filtrationSystem}</p>
              <p>pH Level: {data.phLevel}</p>
              <p>Water Temperature: {data.waterTemperature}°C</p>
              <p>Pond Liner: {data.pondLiner}</p>
              <p>Pond Bottom: {data.pondBottom}</p>
              <p>Decoration: {data.decoration}</p>
              <Button
                type="primary"
                danger
                onClick={() => {
                  if (!customerId) {
                    alert("Please login first");
                    return;
                  }
                  setSelectedId(data.pondDesignTemplateId);
                  setShowModal(true);
                  console.log("Selected template ID:", data.pondDesignTemplateId);
                  console.log("Customer ID:", customerId);
                }}
              >
                Consult
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        open={showModal}
        title="Request"
      >
        <Form onFinish={handleFormCreate} form={form} labelCol={{ span: 24 }}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Note"
            name="note"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Pond_slide;
