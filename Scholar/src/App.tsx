import React, { useState, useEffect } from 'react';
import { ChefHat, TrendingUp, Utensils, MessageSquare, Clock, Users, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Add these type definitions at the top of the file
type UserRating = 'like' | 'dislike' | null;

interface Meal {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  location: string;
  offer: string;
  userRating?: UserRating;
  userComment?: string;
  likes: number;
  dislikes: number;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Indian Coffee House",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      rating: 4.5,
      deliveryTime: "45-50 mins",
      cuisine: "South Indian, Chinese, Fast Food",
      location: "Railway Station",
      offer: "₹50 OFF ABOVE ₹129"
    },
    {
      id: 2,
      name: "The Fusion Lounge",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      rating: 4.1,
      deliveryTime: "70-75 mins",
      cuisine: "South Indian, Chinese, Beverages",
      location: "Chhindwara City",
      offer: "₹50 OFF ABOVE ₹129"
    },
    {
      id: 3,
      name: "Fresh Meal's",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      rating: 4.1,
      deliveryTime: "85-90 mins",
      cuisine: "North Indian, South Indian",
      location: "Chhindwara City",
      offer: "20% OFF UPTO ₹120"
    },
  ]);

  const renderContent = () => {
    switch (activeView) {
      case 'feedback':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Rate Today's Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meals.map((meal) => (
                  <div key={meal.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{meal.name}</h3>
                        <p className="text-sm text-gray-500">{meal.cuisine}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => handleMealRating(meal.id, true)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                              meal.userRating === 'like' 
                                ? 'bg-green-100 text-green-600' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{meal.likes}</span>
                          </button>
                          <button
                            onClick={() => handleMealRating(meal.id, false)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                              meal.userRating === 'dislike' 
                                ? 'bg-red-100 text-red-600' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{meal.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <textarea
                        placeholder="Add a comment about this meal..."
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        value={meal.userComment || ''}
                        onChange={(e) => handleCommentChange(meal.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="space-y-8">
            {/* Filter Section */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                Filter
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                Sort By
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                Rating: 4.0+
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                Pure Veg
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                Rs. 300-Rs. 600
              </button>
            </div>
  
            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {restaurant.offer}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-green-600 fill-current" />
                      <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-600">{restaurant.deliveryTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Most Popular Cuisine</p>
                      <p className="text-lg font-semibold text-gray-900">South Indian</p>
                    </div>
                    <Utensils className="h-8 w-8 text-indigo-500" />
                  </div>
                  <p className="mt-2 text-sm text-green-600">32% of total orders</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Peak Hours</p>
                      <p className="text-lg font-semibold text-gray-900">12:00 - 14:00</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="mt-2 text-sm text-blue-600">45% higher activity</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Customer Satisfaction</p>
                      <p className="text-lg font-semibold text-gray-900">4.5/5.0</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="mt-2 text-sm text-green-600">↑ 0.3 this week</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Top Performing Items</h3>
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{meal.name}</span>
                        <span className="text-sm font-medium text-gray-900">{meal.rating} ★</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Performance</h3>
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{meal.name}</span>
                        <span className="text-sm font-medium text-gray-900">{meal.deliveryTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">450 Meals</p>
                    <p className="text-sm text-green-600">↑ 12% from yesterday</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Students</p>
                    <p className="text-2xl font-semibold text-gray-900">328</p>
                    <p className="text-sm text-blue-600">↑ 8% this week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">4.8/5.0</p>
                    <p className="text-sm text-purple-600">Based on 234 reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Items Section */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{meal.name}</h3>
                        <p className="text-sm text-gray-500">Ordered {Math.floor(Math.random() * 100)} times today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New order placed for {meals[Math.floor(Math.random() * meals.length)].name}
                        </p>
                        <p className="text-sm text-gray-500">{Math.floor(Math.random() * 30)} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Add handleLogin function
  const handleLogin = async () => {
    setUser({ id: 1, name: 'Test User' });
    toast.success('Logged in successfully!');
  };

  // Add handleMealRating function
  const handleMealRating = (mealId: number, isLike: boolean) => {
    if (!user) {
      toast.error('Please login to rate meals');
      return;
    }

    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        const newRating = isLike ? 'like' : 'dislike';
        const oldRating = meal.userRating;
        
        let newLikes = meal.likes || 0;
        let newDislikes = meal.dislikes || 0;
        
        if (oldRating === 'like') newLikes--;
        if (oldRating === 'dislike') newDislikes--;
        
        if (newRating === 'like') newLikes++;
        if (newRating === 'dislike') newDislikes++;

        return {
          ...meal,
          userRating: oldRating === newRating ? null : newRating,
          likes: newLikes,
          dislikes: newDislikes
        };
      }
      return meal;
    }));
    toast.success('Rating updated!');
  };

  // Add handleCommentChange function
  const handleCommentChange = (mealId: number, comment: string) => {
    if (!user) {
      toast.error('Please login to add comments');
      return;
    }

    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, userComment: comment }
        : meal
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Smart Canteen</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveView('menu')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'menu' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Menu
                </button>
                <button 
                  onClick={() => setActiveView('feedback')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'feedback' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Feedback
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;