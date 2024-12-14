"use client";

import React, { FormEvent, useEffect, useState, useRef } from "react";
import Navbar from "../component/AdminNavbar";
import Cookies from "js-cookie";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";
import { useRouter } from "next/navigation";
const Map = dynamic(() => import("../component/LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

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
const ReportPage = () => {
  const [userIdEdit, setUserIdEdit] = useState<string | null>(null);
  const [adminIdEdit, setAdminIdEdit] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [image, setImage] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(14.0254); // Default lat
  const [long, setLong] = useState(100.6164); // Default long
  const [location, setLocation] = useState("");
  const[teluser,setTeluser] =useState("");
  const router = useRouter();
  const [adminusername,setAdminusername]=useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    long: number;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapKey, setMapKey] = useState<number>(0);
  const [markerText, setMarkerText] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [locationINV,setlocationINV]=useState("");
  useEffect(() => {
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      if (decryptedUserId === "123") {

      } else {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/");
      }
    } else {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.push("/");
    }
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [blurRadius, setBlurRadius] = useState(20);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
 const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const statusO = "อยู่ในคลัง";
    setStatus(statusO);
    
    async function fetchAdminUserName() {
      try {
        const response = await axios.get(`/api/saveAdmin`);
        const name = response.data;
        setAdminusername(name);
      } catch (error) {
        console.error("Error fetching user name", error);
      }
    }
    fetchAdminUserName();
    const phoneAdmin = "0433112286";
    setTel(phoneAdmin);
    const userIdFromCookie = Cookies.get("user_id");
    if (userIdFromCookie) {
      const decryptedUserId = decryptWithCryptoJS(userIdFromCookie, SECRET_KEY);
      setAdminIdEdit(decryptedUserId);
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
        const name = response.data.name;
        setUsername(name);
        setAdminusername(name);
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
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // คำนวณขนาดที่เหม��ะสม
      const maxWidth = window.innerWidth * 0.9; // 90% ของความกว้างหน้าจอ
      const maxHeight = window.innerHeight * 0.6; // 60% ของความสูงหน้าจอ
      
      let newWidth = originalImage.width;
      let newHeight = originalImage.height;
      
      // ปรับขนาดให้พอดีกับหน้าจอ
      if (newWidth > maxWidth) {
        const ratio = maxWidth / newWidth;
        newWidth = maxWidth;
        newHeight = newHeight * ratio;
      }
      
      if (newHeight > maxHeight) {
        const ratio = maxHeight / newHeight;
        newHeight = maxHeight;
        newWidth = newWidth * ratio;
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      if (context) {
        context.drawImage(originalImage, 0, 0, newWidth, newHeight);
        setCtx(context);
      }
    }
  }, [originalImage]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!title || !category || !location || !inputRef.current?.files?.length) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setIsSubmitting(true); // Disable the button
    let downloadURL = "";
    if (editedImage) {
      try {
        const response = await fetch(editedImage);
        const blob = await response.blob();
        const fileName = `edited_${Date.now()}.jpg`;
        
        const fileRef = ref(storage, `images/${fileName}`);
        await uploadBytes(fileRef, blob);
        downloadURL = await getDownloadURL(fileRef);
      } catch (error) {
        console.error("File upload error:", error);
        setIsSubmitting(false); // Re-enable the button
      }
    }

    try {
      await axios.post("/api/posts", {
        adminIdEdit,
        title,
        username,
        adminusername,
        tel,
        teluser,
        category,
        otherCategory,
        image: downloadURL,
        status,
        description,
        lat,
        long,
        location,
        markerText,locationINV,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong");
    }finally {
      setIsSubmitting(false); // Re-enable the button
    }
  }

  const handleMapClick = (newPosition: LatLngTuple) => {
    setLat(newPosition[0]);
    setLong(newPosition[1]);
    setMapKey((prevKey) => prevKey + 1); // Refresh map with new position
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      // ตรวจสอบขนาดไฟล์
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      // สร้าง URL สำหรับรูปภาพ
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          setEditedImage(e.target.result as string);
          
          const img = new Image();
          img.src = e.target.result as string;
          img.onload = () => {
            setOriginalImage(img);
            if (canvasRef.current) {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');
              if (context) {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                setCtx(context);
              }
            }
          };
        }
      };
      reader.readAsDataURL(file);
      setShowImageModal(true);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !ctx || !originalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let x, y;

    if (e.type === 'mousemove' || e.type === 'mousedown') {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = (mouseEvent.clientX - rect.left) * scaleX;
      y = (mouseEvent.clientY - rect.top) * scaleY;
    } else {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      x = (touchEvent.touches[0].clientX - rect.left) * scaleX;
      y = (touchEvent.touches[0].clientY - rect.top) * scaleY;
    }

    // วาดรูปภาพต้นฉบับใหม่ในบริเวณที่จะเบลอ
    ctx.save();
    ctx.filter = `blur(${blurRadius}px)`;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  // ฟังก์ชันสำหรับตรวจจับตำแหน่งของผู้ใช้

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
          <p className="mb-4 text-black">โปรดนำของหายไปให้เจ้าหน้าที่ที่ {locationINV}</p>
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
        className="rounded text-2xl text-black"
      >
        ×
      </button>
    </div>

    <h2 className="mb-4 text-center text-lg sm:text-xl font-bold">
      แจ้งพบของสูญหาย
    </h2>
    <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex flex-col space-y-4 text-md">
              <div className="flex flex-col text-md sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <label className="w-full sm:w-32  font-bold text-gray-700">
                  ชื่อสิ่งของ <label className="text-red-600 font-bold">*</label>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="กรุณาระบุชื่อสิ่งของ"
                  required
                  className="w-full sm:flex-grow rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <label className="w-full sm:w-32 text-md font-bold text-gray-700">
                  เบอร์มือถือของคุณ <label className="text-red-600 text-md font-bold">*</label>
                </label>
                <div className="w-full">
                  <input
                    type="tel"
                    value={teluser}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setTeluser(value);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value.length < 10) {
                        alert("กรุณาใส่เบอร์มือถือให้ครบ 10 ตัว");
                      }
                    }}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="กรุณาระบุเบอร์มือถือ 10 หลัก"
                    required
                    className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                  {teluser.length > 0 && teluser.length < 10 && (
                    <p className="text-red-500 text-md mt-1">
                      กรุณาใส่เบอร์มือถือให้ครบ 10 ตัว <label className="text-red-600 text-md font-bold">*</label>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
    
          <div className="mb-4">
            <label className="mb-2 block text-md font-bold text-gray-700">
              หมวดหมู่ <label className="text-red-600 text-md font-bold">*</label>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">กรุณาเลือกหมวดหมู่</option>
              <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
              <option value="สิ่งของส่วนบุคคล">สิ่งของส่วนบุคคล</option>
              <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
            
            {category === "อื่นๆ" && (
              <input
                type="text"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                placeholder="กรุณาระบุหมวดหมู่อื่นๆ"
                required
                className="mt-2 w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>
    
          <div className="mb-4">
            <label className="mb-2 block text-md font-bold text-gray-700">
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
            <label className="mb-2 block text-md font-bold text-gray-700">
              สถานที่พบของหาย <label className="text-red-600 text-md font-bold">*</label>
            </label>
            <select
              value={selectedLocation ? selectedLocation.name : ""}
              onChange={(e) => {
                const selected = predefinedLocations.find(
                  (loc) => loc.name === e.target.value
                );
                setSelectedLocation(selected || null);
              }}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              required >
              <option value="">กรุณาเลือกสถานที่</option>
              {predefinedLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
    
          <div className="mb-4">
            <label className="mb-2 block text-md font-bold text-gray-700">
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
    
          <div className="mb-4 flex justify-center text-md flex-col">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file-input file-input-bordered file-input-info w-full max-w-xs"
            />
            <label >เลือกสถานที่เก็บ <label className="text-red-600 text-md font-bold">*</label></label>
            <select
            required
              value={locationINV}
              onChange={(e) => setlocationINV(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">เลือกสถานที่</option>
              <option value="อาคารโดมบริหาร">อาคารโดมบริหาร</option>
              <option value="SC3">SC3</option>
            </select>
          </div>
    
          <div className="flex justify-center">
      <button
  type="submit"
  disabled={isSubmitting}
  className={`mt-4 w-full rounded-lg bg-green-500 px-4 py-2 text-white ${
      isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
    }`}
>
  {isSubmitting ? "กำลังส่ง..." : "ส่ง"}
</button>
      </div>
        </form>
  </div>
</div>

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden">
          <div className="relative bg-white p-6 rounded-lg max-h-[90vh] overflow-y-auto w-[90vw] max-w-3xl">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800 z-10"
            >
              ×
            </button>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                ระดับความเบลอ: {blurRadius}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={blurRadius}
                onChange={(e) => setBlurRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {imagePreviewUrl && (
              <div className="mb-4">
                <img 
                  src={imagePreviewUrl} 
                  alt="Preview" 
                  className="max-w-full h-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <div className="relative border border-gray-300 rounded">
              <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault(); // ป้องกันการเลื่อนหน้าจอ
                startDrawing(e);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopDrawing();
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e);
              }}
              style={{ 
                cursor: 'crosshair',
                maxWidth: '100%',
                maxHeight: '70vh',
                width: 'auto',
                height: 'auto',
                touchAction: 'none' // ป้องกันการ zoom และ scroll ใน iOS
              }}
              />
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const editedImageUrl = canvas.toDataURL('image/jpeg');
                    setEditedImage(editedImageUrl);
                    setPreviewImage(editedImageUrl);
                    setShowImageModal(false);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ยืนยัน
              </button>
              <button
                onClick={() => {
                  if (ctx && originalImage && canvasRef.current) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(originalImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
                  }
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ReportPage;
