import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseCircle from "assets/images/close-circle.png";
interface FormCleaningProps {
  onClose: () => void;
  serviceCategoryId: string; // Add this prop
}
const FormCleaning: React.FC<FormCleaningProps> = ({ onClose, serviceCategoryId }) => {
  const [formData, setFormData] = useState({
    categoryID: serviceCategoryId, // Set initial value from prop
    description: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    categoryID: "",
    description: "",
    address: "",
    note: "",
  });

  const navigate = useNavigate(); // Ensure navigate is correctly imported and initialized
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryID: serviceCategoryId,
    }));
  }, [serviceCategoryId]);
  // Handle input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
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

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // if (!formData.categoryID.trim()) {
    //   newErrors.categoryID = "Service Detail ID is required";
    //   isValid = false;
    // }

    if (!formData.description.trim()) {
      newErrors.description = "Step is required";
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
          "http://localhost:8080/api/service-requests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                categoryID: formData.categoryID,
                description: formData.description,
              address: formData.address,
              note: formData.note,
            }),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to create service request");
        }

        alert("Service request saved!");
        navigate("/admin/tables/table-service-progress");
      } catch (error) {
        alert("Create service request failed!");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <div className="text-2xl font-bold mb-6 text-gray-800">
        Service Request
        <img src={CloseCircle} alt="close" width={20} height={20} onClick={onClose} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Service Category ID</label>
          <div className="relative">
            <input
              type="text"
              name="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.categoryID ? "border-red" : "border-black"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
              placeholder="Enter service category ID"
              readOnly 
            />
            {errors.categoryID && (
              <p className="text-red text-sm mt-1">{errors.categoryID}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Description</label>
          <div className="relative">
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.description ? "border-red" : "border-black"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-black-15 mb-2">Address</label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.address ? "border-red" : "border-black"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red text-sm mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black-15 mb-2">Note</label>
          <div className="relative">
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.note ? "border-red" : "border-black"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue`}
              placeholder="Enter note"
            ></textarea>
            {errors.note && (
              <p className="text-red text-sm mt-1">{errors.note}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-green hover:bg-green text-white font-bold py-3 rounded-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Service Progress"}
        </button>
      </form>
    </div>
  );
};

export default FormCleaning;
