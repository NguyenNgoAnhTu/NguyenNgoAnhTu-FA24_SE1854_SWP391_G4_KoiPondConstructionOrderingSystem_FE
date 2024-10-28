import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceProgressForm = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    consultId: "",
    isConfirm: false, // Đặt giá trị mặc định là false
    description: "",
    mainCost: 0.0,
    subCost: 0.0,
    vat: 0.0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    customerId: "",
    consultId: "",
    description: "",
    mainCost: "",
    subCost: "",
    vat: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.customerId) {
      newErrors.customerId = "Customer ID is required";
      isValid = false;
    }

    if (!formData.consultId) {
      newErrors.consultId = "Consult ID is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (formData.mainCost <= 0) {
      newErrors.mainCost = "Main Cost must be greater than 0";
      isValid = false;
    }

    if (formData.subCost < 0) {
      newErrors.subCost = "Sub Cost cannot be negative";
      isValid = false;
    }

    if (formData.vat < 0) {
      newErrors.vat = "VAT cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/api/quotation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId: formData.customerId,
            consultId: formData.consultId,
            isConfirm: false, // Đặt mặc định là false
            description: formData.description,
            mainCost: formData.mainCost,
            subCost: formData.subCost,
            vat: formData.vat,
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to create quotation");
        }

        alert("Quotation saved!");
        navigate("/admin/tables/table-quotation");
      } catch (error) {
        alert("Create quotation failed!");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quotation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Consult ID</label>
          <input
            type="text"
            name="consultId"
            value={formData.consultId}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.consultId ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
            placeholder="Enter Consult ID"
          />
          {errors.consultId && (
            <p className="text-red text-sm mt-1">{errors.consultId}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Customer ID</label>
          <input
            type="text"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.customerId ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Customer ID"
          />
          {errors.customerId && (
            <p className="text-red text-sm mt-1">{errors.customerId}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Main Cost</label>
          <input
            type="text"
            name="mainCost"
            value={formData.mainCost}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.mainCost ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Main Cost"
          />
          {errors.mainCost && (
            <p className="text-red text-sm mt-1">{errors.mainCost}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Sub Cost</label>
          <input
            type="text"
            name="subCost"
            value={formData.subCost}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.subCost ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter Sub Cost"
          />
          {errors.subCost && (
            <p className="text-red text-sm mt-1">{errors.subCost}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">VAT</label>
          <input
            type="text"
            name="vat"
            value={formData.vat}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.vat ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            placeholder="Enter VAT"
          />
          {errors.vat && (
            <p className="text-red text-sm mt-1">{errors.vat}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Confirm:</label>
          <span className="text-black-15 font-bold">
            {formData.isConfirm ? "Confirmed" : "Not Confirmed"}
          </span>
        </div>


        <div className="mb-6">
          <label className="block text-black-15 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.description ? "border-red" : "border-black"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
            placeholder="Describe quotation"
          ></textarea>
          {errors.description && (
            <p className="text-red text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-green hover:bg-green text-white font-bold py-3 rounded-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Quotation"}
        </button>
      </form>
    </div>
  );
};

export default ServiceProgressForm;

