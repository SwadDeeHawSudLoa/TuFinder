"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../component/AdminNavbar";
import FilterSearch from "../component/FilterSearch";
import Modal from "../component/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation"
import Pagination from "../component/Pagination";;
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
interface Post {
  post_id: number;
 userIdEdit?: string;
  adminIdEdit?: string;
 title: string;
  username: string;
  adminusername?:string;//เพิ่มชื่อ admin 8
  tel: string;
 teluser: string;// เพิ่มเบอร์มือถือของผู้ใช้ 
  category: string;
  otherCategory: string;
  image: string;
 imageAdmin?: string; //เพิ่มรูปภาพเเนบรูปหลังฐานที่จะเเสดงเฉพาะadmin เท่านั้น
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
  const [adminIdEdit, setadminIdEdit] = useState<string | null>(null);
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

  // Ensure that useRouter is only used client-side
  const router = useRouter();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);
const [activeAction, setActiveAction] = useState<{ type: string; id: number | null }>({
    type: "",
    id: null,
  });
  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      setadminIdEdit(decryptedUserId);
    } else {
      console.error("User ID cookie not found.");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
          const res = await axios.get("/api/posts");
          const postsData: Post[] = res.data;
          setPosts(postsData);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

    if (adminIdEdit) {
      // Check if filters are empty, if so fetch default posts
      const isFiltersEmpty =
        !filters.title &&
        !filters.category &&
        !filters.location &&
        !filters.status;

      if (isFiltersEmpty) {
        fetchPosts(); // Fetch default posts if no filters are provided
      } else {
        fetchSearchResults(filters); // Fetch search results if filters are applied
      }
    }
  }, [adminIdEdit]);
  // Function to fetch search results
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
    setActiveAction({ type: "status", id: post.post_id });
    setShowModal(true);
  };
  const handleChangeStatusClick = async (post: Post): Promise<void> => {
    setActiveAction({ type: "changeStatus", id: post.post_id });
    try {
      router.push(`/statusChangePage/${post.post_id}`);
    } finally {
     
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setActiveAction({ type: "", id: null });
  };

  function handleEditClick(post_id: number): void {
    setActiveAction({ type: "edit", id: post_id });
    router.push(`/editAAdmin/${post_id}`);
  }

  async function handleDeleteClick(post_id: number): Promise<void> {
    setActiveAction({ type: "delete", id: post_id });
    try {
      await axios.delete(`/api/posts/${post_id}`);
      window.location.href = "/adminmangepost";
    } catch (error) {
      console.error("Error fetching user name", error);
    }finally {
      setActiveAction({ type: "", id: null });
    }
  }

  return (
    <>
      <Navbar />

      <div className="mt-20 flex justify-center items-center text-center flex-grow text-4xl font-bold">การจัดการโพสต์ทั้งหมด</div>
      <div className="container mx-auto p-4">
      <div className="sm:ml-90 md:ml-70 justify-center grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentPosts.map((post) => (
          <div
            key={post.post_id}
            className="grid rounded-lg bg-white p-4 shadow-xl"
          >
            <div className="relative mb-4 h-48 w-full">
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="mb-2 flex flex-col items-start justify-between">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-600">{post.location}</p>
              <p className="text-gray-600">{post.category}</p>
            </div>
            <button
               disabled={activeAction.type === "status" && activeAction.id === post.post_id}
               onClick={() => handleButtonClick(post)}
               className={`flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${
                 post.status === "ถูกรับไปเเล้ว"
                   ? "bg-orange-500"
                   : post.status === "ไม่อยู่ในคลัง"
                   ? "bg-red-500"
                   : "bg-green-500"
               }`}
            >
              {activeAction.type === "status" && activeAction.id === post.post_id
                  ? "กำลังดำเนินการ..."
                  : post.status}
            </button>
            <button
                disabled={activeAction.type === "edit" && activeAction.id === post.post_id}
                onClick={() => handleEditClick(post.post_id)}
                className="mt-2 flex-grow transform rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {activeAction.type === "edit" && activeAction.id === post.post_id
                  ? "กำลังเปิด..."
                  : "เเก้ไขโพสต์"}
              </button>
              <div className="flex flex-row">
                <button
                  disabled={activeAction.type === "changeStatus" && activeAction.id === post.post_id}
                  onClick={() => handleChangeStatusClick(post)}
                  className="mt-2 flex-grow transform rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {activeAction.type === "changeStatus" && activeAction.id === post.post_id
                    ? "กำลังเปิด..."
                    : "เปลี่ยนเเปลงสถานะ"}
                </button>
                <button
                  disabled={activeAction.type === "delete" && activeAction.id === post.post_id}
                  onClick={() => handleDeleteClick(post.post_id)}
                  className="mt-2 flex-grow transform rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {activeAction.type === "delete" && activeAction.id === post.post_id
                    ? "กำลังลบ..."
                    : "ลบโพสต์"}
                </button>
                </div>
          </div>
        ))}
      </div>
      <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
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
