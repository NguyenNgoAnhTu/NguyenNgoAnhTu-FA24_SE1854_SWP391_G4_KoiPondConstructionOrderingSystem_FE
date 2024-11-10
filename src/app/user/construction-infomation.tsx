import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ConstructionInfomation() {
    const [datas, setDatas] = useState([]);
    const [datasHistory, setDatasHistory] = useState([]);
    const [datasDocument, setDatasDocument] = useState<DocumentType[]>([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://localhost:8080/api/construction_history/get-design_profiles-by-customer",
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

      useEffect(() => {
        fetchData();
      }, []);

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
                  backgroundColor: "LimeGreen",
                  color: "white",
                }}
                onClick={() => fetchDataHistory(designProfileId)}
              >
                View history
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
            </>
          ),
        },
      ];

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
  return (
    <div>
        <Table dataSource={datas} columns={columns}></Table>

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
  )
}

export default ConstructionInfomation;