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
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
      ): Promise<void> {
        event.preventDefault();
        let downloadURL = "";
        const file = inputRef.current?.files ? inputRef.current.files[0] : null;
        if (file) {
          try {
            const fileRef = ref(storage, `images/${file.name}`);
            await uploadBytes(fileRef, file);
            downloadURL = await getDownloadURL(fileRef);
            console.log(downloadURL);
          } catch (error) {
            console.error("File upload error:", error);
          }
        } else {
          console.error("No file selected.");
        }
    
        try {
          await axios.put(`/api/posts/${id}`, {
            image: downloadURL,
          });
          router.push("/mypostMyadmin");
        } catch (error) {
          console.error("Error submitting post:", error);
          alert("Something went wrong");
        }
      }
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