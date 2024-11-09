import { useEffect, useState } from "react";
import FormQuotation from "../forms/FormQuotation";

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
  const handleDelete = async (serviceRequestId: string) => {
    if (window.confirm("Are you sure you want to delete this service request?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/service-requests/${serviceRequestId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to delete service request");
        }
  
        // Remove the deleted item from the state
        setServiceRequestData(prevData => 
          prevData.filter(request => request.serviceRequestId !== serviceRequestId)
        );
        
        alert("Service request deleted successfully!");
      } catch (error) {
        alert("Failed to delete service request!");
        console.error("Error:", error);
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
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setSelectedService(service);
                      setShowQuotationForm(true);
                    }}
                  >
                    Create Quotation
                  </button>

                  <button
          type="button"
          className="mx-1 text-white bg-red hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => handleDelete(service.serviceRequestId)}
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
