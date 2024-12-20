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

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
  
  
  
  
  const NavigationLinks = () => (
    <>
      <button
        onClick={handleReportClick}
        className="flex w-full items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105"
      >
        <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <span className="ml-3 text-black font-medium">แจ้งพบของหาย</span>
      </button>

      {isLoggedIn && !isAdmin && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105"
          >
            <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="ml-3 text-black text-md">จัดการโพสต์</span>
            <svg className="ml-2 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="text-md absolute left-0 mt-2 w-full rounded-lg bg-white shadow-lg">
              <a href="/adminmangepost" className="block w-full rounded-lg p-3 transition-all duration-300 hover:bg-orange-100 hover:shadow-md">
                จัดการโพสต์
              </a>
              <a href="/mypostMyadmin" className="text-md block w-full rounded-lg p-3 transition-all duration-300 hover:bg-orange-100 hover:shadow-md">
                โพสต์ของฉัน
              </a>
            </div>
          )}
        </div>
      )}

      <a href="/checkuser" className="text-md flex w-full items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105">
        <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="ml-3 text-black text-md">ตรวจสอบผู้ใช้</span>
      </a>

      <a href="/dashboard" className="flex w-full items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105">
        <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="ml-3 text-black text-md">Dashboard</span>
      </a>
    </>
  );
  

  return (
    <>
      <button
        id="menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed left-4 top-4 z-50 rounded-lg bg-[#FF8C32] p-3 shadow-lg transition-all duration-300 hover:shadow-orange-300/50 hover:scale-105 lg:hidden ${
          isMenuOpen ? "hidden" : "block"
        }`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar for Mobile */}
      <div
        id="sidebar"
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-[#FF8C32] shadow-lg transition-transform duration-300 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-4 top-4 p-2 hover:bg-orange-500 rounded-lg"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full flex-col">
          <a href="/mainAdmin">
            <div className="flex items-center p-4">
              <img
                className="mr-2 h-8 w-8 text-gray-100"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
                alt="logo"
              />
              <span className="text-xl font-semibold">TuItemFinder<br />ByAdmin</span>
            </div>
          </a>
          <nav className="flex-1 space-y-2 p-2">
            <NavigationLinks />
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-md flex w-full items-center rounded-lg p-3 hover:bg-red-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-md ml-3">Logout</span>
              </button>
            ) : (
              <a
                href="/login"
                className=" text-md flex w-full items-center rounded-lg p-3 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="text-md ml-3">Login</span>
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Horizontal Navbar for Desktop */}
      <div className="hidden lg:flex lg:justify-between lg:items-center lg:py-4 lg:px-8 lg:bg-[#FF8C32] lg:shadow-lg">
        <a href="/mainAdmin" className="flex items-center group">
          <img
            className="mr-2 h-8 w-8 transition-transform duration-300 group-hover:scale-110"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
            alt="logo"
          />
          <span className="text-xl font-semibold text-black">TuItemFinderByAdmin</span>
        </a>
        
        <nav className="flex space-x-4">
          <NavigationLinks />
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center rounded-lg p-3 transition-all duration-300 hover:bg-red-500/20 hover:shadow-lg hover:scale-105"
            >
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3 text-md text-black ">Logout</span>
            </button>
          ) : (
            <a
              href="/login"
              className="flex items-center rounded-lg p-3 transition-all duration-300 hover:bg-green-500/20 hover:shadow-lg hover:scale-105"
            >
              <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3 text-black text-md">Login</span>
            </a>
          )}
        </nav>
      </div>

      {/* Modal with updated styling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-11/12 max-w-lg rounded-xl bg-white p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
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
                className=" mb-4 rounded-lg bg-yellow-400 px-6 py-3 text-md text-black hover:bg-yellow-600"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Go to Login
              </button>
            </div>
            <button
              className="absolute right-2 top-2 rounded-full border-black px-3 py-2 text-md text-black"
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
