import { useEffect, useState } from "react";
import { Modal, message } from 'antd';
import { Select } from 'antd';
import './button-antd.css'

function ServiceProgressTable() {
  interface ServiceProgress {
    serviceProgressID: string;
    serviceDetail: {
      serviceDetailId: string;
    };
    startDate: string;
    endDate?: string;
    step?: string;
    description?: string;
    isComfirmed: boolean;
  }

  const [serviceProgressData, setServiceProgressData] = useState<ServiceProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProgress | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const token = localStorage.getItem('token');

  const options = [
    { value: "Not started", label: "Not started" },
    { value: "On hold", label: "On hold" },
    { value: "In progress", label: "In progress" },
    { value: "Complete", label: "Complete" },
    { value: "Canceled", label: "Canceled" }
  ];

  useEffect(() => {
    const fetchServiceProgress = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/service-progress", {
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
        setServiceProgressData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProgress();
  }, []);

  const handleEdit = (service: ServiceProgress) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!selectedService) return;

    setLoadingUpdate(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/service-progress/${selectedService.serviceProgressID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...selectedService }),
        });

      if (!response.ok) {
        throw new Error("Failed to update service progress");
      }
      message.success("Service progress updated successfully");
      location.reload();
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/service-progress/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success(`Successfully deleted service progress with ID: ${id}`); // Show success message
        setServiceProgressData((prevData) => prevData.filter((service) => service.serviceProgressID !== id));
      } else {
        throw new Error(`Failed to delete service progress with ID: ${id}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // Show error message
      }
    }
  };

  const handleConfirmed = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/acceptance-service-progress/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success(`Successfully confirmed service progress with ID: ${id}`); // Show success message
        setServiceProgressData((prevList) =>
          prevList.map((service) =>
            service.serviceProgressID === id ? { ...service, isComfirmed: true } : service
          )
        );
      } else {
        throw new Error(`Failed to confirm service progress with ID: ${id}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // Show error message
      }
    }
  }

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

  if (serviceProgressData.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

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
  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-hidden rounded-lg border border-b-black-15 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {[
                "Index",
                "Service Progress ID",
                "Service Detail ID",
                "Start Date",
                "End Date",
                "Step",
                "Description",
                "Is Confirmed",
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
            {serviceProgressData.map((service, index) => (
              <tr key={service.serviceProgressID} className="hover:bg-gray-50 transition duration-200">
                <td className="px-2 py-4 text-sm text-black-15 text-center">{index + 1}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceProgressID}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceDetail?.serviceDetailId || "N/A"}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{new Date(service.startDate).toLocaleString()}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.endDate ? new Date(service.endDate).toLocaleString() : "Unfinished"}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.step}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.description || ""}</td>
                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.isComfirmed ? "✔️" : "❌"}</td>
                <td className="px-2 py-4 text-sm">
                  {!service.isComfirmed && service.endDate && service.step == "Complete" && (
                    <button
                      type="button"
                      className="mx-1 text-white bg-brown focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                      onClick={() => handleConfirmed(service.serviceProgressID)}
                    >
                      Confirm
                    </button>
                  )}
                  {!service.isComfirmed && (
                    <button
                      type="button"
                      className="mx-1 text-white bg-green hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="mx-1 text-white bg-red hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    onClick={() => handleDelete(service.serviceProgressID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title="Edit Service Progress" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loadingUpdate}>
        {selectedService && (
          <div>
            <p><strong>Service Progress ID:</strong> {selectedService.serviceProgressID}</p>
            <p><strong>Service Detail ID:</strong> {selectedService.serviceDetail?.serviceDetailId || "N/A"}</p>
            <p><strong>Start Date:</strong> {new Date(selectedService.startDate).toLocaleString()}</p>
            <p><strong>End Date:</strong> {selectedService.endDate ? new Date(selectedService.endDate).toLocaleString() : "Unfinished"}</p>
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
            <p><strong>Is Confirmed:</strong> {selectedService.isComfirmed ? "✔️" : "❌"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ServiceProgressTable;
