import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "../../assets/images/Logo.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Định nghĩa interface cho menu items
interface MenuItem {
  path: string;
  label: string;
  roles: string[];
}

// Định nghĩa đầy đủ các menu items theo role


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const userRole = localStorage.getItem("role");

  const hasAccess = (allowedRoles: string[]): boolean => {
    return allowedRoles.includes(userRole || "");
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-blue">
        <NavLink to="/">
          <img src={Logo} alt="Logo" width="150" height="100" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-white">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {() => {
                  return (
                    <NavLink
                      to="/admin/dashboard"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname.includes(
                        "dashboard"
                      )}`}
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
                          d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                          fill=""
                        />
                        <path
                          d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                          fill=""
                        />
                        <path
                          d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                          fill=""
                        />
                        <path
                          d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                          fill=""
                        />
                      </svg>
                      Dashboard
                    </NavLink>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}
              {hasAccess(["MANAGER", "STAFF"]) && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/user-management" || pathname.includes("user-management")
                  }
                >
                  {() => {
                    return (
                      <NavLink
                        to="/admin/user-management"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname.includes(
                          "dashboard"
                        )}`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 448 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
                            fill=""
                          />
                        </svg>
                        User Management
                      </NavLink>
                      
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {hasAccess(["MANAGER", "STAFF", "MAINTENANCE"]) && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/maintenance-staff" || pathname.includes("maintenance-staff")
                    }
                > 
                  {() => {
                    return ( <NavLink 
                      to="/admin/maintenance-staff"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname.includes(
                        "maintenance-staff"
                      )}`}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 512 512"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s14-32 32-32s32 14 32 32s-14 32-32 32zM296 328c0 17.36-14.36 32-32 32s-32-14.64-32-32c0-35.36 29.28-64 64-64s64 28.64 64 64z" />
                      </svg>
                      Maintenance Staff
                    </NavLink>
                  );
                  }}
                </SidebarLinkGroup>
              )}
              {hasAccess(["MANAGER", "STAFF", "CONSTRUCTOR"]) && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/constructors-detail" || pathname.includes("constructors-detail")
                  }
                >
                  {() => {
                    return (
                      <NavLink
                        to="/admin/constructors-detail"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname.includes(
                          "constructors-detail"
                        )}`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 512 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s14-32 32-32s32 14 32 32s-14 32-32 32z" />
                        </svg>
                        Constructors Detail
                      </NavLink>
                    );
                  }}
                </SidebarLinkGroup>
              )}  
                {hasAccess(["MANAGER", "STAFF", "DESIGNER"]) && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/designers-detail" || pathname.includes("designers-detail")
                  }
                >
                  {() => {
                    return (
                      <NavLink
                        to="/admin/designers-detail"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname.includes(
                          "designers-detail"
                        )}`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 512 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s14-32 32-32s32 14 32 32s-14 32-32 32z" />
                        </svg>
                        Designers Detail
                      </NavLink>
                    );
                  }}
                </SidebarLinkGroup>
              )}  
        

              {/* <!-- Menu Item Forms --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/constructions" || pathname.includes("constructions")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white ${pathname === "/constructions" || pathname.includes("constructions")
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-max">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 576 512"
                            fill="none"
                          >
                            <path d="M413.5 237.5c-28.2 4.8-58.2-3.6-80-25.4l-38.1-38.1C280.4 159 272 138.8 272 117.6l0-12.1L192.3 62c-5.3-2.9-8.6-8.6-8.3-14.7s3.9-11.5 9.5-14l47.2-21C259.1 4.2 279 0 299.2 0l18.1 0c36.7 0 72 14 98.7 39.1l44.6 42c24.2 22.8 33.2 55.7 26.6 86L503 183l8-8c9.4-9.4 24.6-9.4 33.9 0l24 24c9.4 9.4 9.4 24.6 0 33.9l-88 88c-9.4 9.4-24.6 9.4-33.9 0l-24-24c-9.4-9.4-9.4-24.6 0-33.9l8-8-17.5-17.5zM27.4 377.1L260.9 182.6c3.5 4.9 7.5 9.6 11.8 14l38.1 38.1c6 6 12.4 11.2 19.2 15.7L134.9 484.6c-14.5 17.4-36 27.4-58.6 27.4C34.1 512 0 477.8 0 435.7c0-22.6 10.1-44.1 27.4-58.6z" />
                          </svg>
                          Construction
                        </div>

                        <svg
                          className={`absolute right-0 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructors-detail"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Constructors detail
                              </NavLink>
                            </li>
                          )}

                            {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/designers-detail"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Designers detail
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/consult"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Consult
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/quotation"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Quotation
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSTRUCTOR" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/construction-history"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Construction history
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "DESIGNER") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/design-profile-manager"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Design Profile Manager
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "DESIGNER") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/design-profile"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Design Profile
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/requestDetail"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Request Detail
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "CONSULTANT") && (
                            <li>
                              <NavLink
                                to="/admin/constructions/pondDesignTemplate"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Pond Design Template
                              </NavLink>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === "/maintenances" || pathname.includes("maintenances")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out text-gray hover:text-white  ${pathname === "/maintenances" || pathname.includes("maintenances")
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 512 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                            fill=""
                          />
                        </svg>

                        Maintenance
                        <svg
                          className={`absolute right-0 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-category"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Category
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-requests"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Request
                              </NavLink>
                            </li>
                          )}

                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-quotation"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Quotation
                              </NavLink>
                            </li>
                          )}

                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-details"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Detail
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF" || userRole === "MAINTENANCE") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-progress"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Progress
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-payment"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Payment
                              </NavLink>
                            </li>
                          )}
                          {(userRole === "MANAGER" || userRole === "STAFF") && (
                            <li>
                              <NavLink
                                to="/admin/maintenances/service-feedback"
                                className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out text-gray hover:text-white "
                              >
                                Service Feedback
                              </NavLink>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Forms --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
