"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/AdminNavbar";
import Modal from "../component/Modal";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`px-3 py-1 mx-1 rounded ${
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentPage, setRecentPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly" | "yearly">("daily");

  const itemsPerPage = 5;

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/dashboarddata");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  const totalRecentPages = Math.ceil(dashboardData.recentPosts.length / itemsPerPage);
  const totalAllPages = Math.ceil(dashboardData.allPosts.length / itemsPerPage);

  const recentPostsToShow = dashboardData.recentPosts.slice(
    (recentPage - 1) * itemsPerPage,
    recentPage * itemsPerPage
  );
  const allPostsToShow = dashboardData.allPosts.slice(
    (allPage - 1) * itemsPerPage,
    allPage * itemsPerPage
  );

  // Prepare data for chart based on time frame
  const getPostCounts = (timeFrame: "daily" | "monthly" | "yearly") => {
    const counts: { [key: string]: number } = {};

    dashboardData.allPosts.forEach((post) => {
      const date = new Date(post.date);
      let key = "";

      if (timeFrame === "daily") key = date.toISOString().split("T")[0];
      if (timeFrame === "monthly") key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (timeFrame === "yearly") key = date.getFullYear().toString();

      counts[key] = (counts[key] || 0) + 1;
    });

    const labels = Object.keys(counts).sort();
    const data = labels.map((label) => counts[label]);

    return { labels, data };
  };

  const postCounts = getPostCounts(timeFrame);

  const chartData = {
    labels: postCounts.labels,
    datasets: [
      {
        label: "Number of Posts",
        data: postCounts.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Post Count" },
      },
    },
  };

  return (
    <div style={{ padding: "0px" }}>
      <Navbar />
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "600px" }}>
        <div style={{ backgroundColor: "#f1f1f1", padding: "20px", borderRadius: "5px" }}>
          <h2>Total Posts</h2>
          <p>{dashboardData.totalPosts}</p>
        </div>
        <div style={{ backgroundColor: "#f1f1f1", padding: "20px", borderRadius: "5px" }}>
          <h2>Total Users</h2>
          <p>{dashboardData.totalUsers}</p>
        </div>
        <div style={{ backgroundColor: "#f1f1f1", padding: "20px", borderRadius: "5px" }}>
          <h2>Total Admins</h2>
          <p>{dashboardData.totalAdmins}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "20px" }}>Post Status Summary</h2>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "800px" }}>
        <div style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "5px" }}>
          <h3>ถูกรับไปแล้ว</h3>
          <p>{dashboardData.statusCountReceived}</p>
        </div>
        <div style={{ backgroundColor: "#ffccbc", padding: "20px", borderRadius: "5px" }}>
          <h3>ไม่อยู่ในคลัง</h3>
          <p>{dashboardData.statusCountNotInStock}</p>
        </div>
        <div style={{ backgroundColor: "#c8e6c9", padding: "20px", borderRadius: "5px" }}>
          <h3>อยู่ในคลัง</h3>
          <p>{dashboardData.statusCountInStock}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Posts Over Time</h2>
        <div style={{ width: "500px", height: "300px", margin: "auto" }}>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as "daily" | "monthly" | "yearly")}
            className="mb-4"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      

      <div className="mt-8">
        <h2 className="text-lg font-semibold">All Items</h2>
        <div className="grid gap-4">
          {allPostsToShow.map((post) => (
            <div key={post.post_id} className="border p-4 rounded">
              <h3>{post.title}</h3>
              <button onClick={() => handleButtonClick(post, "ตรวจสอบ")}>ตรวจสอบ</button>
            </div>
          ))}
        </div>
        <Pagination currentPage={allPage} totalPages={totalAllPages} onPageChange={setAllPage} />
      </div>

      {/* Modal Component */}
      {showModal && selectedPost && (
        <Modal
          show={showModal}
          post={selectedPost}
          view={modalView}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
