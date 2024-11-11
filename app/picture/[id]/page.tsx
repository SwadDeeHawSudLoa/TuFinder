import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "@/app/component/AdminNavbar";
import Cookies from "js-cookie";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/config";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
interface Post {
    post_id: number;
   userIdEdit?: string;
    adminIdEdit?: string;
   title: string;
    username: string;
    adminusername?:string;//เพิ่มชื่อ admin 
    tel: string;
   teluser: string;// เพิ่มเบอร์มือถือของผู้ใช้ 
    category: string;
    image: string;
   imageAdmin?: string; //เพิ่มรูปภาพเเนบรูปหลังฐานที่จะเเสดงเฉพาะadmin เท่านั้น
    status: string;
    description: string;
    date: Date;
    lat: number;
    long: number;
    location: string;
  }
  
const picturePage = ({ params }: { params: { id: string } }) => {
   
    return (
<>
<Navbar />






</>
    

    );
        
        
        
        
        
    














    






};
export default picturePage;