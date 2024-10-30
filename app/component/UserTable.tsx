"use client"; // ต้องการเป็น Client Component

import React from "react";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  post: number;
}

interface UserTableProps {
  users: User[];
  onShowPosts: (user_id: string) => void; // ฟังก์ชันที่ใช้ดึงโพสต์
}

const UserTable: React.FC<UserTableProps> = ({ users, onShowPosts }) => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>User List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              user_id
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              first_name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              last_name
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Post</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {user.user_id}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {user.first_name}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {user.last_name}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button
                  onClick={() => onShowPosts(user.user_id)} // คลิกเพื่อแสดงโพสต์
                  style={{ padding: "5px 10px" }}
                >
                  {user.post} Post
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
