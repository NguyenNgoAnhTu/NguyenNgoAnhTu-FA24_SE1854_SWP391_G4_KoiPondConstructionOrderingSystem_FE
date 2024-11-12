import React, { useState } from "react";
import { toast } from "react-toastify";

interface FormEditQuotationProps {
  onClose: () => void;
  onSubmit: (quotationId: string, updatedData: any) => void;
  quotation: {
    serviceQuotationId: string;
    description: string;
    vat: number;
    cost: number;
    totalCost: number;
    serviceRequest: {
      serviceRequestId: string;
      serviceCategory: {
        type: string;
        cost: number;
      };
      address: string;
    };
    customer: {
      name: string;
      email: string;
    };
  };
}

const FormEditQuotation: React.FC<FormEditQuotationProps> = ({
  onClose,
  onSubmit,
  quotation,
}) => {
  const [formData, setFormData] = useState({
    description: quotation.description,
    vat: quotation.vat,
  });

  const [errors, setErrors] = useState({
    description: '',
    vat: '',
  });

  const validateDescription = (value: string) => {
    if (!value.trim()) {
      return 'Description is required';
    }
    if (value.length < 10) {
      return 'Description must be at least 10 characters';
    }
    if (value.length > 500) {
      return 'Description must not exceed 500 characters';
    }
    return '';
  };

  const validateVAT = (value: number) => {
    if (value < 0) {
      return 'VAT cannot be negative';
    }
    if (value > 10) {
      return 'VAT cannot exceed 10%';
    }
    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate fields
    let fieldError = '';
    switch (name) {
      case 'description':
        fieldError = validateDescription(value);
        break;
      case 'vat':
        fieldError = validateVAT(Number(value));
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const descriptionError = validateDescription(formData.description);
    const vatError = validateVAT(formData.vat);

    if (descriptionError || vatError) {
      setErrors({
        description: descriptionError,
        vat: vatError,
      });
      return;
    }

    onSubmit(quotation.serviceQuotationId, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Quotation</h2>
        <form onSubmit={handleSubmit}>
          {/* Read-only Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quotation ID</label>
            <input
              type="text"
              value={quotation.serviceQuotationId}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              value={quotation.customer.name}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>
         

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Service Type</label>
            <input
              type="text"
              value={quotation.serviceRequest.serviceCategory.type}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Service Cost</label>
            <input
              type="number"
              value={quotation.serviceRequest.serviceCategory.cost}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={quotation.serviceRequest.address}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          {/* Editable Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">VAT (%)</label>
            <input
              type="number"
              name="vat"
              value={formData.vat}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.vat ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.vat && (
              <p className="text-red-500 text-sm mt-1">{errors.vat}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Cost (Preview)</label>
            <input
              type="number"
              value={quotation.cost * (1 + Number(formData.vat)/100)}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditQuotation;
