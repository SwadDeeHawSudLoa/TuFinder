"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      router.push("/reports");
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
        <span className="ml-3 text-black text-md">แจ้งพบของหาย</span>
      </button>

      {isLoggedIn && !isAdmin && (
        <a
          href="/myposts"
          className="flex w-full items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105"
        >
          <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="ml-3 text-black text-md">โพสต์ของฉัน</span>
        </a>
      )}
    </>
  );

  return (
    <>
      <button
        id="menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed left-4 top-4 z-50 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 p-3 shadow-lg transition-all duration-300 hover:shadow-orange-300/50 hover:scale-105 lg:hidden ${
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
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-gradient-to-b from-orange-400 to-orange-500 shadow-lg transition-transform duration-300 lg:hidden ${
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
          <a href="/main">
            <div className="flex items-center p-4">
              <img
                className="mr-2 h-8 w-8 text-gray-100"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
                alt="logo"
              />
              <span className="text-xl font-semibold">TuItemFinder</span>
            </div>
          </a>
          <nav className="flex-1 space-y-2 p-2">
            <NavigationLinks />
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className=" text-sm flex w-full items-center rounded-lg p-3 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="ml-3">Logout</span>
              </button>
            ) : (
              <a
                href="/login"
                className=" text-sm flex w-full items-center rounded-lg p-3 hover:bg-green-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="ml-3">Login</span>
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Horizontal Navbar for Desktop */}
      <div className="hidden lg:flex lg:justify-between lg:items-center lg:py-4 lg:px-8 lg:bg-[#FF8C32] lg:shadow-lg">
        <a href="/main" className="flex items-center group">
          <img
            className="mr-2 h-8 w-8 transition-transform duration-300 group-hover:scale-110"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
            alt="logo"
          />
          <span className="text-xl font-semibold text-black">TuItemFinder</span>
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
              <span className="ml-3 text-black text-md">Logout</span>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-11/12 max-w-lg rounded-xl bg-white p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
            <h1 className="mb-4 text-center text-xl font-bold md:text-3xl">
              หากคุณต้องการเเจ้งพบของหาย
              <br />
              โปรดเข้าสู่ระบบ
            </h1>
            <h2 className="mb-4 text-center text-xl  md:text-xl">
              หากคุณไม่ได้เป็นบุคลากรหรือนักศึกษาใน   
              <br />      
              มหาวิทยาลัยโปรดติดต่อ เจ้าหน้าที่ ที่อาคารโดมบริหาร  
              <br />
              หรือสถานที่ที่สิ่งของนั้นอยู่ในคลัง
              </h2>
            <div className="flex flex-col items-center">
              <button
                className="text-md flex justify-center mb-4 w-full max-w-xs rounded-lg bg-green-400 px-6 py-3 text-sm text-black hover:bg-green-700 md:text-lg"
                onClick={() => {
                  window.location.href = "/map";
                }}
              >
                ดูหมุด
                <img
            className="ml-2 h-7 w-10 text-gray-100"
            src="https://png.pngtree.com/png-vector/20221116/ourmid/pngtree-red-location-map-icon-pin-navigation-pointer-target-png-image_6460378.png"
            alt="logo"
          />
              </button>
              <button
                className=" mb-4 w-full max-w-xs rounded-lg bg-yellow-400 px-6 py-3 text-sm text-black hover:bg-yellow-600 md:text-lg"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                เข้าสู่ระบบ
              </button>
            </div>
            <button
              className="absolute right-3 top-3 rounded-full p-2 text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
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
