import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Designers() {
    const [datas, setDatas] = useState([]);
    const [datasDesignProfiles, setDatasDesignProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const fetchData = async (name: any) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/api/customer/getDesignersOrderByDesignProfiles?name=${encodeURIComponent(name)}`,
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

      const fetchDataDesignProfiles = async (staffId: any) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/api/designProfile/getByStaffId/${staffId}`,
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
          setDatasDesignProfiles(data);
          setShowModal(true);
        } catch (err: any) {
          toast.error(err.message);
        }
      };

      const columns = [
        {
          title: "ID",
          dataIndex: "customerId",
          key: "customerId",
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Phone",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
          title: "Action",
          dataIndex: "customerId",
          key: "customerId",
          render: (customerId: any) => (
            <>
              <Button
                type="primary"
                danger
                style={{
                  marginRight: "3px",
                  backgroundColor: "LimeGreen",
                  color: "white",
                }}
                onClick={() => {
                  setSelectedCustomerId(customerId);
                  fetchDataDesignProfiles(customerId)
                }}
              >
                View task
              </Button>
            </>
          ),
        },
      ];

      const columnsDesignProfiles = [
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
      ];

useEffect(() => {
 fetchData("");
}, []);
  return (
    <div>
        <Input.Search
        placeholder="Name"
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
        width={1200}
        open={showModal}
        title="Design profiles"
        onCancel={() => setShowModal(false)}
        onOk={() => setShowModal(false)}
        okButtonProps={{
          style: { backgroundColor: "DodgerBlue", borderColor: "DodgerBlue" },
        }}
      >
        <Table
          dataSource={datasDesignProfiles}
          columns={columnsDesignProfiles}
          scroll={{ x: 600, y: 400 }}
        ></Table>
      </Modal>
    </div>
  )
}

export default Designers;