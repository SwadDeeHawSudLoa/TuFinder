"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

async function handleUpdateClick(postId: number, status: string): Promise<void> {
  await fetchpostId(postId, status);
}

async function fetchpostId(postId: number, status: string) {
  try {
    await axios.put(`/api/statusPosts/${postId}`, { status });
    window.location.href = "/myposts";
  } catch (error) {
    console.error("Error submitting post:", error);
    alert("Something went wrong");
  }
}

const ChangeStatusPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const renderStatusButton = (
    post: number,
    status: string,
    label: string,
    color: string,
  ) => (
    <button
      className={`${color} mx-1 flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50`}
      onClick={() => handleUpdateClick(post, status)}
    >
      {label}
    </button>
  );

  const fetchPost = async (id: Number) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setStatus(res.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
            เเก้ไขสถานะแจ้งพบของสูญหายโพสต์ที่ <>{id}</>
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
          <div className="mt-4 flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <select
              className="w-full sm:flex-grow transform rounded-lg px-4 py-2 font-semibold text-black bg-red-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50"
              value={status}
              onChange={(e) => handleUpdateClick(parseInt(id), e.target.value)}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="ถูกรับไปเเล้ว">ถูกรับไปเเล้ว</option>
              <option value="ไม่อยู่ในคลัง">ไม่อยู่ในคลัง</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeStatusPage;
