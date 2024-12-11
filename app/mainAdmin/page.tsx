"use client";
import React, { useEffect, useState } from "react"; // Make sure React is imported
/*import Navbar from '../component/navbar';*/ // Ensure the correct component is being imported
import Modal from "../component/Modal";
import Image from "next/image";
import axios from "axios";
import FilterSearch from "../component/FilterSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "../component/Pagination";
import Navbar from "../component/AdminNavbar";

interface Post {
  post_id: number;
 userIdEdit?: string;
  adminIdEdit?: string;
 title: string;
  username: string;
  adminusername?:string;//เพิ่มชื่อ admin 
  tel: string;
  teluser: string;// เพิ่มเบอร์มือถือของผู้ใช้ 
  category: string;
  image: string;
 imageAdmin?: string; //เพิ่มรูปภาพเเนบรูปหลังฐานที่จะเเสดงเฉพาะadmin เท่านั้น
  status: string;
  description: string;
  date: Date;
  lat: number;
  long: number;
  location: string;
}

const PostList: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const postsPerPage = 8;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts"); // Adjust endpoint if necessary
      const posts1: Post[] = res.data; // Axios automatically parses JSON response
      setPosts(posts1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
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

  const handleButtonClick = (post: Post, view: "status" | "ตรวจสอบ") => {
    setSelectedPost(post);
    setModalView(view);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };
  const handleEditClick = () => {
    router.push("/edit/${post.post_id}");
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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPosts.map((post) => (
            <div className="grid rounded-lg bg-white p-4 shadow-xl hover:bg-blue-100 transition-colors duration-200"><div
              key={post.post_id}
              className="grid rounded-lg bg-white p-4 shadow-xl hover:bg-blue-100 transition-colors duration-200"
              onClick={() => handleButtonClick(post, "status")}
              style={{ cursor: 'pointer' }}
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
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
             
             
            </div>
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => handleButtonClick(post, "status")}
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
                  onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                  className=" w-full flex-grow transform rounded-md bg-blue-500 px-4 py-2 text-center font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  ตรวจสอบ
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
          view={modalView}
        />
      )}
    </>
  );
};

export default PostList;
