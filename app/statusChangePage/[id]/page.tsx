"use client";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";

interface FormEvent {
  preventDefault: () => void;
}

const decryptWithCryptoJS = (encryptedCookie: string, secretKey: string): string => {
  try {
    console.log("Encrypted Cookie:", encryptedCookie);
    const bytes = CryptoJS.AES.decrypt(encryptedCookie, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Text:", decryptedText);
    return decryptedText;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

const handleAddPictureClick = async (post_id: number, router: ReturnType<typeof useRouter>) => {
  try {
    await axios.put(`/api/posts/${post_id}`, {
      status: "ถูกรับไปเเล้ว",
    });
    router.push(`/picture/${post_id}`);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

const ChangeStatusPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [status, setStatus] = useState("");
  const [locationINV, setlocationINV] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      setIsAdmin(decryptedUserId === "123");
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/api/posts/${id}`);
          setStatus(res.data.status);
          setlocationINV(res.data.locationINV);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(`/api/posts/${id}`, {
        status,
        locationINV,
      });
   window.history.back();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4">
        <div className="flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="text-xl text-black"
          >
            ×
          </button>
        </div>

        <h2 className="flex justify-center text-xl text-center text-black font-bold">
          เเก้ไขสถานะแจ้งพบของสูญหายโพสต์ที่ {id}
        </h2>
        <p
          className={`flex justify-center ml-auto ${
            status === "ถูกรับไปเเล้ว"
              ? "text-orange-500"
              : status === "ไม่อยู่ในคลัง"
              ? "text-red-500"
              : status === "อยู่ในคลัง"
              ? "text-green-500"
              : ""
          } rounded-md px-2 py-1`}
        >
          <strong>สถานะปัจจุบัน:</strong> {status}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex-grow flex justify-center items-center flex-col rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black"
        >
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-grow border-2 border-black transform rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <option value="">เลือกสถานะ</option>
            <option value="ถูกรับไปเเล้ว">ถูกรับไปเเล้ว</option>
            <option value="ไม่อยู่ในคลัง">ไม่อยู่ในคลัง</option>
            {isAdmin && <option value="อยู่ในคลัง">อยู่ในคลัง</option>}
          </select>

          {status === "อยู่ในคลัง" && (
            <>
              <label>เลือกสถานที่ศูนย์เก็บของหาย</label>
              <select
                value={locationINV}
                onChange={(e) => setlocationINV(e.target.value)}
                className="flex-grow border-2 border-black transform rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <option value="" disabled>
                  สถานที่
                </option>
                <option value="อาคารโดมบริหาร">อาคารโดมบริหาร</option>
                <option value="SC3">SC3</option>
              </select>
            </>
          )}

          {status === "ถูกรับไปเเล้ว" && isAdmin && (
            <button
              onClick={() => handleAddPictureClick(parseInt(id), router)}
              type="button"
              className="mt-2 flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              แนบรูปหลักฐาน
            </button>
          )}

          <button
            type="submit"
            className="mt-3 flex-grow items-center transform rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            อัพเดตสถานะ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeStatusPage;
