import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConsultForm = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    description: "",
    consultDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16), // Điều chỉnh thời gian theo múi giờ địa phương
    isCustomerConfirm: false,
    requestDetailId: "",
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
    const { name, value, type } = e.target;

    // Xử lý 'checked' chỉ khi là checkbox
    const inputValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;


    setFormData({
      ...formData,
      [name]: inputValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };


  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.customerId.trim()) {
      newErrors.customerId = "Customer ID is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.requestDetailId.trim()) {
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
              customerId: formData.customerId,
              description: formData.description,
              consultDate: formData.consultDate || new Date().toISOString(),
              isCustomerConfirm: false,
              requestDetailId: formData.requestDetailId,
            }),
          }
        );
        console.log(response);

        if (!response.ok) {
          const errorText = await response.text(); // Lấy chi tiết lỗi từ phản hồi của server
          console.error("Error details:", errorText);
          alert(`Create consult failed: ${errorText}`);
          throw new Error(errorText); // Ném lỗi để ngắt quá trình
        }

        alert("Consult created successfully!");
        navigate("/admin/tables/table-consult"); // Redirect to a list of consultations or another page
      } catch (error) {
        alert("Create consult failed!");
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
          <label className="block text-black-15 mb-2">Customer ID</label>
          <input
            type="text"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.customerId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter customer ID"
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
