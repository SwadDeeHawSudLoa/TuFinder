"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../component/navbar";
import FilterSearch from "../component/FilterSearch";
import Modal from "../component/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
interface Post {
  post_id: number;
  userIdEdit?: string;
  adminIdEdit?: string;
  title: string;
  username: string;
  adminusername?: string; // เพิ่มชื่อ admin
  tel: string;
  teluser: string; // เพิ่มเบอร์มือถือของผู้ใช้
  category: string;
  image: string;
  imageAdmin?: string; // เพิ่มรูปภาพเเนบรูปหลังฐานที่จะเเสดงเฉพาะadminเท่านั้น
  status: string;
  description: string;
  date: Date;
  lat: number;
  long: number;
  location: string;
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

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userIdEdit, setUserIdEdit] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const postsPerPage = 8;

  const router = useRouter();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    console.log("User ID from cookie:", userIdFromCookie);
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      setUserIdEdit(decryptedUserId);
    } else {
      console.error("User ID cookie not found.");
    }
  }, []);

  useEffect(() => {
    if (userIdEdit) {
      const isFiltersEmpty =
        !filters.title &&
        !filters.category &&
        !filters.location &&
        !filters.status;

      if (isFiltersEmpty) {
        fetchPost(userIdEdit); // Fetch default posts if no filters are provided
      } else {
        fetchSearchResults(filters); // Fetch search results if filters are applied
      }
    }

    async function fetchPost(userId: string) {
      try {
        const response = await axios.get(`/api/mypost/${userId}`);
        const post = response.data;
        setPosts(post);
      } catch (error) {
        console.error("Error fetching user posts", error);
      }
    }
  }, [userIdEdit, filters]);

  const fetchSearchResults = async (searchFilters: {
    title: string;
    category: string;
    location: string;
    status: string;
  }) => {
    try {
      const res = await axios.get("/api/search", { params: searchFilters });
      const postsData: Post[] = res.data;
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = (searchFilters: {
    title?: string;
    category?: string;
    location?: string;
    status?: string;
  }) => {
    setFilters({
      title: searchFilters.title || "",
      category: searchFilters.category || "",
      location: searchFilters.location || "",
      status: searchFilters.status || "",
    });
    setCurrentPage(1); // Reset to page 1 after search
  };

  const handleButtonClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  function handleEditClick(post_id: number): void {
    router.push(`/edit/${post_id}`);
  }

  async function handleDeleteClick(post_id: number): Promise<void> {
    try {
      await axios.delete(`/api/posts/${post_id}`);
      window.location.href = "/myposts";
    } catch (error) {
      console.error("Error deleting post", error);
    }
  }

  async function handleChamgeStatusClick(posts: Post){
    router.push(`/statusChangePage/${posts.post_id}`);
  }

  return (
    <>
      <Navbar />
      <div className="justify-center items-center text-center flex-grow text-4xl font-bold">โพสต์ของฉัน</div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPosts.map((post) => (
            <div key={post.post_id} className="grid rounded-lg bg-white p-4 shadow-xl">
              <div className="relative mb-4 h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="flex flex-col items-start justify-between">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-600">{post.location}</p>
                <p className="mb-2 text-gray-600">{post.category}</p>
              </div>
              <button
                onClick={() => handleButtonClick(post)}
                className={`focus:ring-opacity-50" flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 ${
                  post.status === "ถูกรับไปเเล้ว"
                    ? "bg-orange-500"
                    : post.status === "ไม่อยู่ในคลัง"
                    ? "bg-red-500"
                    : post.status === "อยู่ในคลัง"
                    ? "bg-green-500"
                    : ""
                } w-full rounded-md px-4 py-2 text-center`}
              >
                {post.status}
              </button>
              <button
                onClick={() => handleEditClick(post.post_id)}
                className="mt-2 flex-grow transform rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                เเก้ไขโพสต์
              </button>
              <div className="flex flex-row">
              <button
                onClick={() => handleChamgeStatusClick(post)}
                className="mt-2 flex-grow transform rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                เปลี่ยนเเปลงสถานะ
              </button>
                 <button
                onClick={() => handleDeleteClick(post.post_id)}
                className="mt-2 flex-grow transform rounded-lg bg-red-900 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                ลบโพสต์
              </button>
              </div>
             
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 rounded px-3 py-2 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {selectedPost && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          post={selectedPost}
          view={"status"}
        />
      )}
    </>
  );
};

export default PostList;
