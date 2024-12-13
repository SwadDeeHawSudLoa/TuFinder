import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const runtime = 'edge';
export const renderMode = "force-dynamic";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
const LeafletMap = dynamic(() => import("../component/LeafletMapModal"), {
  ssr: false,
});

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

interface ModalProps {
  show: boolean;
  onClose: () => void;
  post: Post1;
  view: "status" | "ตรวจสอบ";
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
const Modal: React.FC<ModalProps> = ({ show, onClose, post, view }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [showContact, setShowContact] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [userid, setUserid] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState<boolean>(false);
  const [showEvidencePopup, setShowEvidencePopup] = useState<boolean>(false); // New state for evidence popup
  const [showFullImage, setShowFullImage] = useState<boolean>(false); // Add this new state
const [status, setStatus] = useState<string>("");
const [locationINV,setlocationINV] = useState<string>("");


  useEffect(() => {
    if (post.post_id) {
      fetchPost(post.post_id);
    }
  }, [post.post_id]);

  const fetchPost = async (id: Number) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setStatus(res.data.status);
      setlocationINV(res.data.locationINV);
    } catch (error) {
      console.error(error);
    }
  };

async function handleSubmit(
  post: Post1, status: string, locationINV: string, event: FormEvent<HTMLFormElement>
): Promise<void> {
  event.preventDefault();
  fetchpostId(post, status, locationINV);
  try {
    await axios.put(`/api/posts/${post.post_id}`, {
      status: status,
      locationINV: locationINV,
    });
  } catch (error) {
    console.error("Error submitting post:", error);
  }
}
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setUsername(localStorage.getItem("username"));
      const userIdFromCookie = Cookies.get("user_id");
      if (userIdFromCookie) {
        const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
        setUserid(decryptedUserId);
      } else {
       
      }
    }
  }, []);

  if (!show || !isClient) return null;

  async function fetchpostId(post: Post1, status: string,locationINV: string): Promise<void> {
    try {
      await axios.put(`/api/statusPosts/${post.post_id}`, { status });
      window.location.href = "/mainAdmin";
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong");
    }
  }

  const isAdmin = userid === "123";

  async function handleUpdateClick(post: Post1, status: string,locationINV: string) {
    fetchpostId(post, status,locationINV);
  }

  async function handleAddPictureClick(post_id: number) {
    router.push(`/picture/${post_id}`);
  }

  const renderStatusButton = (
    post: Post1,
    status: string,
    label: string,
    color: string,
  ) => (
    <button
      className={`${color} mx-1 flex-grow transform rounded-lg px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50`}
      onClick={() => handleUpdateClick(post, status,locationINV)}
    >
      {label}
    </button>
  );
  

  return (
    <div
      className="fixed text-sm inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="overflow-y-auto max-h-screen max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded text-xl text-black"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="relative mb-4 h-48 w-full cursor-pointer" onClick={() => setShowFullImage(true)}>
          <Image
            src={post.image}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <div className="mb-4 flex flex-row items-center justify-center space-x-4 text-md text-black">
          <p><strong>ชื่อสิ่งของ:</strong>{post.title}</p>
          <p>
            <strong>สถานที่พบ:</strong> {post.location}
          </p>
          <p>
            <strong>หมวดหมู่:</strong> {post.category}
          </p>
          <p>
            <strong></strong> {post.otherCategory}
          </p>
        </div>

        <div className="mb-1 h-64">
          <LeafletMap
            posix={[post.lat, post.long]}
            zoom={13}
            style={{ height: "100%" }}
            markerText={post.markerText}
          />
        </div>

        {view !== "ตรวจสอบ" ? (
          <>
           <div className="text-left max-h-32 text-md  max-w overflow-y-auto whitespace-normal rounded bg-slate-200 p-4 ">
  <strong>รายละเอียด:</strong> {post.description}
  
</div>
<div className="flex justify-row">
  <div className="flex justify-between w-full">
    <p className="text-md text-gray-1000 font-bold">
      วันที่โพสต์: 
      
    </p>{status == "อยู่ในคลัง" && (
                  <>
        <p className="text-md text-gray-1000 ">{new Date(post.date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>
    <p className="text-md text-gray-1000 font-bold">
      สถานที่เก็บของหาย: 
    </p>
    <p className="text-md text-gray-1000">{post.locationINV}</p>
                  </>
                )}

   
  </div>
</div>

            <div className="mt-4 flex justify-center">
              <button
                className="rounded bg-green-400 px-4 py-2 text-gray-950"
                onClick={() => setShowContact(!showContact)}
              >
                ติดต่อคนพบของหาย
              </button>
            </div>
            {showContact && (
              <div className="mx-auto mt-4 w-72 rounded-2xl border border-gray-300 bg-slate-200 p-5">
                <div className="flex justify-center">
                  <p>
                    <strong>ชื่อ:</strong> {post.username}
                  </p>
                </div>
                <div className="flex justify-center rounded-2xl border bg-slate-100">
                  <p>
                    <strong>เบอร์โทร:</strong> {post.teluser}
                  </p>
                </div>
                {post.status !== "ไม่อยู่ในคลัง" && (
                  <>
                    <div className="flex justify-center">
                      <p>ผู้ดูเเล ที่รับเก็บเข้าคลัง</p>
                    </div>
                    <div className="flex justify-center">
                      <p>
                        <strong>ชื่อ:</strong> {post.adminusername}
                      </p>
                    </div>
                    <div className="flex justify-center rounded-2xl border bg-slate-100">
                      <p>
                        <strong>เบอร์โทร:</strong> {post.tel}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              {isAdmin && post.status === "ถูกรับไปเเล้ว" && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowEvidencePopup(!showEvidencePopup)} // Toggle evidence popup
                    className="rounded bg-blue-400 px-4 py-2 text-gray-950"
                  >
                    {showEvidencePopup ? "ซ่อนรูปหลักฐาน" : "ดูรูปหลักฐาน"}
                  </button>
                </div>
              )}
              <p
                className={`ml-auto ${
                  post.status === "ถูกรับไปเเล้ว"
                    ? "text-orange-500"
                    : post.status === "ไม่อยู่ในคลัง"
                    ? "text-red-500"
                    : post.status === "อยู่ในคลัง"
                    ? "text-green-500"
                    : ""
                } rounded-md px-2 py-1`}
              >
                <strong>สถานะ:</strong> {post.status}
              </p>
            </div>
          </>
        ) : (
           (
            <>
              <div className="text-left max-h-32 max-w overflow-y-auto whitespace-normal rounded bg-slate-200 p-4">
                <p className="text-left">
                  <strong>รายละเอียด:</strong> {post.description}
                </p>
              </div>
              
                <div className="mt-4 flex items-center justify-between space-x-2">
                <button
                  onClick={() => handleAddPictureClick(post.post_id)}
                  className="flex-grow transform rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  เเนบรูป
                </button>
       


<form onSubmit={(event) => handleSubmit(post, status, locationINV, event)} className="flex-grow  transform flex justify-center items-center flex-col rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black ">
<label >เปลี่ยนสถานะ</label>
<select value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-grow border-2 border-black transform rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
                
                >
                  <option value="" disabled selected>
                  เลือกสถานะ
                  </option>
                  <option value="ถูกรับไปเเล้ว">ถูกรับไปเเล้ว</option>
                  <option value="ไม่อยู่ในคลัง">ไม่อยู่ในคลัง</option>
                  <option value="อยู่ในคลัง" selected={true}>อยู่ในคลัง</option>
                </select>
                {status == "อยู่ในคลัง" && (
                  <>
                 <label >เลือกสถานที่ศูนย์เก็บของหาย</label>
                  <select
                  value={locationINV}
                  onChange={(e) => setlocationINV(e.target.value)}
                  className="flex-grow border-2 border-black transform rounded-lg bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>
                  สถานที่             </option>
                  <option value="อาคารโดมบริหาร">อาคารโดมบริหาร</option>
                  <option value="SC3">SC3</option>
                
                </select>
                  </>
                )}

         
            <button type="submit" className="mt-2 flex-grow transform rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50">
              อัพเดตสถานะ
            </button>
          </form>
                
                </div>

                
            </>
          )
        )}

        {/* Popup modal for showing imageAdmin */}
        {showEvidencePopup && post.imageAdmin && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
            <div className="relative w-80 h-80 bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setShowEvidencePopup(false)}
                className="absolute top-2 right-2 text-xl text-black z-[60]"
                aria-label="Close evidence popup"
              >
                ×
              </button>
              <Image
                src={post.imageAdmin}
                alt="หลักฐาน"
                layout="fill"
                objectFit="contain"
                className="rounded-lg z-500" 
              />
            </div>
          </div>
        )}

        {/* Add this new full image modal */}
        {showFullImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-2 right-2 text-xl text-black z-[60] bg-white rounded-full w-8 h-8 flex items-center justify-center"
                aria-label="Close full image"
              >
                ×
              </button>
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
