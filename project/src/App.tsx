import React, { useState, useEffect } from 'react';
import { Search, Bell, Filter } from 'lucide-react';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ProfileForm } from './components/ProfileForm';
import { AuthForm } from './components/AuthForm';
import { NotificationPanel } from './components/NotificationPanel';
import { FilterPanel, FilterOptions } from './components/FilterPanel';
import { supabase } from './lib/supabase';
import { Database } from './types/supabase';
import toast, { Toaster } from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Scholarship = Database['public']['Tables']['scholarships']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    minAmount: 0,
    maxAmount: 0,
    fields: [],
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchScholarships();
        fetchNotifications(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchNotifications(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
  };

  const fetchScholarships = async () => {
    const { data, error } = await supabase.from('scholarships').select('*');

    if (error) {
      console.error('Error fetching scholarships:', error);
      return;
    }

    setScholarships(data);
  };

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data);
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: session.user.id,
        ...updatedProfile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error('Failed to update profile');
      return;
    }

    toast.success('Profile updated successfully');
    fetchProfile(session.user.id);
  };

  const handleApply = async (scholarshipId: string) => {
    if (!session) {
      toast.error('Please sign in to apply');
      return;
    }

    const { error } = await supabase.from('applications').insert({
      user_id: session.user.id,
      scholarship_id: scholarshipId,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('You have already applied for this scholarship');
      } else {
        toast.error('Failed to submit application');
      }
      return;
    }

    toast.success('Application submitted successfully');
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      toast.error('Failed to mark notification as read');
      return;
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      filters.category.length === 0 ||
      filters.category.includes(scholarship.category);
    
    const matchesAmount =
      (filters.minAmount === 0 || scholarship.amount >= filters.minAmount) &&
      (filters.maxAmount === 0 || scholarship.amount <= filters.maxAmount);
    
    const matchesFields =
      filters.fields.length === 0 ||
      filters.fields.some((field) => scholarship.fields.includes(field));

    return matchesSearch && matchesCategory && matchesAmount && matchesFields;
  });

  useEffect(() => {
    if (session && !profile) {
      setShowProfileForm(true);
    }
  }, [session, profile]);

  const handleProfileSubmit = async (profileData: Partial<Profile>) => {
    if (!session) return;
    
    console.log('Submitting profile:', profileData);
    
    try {
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
  
      const profilePayload = {
        user_id: session.user.id,
        major: profileData.major || '',
        gpa: profileData.gpa || null,
        academic_year: profileData.academic_year || '',
        nationality: profileData.nationality || '',
        updated_at: new Date().toISOString(),
        created_at: existingProfile ? existingProfile.created_at : new Date().toISOString()
      };
  
      const { error } = await supabase
        .from('profiles')
        .upsert(profilePayload, {
          onConflict: 'user_id'
        });
  
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
        return;
      }
  
      toast.success('Profile updated successfully');
      setShowProfileForm(false);
      await fetchProfile(session.user.id);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!session) {
    return <AuthForm onSuccess={() => fetchScholarships()} />;
  }

  if (session && showProfileForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
              <ProfileForm 
                profile={profile} 
                onSubmit={handleProfileSubmit} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">
              ScholarshipFinder
            </h1>
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with profile */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Edit Profile
                </button>
              </div>
              {profile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Major</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.major || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">GPA</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.gpa || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Academic Year</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.academic_year || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nationality</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.nationality || 'Not specified'}</p>
                  </div>
                </div>
              ) : (
                <ProfileForm
                  profile={profile}
                  onSubmit={handleProfileSubmit}  // Changed from onUpdate to onSubmit
                />
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Search and filters */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Latest Scholarships Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Scholarships</h2>
              <div className="bg-white shadow rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  {scholarships
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 3)
                    .map((scholarship) => (
                      <div key={scholarship.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <h3 className="text-lg font-medium text-indigo-600">{scholarship.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Amount: ${scholarship.amount}</p>
                        <p className="text-sm text-gray-500 mt-1">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
                        <button
                          onClick={() => handleApply(scholarship.id)}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* All Scholarships grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Scholarships</h2>
              <div className="grid grid-cols-1 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onApply={handleApply}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApplyFilters={setFilters}
          initialFilters={filters}
        />
      )}
    </div>
  );
}

export default App;