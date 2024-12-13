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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.0641786856995!2d100.600460574564!3d14.073387489767843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e27fec9f7126eb%3A0x14f2cd078eccc3b2!2z4Lit4Liy4LiE4Liy4Lij4LmC4LiU4Lih4Lia4Lij4Li04Lir4Liy4LijIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4mOC4o-C4o-C4oeC4qOC4suC4quC4leC4o-C5jCDguKjguLnguJnguKLguYzguKPguLHguIfguKrguLTguJU!5e0!3m2!1sth!2sth!4v1734095816393!5m2!1sth!2sth"
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
