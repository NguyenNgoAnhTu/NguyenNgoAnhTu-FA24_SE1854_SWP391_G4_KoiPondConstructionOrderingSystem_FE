import { toast } from "react-toastify";

import {  FiRefreshCw, FiEye } from 'react-icons/fi';
import { useState, useEffect } from "react";
import { Modal } from 'antd';

interface Customer {
    customerId: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  }
  
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

const MaintenanceStaff = () => {
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
const [selectedStaffProgress, setSelectedStaffProgress] = useState<ServiceProgress[]>([]);
const [loadingProgress, setLoadingProgress] = useState(false);
const [allStaffProgress, setAllStaffProgress] = useState<Record<string, ServiceProgress[]>>({});

const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
    //  console.log("Fetching customers with role:", role);
    //  console.log("Token:", token);

      const response = await fetch(
        `http://localhost:8080/api/customer/MAINTENANCE`,
        {   
          method: "GET",
          headers: {    
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      
      console.log("API Response:", response.status);
      console.log("Response data:", data);
      
      setCustomers(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }   
  };

  const handleViewProgress = async (staffId: string) => {
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:8080/api/service-progress/maintenance-staff/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch progress");
      
      const data = await response.json();
      setSelectedStaffProgress(data);
      setIsProgressModalOpen(true);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoadingProgress(false);
    }
  };

  const fetchAllStaffProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const progressData: Record<string, ServiceProgress[]> = {};
      
      for (const customer of customers) {
        const response = await fetch(
          `http://localhost:8080/api/service-progress/maintenance-staff/${customer.customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          progressData[customer.customerId] = data;
        }
      }
      
      setAllStaffProgress(progressData);
    } catch (error) {
      console.error("Error fetching all staff progress:", error);
    }
  };

  useEffect(() => {
    if (customers.length > 0) {
      fetchAllStaffProgress();
    }
  }, [customers]);
  useEffect(() => {
    fetchCustomers();
  }, []);

  const isStaffAvailable = (staffId: string): boolean => {
    const staffProgress = allStaffProgress[staffId] || [];
    return staffProgress.length === 0 || staffProgress.every(p => p.isComfirmed);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Maintenance Staff Management</h1>
        <button
          onClick={() => fetchCustomers()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>
  
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
  
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "No.",
                  "ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Role",
                  "Status",
                  "Actions"
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => {
                const isAvailable = isStaffAvailable(customer.customerId);
                return (
                  <tr 
                    key={customer.customerId}
                    className={`hover:bg-gray-50 transition-colors duration-200 
                      ${!isAvailable ? 'opacity-50 bg-gray-100' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {customer.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {customer.role} STAFF
                        
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewProgress(customer.customerId)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent 
                          text-sm leading-4 font-medium rounded-md text-white bg-green   hover:bg-green-600`}
                      >
                        <FiEye className="mr-2 h-4 w-4" />
                        View Progress
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        {/* Empty State */}
        {!loading && customers.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance staff found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new maintenance staff.
            </p>
          </div>
        )}
      </div>
  
      {/* Pagination (if needed) */}
      <div className="mt-4 flex justify-end">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {/* Add pagination buttons here */}
        </nav>
      </div>
  
      {/* Progress Modal */}
      <Modal
        title={<div className="text-lg font-semibold">Service Progress List</div>}
        open={isProgressModalOpen}
        onCancel={() => setIsProgressModalOpen(false)}
        width={800}
        footer={null}
      >
        {loadingProgress ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress ID
                  </th>
                
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedStaffProgress.map((progress) => (
                  <tr key={progress.serviceProgressID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {progress.serviceProgressID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {progress.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(progress.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${progress.isComfirmed ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                            {progress.isComfirmed ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedStaffProgress.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No progress records found</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default MaintenanceStaff;
