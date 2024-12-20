import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { toast } from "react-toastify";
function DesignProfile() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedDesignProfileId, setSelectedDesignProfileId] = useState<number | null>(null);
  const [designs, setDesigns] = useState([]);
  const [pondDesigns, setPondDesigns] = useState([]);
const [showPondDesignModal, setShowPondDesignModal] = useState(false);

  // Fetch design profiles
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/designProfile/get-design_profiles-by-design_staff",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // Hoặc .json() nếu server trả về JSON
        console.error('Error response:', errorData); // In ra lỗi
        throw new Error("Network response was not ok");
    }
      const data = await response.json();
      console.log(data); // In ra dữ liệu để kiểm tra
      setDatas(data); // Gán dữ liệu vào state
    } catch (err) {
      alert(err);
    }
  };

 
  

  
  
  

  // Create design
  const handleFormCreate = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        design: values.design,
        description: values.description,
        designProfileId: selectedDesignProfileId,
      };
      const response = await fetch(
        "http://localhost:8080/api/design",
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
        throw new Error("Network response was not ok");
      }
      console.log("Design created successfully!");
      setShowModal(false);
      toast.success("Design created!");
    } catch (err) {
      alert(err);
    }
  };

  // Fetch designs by design profile ID
  const handleViewDesign = async (designProfileId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/design/getDesignByDesignProfile/${designProfileId}`,
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
      setDesigns(data);
      setShowDesignModal(true);
    } catch (err) {
      alert(err);
    }
  };
  const handleFinishDesign = async (designId : any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/design/finish-design/${designId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to finish design");
      }
      const updatedDesign = await response.json();
      setDesigns((prevDesigns : any) =>
        prevDesigns.map((design : any) =>
          design.designId === designId ? updatedDesign : design
        )
      );
      toast.success("Design finished successfully!");
    } catch (err) {
      alert(err);
    }
  };
  // view pond design template
  const handleViewPondDesign = async (designProfileId: number) => {
    try {
      const token = localStorage.getItem("token");
      console.log('Starting API call for designProfileId:', designProfileId);
      const response = await fetch(
        `http://localhost:8080/api/pondDesignTemplate/getPondByDesignProfileId/${designProfileId}`,
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
      setPondDesigns(data);
      setShowPondDesignModal(true);
    } catch (err) {
      alert(err);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Define columns for the design profile table
  const columns = [
    {
      title: "DesignProfileID",
      dataIndex: "designProfileId",
      key: "designProfileId",
    },
    {
      title: "QuotationId",
      dataIndex: "quotationId",
      key: "quotationId",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "ConstructionStatus",
      dataIndex: "constructionStatus",
      key: "constructionStatus",
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
      title: "Action",
      dataIndex: "designProfileId",
      key: "designProfileId",
      render: (designProfileId: number) => (
        <>
          <Button
            type="primary"
            danger
            style={{ marginRight: "3px" }}
            onClick={() => {
              setSelectedDesignProfileId(designProfileId);
              setShowModal(true);
            }}
          >
            Create Design
          </Button>
          <Button
            type="default"
            onClick={() => handleViewDesign(designProfileId)}
          >
            View Designs
          </Button>
          <Button 
        type="primary"
        onClick={() => handleViewPondDesign(designProfileId)}
      >
        View Pond 
      </Button>
        </>
      ),
    },
  ];

  // Define columns for the design table
  const columnsDesign = [
    // {
    //   title: "DesignProfileID",
    //   dataIndex: "designProfileId",
    //   key: "designProfileId",
    // },
    {
      title: "Design",
      dataIndex: "design",
      key: "design",
    },
    {
      title: "DesignStatus",
      dataIndex: "designStatus",
      key: "designStatus",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
        key: "action",
        // render: (design: any) => (
            // <Popconfirm
            //     title="Finish"
            //     color="red"
            //     description="Do you want to finish this construction?"
            //     onConfirm={() => handleFinishDesign(design.designId)}
            // >
            //     <Button style={{ backgroundColor: "red", color: "white" }}>
            //         Finish
            //     </Button>
            // </Popconfirm>
          
        
          render: (design: any) => (
            design.designStatus == "Complete"? (
              <Button disabled style={{ backgroundColor: "gray", color: "white" }}>
                Finished
              </Button>
            ) : (
              <Popconfirm
                title="Finish"
                color="red"
                description="Do you want to finish this construction?"
                onConfirm={() => handleFinishDesign(design.designId)}
              >
                <Button style={{ backgroundColor: "red", color: "white" }}>
                  Finish
                </Button>
              </Popconfirm>
              
            )
            
          ),
        }
    //    ),
    // },
  ];
  // pond design template
  const pondDesignColumns = [
    {
      title: "Min_Size",
      dataIndex: "minSize",
      key: "minSize"
    },
    {
      title: "Max_Size",
      dataIndex: "maxSize",
      key: "maxSize"
    },
    {
      title: "Water Volume",
      dataIndex: "waterVolume",
      key: "waterVolume"
    },
    {
      title: "Min_Depth",
      dataIndex: "minDepth",
      key: "minDepth"
    },
    {
      title: "Max_Depth",
      dataIndex: "maxDepth",
      key: "maxDepth"
    },
    {
      title: "Shape",
      dataIndex: "shape",
    },
    {
      title: "Filtration System",
      dataIndex: "filtrationSystem",
    },
    {
      title: "PH Level",
      dataIndex: "phLevel",
      key: "phLevel"
    },
    {
      title: "Water Temperature",
      dataIndex: "waterTemperature",
      key:"waterTemperature"
    },
    {
      title: "Pond Liner",
      dataIndex: "pondLiner",
      key:"pondLiner"
    },
    {
      title: "Pond Bottom",
      dataIndex: "pondBottom",
      key:"pondBottom"
    },
    {
      title: "Decoration",
      dataIndex: "decoration",
    },
    {
      title: "Min Estimated Cost",
      dataIndex: "minEstimatedCost",
    },
    {
      title: "Max Estimated Cost",
      dataIndex: "maxEstimatedCost",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl : any) => <img src={imageUrl} alt="pond" style={{ width: 100 }} />,
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Note",
      dataIndex: "note",
    },
  ];

  return (
    <div>
      <Table dataSource={datas} columns={columns}></Table>
      <Modal
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        open={showModal}
        title="Create Design"
      >
        <Form onFinish={handleFormCreate} form={form} labelCol={{ span: 24 }}>
          <Form.Item
            label="Design"
            name="design"
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
        onCancel={() => setShowDesignModal(false)}
        open={showDesignModal}
        title="Designs"
        width={1000} // Tăng độ rộng của modal
        footer ={null}
      >
        <div style={{ overflowX: 'auto' }}> {/* Thêm wrapper div với overflow */}
          <Table 
            dataSource={designs} 
            columns={columnsDesign} 
            pagination={false}
            scroll={{ x: 800 }} // Thêm scroll cho table
          />
        </div>
      </Modal>
      <Modal
      onCancel={() => setShowPondDesignModal(false)}
      open={showPondDesignModal}
      title="Pond Design Templates"
      width={1000}
      footer ={null}
    >
      <div style={{ overflowX: 'auto' }}>
        <Table 
          dataSource={pondDesigns} 
          columns={pondDesignColumns}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      </div>
    </Modal>
    </div>
  );
}

export default DesignProfile;


