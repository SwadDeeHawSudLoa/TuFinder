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

const picturePage = ({ params }: { params: { id: string } }) => {
   
    return (
<>
<Navbar />






</>
    

    );
        
        
        
        
        
    














    






};
export default picturePage;