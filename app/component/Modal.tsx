import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const runtime = 'edge';
export const renderMode = "force-dynamic";

const LeafletMap = dynamic(() => import("../component/LeafletMap"), {
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
  image: string;
  imageAdmin?: string;
  status: string;
  description: string;
  date: Date;
  lat: number;
  long: number;
  location: string;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  post: Post1;
  view: "status" | "ตรวจสอบ";
}

const Modal: React.FC<ModalProps> = ({ show, onClose, post, view }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [showContact, setShowContact] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [userid, setUserid] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState<boolean>(false);
  const [showEvidencePopup, setShowEvidencePopup] = useState<boolean>(false); // New state for evidence popup
  const userIdCookie = Cookies.get("user_id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setUsername(localStorage.getItem("username"));
      setUserid(userIdCookie || null);
    }
  }, []);

  if (!show || !isClient) return null;

  async function fetchpostId(post: Post1, status: string) {
    try {
      await axios.put(`/api/statusPosts/${post.post_id}`, { status });
      window.location.href = "/mainAdmin";
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong");
    }
  }

  const isAdmin = userid === "123";

  async function handleUpdateClick(post: Post1, status: string): Promise<void> {
    await fetchpostId(post, status);
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
      onClick={() => handleUpdateClick(post, status)}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded text-xl text-black"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="relative mb-4 h-48 w-full">
          <Image
            src={post.image}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <div className="mb-4 flex flex-row items-center justify-center space-x-4 text-xl text-black">
          <p>{post.title}</p>
          <p>
            <strong>สถานที่พบ:</strong> {post.location}
          </p>
          <p>
            <strong>หมวดหมู่:</strong> {post.category}
          </p>
        </div>

        <div className="mb-1 h-64">
          <LeafletMap
            posix={[post.lat, post.long]}
            zoom={13}
            onMapClick={() => {}}
            onLocationUpdate={() => {}}
            style={{ height: "100%" }}
          />
        </div>

        {view !== "ตรวจสอบ" ? (
          <>
            <div className="mx-auto h-auto w-3/4 rounded bg-slate-200 p-4 text-center">
              <p className="text-left text-black" id="modal-description">
                <strong>รายละเอียด:</strong> {post.description}
              </p>
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
                {post.status !== "สถานะไม่อยู่ในคลัง" && (
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
              <button className="rounded bg-blue-300 px-4 py-2 text-blue-500">
                ดูหมุด
              </button>
              {isAdmin && post.status === "สถานะถูกรับไปเเล้ว" && (
                <div className="flex flex-1 justify-center">
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
                  post.status === "สถานะถูกรับไปเเล้ว"
                    ? "text-orange-500"
                    : post.status === "สถานะไม่อยู่ในคลัง"
                    ? "text-red-500"
                    : post.status === "สถานะอยู่ในคลัง"
                    ? "text-green-500"
                    : ""
                } rounded-md px-2 py-1`}
              >
                <strong>สถานะ:</strong> {post.status}
              </p>
            </div>
          </>
        ) : (
          isAdmin && (
            <>
              <div className="mx-auto h-auto w-3/4 rounded bg-slate-200 p-4 text-center">
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
                {renderStatusButton(
                  post,
                  "สถานะถูกรับไปเเล้ว",
                  "สถานะถูกรับไปเเล้ว",
                  "bg-orange-500",
                )}
                {renderStatusButton(
                  post,
                  "สถานะไม่อยู่ในคลัง",
                  "สถานะไม่อยู่ในคลัง",
                  "bg-red-500",
                )}
                {renderStatusButton(
                  post,
                  "สถานะอยู่ในคลัง",
                  "สถานะอยู่ในคลัง",
                  "bg-green-500",
                )}
              </div>
            </>
          )
        )}

        {/* Popup modal for showing imageAdmin */}
        {showEvidencePopup && post.imageAdmin && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="relative w-80 h-80 bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setShowEvidencePopup(false)}
                className="absolute top-2 right-2 text-xl text-black"
                aria-label="Close evidence popup"
              >
                ×
              </button>
              <Image
                src={post.imageAdmin}
                alt="หลักฐาน"
                layout="fill"
                objectFit="contain"
                className="rounded-lg z-2000" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
