import React, { useState, useEffect } from 'react';
import { Modal, Timeline, Button, Input, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Image } from 'antd';

interface ServiceProgressLog {
    createDate: string;
    step: string;
    description: string;
    imageUrl?: string;
}

interface ServiceProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceProgressId: string | null;
    mode: 'logs' | 'reject';
}

const ServiceProgressModal: React.FC<ServiceProgressModalProps> = ({
    isOpen,
    onClose,
    serviceProgressId,
    mode
}) => {
    const [logs, setLogs] = useState<ServiceProgressLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (isOpen && serviceProgressId && mode === 'logs') {
            fetchLogs();
        }
    }, [isOpen, serviceProgressId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:8080/api/view-progress-logs/${serviceProgressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }

            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
            message.error('Failed to fetch progress logs');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            message.error('Please provide a reason for rejection');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:8080/api/service-progress/${serviceProgressId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        "serviceDetailID": serviceProgressId,
                        "step": "Rejected",
                        "description": rejectReason,
                        "imageUrl": ""
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to reject service progress');
            }

            message.success('Service progress rejected successfully');
            await fetch(`http://localhost:8080/api/create-progress-log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceProgressId: serviceProgressId,
                }),
            });
            onClose();
        } catch (error) {
            console.error('Error rejecting service progress:', error);
            message.error('Failed to reject service progress');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (mode === 'logs') {
            return (
                <Timeline
                    mode="left"
                    items={logs.map((log) => ({
                        label: (
                            <div>
                                {log.imageUrl && (
                                    <button type="button" onClick={() => {
                                        setPreviewImage(log.imageUrl || '');
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
                        children: (
                            <>
                                <p>{log.step || ''}</p>
                                <p>{log.description || ''}</p>
                            </>
                        ),

                    }))}
                />
            );
        }

        if (mode === 'reject') {
            return (
                <div>
                    <p>Please provide a reason for rejection:</p>
                    <Input.TextArea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                    />
                    <div className="mt-4 flex justify-end">
                        <Button type="primary" danger onClick={handleReject} loading={loading}>
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            title={mode === 'logs' ? 'Progress Logs' : 'Reject Service Progress'}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {renderContent()}
        </Modal>
    );
};

export default ServiceProgressModal;
