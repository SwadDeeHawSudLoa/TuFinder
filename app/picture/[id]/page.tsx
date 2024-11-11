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
    const inputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { id } = params;
 
    return (
<>
<Navbar />

<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
<div className="mb-4 flex justify-between">
    <input
      ref={inputRef}
      type="file"
      className="file-input file-input-bordered file-input-info w-full max-w-xs"
    />
  </div>
    
</div>






</>
    

    );
        
        
        
        
        
    














    






};