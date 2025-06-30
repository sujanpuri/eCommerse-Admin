'use client';

import { useUser } from '@/context/userContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ItemPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [item, setItem] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      alert('Access denied: You do not have permission to create items.');
      router.push('/routes/dashboard');
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select an image.');

    setUploading(true);
    try {
      // STEP 1: Upload image to backend
      const formData = new FormData();
      formData.append('image', imageFile); // 👈 must match multer key in backend

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = uploadRes.data.url;
      console.log('Image uploaded:', imageUrl);

      // STEP 2: Send item data with image URL
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/post`,
        {
          ...item,
          image: imageUrl,
        },
        {
          headers: {
            'x-requester-email': user.email,
          },
        }
      );

      alert('Item created!');
      setItem({ name: '', price: '', description: '' });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert('Failed to create item');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Access Denied</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={item.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={item.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}
