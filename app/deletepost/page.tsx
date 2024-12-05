import React, { useState } from 'react';

const DeletePostPage = () => {
  const [deletedPost, setDeletedPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const data = await response.json();
      setDeletedPost(data);
      setError(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post');
    }
  };

  return (
    <div>
      <h1>Delete Post</h1>
      <button onClick={() => handleDelete(1)}>Delete Post with ID 1</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {deletedPost && (
        <div>
          <h2>Deleted Post Details</h2>
          <p>ID: {deletedPost.post_id}</p>
          <p>Title: {deletedPost.title}</p>
          <p>Username: {deletedPost.username}</p>
          <p>Category: {deletedPost.category}</p>
          <p>Status: {deletedPost.status}</p>
          <p>Description: {deletedPost.description}</p>
          <p>Created At: {new Date(deletedPost.createdAt).toLocaleString()}</p>
          {/* เพิ่ม field อื่นๆ ที่ต้องการแสดง */}
        </div>
      )}
    </div>
  );
};

export default DeletePostPage; 