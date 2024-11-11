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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

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
    
    <div className="p-6 bg-white">
      <Navbar />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            
            <span className="text-gray-600">{formatDateTime(currentDateTime)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        <button className="px-4 py-2 bg-white rounded-md shadow-sm">Overview</button>
        <button className="px-4 py-2 text-gray-500">Analytics</button>
        <button className="px-4 py-2 text-gray-500">Reports</button>
        <button className="px-4 py-2 text-gray-500">Notifications</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Posts</span>
            <span className="text-gray-400">📝</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.totalPosts}</div>
          
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Users</span>
            <span className="text-gray-400">👤</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.totalUsers}</div>
          
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Admins</span>
            <span className="text-gray-400">🛡️</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.totalAdmins}</div>
          
        </div>

        
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">ถูกรับไปแล้ว</span>
            <span className="text-gray-400">📦</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.statusCountReceived}</div>
          <div className="h-2 w-full bg-[#e0f7fa] rounded-full"></div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">ไม่อยู่ในคลัง</span>
            <span className="text-gray-400">❌</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.statusCountNotInStock}</div>
          <div className="h-2 w-full bg-[#ffccbc] rounded-full"></div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">อยู่ในคลัง</span>
            <span className="text-gray-400">✅</span>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardData.statusCountInStock}</div>
          <div className="h-2 w-full bg-[#c8e6c9] rounded-full"></div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold mb-1">
            
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="h-[300px]">
            <Line data={chartData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  ticks: {
                    callback: (value) => `$${value}`
                  },
                  grid: {
                    color: '#f0f0f0'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* All Items Section (styled as Recent Sales) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">All Items</h2>
          <p className="text-gray-500 text-sm mb-6">You made {allPostsToShow.length} posts this month.</p>
          
          <div className="space-y-4">
            {allPostsToShow.map((post) => (
              <div key={post.post_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                    {post.image && <img src={post.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                  className="text-right font-medium text-black bg-green-500 px-3 py-1.5 rounded-md hover:bg-green-600 text-sm"
                >
                  ตรวจสอบ
                </button>
              </div>
            ))}
          </div>

          {/* Added Pagination */}
          <div className="mt-6">
            <Pagination 
              currentPage={allPage} 
              totalPages={totalAllPages} 
              onPageChange={setAllPage} 
            />
          </div>
        </div>
      </div>

      {/* Existing Modal */}
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
