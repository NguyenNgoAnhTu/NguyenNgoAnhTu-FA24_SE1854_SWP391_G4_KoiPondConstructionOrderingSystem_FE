import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Table, Upload } from "antd";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { UploadOutlined } from "@ant-design/icons";

function ConstructionHistory() {
  const [datas, setDatas] = useState([]);
  const [datasHistory, setDatasHistory] = useState([]);
  const [datasDocument, setDatasDocument] = useState<DocumentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormDocumentModal, setShowFormDocumentModal] = useState(false);
  const [showUpdateFormDocumentModal, setShowUpdateFormDocumentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedDesignProfileId, setSelectedDesignProfileId] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [constructors, setConstructors] = useState<StaffType[]>([]);

  type DocumentType = {
    acceptanceDocumentId: number;
    confirmDate: Date;
    description: string;
    confirmCustomerName: string;
    confirmConstructorName: string;
    fileUrl: string;
  };
  type StaffType = {
    name: string;
  };

//Handle upload

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const handleUpload = (file: any, onSuccess: any, onError: any) => {
  const storageRef = ref(storage, `uploads/${file.name}`);
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

//Handle upload

  const fetchData = async (address: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/construction_history/get-design_profiles-by-constructor-and-address?address=${encodeURIComponent(address)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      setDatas(data);
    } catch (err: any) {
      toast.error(err.message);
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
        }
      );
      if (!response.ok) {
        toast.error("Network response was not ok.");
        return;
      }

      const data = await response.json();
      setDatasHistory(data);
      setShowHistoryModal(true);
    } catch (err: any) {
      toast.error(err.message);
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
        }
      );
      if (!response.ok) {
        toast.error("There is no document!");
        return;
      }

      const data = await response.json();
      setDatasDocument([data]);
      setShowDocumentModal(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchDataStaffs = async (designProfileId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/customer/getStaffsByDesignProfileId/${designProfileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("No staffs found");
        return;
      }

      const data = await response.json();
      setConstructors(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFormCreate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        step: values.step,
        description: values.descriptionH,
        startDate: values.startDate,
        endDate: values.endDate,
        note: values.note,
        designProfileId: selectedDesignProfileId,
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
        toast.error("This design profile is already completed!");
        return;
      }
      console.log("Construction history created successfully!");
      setShowModal(false);
      toast.success("Construction history created!");
      fetchData("");
      form.resetFields();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDocumentCreate = async (values: any) => {
    try {
      const fileUrl = values.fileUrl[0]?.response || values.fileUrl[0]?.url;

      if (!fileUrl) {
      throw new Error("File upload failed or URL is missing");
      }

      const token = localStorage.getItem("token");
      const requestBody = {
        description: values.description,
        confirmDate: values.confirmDate,
        confirmCustomerName: values.confirmCustomerName,
        confirmConstructorName: values.confirmConstructorName,
        designProfileId: selectedDesignProfileId, // Include the stored ID
        fileUrl: fileUrl,
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
        toast.error(
          "This design profile is either already finished or has a document!"
        );
        return;
      }
      console.log("Construction history created successfully!");
      setShowFormDocumentModal(false);
      toast.success("Acceptance document created!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDocumentUpdate = async (values: any) => {
    try {
      const fileUrl = values.fileUrl[0]?.response || values.fileUrl[0]?.url;

      if (!fileUrl) {
      throw new Error("File upload failed or URL is missing");
      }

      const token = localStorage.getItem("token");
      const requestBody = {
        description: values.description,
        confirmDate: values.confirmDate,
        confirmCustomerName: values.confirmCustomerName,
        confirmConstructorName: values.confirmConstructorName,
        fileUrl: fileUrl,
      };
      const response = await fetch(
        `http://localhost:8080/api/construction_history/update-document/${selectedDocumentId}`,
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
        toast.error(
          "This design profile is either already finished or has a document!"
        );
        return;
      }
      console.log("Construction history created successfully!");
      setShowUpdateFormDocumentModal(false);
      setShowDocumentModal(false);
      toast.success("Acceptance document updated!");
    } catch (err: any) {
      toast.error(err.message);
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
        toast.error("This design profile has already completed!");
        return;
      }
      console.log("Construction finished successfully!");
      toast.success("Construction finished!");
      fetchData("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (constructionHistoryId: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/construction_history/delete-construction_history/${constructionHistoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        toast.error("You don't have permission!");
        return;
      }
      console.log("Deleted successfully!");
      toast.success("Deleted successfully!");
      setShowHistoryModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchData("");
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
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: any) => {
        const date = new Date(startDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      title: "Expected end date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate: any) => {
        const date = new Date(endDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        return `${formattedDate} ${formattedTime}`;
      },
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
      render: (createDate: any) => {
        const date = new Date(createDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      title: "Action",
      dataIndex: "constructionHistoryId",
      key: "constructionHistoryId",
      render: (constructionHistoryId: any) => (
        <>
          <Popconfirm
            title="Delete"
            color="orange"
            cancelButtonProps={{ style: { color: "white" } }}
            okButtonProps={{ style: { borderColor: "white" } }}
            description="Do you want to delete this?"
            onConfirm={() => handleDelete(constructionHistoryId)}
          >
            <Button style={{ backgroundColor: "red", color: "white" }}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
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
      render: (confirmDate: any) => {
        const date = new Date(confirmDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        return `${formattedDate} ${formattedTime}`;
      },
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
    {
      title: "PDF file",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (text: any, record: any) => (
        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
          View
        </a>
      ),
    },
    {
      title: "Action",
      dataIndex: "acceptanceDocumentId",
      key: "acceptanceDocumentId",
      render: (acceptanceDocumentId: any) => (
        <>
          <Button
            style={{
              marginRight: "3px",
              backgroundColor: "DodgerBlue",
              color: "white",
            }}
            onClick={() => {
              setSelectedDocumentId(acceptanceDocumentId);
              setShowUpdateFormDocumentModal(true);
            }}
          >
            Update
          </Button>
        </>
      ),
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
            onClick={() => {
              setSelectedDesignProfileId(designProfileId);
              fetchDataDocument(designProfileId)
            }}
          >
            View document
          </Button>
          <Popconfirm
            title="Finish"
            color="orange"
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
      <Input.Search
        placeholder="Address"
        enterButton="Search"
        size="large"
        onSearch={(value) => fetchData(value)}
        style={{
          marginLeft: 18,
          marginTop: 10,
          marginBottom: 10,
          width: "82%",
          backgroundColor: "DodgerBlue",
        }}
      />
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
            name="descriptionH"
            rules={[{ required: true, message: "Cannot be blank!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Start date"
            name="startDate"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker showTime/>
          </Form.Item>
          <Form.Item
            label="Expected end date"
            name="endDate"
            dependencies={["startDate"]}
            rules={[
              { required: true, message: "Please select a date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue("startDate");
                  if (!value || !startDate || value.isAfter(startDate)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End date must be later than start date!")
                  );
                },
              }),
            ]}
          >
            <DatePicker showTime/>
          </Form.Item>
          <Form.Item label="Note" name="note">
            <Input />
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
            <DatePicker showTime
              disabledDate={(current) => current && current.isAfter(new Date())}
            />
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
            <Select
              showSearch
              placeholder="Select a constructor"
              onFocus={() => fetchDataStaffs(selectedDesignProfileId)}
            >
              {constructors.map((constructor) => (
                <Select.Option key={constructor.name} value={constructor.name}>
                  {constructor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
              handleUpload(file, onSuccess, onError)
              }
              listType="text"
            >
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        width={1200}
        open={showHistoryModal}
        title="Construction histories"
        onCancel={() => setShowHistoryModal(false)}
        onOk={() => setShowHistoryModal(false)}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table
          dataSource={datasHistory}
          columns={columnsHistory}
          scroll={{ x: 600, y: 400 }}
        ></Table>
      </Modal>


      <Modal
        width={1200}
        open={showDocumentModal}
        title="Acceptance documents"
        onCancel={() => setShowDocumentModal(false)}
        onOk={() => setShowDocumentModal(false)}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table
          dataSource={datasDocument}
          columns={columnsDocument}
          scroll={{ x: 600, y: 400 }}
        ></Table>
      </Modal>


      <Modal
        onCancel={() => setShowUpdateFormDocumentModal(false)}
        onOk={() => form.submit()}
        open={showUpdateFormDocumentModal}
        title="Update Acceptance document"
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Form
          onFinish={handleDocumentUpdate}
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
            <DatePicker showTime
              disabledDate={(current) => current && current.isAfter(new Date())}
            />
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
            <Select
              showSearch
              placeholder="Select a constructor"
              onFocus={() => fetchDataStaffs(selectedDesignProfileId)}
            >
              {constructors.map((constructor) => (
                <Select.Option key={constructor.name} value={constructor.name}>
                  {constructor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Document PDF"
            name="fileUrl"
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

export default ConstructionHistory;
