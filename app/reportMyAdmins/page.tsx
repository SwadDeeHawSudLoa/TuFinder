"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "../component/AdminNavbar";
import Cookies from "js-cookie";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("../component/LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const predefinedLocations = [
  { name: "มหาวิทยาลัยธรรมศาสตร์ รังสิต", lat: 14.0254, long: 100.6164 },
  { name: "จุฬาลงกรณ์มหาวิทยาลัย", lat: 13.7464, long: 100.533 },
  { name: "มหาวิทยาลัยมหิดล", lat: 13.78, long: 100.305 },
];

const ReportMyAdmins = () => {
  const [userIdEdit, setUserIdEdit] = useState<string | null>(null);
  const [adminIdEdit, setAdminIdEdit] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(14.0254); // Default lat
  const [long, setLong] = useState(100.6164); // Default long
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    long: number;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapKey, setMapKey] = useState<number>(0);

  useEffect(() => {
    const statusO = "สถานะไม่อยู่ในคลัง";
    setStatus(statusO);

    const number = "0982192286";
    setTel(number);

    const admin = "123";
    setAdminIdEdit(admin);

    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      setUserIdEdit(userIdFromCookie);
    } else {
      console.error("User ID cookie not found.");
    }
  }, []);

  useEffect(() => {
    if (adminIdEdit) {
      fetchUserName(adminIdEdit);
    }

    async function fetchUserName(adminId: string) {
      try {
        const response = await axios.get(`/api/saveAdmin/${adminId}`);
        const name = response.data;
        setUsername(name);
      } catch (error) {
        console.error("Error fetching user name", error);
      }
    }
  }, [adminIdEdit]);

  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.lat);
      setLong(selectedLocation.long);
      setLocation(selectedLocation.name);
      setMapKey((prevKey) => prevKey + 1); // Refresh map with new position
    }
  }, [selectedLocation]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!title || !category || !location || !inputRef.current?.files?.length) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    
    let downloadURL = "";
    const file = inputRef.current?.files ? inputRef.current.files[0] : null;
    if (file) {
      try {
        const fileRef = ref(storage, `images/${file.name}`);
        await uploadBytes(fileRef, file);
        downloadURL = await getDownloadURL(fileRef);
      } catch (error) {
        console.error("File upload error:", error);
      }
    }

    try {
      await axios.post("/api/posts", {
        adminIdEdit,
        title,
        username,
        tel,
        category,
        image: downloadURL,
        status,
        description,
        lat,
        long,
        location,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong");
    }
  }

  const handleMapClick = (newPosition: LatLngTuple) => {
    setLat(newPosition[0]);
    setLong(newPosition[1]);
    setMapKey((prevKey) => prevKey + 1); // Refresh map with new position
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="w-3/4 max-w-lg rounded-lg bg-white p-6 text-center">
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="rounded text-xl text-black"
            >
              ×
            </button>
          </div>
          <h2 className="mb-4 text-xl font-bold text-green-600">
            ส่งเสร็จสิ้น!
          </h2>
          <p className="mb-4 text-black">โปรดนำของหายไปให้เจ้าหน้าที่ที่ SC1</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="w-3/4 max-w-lg rounded-lg bg-white p-6">
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="rounded text-xl text-black"
            >
              ×
            </button>
          </div>

          <h2 className="mb-4 text-center text-xl font-bold">
            แจ้งพบของสูญหาย
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                ชื่อสิ่งของ
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="กรุณาระบุชื่อสิ่งของ"
                className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">กรุณาเลือกหมวดหมู่</option>
                <option value="documents">เอกสารสำคัญ</option>
                <option value="personal_items">สิ่งของส่วนบุคคล</option>
                <option value="electronics">อุปกรณ์อิเล็กทรอนิกส์</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                รายละเอียดของสภาพสิ่งของ
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="กรุณาระบุรายละเอียด"
                className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                สถานที่พบของหาย
              </label>
              <select
                value={selectedLocation ? selectedLocation.name : ""}
                onChange={(e) => {
                  const selected = predefinedLocations.find(
                    (loc) => loc.name === e.target.value,
                  );
                  setSelectedLocation(selected || null);
                }}
                className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">กรุณาเลือกสถานที่</option>
                {predefinedLocations.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                ตำแหน่งบนแผนที่
              </label>
              <Map
                posix={[lat, long]}
                zoom={13}
                key={mapKey}
                onMapClick={handleMapClick}
                onLocationUpdate={handleMapClick}
                style={{ height: "200px", width: "100%" }}
              />
            </div>

            <div className="mb-4 flex justify-between">
              <input
                ref={inputRef}
                type="file"
                className="file-input file-input-bordered file-input-info w-full max-w-xs"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none"
              >
                ส่ง
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportMyAdmins;
