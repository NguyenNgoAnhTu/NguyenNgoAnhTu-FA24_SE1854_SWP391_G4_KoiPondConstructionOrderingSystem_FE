import { useEffect, useState } from "react";
import { Modal, message } from 'antd';
import './button-antd.css'

function ServiceFeedbackTable() {
    interface ServiceFeedback {
        serviceFeedbackId: string;
        serviceDetail: {
            serviceDetailId: string;
        };
        createDate: string;
        customer: {
            name: string;
        };
        feedback: string;
        rating: number;
    }

    const [serviceFeedbackData, setServiceFeedbackData] = useState<ServiceFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceFeedback | null>(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchServicePayment = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/service-feedback", {
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
                setServiceFeedbackData(data);
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

    const handleViewDetail = (service: ServiceFeedback) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/service-feedback/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                message.success(`Successfully deleted service feedback with ID: ${id}`); // Show success message
                setServiceFeedbackData((prevData) => prevData.filter((service) => service.serviceFeedbackId !== id));
            } else {
                throw new Error(`Failed to delete service feedback with ID: ${id}`);
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

    if (serviceFeedbackData.length === 0) {
        return <div className="text-center py-4">No data available.</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <div className="overflow-hidden rounded-lg border border-b-black-15 shadow-md">
                <table className="min-w-full">
                    <thead className="bg-gray-A0 border">
                        <tr>
                            {[
                                "Index",
                                "Service Feedback ID",
                                "Service Detail ID",
                                "Customer name",
                                "Feedback",
                                "Rating",
                                "Create date",
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
                        {serviceFeedbackData.map((service, index) => (
                            <tr key={service.serviceFeedbackId} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{index + 1}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceFeedbackId}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.serviceDetail.serviceDetailId}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.customer.name}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.feedback}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{service.rating}</td>
                                <td className="px-2 py-4 text-sm text-black-15 text-center">{new Date(service.createDate).toLocaleString()}</td>
                                <td className="px-2 py-4 text-sm">
                                    <button
                                        type="button"
                                        className="mx-1 text-white bg-green hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                                        onClick={() => handleViewDetail(service)}
                                    >
                                        View Detail
                                    </button>
                                    <button
                                        type="button"
                                        className="mx-1 text-white bg-red hover:bg-blue focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                                        onClick={() => handleDelete(service.serviceFeedbackId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="View Service Feedback" open={isModalOpen} onCancel={handleCancel} confirmLoading={loadingUpdate}>
                {selectedService && (
                    <div>
                        <p><strong>Service Feedback ID:</strong> {selectedService.serviceFeedbackId}</p>
                        <p><strong>Service Detail ID:</strong> {selectedService.serviceDetail.serviceDetailId}</p>
                        <p><strong>Customer Name:</strong> {selectedService.customer.name}</p>
                        <p><strong>Feedback:</strong> {selectedService.feedback}</p>
                        <p><strong>Rating:</strong> {selectedService.rating}</p>
                        <p><strong>Create Date:</strong> {new Date(selectedService.createDate).toLocaleString()}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ServiceFeedbackTable;
