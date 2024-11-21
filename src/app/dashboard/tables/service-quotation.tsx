import { useEffect, useState } from "react";
import FormServiceDetail from "../forms/FormServiceDetail";
import FormEditQuotation from "../forms/FormEditQuotation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ServiceQuotationTable() {
  interface ServiceQuotation {
    serviceQuotationId: string;
    customer: {
      name: string;
      email: string;
      role: string;
    };
    serviceRequest: {
      serviceRequestId: string;
      customer: {
        name: string;
        email: string;
        role: string;
      };
      serviceCategory: {
        serviceCategoryId: number;
        type: string;
        cost: number;
        note: string;
      };
      address: string;
      status: string;
    };
    description: string;
    note: string;
    cost: number;
    totalCost: number;
    vat: number;
    confirm: boolean;
  }

  const [serviceQuotationData, setServiceQuotationData] = useState<
    ServiceQuotation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] =
    useState<ServiceQuotation | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingQuotation, setEditingQuotation] =
    useState<ServiceQuotation | null>(null);
  useEffect(() => {
    const fetchServiceQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/service-quotations",
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
        setServiceQuotationData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceQuotations();
  }, []);
  const handleDelete = async (serviceQuotationId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this service quotation? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c', // Matches your delete button color
      cancelButtonColor: '#6c757d', // Neutral gray for cancel button
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `http://localhost:8080/api/service-quotations/${serviceQuotationId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error('Failed to delete service quotation');
          }
  
          // Remove the deleted item from the state
          setServiceQuotationData((prevData) =>
            prevData.filter(
              (quotation) => quotation.serviceQuotationId !== serviceQuotationId
            )
          );
  
          toast.success('Service quotation deleted successfully!');
        } catch (error) {
          toast.error('Failed to delete service quotation!');
          console.error('Error:', error);
        }
      }
    });
  };

  const handleEditClick =    (quotation: ServiceQuotation) => {
    if (quotation.confirm) {
      toast.error("Cannot edit confirmed quotations");
      return;
    }
    setEditingQuotation(quotation);
    setShowEditForm(true);
  };

  const handleEdit = async (
    serviceQuotationId: string,
    updatedData: Partial<ServiceQuotation>
  ) => {
    try {
      const editableData = {
        description: updatedData.description,
        vat: updatedData.vat,
        
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/service-quotations/${serviceQuotationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editableData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quotation");
      }

      const updatedQuotation = await response.json();

      setServiceQuotationData((prevData) =>
        prevData.map((quotation) =>
          quotation.serviceQuotationId === serviceQuotationId
            ? {...quotation, ...updatedQuotation}
            : quotation
        )
      );

      setShowEditForm(false);
      setEditingQuotation(null);
      toast.success("Quotation updated successfully!");
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast.error("Failed to update quotation!");
    }
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

  if (serviceQuotationData.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {[
                "Quotation ID",
                "Request ID",
                "Customer Name",
                "Category Type",
                "Cost",
                "Description",
                "Address",
                "Total Cost",
                "VAT",
                "Confirm",
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
            {serviceQuotationData.map((quotation: ServiceQuotation) => (
              <tr
                key={quotation.serviceQuotationId}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceQuotationId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceRequest.serviceRequestId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.customer.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceRequest.serviceCategory.type || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.cost || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.description}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceRequest.address || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.totalCost || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.vat || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.confirm ? "Confirmed" : "Not Confirmed"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    className={`mx-1 text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 
                      ${quotation.confirm && quotation.serviceRequest.status === "QUOTING"
                        ? "bg-green hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                        : "bg-[#d3d3d3] cursor-not-allowed"
                      }`}
                    onClick={() => {
                      if (!quotation.confirm) {
                        toast.error("Can only create detail for confirmed quotations");
                        return;
                      }
                      if (quotation.serviceRequest.status !== "QUOTING") {
                        toast.error("Can only create detail when request status is QUOTING");
                        return;
                      }
                      setSelectedQuotation(quotation);
                      setShowDetailForm(true);
                    }}
                    disabled={!quotation.confirm || quotation.serviceRequest.status !== "QUOTING"}
                  >
                    Create Detail
                  </button>
                  <button
                    type="button"
                    className={`mx-1 text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 
                      ${!quotation.confirm
                        ? "bg-green hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                        : "bg-[#d3d3d3] cursor-not-allowed"
                      }`}
                    onClick={() => handleEditClick(quotation)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`mx-1 text-white bg-red hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2
                      ${quotation.confirm ? "cursor-not-allowed bg-[#d3d3d3]" : ""}`}
                    onClick={() => handleDelete(quotation.serviceQuotationId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetailForm && selectedQuotation && (
        <FormServiceDetail
          onClose={() => setShowDetailForm(false)}
          quotation={selectedQuotation}
        />
      )}
      {showEditForm && editingQuotation && (
        <FormEditQuotation
        
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEdit} 
          quotation={editingQuotation}
        />
      )}
    </div>
  );
}

export default ServiceQuotationTable;
