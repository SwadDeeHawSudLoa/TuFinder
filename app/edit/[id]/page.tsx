"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "@/app/component/navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/config";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
const Map = dynamic(() => import("@/app/component/LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const decryptWithCryptoJS = (encryptedCookie: string, secretKey: string): string => {
  try {
    console.log("Encrypted Cookie:", encryptedCookie);
    const bytes = CryptoJS.AES.decrypt(encryptedCookie, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Text:", decryptedText);
    return decryptedText;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};
const predefinedLocations = [
  { name: "มหาวิทยาลัยธรรมศาสตร์ รังสิต", lat: 14.07219002764917, long: 100.6055881707834 },
  { name: "อาคารเรียนรวมสังคมศาสตร์ 3 (SC3)", lat: 14.07049939996706, long: 100.6059014796119 },
  { name: "อาคารบรรยายเรียนรวม 1 (บร.1)", lat: 14.0724923207153, long: 100.6022268532616 },
  { name: "อาคารบรรยายเรียนรวม 2 (บร.2)", lat: 14.07357983410881, long: 100.6062930821281 },
  { name: "อาคารบรรยายเรียนรวม 3 (บร.3)", lat: 14.07252874469262, long: 100.6062930821281 },
  { name: "อาคารบรรยายเรียนรวม 4 (บร.4)", lat: 14.07243508302493, long: 100.608079433332 },
  { name: "อาคารบรรยายเรียนรวม 5 (บร.5)", lat: 14.07378276665719, long: 100.6078541277748 },
  { name: "หอสมุดป๋วย อึ๊งภากรณ์", lat: 14.0711550363869, long: 100.6022429465156 },
  { name: "ศูนย์อาหารกรีนแคนทีน(Green canteen)", lat: 14.07330925709733, long: 100.6011539696556 },
  { name: "อาคารโดมบริหาร", lat: 14.07311921165539, long: 100.6029109496253 },
];

const EditReportPage = ({ params }: { params: { id: string } }) => {
  const [userIdEdit, setUserIdEdit] = useState<string | null>(null);
  const [adminIdEdit, setAdminIdEdit] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [markerText, setMarkerText] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(14.0254);
  const [long, setLong] = useState(100.6164);
  const [location, setLocation] = useState("");
  const [teluser, setTeluser] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    long: number;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapKey, setMapKey] = useState<number>(0);
  const [isImagePopupVisible, setIsImagePopupVisible] = useState(false); // New state for the image popup
  const { id } = params;
  const router = useRouter();
  const  [adminUsername, setaAminUsername] = useState<number>(0);

  const fetchPost = async (id: Number) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setUserIdEdit(res.data.userIdEdit);
      setTeluser(res.data.teluser);
      setMarkerText(res.data.markerText);
      setTitle(res.data.title);
      setLocation(res.data.location);
      setDescription(res.data.description);
      setCategory(res.data.category);
      setExistingImage(res.data.image);
    } catch (error) {
      console.error(error);
    }
  }; 

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    const statusO = "ไม่อยู่ในคลัง";
    setStatus(statusO);

    const number = "043311286";
    setTel(number);

    const admin = "123";
    setAdminIdEdit(admin);

    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      setUserIdEdit(decryptedUserId);
    } else {
      console.error("User ID cookie not found.");
    }
  }, []);

  useEffect(() => {
    if (userIdEdit) {
      fetchUserName(userIdEdit);
    }

    async function fetchUserName(userId: string) {
      try {
        const response = await axios.get(`/api/saveUser/${userId}`);
        const name = response.data;
        setUsername(name);
      } catch (error) {
        console.error("Error fetching user name", error);
      }
    }
  }, [userIdEdit]);

  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.lat);
      setLong(selectedLocation.long);
      setLocation(selectedLocation.name);
      setMapKey((prevKey) => prevKey + 1); // Refresh map with new position
    }
  }, [selectedLocation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    let downloadURL = existingImage;
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
      await axios.put(`/api/posts/${id}`, {
        userIdEdit,
        title,
        username,
        tel,
        teluser,
        category,
        markerText,
        image: downloadURL,
        status,
        description,
        lat,
        long,
        location,
      });
      router.push("/myposts");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong");
    }
  }

  const handleMapClick = (newPosition: LatLngTuple) => {
    setLat(newPosition[0]);
    setLong(newPosition[1]);
    setMapKey((prevKey) => prevKey + 1);
  };

  const toggleImagePopup = () => {
    setIsImagePopupVisible(!isImagePopupVisible);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="w-3/4 max-w-lg rounded-lg bg-white p-4 text-center">
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="text-xl text-black"
            >
              ×
            </button>
          </div>
          <h2 className="text-xl font-bold text-green-600">ส่งเสร็จสิ้น!</h2>
          <p className="text-black">โปรดนำของหายไปให้เจ้าหน้าที่ที่ SC1</p>
          <p className="text-gray-700">หากไม่ทราบว่าต้องนำของไปไว้ที่ส่วนไหนของ SC1 โปรดกดปุ่ม “ดูตำแหน่ง SC1” ด้านล่าง</p>
          <button className="bg-green-400 px-4 py-2 text-white rounded hover:bg-green-500">
            ดูตำแหน่ง SC1
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="overflow-y-auto overflow-auto max-h-screen w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="text-xl text-black"
            >
              ×
            </button>
          </div>

          <h2 className="text-xl text-center text-black font-bold">เเก้ไขแจ้งพบของสูญหายโพสต์ที่ <>{id}</></h2>
 <label className="mb-1 block text-sm font-bold text-gray-700">
  ตำแหน่งบนแผนที่
</label>
          <form onSubmit={handleSubmit}>
          <div className="mb-1 flex justify-center items-center z-auto">
   
<Map
    posix={[lat, long]}
    zoom={13}
    key={mapKey}
    onMapClick={handleMapClick}
    onLocationUpdate={handleMapClick}
    markerText={markerText}
    style={{ height: "200px", width: "100%" }}
  />
</div> 
<div className="mb-1">
              <label className="block text-sm font-bold text-gray-700">ชื่อสิ่งของ</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="กรุณาระบุชื่อสิ่งของ"
                className="mt-1 text-black w-full px-2 py-1 text-sm rounded-lg border focus:border-blue-500"
              />
            </div>

            <div className="mb-1">
              <label className="block text-sm font-bold text-gray-700">เบอร์มือถือของคุณ</label>
              <input
                type="text"
                value={teluser}
                onChange={(e) => setTeluser(e.target.value)}
                placeholder="กรุณาระบุเบอร์มือถือ"
                className="mt-1 text-black w-full px-2 py-1 text-sm rounded-lg border focus:border-blue-500"
              />
            </div>

            <div className="mb-1">
    <label className="mb-1 block text-sm font-bold text-gray-700">
      หมวดหมู่
    </label>
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 text-black text-sm focus:border-blue-500 focus:outline-none"
    >
      <option value="">กรุณาเลือกหมวดหมู่</option>
      <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
      <option value="สิ่งของส่วนบุคคล">สิ่งของส่วนบุคคล</option>
      <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
    </select>
  </div>
            <div className="mb-1">
              <label className="text-sm font-bold text-gray-700">รายละเอียดเพิ่มเติม</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม"
                className="mt-1 w-full text-sm  text-black px-2 py-1 rounded-lg border focus:border-blue-500"
              />
            </div>





    <div className="mb-1">
    
    <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          รายละเอียดตำแหน่งเพิ่มเติม (เช่น ชั้นที่ ...)
        </label>
        <div className="mb-2">
          <input
            type="text"
            value={markerText}
            onChange={(e) => setMarkerText(e.target.value)}
            placeholder="ข้อความที่จะแสดงบนหมุด"
            className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <label className="mb-1 block text-sm font-bold text-gray-700">
      สถานที่พบของหาย
    </label>
    <select
      value={location}
      onChange={(e) => {
        const selected = predefinedLocations.find(
          (loc) => loc.name === e.target.value
        );
        setSelectedLocation(selected || null);
      }}
      className="w-full  text-sm rounded-lg border px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
    >
      <option value="">กรุณาเลือกสถานที่</option>
      {predefinedLocations.map((loc) => (
        <option key={loc.name} value={loc.name}>
          {loc.name}
        </option>
      ))}
    </select>
  </div>
  </div>
 

            <div className="mb-1">
              <label className="text-sm font-bold text-gray-700">รูปภาพ</label>
              {existingImage && (
                <div>
                  <button
                    type="button"
                    onClick={toggleImagePopup}
                    className="text-blue-500 underline"
                  >
                    ดูรูปภาพเก่า
                  </button>
                </div>
              )}
             <input
                ref={inputRef}
                type="file"
                className="file-input file-input-bordered file-input-info w-full max-w-xs h-9 text-sm"
            />
            </div>

            {isImagePopupVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10000">
    <div className="w-3/4 max-w-3xl p-4 bg-white rounded shadow-lg relative">
      <button
        className="absolute top-2 right-2 text-xl"
        onClick={toggleImagePopup}
      >
        ×
      </button>
      <img
        src={existingImage}
        alt="Old Post Image"
        className="mx-auto w-full h-auto items-center"
        style={{ height: "40%", width: "50%" }}
      />
    </div>
  </div>
)}


            <div className="mb-1">
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                อัพเดทข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>

     
    </>
  );
};

export default EditReportPage;
