import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormQuotationProps {
  onClose: () => void;
  serviceRequest: {
    serviceRequestId: string;
    serviceCategory: {
      serviceCategoryId: string;
      type: string;
      cost: number;
    };
    description: string;
  };
}

const FormQuotation: React.FC<FormQuotationProps> = ({ onClose, serviceRequest }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestID: serviceRequest.serviceRequestId,
    description: "",
    note: "",
    cost: serviceRequest.serviceCategory.cost,
    totalCost: 0,
    vat: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      totalCost: name === 'cost' ? Number(value) * (1 + formData.vat/100) : 
                name === 'vat' ? formData.cost * (1 + Number(value)/100) : 
                formData.totalCost
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/service-quotations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceRequestId: formData.requestID,
            description: formData.description,
            // note: formData.note,
            cost: Number(formData.cost),
            totalCost: Number(formData.totalCost),
            vat: Number(formData.vat),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create quotation");
      }

      alert("Quotation created successfully!");
      navigate("/admin/tables/table-service-quotation");
    } catch (error) {
      alert("Failed to create quotation!");
    } finally {
      setLoading(false);
    }         
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Create Quotation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2"></label>
            <input
              type="hidden"
              name="requestID"
              value={formData.requestID}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Type</label>
            <input
              type="text"
              name="categoryType"
              value={serviceRequest.serviceCategory.type}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

    

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">VAT (%)</label>
            <input
              type="number"
              name="vat"
              value={formData.vat}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Cost</label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              {loading ? "Creating..." : "Create Quotation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1  bg-green hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormQuotation;