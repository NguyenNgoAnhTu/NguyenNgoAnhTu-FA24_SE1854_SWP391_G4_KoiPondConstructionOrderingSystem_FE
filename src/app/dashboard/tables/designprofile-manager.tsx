import { useEffect, useState } from "react";
import { Button, Form, Modal, Select, Table } from "antd";
import { toast } from "react-toastify";

interface Staff {
  customerId: number; // Thay đổi từ id sang customerId
  name: string;
  role: string;
}
function DesignProfile() {
  const [datas, setDatas] = useState([]);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [designs, setDesigns] = useState([]); // Dữ liệu thiết kế
  const [designStaff, setDesignStaff] = useState<Staff[]>([]); // Danh sách nhân viên thiết kế
  const [constructionStaff, setConstructionStaff] = useState<Staff[]>([]); // Danh sách nhân viên thi công
  const [selectedDesignStaff, setSelectedDesignStaff] = useState<number[]>([]); // Nhân viên thiết kế được chọn
  const [selectedConstructionStaff, setSelectedConstructionStaff] = useState<number[]>([]); // Nhân viên thi công được chọn
  const [selectedDesignProfileId, setSelectedDesignProfileId] = useState<number | null>(null); // ID thiết kế được chọn

  // Fetch design profiles
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/designProfile",
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
      console.log(data); // In ra dữ liệu để kiểm tra
      setDatas(data); // Gán dữ liệu vào state
    } catch (err) {
      alert(err);
    }
  };
  

  // Fetch staffs by role
  const fetchStaffsByRole = async (role: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/customer/${role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Data Staff Not Found");
      }

      const data: Staff[] = await response.json();
      if (role === "DESIGNER") {
        setDesignStaff(data); // Lưu danh sách nhân viên thiết kế
      } else if (role === "CONSTRUCTOR") {
        setConstructionStaff(data); // Lưu danh sách nhân viên thi công
      }
    } catch (err) {
      alert(err);
    }
  };

  // Open assign staff modal
  const handleOpenAssignModal = (designProfileId: number) => {
    setSelectedDesignProfileId(designProfileId);
    fetchStaffsByRole("DESIGNER"); // Lấy danh sách nhân viên thiết kế
    fetchStaffsByRole("CONSTRUCTOR"); // Lấy danh sách nhân viên thi công
    setShowAssignModal(true); // Mở modal
  };

  // Assign staff
  const handleAssignStaff = async () => {
    try {
      const requestBody = [...selectedDesignStaff, ...selectedConstructionStaff]; // Mảng các ID
      const token = localStorage.getItem("token");
const response = await fetch(
  `http://localhost:8080/api/manager/${selectedDesignProfileId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody), // Gửi mảng này
  }
);

      if (!response.ok) {
        const errorMessage = await response.text(); // Lấy nội dung phản hồi
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }

      toast.success("Assign Staff Successfully!");
      setShowAssignModal(false);
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
            type="default"
            onClick={() => handleOpenAssignModal(designProfileId)} 
          >
            Assign Staff
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
  ];

  return (
    <div>
      <Table dataSource={datas} columns={columns} />

      <Modal
        onCancel={() => setShowDesignModal(false)}
        open={showDesignModal}
        title="Designs"
      >
        <Table dataSource={designs} columns={columnsDesign} pagination={false} />
      </Modal>

      <Modal
        title="Assign Staff"
        visible={showAssignModal}
        onOk={handleAssignStaff}
        onCancel={() => setShowAssignModal(false)}
      >
        <h3>DESIGNER</h3>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '20px' }}
          placeholder="Select designer"
          onChange={setSelectedDesignStaff}
          options={designStaff.map(staff => ({
            label: staff.name,
            value: staff.customerId, // Sử dụng customerId
          }))}
        />

        <h3>CONSTRUCTOR</h3>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select constructor "
          onChange={setSelectedConstructionStaff}
          options={constructionStaff.map(staff => ({
            label: staff.name,
            value: staff.customerId, // Sử dụng customerId
          }))}
        />
      </Modal>
    </div>
  );
}

export default DesignProfile;


