import { Modal, Select, message } from 'antd';
import { useState, useEffect } from 'react';

interface ServicePayment {
    servicePaymentID: string;
    paymentMethod: string;
    serviceQuotation: {
        serviceQuotationId: string;
        customer: {
            name: string;
        };
        serviceDetailId: string;
        cost: number;
        vat: number;
        totalCost: number;
    };
    maintenanceStaff: {
        customerId: string;
    };
    description: string;
    status: string;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    servicePayment: ServicePayment | null;
}

const paymentMethodOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
];

const PaymentModal = ({ isOpen, onClose, servicePayment }: PaymentModalProps) => {
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [servicePaymentData, setServicePaymentData] = useState<ServicePayment | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (servicePayment?.serviceQuotation.serviceQuotationId) {
            fetchServicePayment(servicePayment.serviceQuotation.serviceQuotationId);
        }
    }, [servicePayment]);

    useEffect(() => {
        if (!isOpen) {
            setServicePaymentData(null);
            setLoadingPayment(false);
        }
    }, [isOpen]);

    const fetchServicePayment = async (serviceQuotationID: string) => {
        setLoadingPayment(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/service-payment/quotation/${serviceQuotationID}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch payment data");
            }

            if (response.status === 404) {
                setLoadingPayment(false);
                throw new Error("Payment has not been created yet");
            }
            const data = await response.json();
            setServicePaymentData(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setLoadingPayment(false);
        }
    };

    const handlePayment = async () => {
        if (!servicePaymentData) return;

        setLoadingPayment(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/service-payment/${servicePaymentData.servicePaymentID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        serviceQuotationId: servicePaymentData.serviceQuotation.serviceQuotationId,
                        paymentMethod: servicePaymentData.paymentMethod,
                        maintenanceStaffID: servicePaymentData.maintenanceStaff.customerId,
                        status: "Paid"
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to process payment");
            }

            message.success('Payment processed successfully!');
            onClose();
            window.location.reload();
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setLoadingPayment(false);
        }
    };

    const handleInputChange = (
        eOrName: string,
        value?: string
    ) => {
        if (servicePaymentData) {
            setServicePaymentData({
                ...servicePaymentData,
                [eOrName]: value,
            });
        }
    };

    const handleClose = () => {
        setServicePaymentData(null);
        setLoadingPayment(false);
        onClose();
    };

    return (
        <Modal
            title="Payment Details"
            open={isOpen}
            onCancel={handleClose}
            confirmLoading={loadingPayment}
            onOk={servicePaymentData?.status !== "Paid" ? handlePayment : undefined}
            okText={servicePaymentData?.status !== "Paid" ? "Confirm Payment" : "Transaction completed successfully"}
            okButtonProps={{
                disabled: servicePaymentData?.status === "Paid",
                style: servicePaymentData?.status === "Paid" ? { backgroundColor: '#d9d9d9' } : undefined
            }}
            cancelText="Cancel"
        >
            {servicePaymentData ? (
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <p><strong>Payment ID:</strong> {servicePaymentData.servicePaymentID}</p>
                        <p><strong>Customer:</strong> {servicePaymentData.serviceQuotation.customer.name}</p>
                        <p><strong>Cost:</strong> ${servicePaymentData.serviceQuotation.cost}</p>
                        <p><strong>VAT:</strong> {servicePaymentData.serviceQuotation.vat}%</p>
                        {servicePaymentData.status !== "Paid" ? (
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Payment Method</h3>
                                <div className="space-y-2">
                                    <Select
                                        defaultValue={servicePaymentData.paymentMethod}
                                        style={{ width: '100%' }}
                                        onChange={(value) => handleInputChange("paymentMethod", value)}
                                        options={paymentMethodOptions}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p><strong>Payment Method: </strong> {servicePaymentData.paymentMethod}</p>
                        )}
                        <p><strong>Description:</strong> {servicePaymentData.description}</p>
                        <p><strong>Status:</strong> {servicePaymentData.status}</p>
                        <p className="text-xl font-bold text-green-600">
                            <strong>Total Amount:</strong> ${servicePaymentData.serviceQuotation.totalCost.toFixed(2)}
                        </p>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">
                            By proceeding with the payment, you agree to our terms and conditions.
                            The payment will be processed securely.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center">No payment information available.</div>
            )}
        </Modal>
    );
};

export default PaymentModal;
