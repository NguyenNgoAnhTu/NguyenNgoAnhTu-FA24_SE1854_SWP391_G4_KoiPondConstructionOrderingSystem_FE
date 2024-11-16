import { useEffect, useState } from "react";
import FormQuotation from "../forms/FormQuotation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function ServiceRequestTable() {
  interface ServiceRequest {
    serviceRequestId: string;
    serviceCategory: {
      serviceCategoryId: string;
      type: string;
      cost: number;
      note: string;
    };
    description: string;
    address: string;
    note: string;
    status: string;
  }

  const [serviceRequestData, setServiceRequestData] = useState<
    ServiceRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const canDelete = (status: string) => {
    const allowedStatuses = ['PENDING', 'PROCESSING', 'QUOTING'];
    return allowedStatuses.includes(status);
  };

  const handleDelete = async (serviceRequestId: string, status: string) => {
    if (!canDelete(status)) {
      toast.error("Can only delete requests with status: PENDING, PROCESSING, or QUOTING");
      return;
    }

    const { value: note, isConfirmed } = await Swal.fire({
      title: 'Delete Service Request',
      html: `
        <div class="mb-4">
          <p class="text-red-500 mb-2">Are you sure you want to delete this service request?</p>
          <p class="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
          <textarea 
            id="note" 
            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400" 
            placeholder="Please enter a note explaining why you're deleting this request (required)"
            rows="3"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const note = (document.getElementById('note') as HTMLTextAreaElement).value;
        if (!note.trim()) {
          Swal.showValidationMessage('Note is required');
          return false;
        }
        if (note.length < 10) {
          Swal.showValidationMessage('Note must be at least 10 characters long');
          return false;
        }
        return note;
      }
    });

    if (isConfirmed && note) {
      try {
        const token = localStorage.getItem('token');
        const encodedNote = encodeURIComponent(note);
        
        const response = await fetch(
          `http://localhost:8080/api/service-requests/${serviceRequestId}?note=${encodedNote}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete service request');
        }

        setServiceRequestData((prevData) =>
          prevData.filter((request) => request.serviceRequestId !== serviceRequestId)
        );

        toast.success('Service request deleted successfully!');
        
        Swal.fire({
          title: 'Deleted Successfully',
          html: `
            <div class="text-left">
              <p class="mb-2">The service request has been deleted.</p>
              <p class="text-sm text-gray-600"><strong>Note:</strong></p>
              <p class="text-sm text-gray-600 italic">${note}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete service request!');
      }
    }
  };

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/service-requests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setServiceRequestData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequest();
  }, []);

  const handleCreateQuotation = (service: ServiceRequest) => {
    if (service.status !== "PENDING") {
      toast.error("Can only create quotation for requests with PENDING status");
      return;
    }
    setSelectedService(service);
    setShowQuotationForm(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red py-4">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (serviceRequestData.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {[
                "Service Request ID",
                "Category Type",
                "Cost",
                "Description",
                "Address",
                "Note",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-black-15 uppercase tracking-wider text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {serviceRequestData.map((service: ServiceRequest) => (
              <tr
                key={service.serviceRequestId}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.serviceRequestId}
                </td>

                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.serviceCategory.type || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.serviceCategory.cost || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.description}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.address || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.note || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {service.status || "N/A"}
                  </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    className={`mx-1 text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 
                      ${service.status === "PENDING"
                        ? "bg-green hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                        : "bg-[#d3d3d3] cursor-not-allowed" 
                      }`}
                    onClick={() => handleCreateQuotation(service)}
                  >
                    Create Quotation
                  </button>

                  <button
                    type="button"
                    className={`mx-1 text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2
                      ${canDelete(service.status)
                        ? "bg-red hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
                        : "bg-[#d3d3d3] cursor-not-allowed"
                      }`}
                    onClick={() => {
                      if (canDelete(service.status)) {
                        handleDelete(service.serviceRequestId, service.status);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showQuotationForm && selectedService && (
        <FormQuotation
          onClose={() => setShowQuotationForm(false)}
          serviceRequest={selectedService}
        />
      )}
    </div>
  );
}

export default ServiceRequestTable;
