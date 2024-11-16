import { ChangeEvent, useEffect, useState } from "react";
import { Modal, message } from 'antd';
import { Select } from 'antd';
import './button-antd.css'
import { storage } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image, Timeline } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
function ServiceProgressTable() {
  interface ServiceProgress {
    serviceProgressID: string;
    serviceDetail: {
      staff: {
        customerId: string;
      };
      serviceQuotation: {
        serviceQuotationId: string;
      };
    };
    imageUrl?: string;
    startDate: string;
    endDate?: string;
    step?: string;
    description?: string;
    isComfirmed: boolean;
  }

  interface Log {
    serviceProgressLogId: number;
    imageUrl: string;
    step: string | null;
    description: string;
    isActive: boolean;
    createDate: string;
    createBy: string;
  }

  const [serviceProgressData, setServiceProgressData] = useState<ServiceProgress[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLogs, setIsModalOpenLogs] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProgress | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const options = [
    { value: "In progress", label: "In progress" },
    { value: "Complete", label: "Complete" },
    { value: "Canceled", label: "Canceled" }
  ];

  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";
  const [visible, setVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const fetchServiceProgress = async () => {
      let url: string;
      if (role === "MAINTENANCE") {
        const maintenanceStaffID = localStorage.getItem('customerId');
        url = `http://localhost:8080/api/service-progress/maintenance-staff/${maintenanceStaffID}`;
      } else {
        url = `http://localhost:8080/api/service-progress`;
      }
      try {
        const response = await fetch(url, {
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
      }
    };

    fetchServiceProgress();
  }, []);

  const fetchLogs = async (serviceProgressID: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/view-progress-logs/${serviceProgressID}`,
        {
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
      setLogs(data);
      setIsModalOpenLogs(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  const handleEdit = (service: ServiceProgress) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `service-progress/${uuidv4()}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };



  const handleOk = async () => {
    if (!selectedService) return;
    if (selectedService.step === "Canceled") {
      if (!selectedService.description || selectedService.description.trim() === "")
        message.error("Description is required when status is Canceled");
      else if (selectedService.description.length < 0 || selectedService.description.length > 100)
        message.error("Description must be between 0 and 100 characters");
      return;
    }
    if (!image) {
      message.error("Image is required");
      return;
    }

    setLoadingUpdate(true);
    try {
      let imageUrl = selectedService?.imageUrl || "";
      imageUrl = await uploadImage(image);

      const updatedService = {
        ...selectedService,
        imageUrl: imageUrl
      };

      const response = await fetch(
        `http://localhost:8080/api/service-progress/${selectedService.serviceProgressID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedService),
        });
      const resServiceProgressLog = await fetch(`http://localhost:8080/api/create-progress-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceProgressId: selectedService.serviceProgressID,
        }),
      });
      if (!response.ok || !resServiceProgressLog.ok) {
        throw new Error("Failed to update service progress");
      }
      message.success("Service progress updated successfully");
      setServiceProgressData((prevData) =>
        prevData.map((service) =>
          service.serviceProgressID === selectedService.serviceProgressID ? { ...service, ...updatedService } : service
        )
      );
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
    setIsModalOpenLogs(false);
    setLogs([]);
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

  const handleConfirmed = async (service: ServiceProgress) => {
    try {
      const response = await fetch(`http://localhost:8080/api/acceptance-service-progress/${service.serviceProgressID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success(`Successfully confirmed service progress with ID: ${service.serviceProgressID}`); // Show success message
        setServiceProgressData((prevList) =>
          prevList.map((service) =>
            service.serviceProgressID === service.serviceProgressID ? { ...service, isComfirmed: true } : service
          )
        );
        const resPayment = await fetch(`http://localhost:8080/api/service-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            "serviceQuotationID": service.serviceDetail.serviceQuotation.serviceQuotationId,
            "paymentMethod": "Cash",
            "maintenanceStaffID": service.serviceDetail.staff.customerId,
            "status": "Pending"
          }),
        });
        if (!resPayment.ok) {
          throw new Error(`Failed to create service payment`);
        }
      } else {
        throw new Error(`Failed to confirm service progress with ID: ${service.serviceProgressID}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // Show error message
      }
    }
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
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
                "Image",
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
                <td className="px-2 py-4 text-sm text-black-15 text-center w-16 h-16">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      className="w-16 h-16 object-cover rounded mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <img
                      src={PLACEHOLDER_IMAGE}
                      alt="No image"
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  )}</td>
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
                      onClick={() => handleConfirmed(service)}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    type="button"
                    className="mx-1 text-white bg-[#2dd4bf] hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    onClick={() => fetchLogs(service.serviceProgressID)}
                  >
                    View Logs
                  </button>
                  {!service.isComfirmed && (
                    <button
                      type="button"
                      className="mx-1 text-white bg-green hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                  )}
                  {role == "MANAGER" && (
                    <button
                      type="button"
                      className="mx-1 text-white bg-red hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                      onClick={() => handleDelete(service.serviceProgressID)}
                    >
                      Delete
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title="View Logs" open={isModalOpenLogs} onCancel={handleCancel} confirmLoading={loading} footer={null}>
        <Timeline
          mode="left"
          items={logs.map((log) => ({
            label: (
              <div>
                {log.imageUrl && (
                  <button type="button" onClick={() => {
                    setPreviewImage(log.imageUrl);
                    setVisible(true);
                  }}>
                    <EyeOutlined />
                  </button>
                )} {new Date(log.createDate).toLocaleString()}
                <Image
                  width={200}
                  style={{ display: 'none' }}
                  src={log.imageUrl}
                  preview={{
                    visible,
                    src: previewImage,
                    onVisibleChange: (value) => {
                      setVisible(value);
                    },
                  }}
                />
              </div>
            ),
            children: `${log.step || ''} - ${log.description || ''}`,
          }))}
        />
      </Modal>

      <Modal title="Edit Service Progress" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loadingUpdate}>
        {selectedService && (
          <div>
            <p><strong>Service Progress ID:</strong> {selectedService.serviceProgressID}</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <strong>Image*</strong>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-w-full h-32 object-contain"
                />
              )}
            </div>
            <p><strong>Is Confirmed:</strong> {selectedService.isComfirmed ? "✔️" : "❌"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ServiceProgressTable;
