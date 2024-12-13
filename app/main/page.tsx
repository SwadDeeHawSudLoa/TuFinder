"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../component/navbar";
import FilterSearch from "../component/FilterSearch";
import Modal from "../component/Modal";
import Pagination from "../component/Pagination";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
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
interface Post1 {
  post_id: number;
  userIdEdit?: string;
  adminIdEdit?: string;
  title: string;
  username: string;
  adminusername?: string;
  tel: string;
  teluser: string;
  category: string;
  otherCategory: string;
  image: string;
  imageAdmin?: string;
  status: string;
  description: string;
  date: Date;
  lat: number;
  long: number;
  location: string;
  markerText?: string;
  locationINV? :  String;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post1[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post1 | null>(null);
  const postsPerPage = 8;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
const router = useRouter();
  const totalPages = Math.ceil(posts.length / postsPerPage);
  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
     
    } else {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/");
    }
  }, []);
  // Function to fetch default posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      const postsData: Post1[] = res.data;
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Function to fetch search results
  const fetchSearchResults = async (searchFilters: {
    title: string;
    category: string;
    location: string;
    status: string;
  }) => {
    try {
      const res = await axios.get("/api/search", { params: searchFilters });
      const postsData: Post1[] = res.data;
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
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
  }, [filters]); // Re-run whenever filters change

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

  const handleButtonClick = (post: Post1) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <>
      <Navbar />
      <div className="mt-11 flex justify-self-center items-center"><img
            className="h-10 w-10 text-gray-100"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
            alt="logo"
          /><span className="text-2xl font-semibold">TuItemFinder</span></div>
      
      <FilterSearch onSearch={handleSearch} />
      <div className="w-full px-2 py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-2">
          {currentPosts.map((post) => (
            <div
              key={post.post_id}
              className="grid rounded-lg bg-white p-3 shadow-xl hover:bg-orange-100 transition-colors duration-200"
              style={{ cursor: 'pointer' }}
            ><div onClick={() => handleButtonClick(post)}>
              <div className="relative mb-4 h-64 w-full">
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
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div></div>
              
              <button
                onClick={() => handleButtonClick(post)}
                className={`flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${
                  post.status === "ถูกรับไปเเล้ว"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : post.status === "ไม่อยู่ในคลัง"
                      ? "bg-red-500 hover:bg-red-600"
                      : post.status === "อยู่ในคลัง"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                } w-full rounded-md px-4 py-2 text-center`}
              >
                {post.status}
              </button>
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
