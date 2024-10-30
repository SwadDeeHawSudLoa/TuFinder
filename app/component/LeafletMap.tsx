import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";

// Define a custom icon
const customIcon = new L.Icon({
  iconUrl:
    "https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2Flocation-removebg-preview.png?alt=media&token=e15982c3-7a79-4e08-bc38-c8bde557968f", // Replace with your icon URL
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor position of the icon
  popupAnchor: [0, -32], // Position of the popup relative to the icon
});

interface MapProps {
  posix: [number, number];
  zoom: number;
  onMapClick: (coords: [number, number]) => void;
  onLocationUpdate: (coords: [number, number]) => void; // New prop to update location
  style?: React.CSSProperties;
}

const LeafletMap: React.FC<MapProps> = ({
  posix,
  zoom,
  onMapClick,
  onLocationUpdate, // Destructure the new prop
  style,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [lat, setLat] = useState(14.0254); // Default latitude
  const [long, setLong] = useState(100.6164); // Default longitude

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist yet
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(posix, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onMapClick([lat, lng]);

        // Add a marker with the custom icon on map click
        if (mapInstanceRef.current) {
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], {
              icon: customIcon,
            }).addTo(mapInstanceRef.current);
          }
        }
      });
    } else {
      // Update map view if position changes
      mapInstanceRef.current.setView(posix, zoom);

      // Update marker position if it exists
      if (markerRef.current) {
        markerRef.current.setLatLng(posix);
      } else {
        markerRef.current = L.marker(posix, { icon: customIcon }).addTo(
          mapInstanceRef.current,
        );
      }
    }
  }, [posix, zoom, onMapClick]);

  // Function to move map to user's current location
  const handleMarkMyPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLong(longitude);

          // Call the prop function to update the parent component
          onLocationUpdate([latitude, longitude]);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], zoom);

            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], {
                icon: customIcon,
              }).addTo(mapInstanceRef.current);
            }
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert("ไม่สามารถระบุตำแหน่งของคุณได้");
        },
      );
    } else {
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
    }
  };

  return (
    <div style={{ position: "relative", ...style }}>
      <div ref={mapRef} style={{ height: "400px", ...style }} />

      {/* ปุ่ม Mark my position */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px", // ปุ่มจะอยู่ตรงขวาล่าง
          zIndex: 1000, // เพิ่ม z-index เพื่อให้ปุ่มอยู่ด้านบนสุด
        }}
      >
        <button
          type="button"
          onClick={handleMarkMyPosition}
          className="focus:shadow-outline rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2Fcrosshair.png?alt=media&token=5eb5e0bd-7e62-44cf-acec-84eb86ce86f4"
            alt="Mark My Position"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default LeafletMap;
