import { Modal, Form, Input } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Typography from "components/typography";

function Pond_slide() {
  const [datas, setDatas] = useState<PondDesignTemplateType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const customerId = localStorage.getItem("customerId");

  type PondDesignTemplateType = {
    pondDesignTemplateId: number;
    minSize: number;
    maxSize: number;
    waterVolume: number;
    minDepth: number;
    maxDepth: number;
    shape: string;
    filtrationSystem: string;
    phLevel: number;
    waterTemperature: number;
    pondLiner: string;
    pondBottom: string;
    decoration: string;
    minEstimatedCost: number;
    maxEstimatedCost: number;
    imageUrl: string;
    description: string;
  };

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
        toast.error("Network response was not ok");
      }

      const data = await response.json();
      setDatas(data);
    } catch (err) {
      alert(err);
    }
  };

  const handleFormCreate = async (values: any) => {
    try {
      if (!selectedId) {
        toast.error("Please select a pond design template");
      }

      if (!customerId) {
        toast.error("No customer ID found. Please login again.");
      }

      const token = localStorage.getItem("token");

      // First update the customer's address
      const updateCustomerResponse = await fetch(
        `http://localhost:8080/api/customer/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            phoneNumber: localStorage.getItem("phone"),
            address: values.address
          }),
        }
      );

      if (updateCustomerResponse.ok) {
        // Update localStorage with new address
        localStorage.setItem("address", values.address);
      } else {
        toast.error("Failed to update customer address");
        return;
      }

      const requestBody = {
        customerId: customerId,
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
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create service request");
      }

      const requestData = await response.json();

      const requestBodyRequestDetail = {
        pondDesignTemplateId: selectedId,
        requestId: requestData.id,
        customerId: customerId,
        note: values.note,
      };

      console.log("Sending request detail:", requestBodyRequestDetail);

      const responseRequestDetail = await fetch(
        "http://localhost:8080/api/requestDetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBodyRequestDetail),
        }
      );

      if (!responseRequestDetail.ok) {
        const errorData = await responseRequestDetail.json();
        toast.error(errorData.message || "Failed to create request detail");
      }

      const requestDetailData = await responseRequestDetail.json();
      console.log("Request detail created:", requestDetailData);

      setShowModal(false);
      toast.success("Request sent successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Thêm useEffect để set giá trị mặc định cho form khi mở modal
  useEffect(() => {
    if (showModal) {
      const savedAddress = localStorage.getItem("address");
      if (savedAddress) {
        form.setFieldsValue({
          address: savedAddress
        });
      }
    }
  }, [showModal, form]);

  return (
    <div className="max-w-[1440px] w-[90%] mx-auto mt-[50px] phone:w-[95%]">
      <div className="flex flex-col gap-6 mb-10">
        <Typography className="text-[38px] font-bold leading-12">
          Pond Design Templates
        </Typography>
        <div className="w-[200px] h-[1px] bg-gray-A0"></div>
        <Typography className="text-[#2B2825] text-[16px]">
          Choose from our carefully crafted pond design templates to create your perfect water feature
        </Typography>
      </div>

      <div className="grid grid-cols-3 gap-8 phone:grid-cols-1 tablet:grid-cols-2">
        {datas.map((data) => (
          <div
            key={data.pondDesignTemplateId}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-[250px] overflow-hidden">
              <img
                src={data.imageUrl}
                alt="Pond Design"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <Typography className="text-[24px] font-bold mb-4 text-center">
                ${data.minEstimatedCost.toLocaleString()} - ${data.maxEstimatedCost.toLocaleString()}
              </Typography>

              <Typography className="text-[18px] font-semibold mb-4 text-center">
                {data.description || "Pond Design"}
              </Typography>

              <div className="space-y-2 text-[#2B2825] text-[16px]">
                <p>Size: {data.minSize} - {data.maxSize} m²</p>
                <p>Water Volume: {data.waterVolume} L</p>
                <p>Depth: {data.minDepth} - {data.maxDepth} m</p>
                <p>Shape: {data.shape}</p>
                <p>Filtration: {data.filtrationSystem}</p>
                <p>pH Level: {data.phLevel}</p>
                <p>Temperature: {data.waterTemperature}°C</p>
                <p>Liner: {data.pondLiner}</p>
                <p>Bottom: {data.pondBottom}</p>
                <p>Decoration: {data.decoration}</p>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    if (!customerId) {
                      toast.error("Please login first");
                      return;
                    }
                    setSelectedId(data.pondDesignTemplateId);
                    setShowModal(true);
                  }}
                  className="bg-green text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors duration-300"
                >
                  Consult Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        open={showModal}
        title={
          <Typography className="text-[24px] font-bold">
            Request Consultation
          </Typography>
        }
        width={600}
        className="custom-modal"
      >
        <Form
          onFinish={handleFormCreate}
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{
            address: localStorage.getItem("address") || "" // Set giá trị mặc định
          }}
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input.TextArea rows={3} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="note"
          >
            <Input.TextArea rows={2} className="rounded-lg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Pond_slide;
