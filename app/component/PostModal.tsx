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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-orange-100 pb-4">
          <h2 className="text-2xl font-bold text-orange-800">รายการโพสต์</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {posts.length > 0 ? (
          <>
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <div key={post.post_id} 
                     className="border border-orange-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl text-orange-900">{post.title}</h3>
                      <p className="text-orange-600 text-sm mt-1">หมวดหมู่ : {post.category}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      post.status === 'สถานะไม่อยู่ในคลัง' 
                        ? 'bg-red-100 text-red-700' 
                        : post.status === 'สถานะอยู่ในคลัง'
                        ? 'bg-green-100 text-green-700'
                        : post.status === 'สถานะถูกรับไปแล้ว'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-orange-100 text-orange-700' // fallback สำหรับกรณีอื่นๆ
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="mt-4 mb-4 relative h-[400px] w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>

                  <p className="mt-3 text-gray-600">{post.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {post.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.date).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleButtonClick(post, "ตรวจสอบ")}
                      className="inline-flex items-center px-6 py-2.5 rounded-full text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <span className="mr-2">ตรวจสอบ</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Component */}
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
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 transition-colors'
                  }`}
                >
                  ก่อนหน้า
                </button>

                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === number
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    } transition-colors`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 transition-colors'
                  }`}
                >
                  ถัดไป
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบโพสต์</h3>
            <p className="mt-1 text-sm text-gray-500">ไม่มีโพสต์ที่แสดงในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
} 