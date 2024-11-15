import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ServiceRequestLog {
  serviceRequestLogId: string;
  serviceRequest: {
    serviceRequestId: string;
    customer: {
      name: string;
      email: string;
      role: string;
    };
  };
  status: string;
  description: string;
  createDate: string;
  updateBy: string;
}

interface ServiceRequestLogsProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequestId: string;
}

const ServiceRequestLogs: React.FC<ServiceRequestLogsProps> = ({
  isOpen,
  onClose,
  serviceRequestId
}) => {
  const [logs, setLogs] = useState<ServiceRequestLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!serviceRequestId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:8080/api/service-requests-logs/${serviceRequestId}`,
          { method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
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
        toast.error('Failed to load request logs');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLogs();
    }
  }, [serviceRequestId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[70vh] overflow-y-auto shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Service Request Logs</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
            <p className="mt-4 text-gray-500">Loading logs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.serviceRequestLogId}
                  className="border border-gray-200 rounded-lg p-5 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green text-black`}>
                      {log.status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(log.createDate).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-700 text-base mb-3 leading-relaxed">
                    {log.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Updated by: <span className="font-medium ml-1 text-gray-700">{log.updateBy}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-500">No logs available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestLogs;
