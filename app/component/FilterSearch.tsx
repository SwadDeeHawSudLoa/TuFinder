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
      className="ml-5 mr-5 mt-5 flex flex-col items-center justify-center lg:space-y-0 lg:flex-row sm:space-x-3    space-y-4     md:space-x-3  md:space-y-4 sm:space-y-4   sm:w-50  md:w-50 lg:space-x-3"
    >
      <input
        type="text"
        name="search"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ค้นหา..."
        className=" w-full rounded border px-4 py-2   "
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded border px-4 py-2   "
      >
        <option value="">หมวดหมู่</option>
        <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
        <option value="สิ่งของส่วนบุคคล">สิ่งของส่วนบุคคล</option>
        <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>

      <select
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full rounded border px-4 py-2  "
      >
        <option value="">สถานที่</option>
        <option value="มหาวิทยาลัยธรรมศาสตร์ รังสิต">มหาวิทยาลัยธรรมศาสตร์ รังสิต</option>
        <option value="อาคารเรียนรวมสังคมศาสตร์ 3 (SC3)">อาคารเรียนรวมสังคมศาสตร์ 3 (SC3)</option>
        <option value="อาคารบรรยายเรียนรวม 1 (บร.1)">อาคารบรรยายเรียนรวม 1 (บร.1)</option>
        <option value="อาคารบรรยายเรียนรวม 2 (บร.2)">อาคารบรรยายเรียนรวม 2 (บร.2)</option>
        <option value="อาคารบรรยายเรียนรวม 3 (บร.3)">อาคารบรรยายเรียนรวม 3 (บร.3)</option>
        <option value="อาคารบรรยายเรียนรวม 4 (บร.4)">อาคารบรรยายเรียนรวม 4 (บร.4)</option>
        <option value="อาคารบรรยายเรียนรวม 5 (บร.5)">อาคารบรรยายเรียนรวม 5 (บร.5)</option>
        <option value="หอสมุดป๋วย อึ๊งภากรณ์">หอสมุดป๋วย อึ๊งภากรณ์</option>
        <option value="ศูนย์อาหารกรีนแคนทีน(Green canteen)">ศูนย์อาหารกรีนแคนทีน(Green canteen)</option>
        <option value="อาคารโดมบริหาร">อาคารโดมบริหาร</option>
      </select>

      <select
        name="status"
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded border px-4 py-2 "
      >
        <option value="">สถานะ</option>
        <option value="ไม่อยู่ในคลัง">สถานะไม่อยู่ในคลัง</option>
        <option value="อยู่ในคลัง">สถานะอยู่ในคลัง</option>
        <option value="ถูกรับไปเเล้ว">สถานะถูกรับไปเเล้ว</option>
      </select>

      <button
        type="submit"
        className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 "
      >
        ค้นหา
      </button>
    </form>
  );
}
