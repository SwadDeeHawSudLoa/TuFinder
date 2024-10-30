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
interface Post {
  post_id: number;
  userIdEdit: string; // Optional based on your Prisma schema
  adminIdEdit: string; // Optional based on your Prisma schema
  title: string;
  username: string;
  tel: string;
  category: string;
  image: string;
  status: string;
  description: string;
  date: Date;
  lat: number;
  long: number;
  location: string;
}

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

  // Ensure that useRouter is only used client-side
  const router = useRouter();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      setUserIdEdit(userIdFromCookie);
    } else {
      console.error("User ID cookie not found.");
    }
  }, []);

  useEffect(() => {
    if (userIdEdit) {
      // Check if filters are empty, if so fetch default posts
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
        console.error("Error fetching user name", error);
      }
    }
  }, [userIdEdit, filters]);
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
      console.error("Error fetching user name", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="text-4xl">โพสต์ของฉัน</div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPosts.map((post) => (
            <div
              key={post.post_id}
              className="grid rounded-lg bg-white p-4 shadow-md"
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
              <div className="flex flex-col items-start justify-between">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-600">{post.location}</p>
                <p className="mb-2 text-gray-600">{post.category}</p>
              </div>
              <button
                onClick={() => handleButtonClick(post)}
                className={`focus:ring-opacity-50" flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 ${
                  post.status === "สถานะถูกรับไปเเล้ว"
                    ? "bg-orange-500"
                    : post.status === "สถานะไม่อยู่ในคลัง"
                      ? "bg-red-500"
                      : post.status === "สถานะอยู่ในคลัง"
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
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(post.post_id)}
                className="mt-2 flex-grow transform rounded-lg bg-red-900 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Delete
              </button>
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
