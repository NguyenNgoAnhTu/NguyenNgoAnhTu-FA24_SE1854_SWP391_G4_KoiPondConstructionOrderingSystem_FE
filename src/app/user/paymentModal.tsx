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
    transactionID: string;
    description: string;
    status: string;
}

interface VNPayResponse {
    amount: string;
    bankCode: string;
    bankTranNo: string;
    cardType: string;
    orderInfo: string;
    payDate: string;
    responseCode: string;
    tmnCode: string;
    transactionNo: string;
    transactionStatus: string;
    txnRef: string;
    secureHash: string;
    paymentId: string;
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
        let isSubscribed = true;

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

                if (response.status === 404) {
                    console.log('Payment not found for this quotation');
                    if (isSubscribed) {
                        setServicePaymentData(null);
                    }
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch payment data");
                }

                const data = await response.json();
                if (isSubscribed) {
                    setServicePaymentData(data);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error fetching payment:', error.message);
                    if (isSubscribed) {
                        setServicePaymentData(null);
                    }
                }
            } finally {
                if (isSubscribed) {
                    setLoadingPayment(false);
                }
            }
        };

        if (!isOpen) {
            setServicePaymentData(null);
            setLoadingPayment(false);
        } else if (servicePayment?.serviceQuotation.serviceQuotationId) {
            fetchServicePayment(servicePayment.serviceQuotation.serviceQuotationId);
        }

        return () => {
            isSubscribed = false;
            setServicePaymentData(null);
        };
    }, [servicePayment?.serviceQuotation.serviceQuotationId, isOpen, token]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const responseCode = urlParams.get('vnp_ResponseCode');
        const transactionStatus = urlParams.get('vnp_TransactionStatus');

        if (responseCode && transactionStatus) {
            const vnpayResponse: VNPayResponse = {
                paymentId: urlParams.get('paymentId') || '',
                amount: urlParams.get('vnp_Amount') || '',
                bankCode: urlParams.get('vnp_BankCode') || '',
                bankTranNo: urlParams.get('vnp_BankTranNo') || '',
                cardType: urlParams.get('vnp_CardType') || '',
                orderInfo: urlParams.get('vnp_OrderInfo') || '',
                payDate: urlParams.get('vnp_PayDate') || '',
                responseCode,
                tmnCode: urlParams.get('vnp_TmnCode') || '',
                transactionNo: urlParams.get('vnp_TransactionNo') || '',
                transactionStatus,
                txnRef: urlParams.get('vnp_TxnRef') || '',
                secureHash: urlParams.get('vnp_SecureHash') || '',
            };

            if (responseCode === '00' && transactionStatus === '00') {
                console.log('VNPAY payment successful');
                updateOrderStatus(vnpayResponse);
            } else {
                message.error('Payment failed!');
            }
        }
    }, []);

    const updateOrderStatus = async (paymentData: VNPayResponse) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/vnpay/payment_info?vnp_Amount=${paymentData.amount}&vnp_BankCode=${paymentData.bankCode}&vnp_OrderInfo=${paymentData.orderInfo}&vnp_ResponseCode=${paymentData.responseCode}&paymentId=${paymentData.paymentId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update payment status");
            }
            message.success("Payment status updated successfully by method online!");
            onClose();
        } catch (error) {
            console.error('Error updating payment status:', error);
            message.error('Failed to update payment status');
        }
    };

    const handlePayment = async () => {
        if (!servicePaymentData) return;

        setLoadingPayment(true);
        try {
            if (servicePaymentData.paymentMethod === "Online") {
                const responseVNPay = await fetch(
                    `http://localhost:8080/api/vnpay/create_payment?amount=${servicePaymentData.serviceQuotation.totalCost}&paymentId=${servicePaymentData.servicePaymentID}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!responseVNPay.ok) {
                    throw new Error("Failed to create VnPay");
                }
                const data = await responseVNPay.json();
                console.log('Redirecting to VNPAY payment page...', data.url);
                window.location.href = data.url;
                return;
            }
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
            message.success('Payment status updated successfully by method cash!');
            console.log('Payment processed, closing modal...');
            onClose();
            window.location.reload();
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message);
                console.error('Payment error:', error);
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
            {loadingPayment ? (
                <div className="text-center">Loading payment information...</div>
            ) : servicePaymentData ? (
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
                            <>
                                <p><strong>Payment Method: </strong> {servicePaymentData.paymentMethod}</p>
                                {servicePaymentData.transactionID && servicePaymentData.paymentMethod === "Online" && (
                                    <p><strong>Transaction ID:</strong> {servicePaymentData.transactionID}</p>
                                )}
                            </>
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
                <div className="text-center">
                    No payment information available for this quotation.
                </div>
            )}
        </Modal>
    );
};

export default PaymentModal;
