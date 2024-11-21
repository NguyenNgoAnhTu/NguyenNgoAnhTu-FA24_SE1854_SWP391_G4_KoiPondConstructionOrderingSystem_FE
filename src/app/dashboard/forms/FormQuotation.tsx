import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    cost: number;
    
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
    totalCost: serviceRequest.serviceCategory.cost * 1.1,
    vat: 10,
  });
  const [errors, setErrors] = useState({
    description: '',
    vat: '',
    cost: '',
    totalCost: ''
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

  const validateCost = (value: number) => {
    if (value <= 0) {
      return 'Cost must be greater than 0';
    }
    if (value > 1000000000) { // 1 billion limit
      return 'Cost is too high';
    }
    return '';
  };

  const calculateTotalCost = (cost: number, vat: number): number => {
    return Number((cost * (1 + vat/100)).toFixed(2));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'vat') return;
    
    let updatedFormData;
    if (name === 'cost') {
      const newCost = Number(value);
      updatedFormData = {
        ...formData,
        cost: newCost,
        totalCost: calculateTotalCost(newCost, formData.vat).toString()
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: value
      };
    }
    
    setFormData(updatedFormData as any);

    let fieldError = '';
    switch (name) {
      case 'description':
        fieldError = validateDescription(value);
        break;
      case 'cost':
        fieldError = validateCost(Number(value));
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const descriptionError = validateDescription(formData.description);
    const vatError = validateVAT(Number(formData.vat));
    const costError = validateCost(Number(formData.cost));

    const newErrors = {
      description: descriptionError,
      vat: vatError,
      cost: costError,
      totalCost: ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
     // const calculatedTotalCost = calculateTotalCost(Number(formData.cost), Number(formData.vat));
      
      const requestData = {
        serviceRequestId: formData.requestID,
        description: formData.description,
      
        cost: Number(formData.cost),
        
      
      };

      console.log('Sending data:', requestData);

      const response = await fetch(
        'http://localhost:8080/api/service-quotations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceRequestId: formData.requestID,
            description: formData.description,
            cost: Number(formData.cost),
            totalCost: Number(formData.totalCost),
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create quotation');
      }
  
      const result = await response.json();
      console.log('Response:', result);
  
      await Swal.fire({
        title: 'Success!',
        text: 'Quotation created successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
  
      navigate('/admin/maintenances/service-quotation');
    } catch (error) {
      console.error('Error:', error);
      
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to create quotation',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
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
              className={`w-full p-2 border rounded ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

    

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost.toString()}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.cost ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">VAT (%)</label>
            <input
              type="number"
              name="vat"
              value={formData.vat.toString()}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Cost</label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost.toString()}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 text-white py-2 px-4 rounded ${
                loading 
                  ? 'bg-gray cursor-not-allowed'
                  : Object.values(errors).some(error => error !== '')
                  ? 'bg-red hover:bg-red-600'
                  : 'bg-green hover:bg-green-600'
              }`}
              onClick={(e) => {
                if (Object.values(errors).some(error => error !== '')) {
                  e.preventDefault();
                  toast.error('Please fix all errors before submitting');
                }
              }}
            >
              {loading ? "Creating..." : "Create Quotation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-green hover:bg-green-600 text-white py-2 px-4 rounded"
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