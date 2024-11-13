import { useEffect, useState } from "react";
import { Modal, message } from 'antd';
import { Select } from 'antd';
import './button-antd.css'

function ServicePaymentTable() {
    interface ServicePayment {
        servicePaymentID: string;
        paymentMethod: string;
        serviceQuotation: {
            serviceQuotationID: string;
            customer: {
                name: string;
            };
            serviceDetailId: string;
            cost: number;
            vat: number;
            totalCost: number;
        };
        maintenanceStaff: {
            name: string;
        };
        createDate: string;
        status: string;
    }

    const [servicePaymentData, setServicePaymentData] = useState<ServicePayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServicePayment | null>(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const token = localStorage.getItem('token');

    const methodOptions = [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
    ];

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "Paid", label: "Paid" },
        { value: "Failed", label: "Failed" },
        { value: "Refunded", label: "Refunded" },
        { value: "Canceled", label: "Canceled" },
        { value: "Partially Paid", label: "Partially Paid" },
    ];

    useEffect(() => {
        const fetchServicePayment = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/service-payment", {
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
                setServicePaymentData(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServicePayment();
    }, []);

    const handleEdit = (service: ServicePayment) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (!selectedService) return;

        setLoadingUpdate(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/service-payment/${selectedService.servicePaymentID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...selectedService })
                });

            if (!response.ok) {
                throw new Error("Failed to update service payment");
            }
            location.reload();
            message.success("Service payment updated successfully");
            setServicePaymentData((prevData) =>
                prevData.map((service) =>
                    service.servicePaymentID === selectedService.servicePaymentID ? selectedService : service
                )
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message);
                console.log(error);
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
            const response = await fetch(`http://localhost:8080/api/service-payment/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                message.success(`Successfully deleted service payment with ID: ${id}`); // Show success message
                setServicePaymentData((prevData) => prevData.filter((service) => service.servicePaymentID !== id));
            } else {
                throw new Error(`Failed to delete service progress with ID: ${id}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message); // Show error message
            }
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

    if (servicePaymentData.length === 0) {
        return <div className="text-center py-4">No data available.</div>;
    }

    const handleInputChange = (
        eOrName: string,
        value?: string
    ) => {
        if (selectedService) {
            setSelectedService({
                ...selectedService,
                [eOrName]: value,
            });
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
                                "Service Payment ID",
                                "Customer",
                                "Method",
                                "Cost",
                                "VAT",
                                "Total Cost",
                                "Create Date",
                                "Staff",
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
                        {servicePaymentData.map((service, index) => (
                            <tr key={service.servicePaymentID} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{index + 1}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.servicePaymentID}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceQuotation.customer.name}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.paymentMethod}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceQuotation.cost}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceQuotation.vat}%</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceQuotation.totalCost}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{new Date(service.createDate).toLocaleString()}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.maintenanceStaff.name}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.status}</td>
                                <td className="px-2 py-4 text-sm">
                                    <button
                                        type="button"
                                        className="mx-1 text-white bg-green hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                                        onClick={() => handleEdit(service)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="mx-1 text-white bg-red hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                                        onClick={() => handleDelete(service.servicePaymentID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Edit Service Payement" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loadingUpdate}>
                {selectedService && (
                    <div>
                        <p><strong>Service Payment ID:</strong> {selectedService.servicePaymentID}</p>
                        <p><strong>Customer:</strong> {selectedService.serviceQuotation.customer.name}</p>
                        <div className="mt-1">
                            <label className="mt-1">
                                <strong>Method:</strong>
                                <Select
                                    defaultValue={selectedService.paymentMethod}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleInputChange("paymentMethod", value)}
                                    options={methodOptions}
                                />
                            </label>
                        </div>
                        <p><strong>Cost:</strong> {selectedService.serviceQuotation.cost}</p>
                        <p><strong>VAT:</strong> {selectedService.serviceQuotation.cost}</p>
                        <p><strong>Total Cost:</strong> {selectedService.serviceQuotation.totalCost}</p>
                        <p><strong>Create Date:</strong> {new Date(selectedService.createDate).toLocaleString()}</p>
                        <p><strong>Staff:</strong> {selectedService.maintenanceStaff.name}</p>
                        <div className="mt-1">
                            <label className="mt-1">
                                <strong>Status:</strong>
                                <Select
                                    defaultValue={selectedService.status}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleInputChange("status", value)}
                                    options={statusOptions}
                                />
                            </label>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ServicePaymentTable;
