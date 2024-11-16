import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ConstructionInfomation() {
    const [datas, setDatas] = useState([]);
    const [datasHistory, setDatasHistory] = useState([]);
    const [datasDocument, setDatasDocument] = useState<DocumentType[]>([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const [showDesignModal, setShowDesignModal] = useState(false);
    const [designs, setDesigns] = useState([]);
    

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

      const handleShowMore = () => {
        setVisibleCount(prev => prev + 6);
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
              <Button
            type="primary"
            danger
                style={{
                  marginRight: "3px",
                  backgroundColor: "LimeGreen",
                  color: "white",
                }}
            onClick={() => handleViewDesign(designProfileId)}
          >
            View Designs
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
          title: "Start date",
          dataIndex: "startDate",
          key: "startDate",
        },
        {
          title: "Expected end date",
          dataIndex: "endDate",
          key: "endDate",
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
      ];
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
        <div className="container mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datas.slice(0, visibleCount).map((data: any) => (
              <div
                key={data.designProfileId}
                className="rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-center mb-4">
                  Design Profile ID: {data.designProfileId}
                </h3>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Address:</strong> {data.address}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Construction Status:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${data.contructionStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      data.contructionStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {data.contructionStatus}
                  </span>
                </p>

                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => fetchDataHistory(data.designProfileId)}
                    className="text-white bg-green hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2"
                  >
                    View History
                  </button>
                  <button
                    onClick={() => fetchDataDocument(data.designProfileId)}
                    className="text-white bg-green hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2"
                  >
                    View Document
                  </button>
                  <button
                    onClick={() => handleViewDesign(data.designProfileId)}
                    className="text-white bg-green hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2"
                  >
                    View Designs
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < datas.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="mx-1 text-white bg-red hover:bg-red-32 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
              >
                Show More
              </button>
            </div>
          )}

          {/* Modals */}
          <Modal
            width={1200}
            open={showHistoryModal}
            title={
              <h3 className="text-lg font-semibold">
                Construction Histories
              </h3>
            }
            onCancel={() => setShowHistoryModal(false)}
            onOk={() => setShowHistoryModal(false)}
            okButtonProps={{
              className: "bg-blue-600 hover:bg-blue-700"
            }}
          >
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <Table 
                dataSource={datasHistory} 
                columns={columnsHistory} 
                scroll={{ x: 600, y: 400 }}
                className="min-w-full"
                rowClassName="hover:bg-gray-50 transition duration-200"
              />
            </div>
          </Modal>

          <Modal
            width={1200}
            open={showDocumentModal}
            title={
              <h3 className="text-lg font-semibold">
                Acceptance Documents
              </h3>
            }
            onCancel={() => setShowDocumentModal(false)}
            onOk={() => setShowDocumentModal(false)}
            okButtonProps={{
              className: "bg-blue-600 hover:bg-blue-700"
            }}
          >
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <Table 
                dataSource={datasDocument} 
                columns={columnsDocument} 
                scroll={{ x: 600, y: 400 }}
                className="min-w-full"
                rowClassName="hover:bg-gray-50 transition duration-200"
              />
            </div>
          </Modal>

          <Modal
            width={1200}
            open={showDesignModal}
            title={
              <h3 className="text-lg font-semibold">
                Designs
              </h3>
            }
            onCancel={() => setShowDesignModal(false)}
            onOk={() => setShowDesignModal(false)}
            okButtonProps={{
              className: "bg-blue-600 hover:bg-blue-700"
            }}
          >
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <Table 
                dataSource={designs} 
                columns={columnsDesign} 
                scroll={{ x: 600, y: 400 }}
                className="min-w-full"
                rowClassName="hover:bg-gray-50 transition duration-200"
              />
            </div>
          </Modal>
        </div>
      );
}

export default ConstructionInfomation;