"use client";

import Navbar from "../component/AdminNavbar";
import React, { useState, useEffect } from 'react';
import UserTable from '../component/UserTable'; 



interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  post: number;
}

interface Post {
  post_id: number;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // สถานะของ Modal

  // ฟังก์ชันดึงโพสต์เมื่อคลิกที่ปุ่มจำนวน post ของ user_id
  const handleShowPosts = async (user_id: string) => {
    setSelectedUserId(user_id);
    
    try {
      const response = await fetch(`/api/mypost/${user_id}`);
      const data = await response.json();
      setPosts(data);
      setShowModal(true); // เปิด modal เมื่อข้อมูลถูกดึงมาแล้ว
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.map((user: any) => ({
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          post: user.Post.length, // จำนวน post ของ user
        })));
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setPosts(null); // รีเซ็ตโพสต์เมื่อปิด modal
  };

  return (
    <div>
      <Navbar />
      
      {/* ตารางของผู้ใช้ */}
      <UserTable users={users} onShowPosts={handleShowPosts} />

      {/* Modal สำหรับแสดงข้อมูลโพสต์ */}
      {showModal && selectedUserId && posts && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>โพสต์ของผู้ใช้ User ID: {selectedUserId}</h2>
            <ul>
           
            </ul>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
