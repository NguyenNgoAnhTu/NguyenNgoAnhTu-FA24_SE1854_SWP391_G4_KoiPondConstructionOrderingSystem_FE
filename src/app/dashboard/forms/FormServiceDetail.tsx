import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface FormServiceDetailProps {
  onClose: () => void;
  quotation: {
    serviceQuotationId: string;
    cost: number;
    totalCost: number;
    vat: number;
    serviceRequest: {
      serviceCategory: {
        type: string;
        
      };
      address: string;
    };
  };
//   staff: {
//     customerId: string;
//     name: string;
//   };
//   customer: {
//     customerId: string;
//     name: string;
//   };
}

const FormServiceDetail: React.FC<FormServiceDetailProps> = ({ onClose, quotation }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceQuotationId: quotation.serviceQuotationId,
    description: "",
    staffId:"",
  });
  const [staffList, setStaffList] = useState<Array<{ customerId: string; name: string }>>([]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/staff", {   
          method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch staff");
        }
        
        const data = await response.json();
        setStaffList(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
  
    fetchStaff();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/service-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceQuotationId: formData.serviceQuotationId,
            description: formData.description,
            staffId: formData.staffId,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create service detail");
      }
  
      // Show success notification with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Service detail created successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
  
      navigate("/admin/tables/table-service-details");
    } catch (error) {
      toast.error("Failed to create service detail!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Create Service Detail</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2"></label>
            <input
              type="hidden"
              value={quotation.serviceQuotationId}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
  <label className="block text-gray-700 mb-2">Staff Name</label>
  <select
    name="staffId"
    value={formData.staffId}
    onChange={handleChange}
    className="w-full p-2 border rounded"
    required
  >
    <option value=""></option>
    {staffList.map((staff) => (
      <option key={staff.customerId} value={staff.customerId}>
        {staff.name}
      </option>
      
    ))}
  </select>
  
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

          

          

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              {loading ? "Creating..." : "Create Service Detail"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red hover:bg-black text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormServiceDetail;