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
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
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
export default function DashboardAdmin() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentPage, setRecentPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly" | "yearly">("daily");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
const router = useRouter();
  const itemsPerPage = 5;
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
    
    <div className=" bg-orange-50/50">
      <Navbar />
      {/* Header */}
      <div className="mt-20 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-950">แดชบอร์ด</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-orange-700">{formatDateTime(currentDateTime)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-white/50 rounded-lg w-fit mb-6">
        <button className="px-4 py-2 bg-white rounded-md shadow-sm text-orange-700">ภาพรวม</button>
      
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">โพสต์ทั้งหมด</span>
            <span className="text-orange-600">📝</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.totalPosts}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">ผู้ใช้ทั้งหมด</span>
            <span className="text-orange-600">👤</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.totalUsers}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">เเอดมินทั้งหมด</span>
            <span className="text-orange-600">🛡️</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.totalAdmins}</div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">ถูกรับไปแล้ว</span>
            <span className="text-orange-600">📦</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.statusCountReceived}</div>
          <div className="h-2 w-full bg-orange-200 rounded-full"></div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">ไม่อยู่ในคลัง</span>
            <span className="text-orange-600">❌</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.statusCountNotInStock}</div>
          <div className="h-2 w-full bg-orange-200 rounded-full"></div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-800">อยู่ในคลัง</span>
            <span className="text-orange-600">✅</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-orange-900">{dashboardData.statusCountInStock}</div>
          <div className="h-2 w-full bg-orange-200 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="col-span-2 bg-orange-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-orange-900">Overview</h2>
          <div className="h-[300px]">
            <Line data={{
              ...chartData,
              datasets: [{
                ...chartData.datasets[0],
                borderColor: "rgba(249, 115, 22, 1)", // orange-500
                backgroundColor: "rgba(249, 115, 22, 0.1)",
              }]
            }} options={chartOptions} />
          </div>
        </div>

        {/* All Items Section */}
        <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-orange-900">โพสต์ทั้งหมด</h2>
          <p className="text-orange-700 text-sm mb-6">
            วันนี้มีจำนวนโพสต์ใหม่: {
              getPostCounts("daily").data[getPostCounts("daily").labels.indexOf(
                new Date().toISOString().split("T")[0]
              )] || 0
            } รายการ
          </p>
          
          <div className="space-y-4">
            {allPostsToShow.map((post) => (
              <div key={post.post_id} className="flex-col flex items-center justify-between md:flex-row md:text-md sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-200 rounded-full overflow-hidden">
                    {post.image && <img src={post.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">{post.title}</p>
                    <p className="text-sm text-orange-600">{post.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                  className="text-right font-medium text-white bg-orange-500 px-4 py-1.5 rounded-md hover:bg-orange-600 text-sm"
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
