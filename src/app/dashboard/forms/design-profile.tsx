import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateDesignProfileForm = () => {
  const [formData, setFormData] = useState({
    quotationId: "",
    address: "",
    constructionStatus: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    quotationId: "",
    address: "",
    constructionStatus: "",
    description: ""
  });

  const navigate = useNavigate();

  // Xử lý khi có sự thay đổi trong input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate từng trường
    if (!formData.quotationId) {
      newErrors.quotationId = "Quotation ID is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    // if (!formData.constructionStatus.trim()) {
    //   newErrors.constructionStatus = "Construction status is required";
    //   isValid = false;
    // }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      try {
        const response = await fetch("http://localhost:8080/api/designProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quotationId: formData.quotationId,
            address: formData.address,
            //constructionStatus: formData.constructionStatus,
            description: formData.description,
          }),
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to create design profile");
        }
  
        const data = await response.json(); // Nếu cần xử lý data
  
        alert("Design profile created successfully!");
        console.log(data); // Kiểm tra dữ liệu trả về
        navigate("/admin/tables/table-designProfile");
      } catch (error) {
        console.error(error); // Hiển thị lỗi lên console để kiểm tra
        alert("Failed to create design profile");
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Design Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Quotation ID</label>
          <input
            type="text"
            name="quotationId"
            value={formData.quotationId}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.quotationId ? "border-red" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Quotation ID"
          />
          {errors.quotationId && <p className="text-red text-sm mt-1">{errors.quotationId}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.address ? "border-red" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Address"
          />
          {errors.address && <p className="text-red text-sm mt-1">{errors.address}</p>}
        </div>

        {/* <div className="mb-6">
          <label className="block text-black-15 mb-2">Construction Status</label>
          <input
            type="text"
            name="constructionStatus"
            value={formData.constructionStatus}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.constructionStatus ? "border-red" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Construction Status"
          />
          {errors.constructionStatus && <p className="text-red text-sm mt-1">{errors.constructionStatus}</p>}
        </div> */}

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.description ? "border-red" : "border-black"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Description"
          ></textarea>
          {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          className={`w-full bg-green-600 text-white font-bold py-3 rounded-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Design Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateDesignProfileForm;
