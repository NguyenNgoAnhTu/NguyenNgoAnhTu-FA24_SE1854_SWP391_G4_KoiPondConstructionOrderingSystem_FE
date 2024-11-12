import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";


type QuotationType = {
    quotationId: number;
    customerId: number;
    consultId: number;
    mainCost: number;
    subCost: number;
    vat: number;
    description: string;
    createDate: string; 
    isConfirm: boolean; 
  };
function Quotation() {
    const [datas, setDatas] = useState<QuotationType[]>([]);
    
const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/quotation/getQuotationByCustomer",
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
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
   
    {
        title: "QuotationID",
        dataIndex: "quotationId",
        key: "quotationId",
      },
      {
        title: "ConsultId",
        dataIndex: "consultId",
        key: "consultId",
      },
    //   {
    //     title: "CustomerId",
    //     dataIndex: "customerId",
    //     key: "customerId",
    //   },
      {
        title: "MainCost",
        dataIndex: "mainCost",
        key: "mainCost",
      },
      {
        title: "SubCost",
        dataIndex: "subCost",
        key: "subCost",
      },
      {
        title: "TotalCost",
        dataIndex: "total", 
        key: "total",
      },
      {
        title: "VAT",
        dataIndex: "vat",
        key: "vat",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    //   {
    //     title: "Created",
    //     dataIndex: "createDate",
    //     key: "createDate",
    //   },
    //   {
    //     title: "Updated",
    //     dataIndex: "updateDate",
    //     key: "updateDate",
    //   },

];
return (
    <div>
      <Table dataSource={datas} columns={columns} />
      </div>
  );
}

export default Quotation;
      