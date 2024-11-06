import { useEffect, useState } from "react";
import FormServiceDetail from "../forms/FormServiceDetail";
import FormEditQuotation from "../forms/FormQuotation";

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
    if (
      window.confirm("Are you sure you want to delete this service quotation?")
    ) {
      try {
        const id = serviceQuotationId;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/service-quotations/${id}`,
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
        setServiceQuotationData((prevData) =>
          prevData.filter(
            (request) => request.serviceQuotationId !== serviceQuotationId
          )
        );

        alert("Service request deleted successfully!");
      } catch (error) {
        alert("Failed to delete service request!");
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = async (
    quotationId: string,
    updatedData: Partial<ServiceQuotation>
  ) => {
    try {
      const token = localStorage.getItem("token");
      const id = quotationId;
      const response = await fetch(
        `http://localhost:8080/api/service-quotations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quotation");
      }

      const updatedQuotation = await response.json();

      // Update the local state with the edited quotation
      setServiceQuotationData((prevData) =>
        prevData.map((quotation) =>
          quotation.serviceQuotationId === quotationId
            ? updatedQuotation
            : quotation
        )
      );

      setShowEditForm(false);
      setEditingQuotation(null);
      alert("Quotation updated successfully!");
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("Failed to update quotation!");
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
                "Category Cost",
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
                  {quotation.serviceRequest.serviceCategory.cost || "N/A"}
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
                    className={`mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                      !quotation.confirm ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setShowDetailForm(true);
                    }}
                    disabled={!quotation.confirm}
                  >
                    Create Detail
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setEditingQuotation(quotation);
                      setShowEditForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-red hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          quotation={editingQuotation}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}

export default ServiceQuotationTable;
