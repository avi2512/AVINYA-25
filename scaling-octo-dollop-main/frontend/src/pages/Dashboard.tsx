import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  status: string;
  imageUrl?: string;
  // description?: string; // Uncomment if you plan to use description in the future
}

export function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get("http://localhost:3000/items/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1c1c1c] to-gray-800 flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Lost & Found Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/lost-items")}
            className="bg-[#E0EAFF] text-[#1C1C1C] px-4 py-2 rounded-lg hover:bg-[#d3dcf5] transition"
          >
            Lost Items
          </button>
          <button
            onClick={() => navigate("/found-items")}
            className="bg-[#E0EAFF] text-[#1C1C1C] px-4 py-2 rounded-lg hover:bg-[#d3dcf5] transition"
          >
            Found Items
          </button>
          <button
            onClick={() => navigate("/report-item")}
            className="bg-[#E0EAFF] text-[#1C1C1C] px-4 py-2 rounded-lg hover:bg-[#d3dcf5] transition"
          >
            Report Item
          </button>
        </div>
      </div>

      {/* Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-[#1C1C1C]">Total Items</h2>
          <p className="text-4xl font-bold text-[#3B82F6]">{items.length}</p>
          <span className="text-gray-500 mt-2">All reported items</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-[#1C1C1C]">Lost Items</h2>
          <p className="text-4xl font-bold text-red-500">
            {items.filter(item => item.status === "lost").length}
          </p>
          <span className="text-gray-500 mt-2">Currently marked as lost</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-[#1C1C1C]">Found Items</h2>
          <p className="text-4xl font-bold text-green-500">
            {items.filter(item => item.status === "found").length}
          </p>
          <span className="text-gray-500 mt-2">Currently marked as found</span>
        </div>
      </div>

      {/* Items Grid */}
      <div className="bg-[#151b23] rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-white">Reported Items</h2>

        {/* Search Bar */}
        <div className="mb-6 rounded-lg ">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-lg border font-bold  bg-white border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items
            .filter(item =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/${item._id}`)}
                className="bg-[#F8FAFC] rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer flex flex-col"
              >
                <div className="flex h-full">
                  {/* Left Side: Text */}
                  <div className="w-1/2 flex flex-col justify-center pr-2">
                    <h3 className="text-lg font-semibold text-[#1C1C1C] mb-2">
                      {item.title}
                    </h3>
                    <p
                      className={`text-base font-semibold ${
                        item.status === "lost" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </p>
                  </div>

                  {/* Right Side: Image */}
                  <div className="w-1/2 flex justify-center items-center">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-24 object-contain rounded-xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
