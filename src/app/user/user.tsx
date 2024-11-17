import { useState } from "react";
import { useEffect } from "react";
import "./user.css";
import { message } from 'antd';
import { toast } from "react-toastify";
import ConstructionInfomation from "./construction-infomation";
import PaymentModal from './paymentModal';
import FeedbackModal from './feedbackModal';
import Swal from 'sweetalert2';
import ServiceRequestLogs from './service-request-logs';
import RequestLog from './request-log';
import ServiceProgressModal from './service-progress.modal';

const User = () => {
  interface ServiceRequest {
    serviceRequestId: string;
    serviceCategory: {
      serviceCategoryId: string;
      type: string;
      cost: number;
      note: string;
    };
    customer: {
      name: string;
      email: string;
      role: string;
    };
    description: string;
    address: string;
    status: string;
    note: string;
    createBy: string;
    createDate: string;
    isActive: boolean;
  }

  interface ServiceQuotation {
    serviceQuotationId: string;
    customer: {
      name: string;
      email: string;
      role: string;
    };
    serviceProgress: {
      serviceProgressID?: string;
      isConfirmed?: boolean;
    };
    serviceRequest: {
      serviceRequestId: string;
      customer: {
        name: string;
        email: string;
        role: string;
      };
      serviceCategory: {
        serviceCategoryId: number;
        type: string;
        cost: number;
        note: string;
      };
      address: string;
      status: string;
    };
    description: string;
    note: string;
    cost: number;
    totalCost: number;
    vat: number;
    confirm: boolean;
    createBy: string;
    createDate: string;
  }

  interface ServiceProgress {
    serviceProgressID: string;
    serviceDetail: {
      serviceDetailId: string;
      staff: {
        customerId: string;
      };
      serviceQuotation: {
        serviceQuotationId: string;
      };
    };
    startDate: string;
    endDate?: string;
    step?: string;
    description?: string;
    isComfirmed: boolean;
  }

  interface Request {
    id: string;
    description: string;
    address: string;
    note: string;
    status: string;
    createDate: string;
    updatedAt: string;
    isActive: boolean;
  }

  interface GetAllQuotationResponse {
    quotationId: string;
    consult: {
      Id: string;
      consultDate: string;

      requestDetail: {
        requestDetailId: string;
        note: string;
        request: {
          id: string;
          address: string;
          status: string;
        }
      };
    };
    isConfirm: boolean;
    description: string;
    totalCost: number;
    vat: number;
    subCost: number;
    mainCost: number;
    createdAt: string;
    updatedAt: string;
  }
  interface Request {
    id: string;
    description: string;
    address: string;
    note: string;
    status: string;
    createDate: string;
    updatedAt: string;
  }

  interface GetAllQuotationResponse {
    quotationId: string;
    consult: {
      Id: string;
      consultDate: string;

      requestDetail: {
        requestDetailId: string;
        note: string;
        request: {
          id: string;
          address: string;
          status: string;
        }
      };
    };
    isConfirm: boolean;
    description: string;
    totalCost: number;
    vat: number;
    subCost: number;
    mainCost: number;
    createdAt: string;
    updatedAt: string;
  }
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceQuotation, setServiceQuotation] = useState<ServiceQuotation[]>(
    []
  );
  const [serviceProgress, setServiceProgress] = useState<ServiceProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(localStorage.getItem("name") || "N/A");
  const [email, setEmail] = useState(
    localStorage.getItem("email") || "N/A"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || "N/A"
  );


  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);


  const [showServiceRequests, setShowServiceRequests] = useState(false);
  const [showServiceQuotation, setShowServiceQuotation] = useState(false);
  const [showServiceProgress, setShowServiceProgress] = useState(false);
  const [showConstructionInfo, setShowConstructionInfo] = useState(false);
  //const [customerId] = useState(localStorage.getItem("customerId") || "");
  const [modal, setModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // initially show 3 cards
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [constructionRequests, setConstructionRequests] = useState<Request[]>([]);

  const [quotationConstructions, setQuotationConstructions] = useState<GetAllQuotationResponse[]>([]);
  // const [showQuotations, setShowQuotations] = useState(false)

  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState<string | null>(null);

  const [showConstructionInfoMenu, setShowConstructionInfoMenu] = useState(false);
  const [activeConstructionTab, setActiveConstructionTab] = useState<string | null>(null);
  const [showConstructionRequest, setShowConstructionRequest] = useState(false);
  const [showConstructionQuotation, setShowConstructionQuotation] = useState(false);
  const [showConstructionInformation, setShowConstructionInformation] = useState(false);

  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(localStorage.getItem("address") || "N/A");  

  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isRequestLogsModalOpen, setIsRequestLogsModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressModalMode, setProgressModalMode] = useState<'logs' | 'reject'>('logs');
  const [selectedProgressId, setSelectedProgressId] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

  const handleConfirmToggle = async (serviceQuotationId: string) => {
    try {
      // Validate serviceQuotationId
      if (!serviceQuotationId) {
        toast.error('Invalid quotation ID');
        return;
      }

      // Find quotation
      const quotation = serviceQuotation.find(
        (q) => q.serviceQuotationId === serviceQuotationId
      );

      if (!quotation) {
        toast.error('Quotation not found');
        return;
      }

      // Check if already confirmed
      if (quotation.confirm) {
        toast.info('This quotation has already been confirmed');
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Confirm Quotation',
        text: 'Are you sure you want to confirm this quotation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm it!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Log request details
     

        const response = await fetch(
          `http://localhost:8080/api/service-quotations/${serviceQuotationId}/toggle-confirm`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        // Read response text first
        const responseText = await response.text();
      //  console.log('Response text:', responseText);

        // Try to parse JSON if possible
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
          console.warn('Response is not JSON:', responseText);
        }

        if (!response.ok) {
          throw new Error(
            data?.message || 
            responseText || 
            'Failed to confirm quotation'
          );
        }

        // Update state only if request was successful
        setServiceQuotation(prev => 
          prev.map(q => 
            q.serviceQuotationId === serviceQuotationId
              ? { ...q, confirm: true }
              : q
          )
        );

        toast.success('Quotation confirmed successfully');

        // Refresh data
        await fetchQuotations();
      }
    } catch (error) {
      console.error('Confirmation error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(
        error instanceof Error 
          ? `Failed to confirm: ${error.message}`
          : 'Failed to confirm quotation'
      );
    }
  };

  // Add fetch function
  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:8080/api/service-quotations',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }

      const data = await response.json();
      setServiceQuotation(data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // show 3 more cards on each click
  };
    const handleOpen = () => {
    setModal(!modal);
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) {
        setError("Authentication information missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch service requests
        if (showServiceRequests) {
          const serviceRequestsResponse = await fetch(
            `http://localhost:8080/api/service-requests/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (serviceRequestsResponse.ok) {
            const serviceRequestsData = await serviceRequestsResponse.json();
            setServiceRequests(serviceRequestsData || []);
          }
        }

        // Fetch service quotations
        if (showServiceQuotation) {
          const quotationsResponse = await fetch(
            `http://localhost:8080/api/service-quotations/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (quotationsResponse.ok) {
            const quotationsData = await quotationsResponse.json();
            setServiceQuotation(quotationsData || []);
          }
        }

        // Fetch service progress
        if (showServiceProgress) {
          const progressResponse = await fetch(
            `http://localhost:8080/api/service-progress/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setServiceProgress(progressData || []);
          }
        }

        // Fetch construction info
        if (showConstructionRequest) {
          const constructionResponse = await fetch(
            `http://localhost:8080/api/request/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (constructionResponse.ok) {
            const constructionData = await constructionResponse.json();
            setConstructionRequests(constructionData || []);
          }
        }

        // Fetch construction quotations
        if (showConstructionQuotation) {
          const constructionQuotationsResponse = await fetch(
            `http://localhost:8080/api/quotation/customer`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (constructionQuotationsResponse.ok) {
            const quotationData = await constructionQuotationsResponse.json();
            setQuotationConstructions(quotationData || []);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showServiceRequests, showServiceQuotation, showServiceProgress, showConstructionRequest, showConstructionQuotation]);



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
        message.success(`Successfully confirmed service progress with ID: ${service.serviceProgressID}`);
        setServiceProgress((prevList) =>
          prevList.map((prevService) =>
            prevService.serviceProgressID === service.serviceProgressID
              ? { ...prevService, isComfirmed: true }
              : prevService
          )
        );
        await fetch(`http://localhost:8080/api/create-progress-log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceProgressId: service.serviceProgressID,
          }),
        });
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

  const handleRejected = async (service: ServiceProgress) => {
    console.log(service);
  }

  const handlePaymentClick = (quotation: ServiceQuotation) => {
    setSelectedPayment({
      serviceQuotation: {
        serviceQuotationId: quotation.serviceQuotationId,
        customer: quotation.customer,
        cost: quotation.cost,
        vat: quotation.vat,
        totalCost: quotation.totalCost
      }
    });
    setIsPaymentModalOpen(true);
  };

  const handleFeedbackClick = (requestId: string) => {
    console.log('Opening feedback modal for request:', requestId);
    setSelectedRequestId(requestId);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedRequestId(null);
  };

  const handleViewLogs = (serviceRequestId: string) => {
    setSelectedRequestId(serviceRequestId);
    setIsLogsModalOpen(true);
  };

  const handleViewRequestLogs = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsRequestLogsModalOpen(true);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      // const customer = localStorage.getItem("customer");
      if (!name.trim()) {
        toast.error("Name cannot be empty");
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (!phone.trim() || phone.length < 10 || phone.length > 11) {
        toast.error("Please enter a valid phone number");
        return;
      }
      const updateData = {
        name: name,
        email: email,
        phoneNumber: phone,
        address: address,
      };

      const response = await fetch(
        `http://localhost:8080/api/customer/${customerId}`,  // Đã bỏ customerId khỏi URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData), // Gửi customer object
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      if(response.ok){
      const updatedProfile = await response.json();

      // Update local storage với dữ liệu từ response
      localStorage.setItem("name", updatedProfile.name);
      localStorage.setItem("email", updatedProfile.email);
      localStorage.setItem("phone", updatedProfile.phoneNumber);
      localStorage.setItem("address", updatedProfile.address);
      console.log(updatedProfile.address);
      console.log(updatedProfile.name);
      // Update state với dữ liệu từ response
      setName(updatedProfile.name);
      setEmail(updatedProfile.email);
      setPhone(updatedProfile.phoneNumber);
      setAddress(updatedProfile.address);

      // Reset editing states
      setIsEditingName(false);
      setIsEditingEmail(false);
      setIsEditingPhone(false);
      setIsEditingAddress(false);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    }
  };
  return (
    <div className="container mx-auto">
      <div className="main-body">
        <div className="flex flex-wrap">
          <div className="lg:w-1/3 w-full p-4">
            <div className="card bg-white shadow-lg ">
              <div className="card-body p-6">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://i.pinimg.com/564x/72/32/98/72329823360e56269897813a3dbd99b6.jpg"
                    alt="Admin"
                    className="rounded-full p-1 bg-blue-500"
                    width="110"
                  />
                  <div className="mt-3">
                    <h4 className="text-lg font-semibold">{name}</h4>
                    <p className="text-gray-400 text-sm">{phone}</p>
                  </div>
                </div>

                <hr className="my-4" />
                <nav className="mt-5">
                  <ul className="flex flex-col gap-2">
                    {role === "CUSTOMER" && (
                      <>
                        {/* Service Menu */}
                        <div
                          className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0 cursor-pointer"
                          onClick={() => {
                            setShowServiceMenu(!showServiceMenu);
                            setShowConstructionInfoMenu(false);
                            setActiveConstructionTab(null);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.5 9.75H1.5C1.0875 9.75 0.75 10.0875 0.75 10.5C0.75 10.9125 1.0875 11.25 1.5 11.25H16.5C16.9125 11.25 17.25 10.9125 17.25 10.5C17.25 10.0875 16.9125 9.75 16.5 9.75Z"
                              fill=""
                            />
                            <path
                              d="M16.5 13.5H1.5C1.0875 13.5 0.75 13.8375 0.75 14.25C0.75 14.6625 1.0875 15 1.5 15H16.5C16.9125 15 17.25 14.6625 17.25 14.25C17.25 13.8375 16.9125 13.5 16.5 13.5Z"
                              fill=""
                            />
                            <path
                              d="M16.5 6H1.5C1.0875 6 0.75 6.3375 0.75 6.75C0.75 7.1625 1.0875 7.5 1.5 7.5H16.5C16.9125 7.5 17.25 7.1625 17.25 6.75C17.25 6.3375 16.9125 6 16.5 6Z"
                              fill=""
                            />
                          </svg>
                          <p>Service</p>
                        </div>

                        {/* Service Submenu */}
                        {showServiceMenu && (
                          <div className="pl-8">
                            <ul className="flex flex-col gap-2">
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeServiceTab === 'requests' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveServiceTab('requests');
                                    setShowServiceRequests(true);
                                    setShowServiceQuotation(false);
                                    setShowServiceProgress(false);
                                  }}
                                >
                                  Service Requests
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeServiceTab === 'quotation' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveServiceTab('quotation');
                                    setShowServiceRequests(false);
                                    setShowServiceQuotation(true);
                                    setShowServiceProgress(false);
                                  }}
                                >
                                  Service Quotation
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeServiceTab === 'progress' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveServiceTab('progress');
                                    setShowServiceRequests(false);
                                    setShowServiceQuotation(false);
                                    setShowServiceProgress(true);
                                  }}
                                >
                                  Service Progress
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Construction Info Menu */}
                        <div
                          className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0 cursor-pointer"
                          onClick={() => {
                            setShowConstructionInfoMenu(!showConstructionInfoMenu);
                            setShowServiceMenu(false);
                            setActiveServiceTab(null);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.5 9.75H1.5C1.0875 9.75 0.75 10.0875 0.75 10.5C0.75 10.9125 1.0875 11.25 1.5 11.25H16.5C16.9125 11.25 17.25 10.9125 17.25 10.5C17.25 10.0875 16.9125 9.75 16.5 9.75Z"
                              fill=""
                            />
                            <path
                              d="M16.5 13.5H1.5C1.0875 13.5 0.75 13.8375 0.75 14.25C0.75 14.6625 1.0875 15 1.5 15H16.5C16.9125 15 17.25 14.6625 17.25 14.25C17.25 13.8375 16.9125 13.5 16.5 13.5Z"
                              fill=""
                            />
                            <path
                              d="M16.5 6H1.5C1.0875 6 0.75 6.3375 0.75 6.75C0.75 7.1625 1.0875 7.5 1.5 7.5H16.5C16.9125 7.5 17.25 7.1625 17.25 6.75C17.25 6.3375 16.9125 6 16.5 6Z"
                              fill=""
                            />
                          </svg>
                          <p>Construction Information</p>
                        </div>

                        {/* Construction Info Submenu */}
                        {showConstructionInfoMenu && (
                          <div className="pl-8">
                            <ul className="flex flex-col gap-2">
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeConstructionTab === 'requests' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveConstructionTab('requests');
                                    setShowConstructionRequest(true);
                                    setShowConstructionQuotation(false);
                                    setShowConstructionInformation(false);
                                  }}
                                >
                                  Construction Requests
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeConstructionTab === 'quotations' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveConstructionTab('quotations');
                                    setShowConstructionRequest(false);
                                    setShowConstructionQuotation(true);
                                    setShowConstructionInformation(false);
                                  }}
                                >
                                  Construction Quotations
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`cursor-pointer py-2 px-4 ${activeConstructionTab === 'information' ? 'bg-gray-A0' : ''}`}
                                  onClick={() => {
                                    setActiveConstructionTab('information');
                                    setShowConstructionRequest(false);
                                    setShowConstructionQuotation(false);
                                    setShowConstructionInformation(true);
                                  }}
                                >
                                  Construction History
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3 w-full p-4">
            {/* Edit Profile Section - Fixed at top */}
            <div className="card bg-white shadow-lg mb-6">
              <div className="card-body p-6">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingName ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{name}</span>
                        <button onClick={() => setIsEditingName(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingEmail ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{email}</span>
                        <button onClick={() => setIsEditingEmail(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingPhone ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{phone}</span>
                        <button onClick={() => setIsEditingPhone(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Address</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{address}</span>
                        <button onClick={() => setIsEditingAddress(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Service Content - Scrollable area below profile */}
            <div className="mt-6">
              {role === "CUSTOMER" && showServiceMenu && (
                <>
                  {showServiceRequests && (
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4">Service Requests</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {serviceRequests.slice(0, visibleCount).map((service) => (
                          <div 
                            key={service.serviceRequestId}
                            className={`rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 relative
                              ${!service.isActive ? 'opacity-60' : ''}`}
                          >
                            {!service.isActive && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                  Inactive
                                </span>
                              </div>
                            )}

                            <h3 className="text-lg font-semibold text-center mb-4">
                              Service Request ID: {service.serviceRequestId}
                            </h3>

                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Category Type:</strong>{" "}
                              {service.serviceCategory.type || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Cost:</strong>{" "}
                              {service.serviceCategory.cost || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Description:</strong> {service.description}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Address:</strong> {service.address || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Note:</strong> {service.note || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Create Date:</strong> {new Date(service.createDate).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Status:</strong> {service.status || "N/A"}
                            </p>

                            <div className="flex justify-center mt-4 gap-2">
                              <button
                                onClick={() => handleViewLogs(service.serviceRequestId)}
                                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                View Logs
                              </button>
                              {service.isActive && service.status === "Finish" && (
                                <button
                                  onClick={() => {
                                    setSelectedRequestId(service.serviceRequestId);
                                    setIsFeedbackModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green transition-colors"
                                >
                                  Feedback
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feedback Modal */}
                      <FeedbackModal
                        isOpen={isFeedbackModalOpen}
                        onClose={() => {
                          setIsFeedbackModalOpen(false);
                          setSelectedRequestId(null);
                        }}
                        serviceRequestId={selectedRequestId}
                      />

                      {visibleCount < serviceRequests.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleShowMore}
                            className="px-6 py-2.5 bg-red text-white rounded-full hover:opacity-80 transition-opacity"
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {showServiceQuotation && (
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4">Service Quotations</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {serviceQuotation.slice(0, visibleCount).map((quotation) => (
                          <div
                            key={quotation.serviceQuotationId}
                            className="rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">
                                ID: {quotation.serviceQuotationId}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm ${quotation.confirm
                                ? "bg-green-100 text-green"
                                : "bg-yellow-100 text-yellow"
                                }`}>
                                {quotation.confirm ? "Confirmed" : "Pending"}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium">Service Type:</span>{" "}
                                {quotation.serviceRequest.serviceCategory.type}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Create By:</span>{" "}
                                {quotation.createBy}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Description:</span>{" "}
                                {quotation.description}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Address:</span>{" "}
                                {quotation.serviceRequest.address}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Create Date:</span>{" "}
                                {new Date(quotation.createDate).toLocaleString()}
                              </p>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-sm">
                                  <span className="font-medium">Base Cost:</span>{" "}
                                  ${quotation.cost.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">VAT:</span>{" "}
                                  {quotation.vat.toLocaleString()}%
                                </p>
                                <p className="text-lg font-semibold text-green-600">
                                  <span className="font-medium">Total:</span>{" "}
                                  ${quotation.totalCost.toLocaleString()}
                                </p>
                              </div>

                              <div className="flex justify-center gap-2 mt-4">
                                {!quotation.confirm && (
                                  <button
                                    className="px-4 py-2 bg-green text-white rounded-lg hover:bg-blue transition-colors"
                                    onClick={() => handleConfirmToggle(quotation.serviceQuotationId)}
                                  >
                                    Confirm Quotation
                                  </button>
                                )}

                                {quotation.confirm === true && (
                                  <td className="px-6 py-4 text-sm text-center">
                                    <button
                                      className="px-4 py-2 rounded-lg bg-[#4A6CF7] text-white"
                                      onClick={() => handlePaymentClick(quotation)}
                                    >
                                      Payment
                                    </button>
                                  </td>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Modals */}
                      <PaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        servicePayment={selectedPayment}
                      />

                      <FeedbackModal
                        isOpen={isFeedbackModalOpen}
                        onClose={handleCloseFeedbackModal}
                        serviceRequestId={selectedRequestId}
                      />

                      {/* Show More Button */}
                      {visibleCount < serviceQuotation.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleShowMore}
                            className="px-6 py-2.5 bg-red text-white rounded-full hover:opacity-80 transition-opacity"
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {showServiceProgress && (
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4">Service Progress</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {serviceProgress
                          .slice(0, visibleCount)
                          .map((service: ServiceProgress) => (
                            <div
                              key={service.serviceProgressID}
                              className={`rounded-lg shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer ${service.isComfirmed ? 'bg-[#EBF8F2]' : 'bg-red bg-opacity-50'
                                }`}
                            >
                              <h3 className="text-lg font-semibold text-center mb-4">
                                Service Progress ID:  {service.serviceProgressID}
                              </h3>
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Service Detail ID:  </strong>
                                {service.serviceDetail.serviceDetailId}
                              </p>
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Start Date:  </strong>
                                {new Date(service.startDate).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>End Date:  </strong>
                                {service.endDate ? new Date(service.endDate).toLocaleString() : "Unfinished"}
                              </p>
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Step:  </strong>
                                {service.step}
                              </p><p className="text-sm text-gray-700 mb-2">
                                <strong>Description:  </strong>
                                {service.description}
                              </p>
                              <p><strong>Confirmed:  </strong> {service.isComfirmed ? "✔️" : "❌"}</p>

                              <div className="flex justify-center mt-4">
                                <button
                                  type="button"
                                  className="mx-1 text-[#2dd4bf] bg-white hover:text-white hover:bg-[#2dd4bf] focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2"
                                  onClick={() => {
                                    setSelectedProgressId(service.serviceProgressID);
                                    setProgressModalMode('logs');
                                    setIsProgressModalOpen(true);
                                  }}
                                >
                                  View Logs
                                </button>
                                {!service.isComfirmed && service.endDate && service.step == "Complete" && (
                                  <>
                                    <button
                                      type="button"
                                      className="mx-1 text-green bg-white hover:text-white hover:bg-green focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2"
                                      onClick={() => handleConfirmed(service)}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type="button"
                                      className="mx-1 text-red bg-white hover:text-white hover:bg-red focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
                                      onClick={() => {
                                        setSelectedProgressId(service.serviceProgressID);
                                        setProgressModalMode('reject');
                                        setIsProgressModalOpen(true);
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                      {visibleCount < serviceProgress.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleShowMore}
                            className="text-white bg-red hover:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5"
                          >
                            Show More
                          </button>
                        </div>
                      )}
                      <br></br>
                    </div>
                  )}
                </>
              )}

              {/* Construction Info Content */}
              {role === "CUSTOMER" && showConstructionInfoMenu && (
                <>
                  {/* Construction Requests */}
                  {showConstructionRequest && (
                    <div className="container mx-auto mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {constructionRequests.map((request) => (
                          <div
                            key={request.id}
                            className="rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
                          >
                            <h3 className="text-lg font-semibold text-center mb-4">
                              Request ID: {request.id}
                            </h3>

                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Description:</strong> {request.description}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Address:</strong> {request.address}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Note:</strong> {request.note || "N/A"}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Created Date:</strong>{" "}
                              {new Date(request.createDate).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Status:</strong>{" "}
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'}`}
                              >
                                {request.status}
                              </span>
                            </p>

                            <div className="flex justify-center mt-4 gap-2">
                              <button
                                onClick={() => handleViewRequestLogs(request.id)}
                                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                View Logs
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {visibleCount < constructionRequests.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleShowMore}
                            className="mx-1 text-white bg-red  hover:bg-red-32 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Construction Quotations */}
                  {showConstructionQuotation && (
                    <div className="container mx-auto mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quotationConstructions.map((quotation, index) => (
                          <div
                            key={quotation.quotationId}
                            className="rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
                          >
                            <h3 className="text-lg font-semibold text-center mb-4">
                              Quotation ID: {quotation.quotationId}
                            </h3>

                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Consult Date:</strong>{" "}
                              {new Date(quotation.consult.consultDate).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Request ID:</strong>{" "}
                              {quotation.consult.requestDetail.request.id}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Address:</strong>{" "}
                              {quotation.consult.requestDetail.request.address}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Description:</strong> {quotation.description}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Main Cost:</strong> ${quotation.mainCost.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Sub Cost:</strong> ${quotation.subCost.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>VAT:</strong> ${quotation.vat.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Total Cost:</strong>{" "}
                              <span className="font-semibold text-lg text-green-600">
                                ${quotation.totalCost.toLocaleString()}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Status:</strong>{" "}
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${quotation.consult.requestDetail.request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  quotation.consult.requestDetail.request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'}`}
                              >
                                {quotation.consult.requestDetail.request.status}
                              </span>
                            </p>


                          </div>
                        ))}
                      </div>
                      {visibleCount < quotationConstructions.length && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleShowMore}
                            className="mx-1 text-white bg-red  hover:bg-red-32 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Construction Information */}
                  {showConstructionInformation && (
                    <div className="container mx-auto mt-8">
                      <ConstructionInfomation />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ServiceRequestLogs
        isOpen={isLogsModalOpen}
        onClose={() => {
          setIsLogsModalOpen(false);
          setSelectedRequestId(null);
        }}
        serviceRequestId={selectedRequestId || ''}
      />
      <RequestLog
        isOpen={isRequestLogsModalOpen}
        onClose={() => {
          setIsRequestLogsModalOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId || ''}
      />
      <ServiceProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => {
          setIsProgressModalOpen(false);
          setSelectedProgressId(null);
        }}
        serviceProgressId={selectedProgressId}
        mode={progressModalMode}
      />
    </div>
  );
};

export default User;