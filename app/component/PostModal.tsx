'use client';
import { useState } from 'react';
import Image from 'next/image';
import Modal from "../component/Modal";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: any[];
  onCheckClick?: (post: any) => void;
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

export default function PostModal({ isOpen, onClose, posts, onCheckClick }: PostModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // จำนวน posts ต่อหน้า
  const [modalView, setModalView] = useState<"status" | "ตรวจสอบ">("status");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!isOpen) return null;

  // คำนวณ posts ที่จะแสดงในหน้าปัจจุบัน
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // สร้างปุ่ม pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
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
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Posts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {posts.length > 0 ? (
          <>
            <div className="space-y-4">
              {currentPosts.map((post) => (
                <div key={post.post_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-gray-600 text-sm">{post.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      post.status === 'ไม่อยู่ในคลัง' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="mt-4 mb-4 relative h-32 w-48 mx-auto">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>

                  <p className="mt-2">{post.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Location: {post.location}</p>
                    <p>Date: {new Date(post.date).toLocaleDateString()}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                      className="transform rounded-md bg-blue-500 px-4 py-2 text-center font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      ตรวจสอบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {selectedPost && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          post={selectedPost}
          view={modalView}
        />
      )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Previous
                </button>

                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 rounded ${
                      currentPage === number
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            ไม่พบโพสต์
          </div>
        )}
      </div>
    </div>
  );
} 