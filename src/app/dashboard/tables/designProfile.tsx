// import { useEffect, useState } from "react";
// import { Button, Form, Input, Modal, Table } from "antd";



// function designProfile() {
//     const [datas, setDatas] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [form] = Form.useForm();
//     const [selectedDesignProfileId, setSelectedDesignProfileId] = useState(null);
//     const [showHistoryModal, setShowHistoryModal] = useState(false);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         "http://localhost:8080/api/designProfile",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       setDatas(data);
//     } catch (err) {
//       alert(err);
//     }
//   };
//   const handleFormCreate = async (values: any) => {
//     try {
//       const token = localStorage.getItem("token");
//       const requestBody = {
//         design:values.design,
//         description: values.description,
//         designProfileId: selectedDesignProfileId,
//       };
//       const response = await fetch(
//         "http://localhost:8080/api/design",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       console.log("Design created successfully!");
//       setShowModal(false);
//       alert("Design created!");
//     } catch (err) {
//       alert(err);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);
//   const columns = [
//     {
//       title: "DesignProfileID",
//       dataIndex: "designProfileId",
//       key: "designProfileId",
//     },
//     {
//       title: "QuotationId",
//       dataIndex: "quotationId",
//       key: "quotationId",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//     },
//     {
//       title: "ConstructionStatus",
//       dataIndex: "constructionStatus",
//       key: "constructionStatus",
//     },
    
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Created",
//       dataIndex: "createDate",
//       key: "createDate",
//     },
//     {
//         title: "Action",
//         dataIndex: "designProfileId",
//         key: "designProfileId",
//         render: (designProfileId: any) => (
//           <>
//             <Button
//               type="primary"
//               danger
//               style={{ marginRight: "3px" }}
//               onClick={() => {
//                 setSelectedDesignProfileId(designProfileId);
//                 setShowModal(true);
//               }}
//             >
//               Create design
//             </Button>
           
//           </>
//         ),
//       },
// ];
// const columnsDesign = [
//     {
//       title: "DesignProfileID",
//       dataIndex: "designProfileId",
//       key: "designProfileId",
//     },
//     {
//       title: "Design",
//       dataIndex: "design",
//       key: "design",
//     },
//     {
//       title: "DesignStatus",
//       dataIndex: "designStatus",
//       key: "designStatus",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
   
    
//   ];

//   return (
//     <div>
//     <Table dataSource={datas} columns={columns}></Table>
//       <Modal
//         onCancel={() => setShowModal(false)}
//         onOk={() => form.submit()}
//         open={showModal}
//         title="Design"
//       >
//         <Form onFinish={handleFormCreate} form={form} labelCol={{ span: 24 }}>
//           <Form.Item
//             label="Design"
//             name="design"
//             rules={[{ required: true, message: "Cannot be blank!" }]}
//           >
//             <Input />
//           </Form.Item>
//           {/* <Form.Item
//             label="DesignStatus"
//             name="designStatus"
//             rules={[{ required: true, message: "Cannot be blank!" }]}
//           >
//             <Input />
//           </Form.Item> */}
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ required: true, message: "Cannot be blank!" }]}
//           >
//             <Input.TextArea />
//           </Form.Item>
//         </Form>
//       </Modal>
      
//     </div>
//   )
// }

// export default designProfile



import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table } from "antd";

function DesignProfile() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [form] = Form.useForm();
  const [selectedDesignProfileId, setSelectedDesignProfileId] = useState<number | null>(null);
  const [designs, setDesigns] = useState([]);

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
      alert("Design created!");
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
      alert("Design finished successfully!");
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
      render: ( design : any) => (
        <Button
        type="primary"
        danger
        style={{ marginRight: "3px" }}
          onClick={() => handleFinishDesign(design.designId)}
        >
          Finish
        </Button>
        
        // {!design.designStatus && ( // Hiển thị nút Confirm nếu chưa xác nhận
        //   <Button type="link" onClick={() => handleConfirm(record.quotationId)}>
        //     Confirm
        //   </Button>
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
      >
        <Table dataSource={designs} columns={columnsDesign} pagination={false} />
      </Modal>
    </div>
  );
}

export default DesignProfile;



