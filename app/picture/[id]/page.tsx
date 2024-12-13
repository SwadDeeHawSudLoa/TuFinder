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

const Map = dynamic(() => import("@/app/component/LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const predefinedLocations = [
  { name: "มหาวิทยาลัยธรรมศาสตร์ รังสิต", lat: 14.0254, long: 100.6164 },
  { name: "จุฬาลงกรณ์มหาวิทยาลัย", lat: 13.7464, long: 100.533 },
  { name: "มหาวิทยาลัยมหิดล", lat: 13.78, long: 100.305 },
];

const PicturePage = ({ params }: { params: { id: string } }) => {
  const [userIdEdit, setUserIdEdit] = useState<string | null>(null);
  const [adminIdEdit, setAdminIdEdit] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageAdmin, setimageAdmin] = useState("");
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
  
  const fetchPost = async (id: Number) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
     setimageAdmin(res.data.imageAdmin);
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
        
        imageAdmin: downloadURL,
        
      });
      router.push("/mainAdmin");
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 shadow-xl">
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
       <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75" style={{ zIndex: 9999 }}>
        <div className="w-3/4 max-w-lg rounded-lg bg-white p-4">
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="text-xl text-black"
            >
              ×
            </button>
          </div>

          <h2 className="text-xl text-center text-black font-bold">เเก้ไขแจ้งพบของสูญหายโพสต์ที่ <>{id}</></h2>
 
          <form onSubmit={handleSubmit}>

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
      className="file-input file-input-bordered file-input-info w-full max-w-xs"
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
        className="w-full h-auto items-center"
        style={{ height: "180px", width: "50%" }}
      />
    </div>
  </div>
)}

            <div className="mb-1">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700"
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

export default PicturePage;
