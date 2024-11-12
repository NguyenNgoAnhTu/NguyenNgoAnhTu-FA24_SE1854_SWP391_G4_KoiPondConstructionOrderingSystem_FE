import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type PondDesignTemplateFormData = {
  minSize: string;
  maxSize: string;
  waterVolume: string;
  minDepth: string;
  maxDepth: string;
  shape: string;
  filtrationSystem: string;
  phLevel: string;
  waterTemperature: string;
  pondLiner: string;
  pondBottom: string;
  decoration: string;
  minEstimatedCost: string;
  maxEstimatedCost: string;
  imageUrl: string;
  description: string;
  note: string;
};

const PondDesignTemplateForm = () => {
  const [formData, setFormData] = useState<PondDesignTemplateFormData>({
    minSize: "",
    maxSize: "",
    waterVolume: "",
    minDepth: "",
    maxDepth: "",
    shape: "",
    filtrationSystem: "",
    phLevel: "",
    waterTemperature: "",
    pondLiner: "",
    pondBottom: "",
    decoration: "",
    minEstimatedCost: "",
    maxEstimatedCost: "",
    imageUrl: "",
    description: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Handle input changes
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
    const newErrors: Record<string, string> = {};

    if (!formData.minSize) {
      newErrors.minSize = "Minimum size is required";
      isValid = false;
    } else if (parseFloat(formData.minSize) < 0) {
      newErrors.minSize = "Minimum size cannot be negative";
      isValid = false;
    }
    if (!formData.maxSize) {
      newErrors.maxSize = "Maximum size is required";
      isValid = false;
    } else if (parseFloat(formData.maxSize) < parseFloat(formData.minSize)) {
      newErrors.maxSize = "Maximum size must be greater than minimum size";
      isValid = false;
    }
    if (!formData.waterVolume) {
      newErrors.waterVolume = "Water volume is required";
      isValid = false;
    } else if (parseFloat(formData.waterVolume) <= 0) {
      newErrors.waterVolume = "Water volume must be greater than 0";
      isValid = false;
    }
    if (!formData.shape.trim()) {
      newErrors.shape = "Shape is required";
      isValid = false;
    } else if (formData.shape.length < 3) {
      newErrors.shape = "Shape must be at least 3 characters long";
      isValid = false;
    }
    if (!formData.filtrationSystem.trim()) {
      newErrors.filtrationSystem = "Filtration system is required";
      isValid = false;
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
      isValid = false;
    }
    if (!formData.minDepth) {
      newErrors.minDepth = "Minimum depth is required";
      isValid = false;
    } else if (parseFloat(formData.minDepth) < 0) {
      newErrors.minDepth = "Minimum depth cannot be negative";
      isValid = false;
    }
    if (!formData.maxDepth) {
      newErrors.maxDepth = "Maximum depth is required";
      isValid = false;
    } else if (parseFloat(formData.maxDepth) < parseFloat(formData.minDepth)) {
      newErrors.maxDepth = "Maximum depth must be greater than minimum depth";
      isValid = false;
    }
    if (formData.phLevel) {
      const ph = parseFloat(formData.phLevel);
      if (ph < 7 || ph > 8) {
        newErrors.phLevel = "PH level must be between 7 and 8";
        isValid = false;
      }
    }
    if (formData.waterTemperature) {
      const temp = parseFloat(formData.waterTemperature);
      if (temp < 0 || temp > 40) {
        newErrors.waterTemperature = "Water temperature must be between 0°C and 40°C";
        isValid = false;
      }
    }
    if (!formData.pondLiner.trim()) {
      newErrors.pondLiner = "Pond liner is required";
      isValid = false;
    } else if (formData.pondLiner.length < 3) {
      newErrors.pondLiner = "Pond liner must be at least 3 characters long";
      isValid = false;
    }
    // Validate Pond Bottom
  if (!formData.pondBottom.trim()) {
    newErrors.pondBottom = "Pond bottom is required";
    isValid = false;
  } else if (formData.pondBottom.length < 3) {
    newErrors.pondBottom = "Pond bottom must be at least 3 characters long";
    isValid = false;
  }

  // Validate Decoration
  if (!formData.decoration.trim()) {
    newErrors.decoration = "Decoration is required";
    isValid = false;
  } else if (formData.decoration.length < 3) {
    newErrors.decoration = "Decoration must be at least 3 characters long";
    isValid = false;
  }
  // Validate Estimated Cost
  if (!formData.minEstimatedCost) {
    newErrors.minEstimatedCost = "Minimum estimated cost is required";
    isValid = false;
  } else if (parseFloat(formData.minEstimatedCost) < 0) {
    newErrors.minEstimatedCost = "Minimum estimated cost cannot be negative";
    isValid = false;
  }

  if (!formData.maxEstimatedCost) {
    newErrors.maxEstimatedCost = "Maximum estimated cost is required";
    isValid = false;
  } else if (parseFloat(formData.maxEstimatedCost) < parseFloat(formData.minEstimatedCost)) {
    newErrors.maxEstimatedCost = "Maximum estimated cost must be greater than minimum cost";
    isValid = false;
  }
  if (formData.description && formData.description.length > 1000) {
    newErrors.description = "Description must not exceed 1000 characters";
    isValid = false;
  }

  // Validate Note
  if (formData.note && formData.note.length > 500) {
    newErrors.note = "Note must not exceed 500 characters";
    isValid = false;
  }


    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8080/api/pondDesignTemplate",
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
          const errorText = await response.text();
          toast.error(`Create Pond Design Template failed: ${errorText}`);
          throw new Error(errorText);
        }

        toast.success("Pond Design Template created successfully!");
        navigate("");
      } catch (error) {
        toast.error("Failed to create Pond Design Template");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Pond Design Template
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        {[
          { name: "minSize", label: "Min Size", type: "number" },
          { name: "maxSize", label: "Max Size", type: "number" },
          { name: "waterVolume", label: "Water Volume", type: "number" },
          { name: "minDepth", label: "Min Depth", type: "number" },
          { name: "maxDepth", label: "Max Depth", type: "number" },
          { name: "shape", label: "Shape", type: "text" },
          { name: "filtrationSystem", label: "Filtration System", type: "text" },
          { name: "phLevel", label: "PH Level", type: "number" },
          { name: "waterTemperature", label: "Water Temperature", type: "number" },
          { name: "pondLiner", label: "Pond Liner", type: "text" },
          { name: "pondBottom", label: "Pond Bottom", type: "text" },
          { name: "decoration", label: "Decoration", type: "text" },
          { name: "minEstimatedCost", label: "Min Estimated Cost", type: "number" },
          { name: "maxEstimatedCost", label: "Max Estimated Cost", type: "number" },
          { name: "imageUrl", label: "Image URL", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "note", label: "Note", type: "textarea" },
        ].map(({ name, label, type }) => (
          <div className="mb-6" key={name}>
            <label className="block text-black-15 mb-2">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name as keyof PondDesignTemplateFormData]} // Ép kiểu name
                onChange={handleChange}
                className={`w-full p-3 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name as keyof PondDesignTemplateFormData]} // Ép kiểu name
                onChange={handleChange}
                className={`w-full p-3 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            )}
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className={`w-full bg-green hover:bg-green text-white font-bold py-3 rounded-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Pond Design Template"}
        </button>
      </form>
    </div>
  );
};

export default PondDesignTemplateForm;
