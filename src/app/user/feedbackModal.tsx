import { Modal, Rate, Input, message } from 'antd';
import { useState } from 'react';

const { TextArea } = Input;

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceCategoryId: string | null;
}

const FeedbackModal = ({ isOpen, onClose, serviceCategoryId }: FeedbackModalProps) => {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const token = localStorage.getItem('token');

    const handleSubmit = async () => {
        if (!serviceCategoryId) return;

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
            const response = await fetch('http://localhost:8080/api/service-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceCategoryId: serviceCategoryId,
                    rating: rating,
                    feedback: feedback,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            message.success('Feedback submitted successfully!');
            setRating(0);
            setFeedback('');
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setFeedback('');
        onClose();
    };

    return (
        <Modal
            title="Feedback"
            open={isOpen}
            onCancel={handleCancel}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText="Submit Feedback"
            cancelText="Cancel"
        >
            <div className="space-y-6">
                {/* Rating Section */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
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
                        Your feedback is valuable to us and helps improve our services.
                        Please rate your experience and provide detailed feedback.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default FeedbackModal; 