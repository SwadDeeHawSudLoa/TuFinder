'use client';
import { useEffect, useState } from 'react';
import PostModal from '../component/PostModal';

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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">user_id</th>
              <th className="px-4 py-2 border">first_name</th>
              <th className="px-4 py-2 border">last_name</th>
              <th className="px-4 py-2 border">Post</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.user_id}</td>
                <td className="px-4 py-2 border">{user.first_name}</td>
                <td className="px-4 py-2 border">{user.last_name}</td>
                <td className="px-4 py-2 border">
                  <button 
                    onClick={() => handlePostClick(user.user_id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    {user._count?.Post || 0} Post
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        posts={selectedUserPosts}
      />
    </>
  );
}