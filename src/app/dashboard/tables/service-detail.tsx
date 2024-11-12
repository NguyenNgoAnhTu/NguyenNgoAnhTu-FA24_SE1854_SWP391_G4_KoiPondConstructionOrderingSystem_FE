import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Select, message } from 'antd';

interface ServiceDetail {
  serviceDetailId: string;
  staff: {
    customerId: string;
    name: string;
  };
  serviceQuotation: {
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
  };
  description: string;
  isActive: boolean;
  isCreatedProgress: boolean;
}

interface ServiceProgress {
  serviceDetailID: string;
  step: string;
  description: string;
}

function ServiceRequestTable() {
  const [serviceDetailsData, setServiceDetailsData] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProgress | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/service-details", {
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
        setServiceDetailsData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleInputChange = (
    eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    value?: string
  ) => {
    if (selectedService) {
      if (typeof eOrName === "string") {
        // Handle Select change
        setSelectedService({
          ...selectedService,
          [eOrName]: value,
        });
      } else {
        // Handle input/textarea change
        const { name, value } = eOrName.target;
        setSelectedService({
          ...selectedService,
          [name]: value,
        });
      }
    }
  };

  const options = [
    { value: "Not started", label: "Not started" },
    { value: "On hold", label: "On hold" },
    { value: "In progress", label: "In progress" },
    { value: "Complete", label: "Complete" },
    { value: "Canceled", label: "Canceled" }
  ];

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

  if (serviceDetailsData.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

  const handleCreateProgress = (serviceDetailId: string) => {
    setSelectedService({
      serviceDetailID: serviceDetailId,
      step: "Not started",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!selectedService) return;

    setLoadingUpdate(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/service-progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...selectedService }),
        });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create service progress");
      }
      const service = serviceDetailsData.find(service => service.serviceDetailId === selectedService.serviceDetailID);
      if (service) {
        service.isCreatedProgress = true;
      }
      navigate("/admin/tables/table-service-progress");
      message.success("Service progress create successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoadingUpdate(false);
      setIsModalOpen(false);
      setSelectedService(null);
    }
  };

  const tableHeaders = [
    "Service Detail ID",
    "Staff Name",
    "Quotation ID",
    "Customer Name",
    "Cost",
    "Total Cost",
    "VAT",
    "Is Active",
    "Actions"
  ];

  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {tableHeaders.map((header) => (
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
            {serviceDetailsData.map((serviceDetail) => (
              <tr
                key={serviceDetail.serviceDetailId}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceDetailId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.staff.name}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.serviceQuotationId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.customer.name}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.cost}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.totalCost}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.vat}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create Quotation
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => handleCreateProgress(serviceDetail.serviceDetailId)}
                  >
                    Create Progress
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
      <Modal title="Create Service Progress" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loadingUpdate}>
        {selectedService && (
          <div>
            <p><strong>Service Detail ID:</strong> {selectedService.serviceDetailID || "N/A"}</p>
            <div className="mt-1">
              <label>
                <strong>Step:</strong>
                <Select
                  defaultValue={selectedService.step}
                  style={{ width: '100%' }}
                  onChange={(value) => handleInputChange("step", value)}
                  options={options}
                />
              </label>
              <label className="mt-1">
                <strong>Description:</strong>
                <textarea
                  name="description"
                  value={selectedService.description || ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ServiceRequestTable;
