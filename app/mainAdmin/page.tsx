"use client";
import React, { useEffect, useState } from "react"; // Make sure React is imported
/*import Navbar from '../component/navbar';*/ // Ensure the correct component is being imported
import Modal from "../component/Modal";
import Image from "next/image";
import axios from "axios";
import FilterSearch from "../component/FilterSearch";
import { useRouter } from "next/navigation";
import Pagination from "../component/Pagination";
import Navbar from "../component/AdminNavbar";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";

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
  locationINV? :  String
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
  const router = useRouter();
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
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const postsPerPage = 8;
  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      if (decryptedUserId === "123") {

      } else {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/");
      }
    } else {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/");
    }
  }, []);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts"); // Adjust endpoint if necessary
      const posts1: Post1[] = res.data; // Axios automatically parses JSON response
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

  const handleButtonClick = (post: Post1, view: "status" | "ตรวจสอบ") => {
    setSelectedPost(post);
    setModalView(view);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <>
      <Navbar />
      <div className="mt-11 flex justify-self-center items-center">
       
        
      </div>
      <FilterSearch onSearch={handleSearch} />
      <div className="w-full px-2 py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-2">
          {currentPosts.map((post) => (
            <div
              key={post.post_id}
              className="grid rounded-lg bg-white p-3 shadow-xl hover:bg-orange-100 transition-colors duration-200"
             
            ><div onClick={() => handleButtonClick(post, "status")}>
               <div className="relative mb-4 h-64 w-full">
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
                  {new Date(post.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
             
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => handleButtonClick(post, "status")}
                  className={`focus:ring-opacity-50 flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 ${
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

