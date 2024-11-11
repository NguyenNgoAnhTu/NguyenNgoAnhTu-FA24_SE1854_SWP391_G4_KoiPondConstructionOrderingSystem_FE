import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import "./user.css";
import { message } from 'antd';
import { toast } from "react-toastify";
const User = () => {
  interface ServiceRequest {
    serviceRequestId: string;
    serviceCategory: {
      serviceCategoryId: string;
      type: string;
      cost: number;
      note: string;
    };
    description: string;
    address: string;
    note: string;
    status: string;
  }

  interface ServiceQuotation {
    serviceQuotationId: string;
    customer: {
      name: string;
      email: string;
      role: string;
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
  }

  interface ServiceProgress {
    serviceProgressID: string;
    serviceDetail: {
      serviceDetailId: string;
    };
    startDate: string;
    endDate?: string;
    step?: string;
    description?: string;
    isComfirmed: boolean;
  }

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceQuotation, setServiceQuotation] = useState<ServiceQuotation[]>(
    []
  );
  const [serviceProgress, setServiceProgress] = useState<ServiceProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(localStorage.getItem("name") || "John Doe");
  const [email, setEmail] = useState(
    localStorage.getItem("email") || "john@example.com"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || "(239) 816-9029"
  );
  const [mobile, setMobile] = useState(
    localStorage.getItem("mobile") || "(320) 380-4539"
  );
  const [address, setAddress] = useState(
    localStorage.getItem("address") || "Bay Area, San Francisco, CA"
  );

  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  //const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showServiceRequests, setShowServiceRequests] = useState(false);
  const [showServiceQuotation, setShowServiceQuotation] = useState(false);
  const [showServiceProgress, setShowServiceProgress] = useState(false);
  //const [customerId] = useState(localStorage.getItem("customerId") || "");
  const [modal, setModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // initially show 3 cards
  const handleConfirmToggle = async (quotationId: string) => {
    // Only show confirmation dialog if not already confirmed
    const quotation = serviceQuotation.find(
      (q) => q.serviceQuotationId === quotationId
    );
    if (!quotation?.confirm) {
      if (
        window.confirm(
          "Are you sure you want to confirm this quotation? This action cannot be undone."
        )
      ) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/api/service-quotations/${quotationId}/toggle-confirm`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to toggle confirmation status");
          }

          const updatedQuotation = await response.json();
          setServiceQuotation((prevData) =>
            prevData.map((quotation) =>
              quotation.serviceQuotationId === quotationId
                ? updatedQuotation
                : quotation
            )
          );

          toast.success("Quotation confirmed successfully!");
        } catch (error) {
          console.error("Error toggling confirmation status:", error);
          toast.error("Failed to confirm quotation");
        }
      }
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // show 3 more cards on each click
  };
  const handleOpen = () => {
    setModal(!modal);
  };
  useEffect(() => {
    // Modify the fetchServiceRequests function

    const fetchServiceRequests = async () => {
      // if (!customerId) {
      //   setError("No customer ID found");
      //   setLoading(false);
      //   return;
      // }
      try {
        const response = await fetch(
          `http://localhost:8080/api/service-requests/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setServiceRequests(data);
        console.log(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchServiceQuotation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/service-quotations/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setServiceQuotation(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };



    const fetchServiceProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/service-progress/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setServiceProgress(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchServiceRequests();
    fetchServiceQuotation();
    fetchServiceProgress();

  }, [showServiceRequests, showServiceQuotation, showServiceProgress]);

  const handleConfirmed = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/acceptance-service-progress/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success(`Successfully confirmed service progress with ID: ${id}`); // Show success message
        setServiceProgress((prevList) =>
          prevList.map((service) =>
            service.serviceProgressID === id ? { ...service, isComfirmed: true } : service
          )
        );
      } else {
        throw new Error(`Failed to confirm service progress with ID: ${id}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // Show error message
      }
    }
  }

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
  const handleSave = (field: any, value: any) => {
    switch (field) {
      case "name":
        setName(value);
        localStorage.setItem("name", value);
        setIsEditingName(false);
        break;
      case "email":
        setEmail(value);
        localStorage.setItem("email", value);
        setIsEditingEmail(false);
        break;
      case "phone":
        setPhone(value);
        localStorage.setItem("phone", value);
        setIsEditingPhone(false);
        break;
      case "mobile":
        setMobile(value);
        localStorage.setItem("mobile", value);
        //setIsEditingMobile(false);
        break;
      case "address":
        setAddress(value);
        localStorage.setItem("address", value);
        setIsEditingAddress(false);
        break;
      default:
        break;
    }
  };
  return (
    <div className="container mx-auto">
      <div className="main-body">
        <div className="flex flex-wrap">
          <div className="lg:w-1/3 w-full p-4">
            <div className="card bg-white shadow-lg">
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
                    <p className="text-gray-400 text-sm">{address}</p>
                  </div>
                </div>
                <hr className="my-4" />
                <nav className="mt-5">
                  <ul className="flex flex-col gap-2">
                    <div
                      className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"

                      onClick={handleOpen}>

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

                      {/* mục lớn */}
                      <p> Service</p>
                    </div>
                    <div className={`slide-container ${modal ? "open" : ""}`}>
                      {/* mục nhỏ */}

                      <li>
                        <NavLink
                          to="#"
                          className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowServiceRequests(!showServiceRequests);
                            setShowServiceQuotation(false);
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
                          Service Requests
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="#"
                          className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowServiceQuotation(!showServiceQuotation);
                            setShowServiceRequests(false);
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
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V3.15002C1.77227 2.89689 1.96914 2.70002 2.22227 2.70002H14.8285C15.0816 2.70002 15.2785 2.89689 15.2785 3.15002V6.44064C15.2785 6.77814 15.5598 7.08752 15.9254 7.08752C16.291 7.08752 16.5723 6.80627 16.5723 6.44064V3.15002C16.5723 2.18439 15.7941 1.40627 14.8285 1.40627H2.22227C1.25664 1.40627 0.478516 2.18439 0.478516 3.15002V14.8219C0.478516 15.7875 1.25664 16.5656 2.22227 16.5656H15.7785C16.7441 16.5656 17.5223 15.7875 17.5223 14.8219V12.3187C17.5223 11.9812 17.2129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.4726 7.53752C13.2195 7.2844 12.8257 7.2844 12.5726 7.53752L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.45699 7.53752C5.20387 7.2844 4.81012 7.2844 4.55699 7.53752C4.30387 7.79065 4.30387 8.1844 4.55699 8.43752L8.55074 12.3469Z"
                              fill=""
                            />
                          </svg>
                          Service Quotations
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to="#"
                          className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowServiceProgress(!showServiceProgress);
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
                          Service Progress
                        </NavLink>
                      </li>
                    </div>

                    {/* Add more menu items as needed */}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 w-full p-4">
            <div className="card bg-white shadow-lg">
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
                    className="bg-green text-white px-4 py-2 rounded-lg"
                    onClick={() => {
                      handleSave("name", name);
                      handleSave("email", email);
                      handleSave("phone", phone);
                      handleSave("mobile", mobile);
                      handleSave("address", address);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Service Requests */}
          {showServiceRequests && (
            <div className="container mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceRequests
                  .slice(0, visibleCount)
                  .map((service: ServiceRequest) => (
                    <div
                      key={service.serviceRequestId}
                      className=" rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
                    >
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
                        <strong>Status:</strong> {service.status || "N/A"}
                      </p>

                      <div className="flex justify-center mt-4">
                        {/* Optional 'Create Quotation' button */}
                        {/* <button
              type="button"
              className="mx-1 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2"
            >
              Create Quotation
            </button> */}
                        <button
                          type="button"
                          className="mx-1 text-red bg-white hover:text-white  hover:bg-red focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {visibleCount < serviceRequests.length && (
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

          {/* Service Quotation */}
          {showServiceQuotation && (
            <div className="container mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceQuotation.slice(0, visibleCount).map((quotation) => (
                  <div
                    key={quotation.serviceQuotationId}
                    className="rounded-lg bg-[#EBF8F2] shadow-md p-4 hover:shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold text-center mb-4">
                      Quotation ID: {quotation.serviceQuotationId}
                    </h3>

                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Category Type:</strong>{" "}
                      {quotation.serviceRequest.serviceCategory.type || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Category Cost:</strong>{" "}
                      {quotation.serviceRequest.serviceCategory.cost || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Customer Name:</strong>{" "}
                      {quotation.customer.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Request ID:</strong>{" "}
                      {quotation.serviceRequest.serviceRequestId}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Description:</strong> {quotation.description}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Address:</strong>{" "}
                      {quotation.serviceRequest.address || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Total Cost:</strong>{" "}
                      {quotation.totalCost || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>VAT:</strong> {quotation.vat || "N/A"}
                    </p>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        className={`px-4 py-2 rounded-lg ${quotation.confirm
                          ? "bg-green text-white cursor-not-allowed opacity-50"
                          : "bg-red text-white hover:bg-red-600"
                          }`}
                        onClick={() =>
                          handleConfirmToggle(quotation.serviceQuotationId)
                        }
                        disabled={quotation.confirm}
                      >
                        {quotation.confirm ? "Confirmed" : "Not Confirmed"}
                      </button>
                    </td>
                  </div>
                ))}
              </div>

              {visibleCount < serviceQuotation.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleShowMore}
                    className="text-white bg-red hover:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}

          {/*Start Service Progress*/}
          {showServiceProgress && (
            <div className="container mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <p><strong>Is Confirmed:  </strong> {service.isComfirmed ? "✔️" : "❌"}</p>


                      <div className="flex justify-center mt-4">

                        {!service.isComfirmed && service.endDate && service.step == "Complete" && (
                          <button
                            type="button"
                            className="mx-1 text-red bg-white hover:text-white  hover:bg-red focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"
                            onClick={() => handleConfirmed(service.serviceProgressID)}
                          >
                            Confirm
                          </button>
                        )}
                        {/* {service.isComfirmed && (
                          <button
                            type="button"
                            className="mx-1 text-green bg-white hover:text-white  hover:bg-green focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2"

                          >
                            Payment
                          </button>
                        )} */}
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
          {/*End Service Progress*/}
        </div>
      </div>
    </div>
  );
};

export default User;
