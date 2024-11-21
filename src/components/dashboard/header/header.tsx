import { useEffect, useState } from "react";
import DropdownUser from "./DropdownUser";

const Header = ({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: (value: boolean) => void }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: ''
  });

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    if (name && role) {
      setUserInfo({
        name: name,
        role: role
      });
    }
  }, []);

  return (
    <header className="sticky top-0 z-[1100] flex w-full bg-[#4A6CF7] drop-shadow-1">
      <div className="flex w-full items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-blue-600 lg:hidden"
          >
            {/* ... burger menu icon ... */}
          </button>

          {/* Thêm thông tin user */}
          <div className="hidden lg:flex items-center space-x-3 text-white">
            <div className="text-sm">
              Welcome, <span className="font-semibold">{userInfo.name}</span>
            </div>
            <div className="h-4 w-[1px] bg-blue-400"></div>
            <div className="text-sm">
              Role: <span className="font-semibold">{userInfo.role}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* User Area */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="flex h-8.5 w-8.5 items-center justify-center rounded-lg text-white hover:bg-blue-600">
                <span className="relative">
                  {/* Bell Icon */}
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              </button>
            </div>

            {/* Divider */}
            <span className="h-6 w-[1px] bg-blue-400"></span>

            <DropdownUser />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
