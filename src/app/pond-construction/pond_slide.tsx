import { Table, Button, Modal, Form, Input } from "antd";
import { useState, useEffect } from "react";

function Pond_slide() {
  const [datas, setDatas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

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
      const token = localStorage.getItem("token");
      const requestBody = {
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setShowModal(false);
      // alert("Request sent!");

      const token2 = localStorage.getItem("token");
      const requestBodyRequestDetail = {
        pondDesignTemplateId: selectedId,
        requestId: data.id,
      };
      const responseRequestDetail = await fetch(
        "http://localhost:8080/api/requestDetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token2}`,
          },
          body: JSON.stringify(requestBodyRequestDetail),
        }
      );
      alert("Request sent!");
      if (!responseRequestDetail.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (err) {
      alert(err);
    }
  };

  const columns = [
    { title: "Min Size", dataIndex: "minSize", key: "minSize" },
    { title: "Max Size", dataIndex: "maxSize", key: "maxSize" },
    { title: "Water Volume", dataIndex: "waterVolume", key: "waterVolume" },
    { title: "Min Depth", dataIndex: "minDepth", key: "minDepth" },
    { title: "Max Depth", dataIndex: "maxDepth", key: "maxDepth" },
    { title: "Shape", dataIndex: "shape", key: "shape" },
    {
      title: "Filtration System",
      dataIndex: "filtrationSystem",
      key: "filtrationSystem",
    },
    { title: "pH Level", dataIndex: "phLevel", key: "phLevel" },
    {
      title: "Water Temperature",
      dataIndex: "waterTemperature",
      key: "waterTemperature",
    },
    { title: "Pond Liner", dataIndex: "pondLiner", key: "pondLiner" },
    { title: "Pond Bottom", dataIndex: "pondBottom", key: "pondBottom" },
    { title: "Decoration", dataIndex: "decoration", key: "decoration" },
    {
      title: "Min Estimated Cost",
      dataIndex: "minEstimatedCost",
      key: "minEstimatedCost",
    },
    {
      title: "Max Estimated Cost",
      dataIndex: "maxEstimatedCost",
      key: "maxEstimatedCost",
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      dataIndex: "pondDesignTemplateId",
      key: "pondDesignTemplateId",
      render: (pondDesignTemplateId: any) => (
        <>
          <Button
            type="primary"
            danger
            onClick={() => {
              setSelectedId(pondDesignTemplateId);
              setShowModal(true);
            }}
          >
            Consult
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Pond design templates:</h1>
      <Table dataSource={datas} columns={columns}></Table>
      <Modal
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        open={showModal}
        title="Construction history"
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
          <Form.Item label="Note" name="note">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Pond_slide;
