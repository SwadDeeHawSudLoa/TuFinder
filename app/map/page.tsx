"use client"; // Mark this file as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Map: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const closeModal = () => {
    setIsModalOpen(false);
    router.back(); // ใช้ router.back() เพื่อนำผู้ใช้กลับไปยังหน้าเดิม
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative h-4/5 w-11/12 max-w-2xl rounded-lg bg-white p-4 shadow-2xl">
            <button
              className="absolute right-1 top-1 rounded-full border-black px-0 py-0 text-lg text-black"
              onClick={closeModal}
            >
              &#x2715;
            </button>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.129561323848!2d100.60065637498842!3d14.06952568635634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e27fcf0c5a5dd9%3A0x81142340ee2a6cf1!2sSC1!5e0!3m2!1sth!2sth!4v1725181984663!5m2!1sth!2sth"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
