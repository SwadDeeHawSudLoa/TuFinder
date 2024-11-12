"use client"; // Mark this file as a Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail === "admin@example.com") {
      setIsAdmin(true);
    }
  }, []);

  const handleReportClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      router.push("/reportMyAdmins");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-orange-700 shadow-lg">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <a href="/mainAdmin" className="flex items-center space-x-3">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2FEmblem_of_Thammasat_University.svg.png?alt=media&token=84f87b8e-14a9-43c9-a7e7-af310885d844"
              className="h-8"
              alt="Logo"
            />
            <span className="text-2xl font-semibold text-white">
              TuItemFinder <br /> ByAdmin
            </span>
          </a>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden space-x-6 lg:flex">
            <div className="relative">
              <button
                onClick={handleReportClick}
                className="flex items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:bg-yellow-600 focus:outline-none"
              >
                แจ้งพบของหาย
              </button>
            </div>
            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <a
                    href="/mypostMyadmin"
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:bg-yellow-600"
                  >
                    โพสต์ของฉัน
                  </a>
                )}
                {!isAdmin && (
                  <a
                    href="/checkuser"
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:bg-yellow-600"
                  >
                    ตรวจสอบผู้ใช้
                  </a>
                )}
                {!isAdmin && (
                  <a
                    href="/dashboard"
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:bg-yellow-600"
                  >
                    Dashboard
                  </a>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src="/ggg.png"
                      className="h-8 w-8 rounded-full"
                      alt="User Avatar"
                    />
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg transition duration-300 ease-in-out">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:bg-yellow-600"
              >
                Login
              </a>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 z-50 w-48 rounded-lg bg-orange-600 opacity-100 shadow-lg transition-opacity">
            <a
              href="/reportMyAdmins"
              className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                handleReportClick();
                setIsMenuOpen(false); // Close the menu on click
              }}
            >
              แจ้งพบของหาย
            </a>
            {!isAdmin && (
              <>
                <a
                  href="/mypostMyadmin"
                  className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)} // Close the menu on click
                >
                  โพสต์ของฉัน
                </a>
                <a
                  href="/checkuser"
                  className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
                >
                  ตรวจสอบผู้ใช้
                </a>
              </>
            )}
            {!isAdmin && (
              <a
                href="/dashboard"
                className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
              >
                Dashboard
              </a>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false); // Close the menu on click
                }}
                className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
                onClick={() => setIsMenuOpen(false)} // Close the menu on click
              >
                Login
              </a>
            )}
          </div>
        )}
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/3 rounded-lg bg-white p-10 shadow-2xl">
            <h1 className="mb-6 text-center text-3xl font-bold">
              หากคุณต้องการเเจ้งพบของหาย
              <br />
              โปรดเข้าสู่ระบบ
            </h1>
            <h2 className="mb-6 text-center text-2xl">
              หากคุณไม่ได้เป็นบุคลากรหรือนักศึกษาใน
              <br />
              มหาวิทยาลัยโปรดติดต่อเจ้าหน้าที่ ที่อาคาร SC1
            </h2>
            <div className="flex flex-col items-center">
              <button
                className="mb-4 rounded-lg bg-green-400 px-6 py-3 text-lg text-black hover:bg-green-700"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                ดูหมุด
              </button>
              <button
                className="mb-4 rounded-lg bg-yellow-400 px-6 py-3 text-lg text-black hover:bg-yellow-600"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Go to Login
              </button>
            </div>
            <button
              className="absolute right-2 top-2 rounded-full border-black px-3 py-2 text-lg text-black"
              onClick={closeModal}
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
