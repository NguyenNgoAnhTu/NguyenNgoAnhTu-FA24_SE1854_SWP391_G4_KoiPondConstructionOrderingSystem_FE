import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import close_circle from "assets/icons/close-circle.svg";
import Swal from "sweetalert2";

interface FormCleaningProps {
  onClose: () => void;
  serviceCategoryId: number;
  categoryType: string;
}

const FormCleaning: React.FC<FormCleaningProps> = ({
  onClose,
  serviceCategoryId,
  categoryType,
}) => {
  const [formData, setFormData] = useState({
    categoryID: serviceCategoryId,
    categoryType: categoryType,
    description: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    categoryType: "",
    description: "",
    address: "",
    note: "",
  });

  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null); // Ref for the form container

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryID: serviceCategoryId,
      categoryType: categoryType,
    }));
  }, [serviceCategoryId, categoryType]);

  // Handle click outside of the form to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
  
        // Success popup
        await Swal.fire({
          title: 'Success!',
          text: 'Service request saved!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
  
        navigate("/user");
      } catch (error) {
        // Error popup
        Swal.fire({
          title: 'Error!',
          text: 'Create service request failed!',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={formRef} className="w-[500px] mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
        <div className="text-2xl font-bold mb-6 text-gray-800 flex justify-between">
          Service Request
          <img
            src={close_circle}
            alt="close"
            width={30}
            height={30}
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-black-15 mb-2">Service Category Type</label>
            <input
              type="text"
              name="categoryType"
              value={formData.categoryType}
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue bg-gray-50"
              readOnly
            />
          </div>

          <div className="mb-6">
            <label className="block text-black-15 mb-2">Description</label>
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

          <div className="mb-6">
            <label className="block text-black-15 mb-2">Address</label>
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

          <div className="mb-6">
            <label className="block text-black-15 mb-2">Note</label>
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

          <div className="flex gap-4 w-full">
            <button
              type="submit"
              className={`bg-green w-[50%] hover:opacity-50 text-white font-bold rounded-md transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Service Request"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red w-[50%] hover:opacity-50 text-white font-bold py-3 rounded-md transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCleaning;
