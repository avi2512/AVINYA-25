import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  status: string;
  imageUrl?: string;
}

export function FoundItemsDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFoundItems() {
      try {
        const response = await axios.get("http://localhost:3000/items/found-items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    }

    fetchFoundItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">LOST_AND_FOUND</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#1C1C1C] text-white px-4 py-2 rounded-xl hover:bg-[#333] transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/lost-items")}
            className="bg-[#1C1C1C] text-white px-4 py-2 rounded-xl hover:bg-[#333] transition"
          >
            Lost Items
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/${item._id}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col cursor-pointer border border-gray-200"
          >
            {/* Image */}
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {/* Title */}
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-2 text-center">
              {item.title}
            </h2>
            {/* Status */}
            <p
              className={`text-sm font-medium text-center ${
                item.status.toLowerCase() === "found"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {item.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
