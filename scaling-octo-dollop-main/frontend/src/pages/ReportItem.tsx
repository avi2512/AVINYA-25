import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icon issue
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function ReportItem() {
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3000/items",
        {
          title,
          description,
          location,
          status,
          imageUrl,
          coordinates, 
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      alert("Item reported successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Failed to report item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setCoordinates(e.latlng);
      },
    });

    return coordinates === null ? null : <Marker position={coordinates} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800 flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-[#1C1C1C]">
          Report Lost or Found Item
        </h2>

        {/* Status Selector */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setStatus("lost")}
            className={`px-6 py-2 rounded-full border ${
              status === "lost"
                ? "bg-red-500 text-white"
                : "bg-white text-[#1C1C1C]"
            } transition`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => setStatus("found")}
            className={`px-6 py-2 rounded-full border ${
              status === "found"
                ? "bg-green-500 text-white"
                : "bg-white text-[#1C1C1C]"
            } transition`}
          >
            Found
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label className="block mb-1 text-[#1C1C1C] font-semibold">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter item title"
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block mb-1 text-[#1C1C1C] font-semibold">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Describe the item..."
            rows={4}
          ></textarea>
        </div>

        {/* Location Input */}
        <div>
          <label className="block mb-1 text-[#1C1C1C] font-semibold">
            Location (Block/Area)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Where was it lost/found?"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block mb-1 text-[#1C1C1C] font-semibold">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Optional: Add an image URL"
          />
        </div>

        {/* Map Picker */}
        <div>
          <label className="block mb-2 text-[#1C1C1C] font-semibold">
            Pin the Location on Map
          </label>
                    <MapContainer
            center={[28.6106, 77.0353]} // ✅ Updated to NSUT Dwarka
            zoom={15}
            style={{ height: "300px", width: "100%" }}
            >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
          {coordinates && (
            <p className="text-sm text-gray-600 mt-1">
              Selected Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1C1C] text-white py-2 rounded hover:bg-[#333333] transition"
        >
          {loading ? "Reporting..." : "Report Item"}
        </button>
      </form>
    </div>
  );
}
