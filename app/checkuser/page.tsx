'use client';
import { useEffect, useState } from 'react';
import PostModal from '../component/PostModal';
import Navbar from "../component/AdminNavbar";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  _count: {
    Post: number;
  }
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosts, setSelectedUserPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handlePostClick = async (userId: string) => {
    try {
      const response = await fetch(`/api/mypost/${userId}`);
      const posts = await response.json();
      setSelectedUserPosts(posts);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto bg-orange-50 min-h-screen">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 animate-fade-in">
          รายชื่อนักศึกษา
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-200">
              <thead>
                <tr className="bg-orange-500">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    รหัสนักศึกษา
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    ชื่อจริง
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    นามสกุล
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    จำนวนโพสต์
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {users.map((user) => (
                  <tr 
                    key={user.user_id} 
                    className="hover:bg-orange-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-900">
                      {user.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-900">
                      {user.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-900">
                      {user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handlePostClick(user.user_id)}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                      >
                        <span className="mr-2">{user._count?.Post || 0}</span>
                        <span>โพสต์</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
          </div>
        )}
      </div>

      <PostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        posts={selectedUserPosts}
      />
    </>
  );
}