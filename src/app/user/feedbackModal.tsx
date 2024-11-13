import { Modal, Rate, Input, message } from 'antd';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceRequestId: string | null;
}

interface FeedbackData {
    serviceFeedbackId: string;
    serviceRequest: {
        serviceRequestId: string;
    }
    rating: number;
    feedback: string;
    createDate: string;
}

const FeedbackModal = ({ isOpen, onClose, serviceRequestId }: FeedbackModalProps) => {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const [existingFeedback, setExistingFeedback] = useState<FeedbackData | null>(null);
    const token = localStorage.getItem('token');

    // Reset states when modal opens
    useEffect(() => {
        if (isOpen) {
            if (serviceRequestId) {
                fetchExistingFeedback();
            } else {
                // Reset states if no serviceRequestId
                setRating(0);
                setFeedback('');
                setExistingFeedback(null);
            }
        }
    }, [isOpen, serviceRequestId]);

    const fetchExistingFeedback = async () => {
        try {
            setRating(0); // Reset rating before fetching
            setFeedback(''); // Reset feedback before fetching
            setExistingFeedback(null); // Reset existingFeedback before fetching

            const response = await fetch(
                `http://localhost:8080/api/service-feedback/service-request/${serviceRequestId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setExistingFeedback(data);
                setRating(data.rating);
                setFeedback(data.feedback);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const handleSubmit = async () => {
        if (!serviceRequestId) return;

        if (rating === 0) {
            message.error('Please provide a rating');
            return;
        }

        if (!feedback.trim()) {
            message.error('Please provide feedback');
            return;
        }

        setLoading(true);
        try {
            const url = existingFeedback
                ? `http://localhost:8080/api/service-feedback/${existingFeedback.serviceFeedbackId}`
                : 'http://localhost:8080/api/service-feedback';

            const method = existingFeedback ? 'PUT' : 'POST';

            const requestBody = {
                serviceRequestId,
                rating,
                feedback
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback');
            }

            message.success(existingFeedback ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset all states when closing modal
        setRating(0);
        setFeedback('');
        setExistingFeedback(null);
        onClose();
    };

    return (
        <Modal
            title={existingFeedback ? "Edit Feedback" : "New Feedback"}
            open={isOpen}
            onCancel={handleCancel}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={existingFeedback ? "Update Feedback" : "Submit Feedback"}
            cancelText="Cancel"
        >
            <div className="space-y-6">
                {/* Created Date (only show for existing feedback) */}
                {existingFeedback && (
                    <div className="text-sm text-gray-500">
                        Created: {new Date(existingFeedback.createDate).toLocaleString()}
                    </div>
                )}

                {/* Rating Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-500">Rating</h3>
                    <div className="flex items-center space-x-2">
                        <Rate
                            value={rating}
                            onChange={setRating}
                            style={{ fontSize: 24 }}
                        />
                        {rating > 0 && <span className="text-blue-600">({rating} stars)</span>}
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Your Feedback</h3>
                    <TextArea
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Please share your experience with our service..."
                        maxLength={500}
                        showCount
                        className="w-full"
                    />
                </div>

                {/* Information Note */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                        {existingFeedback
                            ? "You can update your feedback at any time. Your honest opinion helps us improve."
                            : "Your feedback is valuable to us and helps improve our services."}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default FeedbackModal; 