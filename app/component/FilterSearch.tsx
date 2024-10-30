import React, { useState } from "react";

interface FilterSearchProps {
  onSearch: (filters: {
    title?: string;
    category?: string;
    location?: string;
    status?: string;
  }) => void;
}

export default function FilterSearch({ onSearch }: FilterSearchProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the parent component's onSearch function with all filter value
    onSearch({ title, category, location, status });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-3 sm:space-y-0"
    >
      <input
        type="text"
        name="search"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ค้นหา..."
        className="w-full rounded border px-4 py-2 sm:w-auto"
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded border px-4 py-2 sm:w-auto"
      >
        <option value="">หมวดหมู่</option>
        <option value="documents">เอกสารสำคัญ</option>
        <option value="personal_items">สิ่งของส่วนบุคคล</option>
        <option value="electronics">อุปกรณ์อิเล็กทรอนิกส์</option>
      </select>

      <select
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full rounded border px-4 py-2 sm:w-auto"
      >
        <option value="">สถานที่</option>
        <option value="มหาวิทยาลัยธรรมศาสตร์ รังสิต">
          มหาวิทยาลัยธรรมศาสตร์ รังสิต
        </option>
        <option value="จุฬาลงกรณ์มหาวิทยาลัย">จุฬาลงกรณ์มหาวิทยาลัย</option>
        <option value="มหาวิทยาลัยมหิดล">มหาวิทยาลัยมหิดล</option>
      </select>

      <select
        name="status"
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded border px-4 py-2 sm:w-auto"
      >
        <option value="">สถานะ</option>
        <option value="สถานะไม่อยู่ในคลัง">สถานะไม่อยู่ในคลัง</option>
        <option value="สถานะอยู่ในคลัง">สถานะอยู่ในคลัง</option>
        <option value="สถานะรับไปเเล้ว">สถานะรับไปเเล้ว</option>
      </select>

      <button
        type="submit"
        className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 sm:w-auto"
      >
        ค้นหา
      </button>
    </form>
  );
}
