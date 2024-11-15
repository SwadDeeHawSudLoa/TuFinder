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
      <aside className="group fixed left-0 top-0 z-50 flex h-screen w-[70px] flex-col bg-orange-400 shadow-lg transition-all duration-300 hover:w-64">
        <a href="/mainAdmin" className="flex items-center p-4">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2FEmblem_of_Thammasat_University.svg.png?alt=media&token=84f87b8e-14a9-43c9-a7e7-af310885d844"
            className="h-8 w-8"
            alt="Logo"
          />
          <span className="ml-3 whitespace-nowrap text-xl font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            TuItemFinder
          </span>
        </a>

        <nav className="flex flex-1 flex-col gap-2 p-2">
          <button
            onClick={handleReportClick}
            className="flex items-center rounded-lg p-3 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              แจ้งพบของหาย
            </span>
          </button>

          {isLoggedIn && !isAdmin && (
            <>
              <a
                href="/mypostMyadmin"
                className="flex items-center rounded-lg p-3 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  โพสต์ของฉัน
                </span>
              </a>

              <a
                href="/checkuser"
                className="flex items-center rounded-lg p-3 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  ตรวจสอบผู้ใช้
                </span>
              </a>

              <a
                href="/dashboard"
                className="flex items-center rounded-lg p-3 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Dashboard
                </span>
              </a>
            </>
          )}
        </nav>

        <div className="border-t p-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg p-3 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Logout
              </span>
            </button>
          ) : (
            <a
              href="/login"
              className="flex items-center rounded-lg p-3 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Login
              </span>
            </a>
          )}
        </div>
      </aside>

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
