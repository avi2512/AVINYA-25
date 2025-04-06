import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import GoogleMapsIcon from "./google-maps-2020-icon.svg";

interface Item {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  studentId: string;
  date: string;
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Student {
  name: string;
  email: string;
  // Add other fields if needed
}

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await axios.get(`http://localhost:3000/items/${id}`);
        setItem(response.data);
      } catch (error) {
        setError("Failed to fetch item details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  // 🆕 Fetch student details once item is loaded
  useEffect(() => {
    async function fetchStudent() {
      if (!item?.studentId) return;

      try {
        const response = await axios.get(`http://localhost:3000/login/${item.studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Failed to fetch student details.", error);
      }
    }

    fetchStudent();
  }, [item?.studentId]);

  const handleNavigate = () => {
    if (!item) return;
    const destination = `${item.coordinates.lat},${item.coordinates.lng}`;
    const origin = '28.6100,77.0380'; 
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800">
        <p className="text-lg text-white">Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800">
        <p className="text-lg text-red-400">{error || "Item not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800 flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white text-black rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-bold">Lost & Found Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/lost-items")}
            className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition"
          >
            Lost Items
          </button>
          <button
            onClick={() => navigate("/found-items")}
            className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition"
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Text Details */}
        <div className="bg-[#2b2b2b] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="md:w-1/2 space-y-3">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-gray-300">{item.description}</p>
            <p className="text-gray-400 font-medium"><strong>Location:</strong> {item.location}</p>
            <p className="text-gray-400 font-medium">
              <strong>Status:</strong>{" "}
              <span className={item.status === "lost" ? "text-red-400" : "text-green-400"}>
                {item.status.toUpperCase()}
              </span>
            </p>
            <p className="text-gray-400 font-medium">
              <strong>Student Name:</strong>{" "}
              {student ? student.name : "Loading..."}
            </p>
            <p className="text-gray-400 font-medium"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>

            <button
              onClick={handleNavigate}
              className="mt-4 flex items-center justify-center bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition"
            >
              <img src={GoogleMapsIcon} alt="Google Maps" className="w-5 h-5 mr-2" />
              Get Directions
            </button>
          </div>

          {/* Image */}
          {item.imageUrl && (
            <div className="md:w-1/2 flex justify-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-[#2b2b2b] text-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Location on Map</h3>
          <MapContainer
            center={[item.coordinates.lat, item.coordinates.lng]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[item.coordinates.lat, item.coordinates.lng]} icon={markerIcon}>
              <Popup>{item.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
