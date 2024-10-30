"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/AdminNavbar";
import Modal from "../component/Modal";

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex justify-center">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`mx-1 rounded px-3 py-1 ${
            index + 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

interface Post {
  post_id: number;
  userIdEdit: string; // Updated to match Prisma schema
  adminIdEdit: string; // Updated to match Prisma schema
  title: string;
  username: string;
  tel: string;
  category: string;
  image: string;
  status: string;
  description: string;
  date: Date; // Ensure correct handling of Date
  lat: number;
  long: number;
  location: string;
}

interface DashboardData {
  recentPosts: Post[];
  allPosts: Post[];
  totalPosts: number;
  totalUsers: number;
  totalAdmins: number;
  statusCountInStock: number;
  statusCountNotInStock: number;
  statusCountReceived: number;
}

export default function DashboardAdmin() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [recentPage, setRecentPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const itemsPerPage = 5; // Number of items per page

  // Fetch Dashboard Data from API
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/dashboarddata");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts"); // Adjust endpoint if necessary
      const posts1: Post[] = res.data; // Axios automatically parses JSON response
      setPosts(posts1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData(); // Fetch data when the component is mounted
  }, []);

  useEffect(() => {
    fetchPosts(); // Fetch data when the component is mounted
  }, []);

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  const handleButtonClick = (post: Post, view: "status" | "ตรวจสอบ") => {
    setSelectedPost(post);
    setModalView(view);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // Pagination logic
  const totalRecentPages = Math.ceil(
    dashboardData.recentPosts.length / itemsPerPage,
  );
  const totalAllPages = Math.ceil(dashboardData.allPosts.length / itemsPerPage);

  const recentPostsToShow = dashboardData.recentPosts.slice(
    (recentPage - 1) * itemsPerPage,
    recentPage * itemsPerPage,
  );

  const allPostsToShow = dashboardData.allPosts.slice(
    (allPage - 1) * itemsPerPage,
    allPage * itemsPerPage,
  );

  return (
    <div style={{ padding: "0px" }}>
      <Navbar />
      <h1>Admin Dashboard</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h2>Total Posts</h2>
          <p>{dashboardData.totalPosts}</p>
        </div>
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h2>Total Users</h2>
          <p>{dashboardData.totalUsers}</p>
        </div>
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h2>Total Admins</h2>
          <p>{dashboardData.totalAdmins}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "20px" }}>Post Status Summary</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            backgroundColor: "#e0f7fa",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>ถูกรับไปแล้ว</h3>
          <p>{dashboardData.statusCountReceived}</p>
        </div>
        <div
          style={{
            backgroundColor: "#ffccbc",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>ไม่อยู่ในคลัง</h3>
          <p>{dashboardData.statusCountNotInStock}</p>
        </div>
        <div
          style={{
            backgroundColor: "#c8e6c9",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>อยู่ในคลัง</h3>
          <p>{dashboardData.statusCountInStock}</p>
        </div>
      </div>

      {/* Recent Items */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent Items</h2>
        <div className="mt-4 space-y-4">
          {recentPostsToShow.map((post) => (
            <div
              key={post.post_id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  post.status === "สถานะไม่อยู่ในคลัง"
                    ? "bg-red-100 text-red-600"
                    : post.status === "สถานะอยู่ในคลัง"
                      ? "bg-green-100 text-green-600"
                      : post.status === "สถานะถูกรับไปเเล้ว"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                }`}
              >
                {post.status}
              </span>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={recentPage}
          totalPages={totalRecentPages}
          onPageChange={setRecentPage}
        />
      </div>

      {/* All Items */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">All Items</h2>
        <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-6 py-2 font-medium text-gray-900">Name</th>
                <th className="px-6 py-2 font-medium text-gray-900">
                  Category
                </th>
                <th className="px-6 py-2 font-medium text-gray-900">Status</th>
                <th className="px-6 py-2 font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allPostsToShow.map((post) => (
                <tr key={post.post_id}>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">{post.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        post.status === "สถานะไม่อยู่ในคลัง"
                          ? "bg-red-100 text-red-600"
                          : post.status === "สถานะอยู่ในคลัง"
                            ? "bg-green-100 text-green-600"
                            : post.status === "สถานะถูกรับไปเเล้ว"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                      className="text-black-900 rounded-full bg-green-500 px-3 py-1 text-sm font-medium"
                    >
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={allPage}
            totalPages={totalAllPages}
            onPageChange={setAllPage}
          />
          {selectedPost && (
            <Modal
              show={showModal}
              onClose={handleCloseModal}
              post={selectedPost}
              view={modalView}
            />
          )}
        </div>
      </div>
    </div>
  );
}
