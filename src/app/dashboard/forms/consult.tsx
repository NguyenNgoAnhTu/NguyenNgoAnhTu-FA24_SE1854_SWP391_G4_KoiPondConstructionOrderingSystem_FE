import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ConsultForm = () => {
  const location = useLocation();
  const { customerId, requestDetailId } = location.state || {};

  const [customerName, setCustomerName] = useState<string>("");
  const [formData, setFormData] = useState({
    customerId: customerId || "",
    description: "",
    consultDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    isCustomerConfirm: false,
    requestDetailId: requestDetailId || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    customerId: "",
    description: "",
    consultDate: "",
    requestDetailId: "",
  });

  //const [requestDetail, setRequestDetail] = useState([]); // Lưu danh sách requestDetails

  const navigate = useNavigate();

  // Fetch requestDetails khi component được mount
  // useEffect(() => {
  //   const fetchRequestDetail = async () => {
  //     const token = localStorage.getItem("token");
  //     try {
  //       const response = await fetch("http://localhost:8080/api/requestDetail", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         setRequestDetail(data); // Lưu toàn bộ request details vào state
  //       } else {
  //         console.error("Failed to fetch request details");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching request details:", error);
  //     }
  //   };
  //   fetchRequestDetail();
  // }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
      // Xóa customerName khi người dùng bắt đầu nhập ID mới
      setCustomerName("");
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      if (!formData.customerId) {
        setCustomerName("");
        return;
      }

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/customer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const customers = await response.json();
          // Tìm customer có id trùng với formData.customerId
          const customer = customers.find(
            (c: any) => c.customerId === parseInt(formData.customerId)
          );

          if (customer) {
            setCustomerName(customer.name);
          } else {
            setCustomerName("Customer not found");
          }
        } else {
          setCustomerName("Error loading customer");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        setCustomerName("Error loading customer name");
      }
    };

    if (formData.customerId) {
      fetchCustomerDetail();
    }
  }, [formData.customerId]);


  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.customerId) {
      newErrors.customerId = "Customer ID is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.requestDetailId) {
      newErrors.requestDetailId = "Request Detail ID is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8080/api/consult",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              customerId: parseInt(formData.customerId), // Chuyển đổi sang số
              description: formData.description,
              consultDate: formData.consultDate || new Date().toISOString(),
              isCustomerConfirm: formData.isCustomerConfirm,
              requestDetailId: parseInt(formData.requestDetailId), // Chuyển đổi sang số
            }),
          }
        );
        console.log(response);

        if (!response.ok) {
          const errorText = await response.text(); // Lấy chi tiết lỗi từ phản hồi của server
          console.error("Error details:", errorText);
          toast.error(`Create consult failed: ${errorText}`);
          toast.error(errorText); // Ném lỗi để ngắt quá trình
        }

        const data = await response.json();
        console.log("Response data:", data);

        toast.success("Consult created successfully!");
        navigate("/admin/constructions/consult");
      } catch (error) {
        console.error("Error creating consult:", error);
        toast.error(error instanceof Error ? error.message : "Create consult failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Consult
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Customer Name</label>
          <input
            type="text"
            name="customerId"
            value={customerName || formData.customerId}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.customerId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter customer ID"
            disabled={!!customerId}
          />
          {errors.customerId && (
            <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Request Detail ID</label>
          <input
            type="text"
            name="requestDetailId"
            value={formData.requestDetailId}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.requestDetailId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter request detail ID"
            disabled={!!requestDetailId}
          />
          {errors.requestDetailId && (
            <p className="text-red-500 text-sm mt-1">{errors.requestDetailId}</p>
          )}
        </div>

        {/* <div className="mb-6">
          <label className="block text-black-15 mb-2">Request Detail ID</label>
          <input
            type="text"
            name="requestDetailId"
            list="requestDetailOptions" // Kết nối input với datalist
            value={formData.requestDetailId}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.requestDetailId ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter request detail ID"
          />
          <datalist id="requestDetailOptions">
            {requestDetail.map(detail => (
              <option
                key={detail.requestDetailId}
                value={detail.requestDetailId}
                label={`Request ID: ${detail.requestId}, Pond Design Template ID: ${detail.pondDesignTemplateId}`}
              />
            ))}
          </datalist>
          {errors.requestDetailId && <p className="text-red-500 text-sm mt-1">{errors.requestDetailId}</p>}
        </div> */}

        {/* <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isCustomerConfirm"
              checked={formData.isCustomerConfirm}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-black-15">Customer Confirm</span>
          </label>
        </div> */}

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter description"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Consult Date</label>
          <input
            type="datetime-local"
            name="consultDate"
            value={formData.consultDate}
            onChange={handleChange}
            className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
          />
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Customer Confirm:</label>
          <span className="text-black-15 font-bold">
            {formData.isCustomerConfirm ? "Confirmed" : "Not Confirmed"}
          </span>
        </div>

        <button
          type="submit"
          className={`w-full bg-green hover:bg-green text-white font-bold py-3 rounded-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Consult"}
        </button>
      </form>
    </div>

  );
};

export default ConsultForm;
