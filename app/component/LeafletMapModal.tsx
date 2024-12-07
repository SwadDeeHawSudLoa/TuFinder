import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";

// Define a custom icon
const customIcon = new L.Icon({
  iconUrl:
    "https://firebasestorage.googleapis.com/v0/b/tuitemfider.appspot.com/o/private%2Flocation-removebg-preview.png?alt=media&token=e15982c3-7a79-4e08-bc38-c8bde557968f",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapProps {
  posix: [number, number];
  zoom: number;
  style?: React.CSSProperties;
}

const LeafletMapModal: React.FC<MapProps> = ({
  posix,
  zoom,
  style,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist yet
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(posix, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      // Add initial marker
      markerRef.current = L.marker(posix, { icon: customIcon }).addTo(
        mapInstanceRef.current
      );
    } else {
      // Update map view if position changes
      mapInstanceRef.current.setView(posix, zoom);

      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng(posix);
      }
    }
  }, [posix, zoom]);

  return (
    <div style={{ position: "relative", ...style, zIndex: 0 }}>
      <div ref={mapRef} style={{ height: "400px", ...style }} />
    </div>
  );
};

export default LeafletMapModal;
