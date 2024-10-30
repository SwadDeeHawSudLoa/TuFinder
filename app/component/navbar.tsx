"use client"; // Mark this file as a Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal"; // Adjust the import path as needed

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check login state from local storage
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
      router.push("/reports");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      <nav className="border-gray-200 bg-orange-700 shadow-2xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <a
            href={isAdmin ? "/mainAdmin" : "/main"}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2FEmblem_of_Thammasat_University.svg.png?alt=media&token=84f87b8e-14a9-43c9-a7e7-af310885d844"
              className="h-8"
              alt="Logo"
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
              TU ItemFinder
            </span>
          </a>
          {/* Mobile Menu Button */}
          <div className="md:hidden lg:hidden">
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
          <div className="hidden items-center space-x-4 md:flex">
            <div className="flex h-10 w-32 items-center justify-center rounded-2xl bg-yellow-500">
              <div
                className="flex h-full w-full items-center justify-center rounded-lg p-1 hover:bg-orange-600"
                onClick={handleReportClick}
              >
                <span className="hover:text-black-700 cursor-pointer text-xs font-bold text-black">
                  เเจ้งพบของหาย
                </span>
              </div>
            </div>

            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <div className="flex h-10 w-32 items-center justify-center rounded-2xl bg-yellow-500 hover:bg-orange-600">
                    <a
                      href="/myposts"
                      className="hover:text-black-700 text-xs font-bold text-black"
                    >
                      โพสต์ของฉัน
                    </a>
                  </div>
                )}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img
                      src="/ggg.png" // Replace with your user avatar URL
                      className="h-8 w-8 rounded-full"
                      alt="User Avatar"
                    />
                    <svg
                      className="h-5 w-5"
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
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-10 w-32 items-center justify-center rounded-2xl bg-yellow-500">
                <div className="flex h-full w-full items-center justify-center rounded-lg p-1 hover:bg-orange-600">
                  <a
                    href="/login"
                    className="hover:text-black-700 text-xs font-bold text-black"
                  >
                    Login
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 z-50 w-48 rounded-sm bg-orange-600 opacity-100 shadow-lg transition-opacity">
            <button
              onClick={handleReportClick}
              className="block px-4 py-2 text-lg text-white hover:bg-orange-600"
            >
              เเจ้งพบของหาย
            </button>

            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <div className="absolute right-0 z-50 w-48 rounded-sm bg-orange-600 opacity-100 shadow-lg transition-opacity">
                    <a
                      href="/myposts"
                      className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
                    >
                      โพสต์ของฉัน
                    </a>

                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-lg text-white hover:bg-orange-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600">
                <div className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600">
                  <a
                    href="/login"
                    className="block px-4 py-2 text-lg font-semibold text-white hover:bg-orange-600"
                  >
                    Login
                  </a>
                </div>
              </div>
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
                  window.location.href = "/map";
                }}
              >
                ดูหมุด
              </button>
              <button
                className="mb-4 rounded-lg border-black bg-yellow-400 px-6 py-3 text-lg text-black hover:bg-yellow-600"
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
