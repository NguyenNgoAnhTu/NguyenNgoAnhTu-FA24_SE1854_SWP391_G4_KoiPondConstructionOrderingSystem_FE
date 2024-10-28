import { useEffect, useState } from "react";
import FormServiceDetail from "../forms/FormServiceDetail";

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
    isActive: boolean;
  }

  const [serviceQuotationData, setServiceQuotationData] = useState<ServiceQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<ServiceQuotation | null>(null);

  useEffect(() => {
    const fetchServiceQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/service-quotations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
                "Category Type",
                "Category Cost",
                "Customer Name",
                "Request ID",
                "Description",
                "Address",
                "Total Cost",
                "VAT",
                "Active Status",
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
                  {quotation.serviceRequest.serviceCategory.type || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceRequest.serviceCategory.cost || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.customer.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {quotation.serviceRequest.serviceRequestId}
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
                  {quotation.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setShowDetailForm(true);
                    }}
                  >
                    Create Detail
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-red hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
    </div>
  );
}

export default ServiceQuotationTable;
