import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from 'antd';

const ServiceProgressForm = () => {
  const [formData, setFormData] = useState({
    serviceDetailID: "",
    step: "Not started", // default value for step
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    serviceDetailID: "",
    step: "",
    description: "",
  });

  const options = [
    { value: "Not started", label: "Not started" },
    { value: "On hold", label: "On hold" },
    { value: "In progress", label: "In progress" },
    { value: "Complete", label: "Complete" },
    { value: "Canceled", label: "Canceled" }
  ];

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
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

  // Handle Select component changes for step
  const handleStepChange = (value: string) => {
    setFormData({
      ...formData,
      step: value,
    });
  };

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.serviceDetailID.trim()) {
      newErrors.serviceDetailID = "Service Detail ID is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8080/api/service-progress",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to create service progress");
        }

        alert("Service progress saved!");
        navigate("/admin/tables/table-service-progress");
      } catch (error) {
        alert("Create service progress failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Service Progress
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Service Detail ID</label>
          <div className="relative">
            <input
              type="text"
              name="serviceDetailID"
              value={formData.serviceDetailID}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.serviceDetailID ? "border-red" : "border-black"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
              placeholder="Enter service detail ID"
            />
            {errors.serviceDetailID && (
              <p className="text-red text-sm mt-1">{errors.serviceDetailID}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Step</label>
          <div className="relative">
            <Select
              defaultValue="Not started"
              style={{ width: '100%' }}
              onChange={handleStepChange}
              options={options}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Description</label>
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.description ? "border-red" : "border-black"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
              placeholder="Describe the progress of this step"
            ></textarea>
            {errors.description && (
              <p className="text-red text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-green hover:bg-green-dark text-white font-bold py-3 rounded-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Service Progress"}
        </button>
      </form>
    </div>
  );
};

export default ServiceProgressForm;
