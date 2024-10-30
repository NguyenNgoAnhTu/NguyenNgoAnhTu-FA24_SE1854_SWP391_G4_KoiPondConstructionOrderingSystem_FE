import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
} from "antd";

function ConstructionHistory() {
  const [datas, setDatas] = useState([]);
  const [datasHistory, setDatasHistory] = useState([]);
  const [datasDocument, setDatasDocument] = useState<DocumentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormDocumentModal, setShowFormDocumentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedDesignProfileId, setSelectedDesignProfileId] = useState(null);

  type DocumentType = {
    acceptanceDocumentId: number;
    confirmDate: Date;
    description: string;
    confirmCustomerName: string;
    confirmConstructorName: string;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/construction_history/get-design_profiles-by-constructor",
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

  const fetchDataHistory = async (designProfileId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/construction_history/get-construction_history-by-id/${designProfileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setDatasHistory(data);
      setShowHistoryModal(true);
    } catch (err) {
      alert(err);
    }
  };

  const fetchDataDocument = async (designProfileId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/construction_history/get-acceptance_document-by-id/${designProfileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error("There is no document!");
      }

      const data = await response.json();
      setDatasDocument([data]);
      setShowDocumentModal(true);
    } catch (err) {
      alert(err);
    }
  };

  const handleFormCreate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        step: values.step,
        description: values.description,
        designProfileId: selectedDesignProfileId, // Include the stored ID
      };
      const response = await fetch(
        "http://localhost:8080/api/construction_history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error("This design profile is already completed!");
      }
      console.log("Construction history created successfully!");
      setShowModal(false);
      alert("Construction history created!");
    } catch (err) {
      alert(err);
    }
  };

  const handleDocumentCreate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        description: values.description,
        confirmDate: values.confirmDate,
        confirmCustomerName: values.confirmCustomerName,
        confirmConstructorName: values.confirmConstructorName,
        designProfileId: selectedDesignProfileId, // Include the stored ID
      };
      const response = await fetch(
        "http://localhost:8080/api/construction_history/acceptance_document",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error(
          "This design profile is either already finished or has a document!"
        );
      }
      console.log("Construction history created successfully!");
      setShowFormDocumentModal(false);
      alert("Acceptance document created!");
    } catch (err) {
      alert(err);
    }
  };

  const handleFinish = async (designProfileId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/construction_history/finish-construction/${designProfileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("This design profile has already completed!");
      }
      console.log("Construction finished successfully!");
      alert("Construction finished!");
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columnsHistory = [
    {
      title: "ID",
      dataIndex: "constructionHistoryId",
      key: "constructionHistoryId",
    },
    {
      title: "Step",
      dataIndex: "step",
      key: "step",
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
    {
      title: "Created",
      dataIndex: "createDate",
      key: "createDate",
    },
  ];

  const columnsDocument = [
    {
      title: "ID",
      dataIndex: "acceptanceDocumentId",
      key: "acceptanceDocumentId",
    },
    {
      title: "Confirm date",
      dataIndex: "confirmDate",
      key: "confirmDate",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Customer",
      dataIndex: "confirmCustomerName",
      key: "confirmCustomerName",
    },
    {
      title: "Staff",
      dataIndex: "confirmConstructorName",
      key: "confirmConstructorName",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "designProfileId",
      key: "designProfileId",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contruction status",
      dataIndex: "contructionStatus",
      key: "contructionStatus",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "designProfileId",
      key: "designProfileId",
      render: (designProfileId: any) => (
        <>
          <Button
            style={{
              marginRight: "3px",
              backgroundColor: "DodgerBlue",
              color: "white",
            }}
            onClick={() => {
              setSelectedDesignProfileId(designProfileId);
              setShowModal(true);
            }}
          >
            Create history
          </Button>
          <Button
            style={{
              marginRight: "3px",
              backgroundColor: "LimeGreen",
              color: "white",
            }}
            onClick={() => fetchDataHistory(designProfileId)}
          >
            View history
          </Button>
          <Button
            style={{
              marginRight: "3px",
              backgroundColor: "DodgerBlue",
              color: "white",
            }}
            onClick={() => {
              setSelectedDesignProfileId(designProfileId);
              setShowFormDocumentModal(true);
            }}
          >
            Create document
          </Button>
          <Button
            type="primary"
            danger
            style={{
              marginRight: "3px",
              backgroundColor: "LimeGreen",
              color: "white",
            }}
            onClick={() => fetchDataDocument(designProfileId)}
          >
            View document
          </Button>
          <Popconfirm
            title="Finish"
            color="red"
            cancelButtonProps={{ style: { color: "white" } }}
            okButtonProps={{ style: { borderColor: "white" } }}
            description="Do you want to finish this construction?"
            onConfirm={() => handleFinish(designProfileId)}
          >
            <Button style={{ backgroundColor: "red", color: "white" }}>
              Finish
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <div>
      <Table dataSource={datas} columns={columns}></Table>
      <Modal
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        open={showModal}
        title="Construction history"
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Form onFinish={handleFormCreate} form={form} labelCol={{ span: 24 }}>
          <Form.Item
            label="Step"
            name="step"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        onCancel={() => setShowFormDocumentModal(false)}
        onOk={() => form.submit()}
        open={showFormDocumentModal}
        title="Acceptance document"
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Form
          onFinish={handleDocumentCreate}
          form={form}
          labelCol={{ span: 24 }}
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Confirm date"
            name="confirmDate"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Customer"
            name="confirmCustomerName"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Staff"
            name="confirmConstructorName"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={showHistoryModal}
        title="Construction histories"
        onCancel={() => setShowHistoryModal(false)}
        onOk={() => setShowHistoryModal(false)}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table dataSource={datasHistory} columns={columnsHistory}></Table>
      </Modal>
      <Modal
        open={showDocumentModal}
        title="Acceptance documents"
        onCancel={() => setShowDocumentModal(false)}
        onOk={() => setShowDocumentModal(false)}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table dataSource={datasDocument} columns={columnsDocument}></Table>
      </Modal>
    </div>
  );
}

export default ConstructionHistory;
