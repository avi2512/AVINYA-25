import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: string;
}

export function SearchLostItems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Lost Items</h1>
      
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Search for lost items..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex gap-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="accessories">Accessories</option>
            <option value="others">Others</option>
          </select>
          
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="text-center mb-8">
        <Link
          to="/report-lost-item"
          className="inline-block w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Report a Lost Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Lost</span>
          <h3 className="text-lg font-semibold mt-2">Item Title</h3>
          <p className="text-gray-600 text-sm mt-1">Description of the lost item...</p>
          <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 mt-2">Category</span>
          <p className="text-sm text-gray-500 mt-2">Lost on: Date</p>
          <p className="text-sm mt-2">Location: Place</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
}