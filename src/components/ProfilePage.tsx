import { useState, useRef, useEffect } from 'react';
import { Edit, Mail, MapPin, Calendar, Award, TrendingUp, Target, X, Eye, EyeOff, Upload, Trash2, BookOpen, Settings, LogOut, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../hooks/useToast';
import { useAnnouncer } from '../hooks/useAccessibility';
import EmojiPicker from './EmojiPicker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

interface ProfilePageProps {
  userName: string;
  onNavigate: (page: any) => void;
  profileImage?: string | null;
  onProfileImageUpdate?: (image: string | null) => void;
  onProfileNameUpdate?: (name: string) => void;
  onLogout?: () => void;
}

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    tutorialReminders: boolean;
    communityUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
  };
}

interface UserStats {
  signsInterpreted: number;
  tutorialsCompleted: number;
  communityPosts: number;
  daysActive: number;
  totalPracticeTime: number;
  averageAccuracy: number;
  learningStreak: number;
  lastActiveDate: string;
}

export default function ProfilePage({ userName, onNavigate, profileImage: initialProfileImage, onProfileImageUpdate, onProfileNameUpdate, onLogout }: ProfilePageProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { announce } = useAnnouncer();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(() => localStorage.getItem('vaani_admin_mode') === 'true');
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(user?.email || '');
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileEmoji, setProfileEmoji] = useState('👤');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  
  // User settings
  const [settings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      tutorialReminders: true,
      communityUpdates: false
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true
    },
    preferences: {
      language: 'en',
      theme: 'auto',
      fontSize: 'medium'
    }
  });
  
  // User stats with real data simulation
  const [userStats] = useState<UserStats>({
    signsInterpreted: 234,
    tutorialsCompleted: 12,
    communityPosts: 8,
    daysActive: 45,
    totalPracticeTime: 1260, // in minutes
    averageAccuracy: 78,
    learningStreak: 7,
    lastActiveDate: new Date().toISOString()
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with props
  useEffect(() => {
    setDisplayName(userName);
    setEditName(userName);
    setProfileImage(initialProfileImage || null);
  }, [userName, initialProfileImage]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/\d/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('one special character');
    return { isValid: errors.length === 0, errors };
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate name
    if (!editName.trim()) {
      newErrors.name = 'Name is required';
    } else if (editName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (editName.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    
    // Validate email
    if (!editEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(editEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password if provided
    if (currentPassword || newPassword || confirmPassword) {
      // For Supabase, we don't strictly need current password if logged in, but good practice
      // if (!currentPassword) {
      //   newErrors.currentPassword = 'Current password is required to change password';
      // }
      
      if (newPassword) {
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          newErrors.newPassword = `Password must contain: ${passwordValidation.errors.join(', ')}`;
        }
      }
      
      if (confirmPassword !== newPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      announce('Please fix the form errors before saving', 'polite');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (!user) throw new Error('No user logged in');

      // Update Profile Data
      const updates: any = {
        id: user.id,
        username: editName,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (profileError) throw profileError;

      // Update Email/Password if changed
      if (editEmail !== user.email || newPassword) {
        const authUpdates: any = {};
        if (editEmail !== user.email) authUpdates.email = editEmail;
        if (newPassword) authUpdates.password = newPassword;

        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) throw authError;
      }
      
      // Update displayed name and email
      setDisplayName(editName);
      setDisplayEmail(editEmail);
      onProfileNameUpdate?.(editName);
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Show success message
      addToast('Profile updated successfully!', 'success');
      announce('Profile updated successfully', 'polite');
      
      // Close dialog
      setIsEditDialogOpen(false);
      
      // Reset errors
      setErrors({});
    } catch (error: any) {
      addToast('Failed to update profile: ' + (error.message || 'Unknown error'), 'error');
      announce('Profile update failed', 'assertive');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Starting upload...', { filePath, file });
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        console.log('Upload result:', { uploadError, uploadData });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          });

        if (updateError) throw updateError;

        setProfileImage(publicUrl);
        setProfileEmoji('👤'); // Reset to default emoji when image is uploaded
        onProfileImageUpdate?.(publicUrl);
        addToast('Profile image updated successfully!', 'success');
      } catch (error: any) {
        addToast('Error uploading image: ' + (error.message || 'Unknown error'), 'error');
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfileImage(null);
      setProfileEmoji('👤'); // Reset to default emoji when image is removed
      onProfileImageUpdate?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      addToast('Profile image removed', 'info');
    } catch (error: any) {
      addToast('Error removing image: ' + error.message, 'error');
    }
  };

  const handleExportData = () => {
    const userData = {
      profile: {
        name: displayName,
        email: displayEmail,
        avatar: profileImage || profileEmoji,
        joinDate: 'October 2024'
      },
      stats: userStats,
      achievements: achievements.filter(a => a.unlocked),
      settings: settings
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vaani-setu-profile-${displayName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addToast('Profile data exported successfully!', 'success');
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${displayName}'s Vaani Setu Profile`,
      text: `Check out my progress on Vaani Setu - I've completed ${userStats.tutorialsCompleted} tutorials and interpreted ${userStats.signsInterpreted} signs!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Profile shared successfully!', 'success');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          addToast('Failed to share profile', 'error');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.text} ${shareData.url}`);
        addToast('Profile link copied to clipboard!', 'success');
      } catch (error) {
        addToast('Failed to copy link to clipboard', 'error');
        console.error('Clipboard error:', error instanceof Error ? error.message : String(error));
      }
    }
  };

  const handleLogout = () => {
    addToast('Logged out successfully', 'info');
    // Call parent logout handler to clear profile image and other session data
    onLogout?.();
    onNavigate('login');
  };

  const formatPracticeTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed first tutorial', icon: '🎯', unlocked: true },
    { id: 2, title: 'Quick Learner', description: 'Completed 5 tutorials', icon: '📚', unlocked: true },
    { id: 3, title: 'Interpreter', description: '100 signs interpreted', icon: '🎥', unlocked: true },
    { id: 4, title: 'Community Helper', description: '10 helpful posts', icon: '💬', unlocked: false },
    { id: 5, title: 'Week Streak', description: '7 days in a row', icon: '🔥', unlocked: true },
    { id: 6, title: 'Master', description: 'Completed all tutorials', icon: '🏆', unlocked: false },
  ];

  const activityLog = [
    { date: 'Today', activity: 'Completed tutorial: Emergency Signs', icon: '📚' },
    { date: 'Yesterday', activity: 'Interpreted 24 signs', icon: '🎥' },
    { date: '2 days ago', activity: 'Posted in community forum', icon: '💬' },
    { date: '3 days ago', activity: 'Started tutorial: Numbers 1-100', icon: '🔢' },
    { date: '4 days ago', activity: 'Interpreted 18 signs', icon: '🎥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center text-6xl shadow-xl overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileEmoji}</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl text-white mb-2">{displayName}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{displayEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined Oct 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start md:self-auto">
                    <button
                      onClick={handleExportData}
                      className="px-4 py-3 bg-white/90 text-green-600 rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg border border-white/30"
                      title="Export Profile Data"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={handleShareProfile}
                      className="px-4 py-3 bg-white/90 text-purple-600 rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg border border-white/30"
                      title="Share Profile"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button 
                      onClick={() => {
                        setEditName(displayName);
                        setEditEmail(displayEmail);
                        setIsEditDialogOpen(true);
                      }}
                      className="px-6 py-3 bg-white/90 text-blue-600 rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg border border-white/30"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Tutorials Completed</p>
                    <p className="text-3xl font-bold">{userStats.tutorialsCompleted}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-yellow-500 dark:bg-yellow-600 rounded-2xl p-6 text-white shadow-md border border-yellow-400 dark:border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white dark:text-yellow-100 font-medium">Signs Interpreted</p>
                    <p className="text-3xl font-bold text-white">{userStats.signsInterpreted}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-200 dark:text-yellow-300" />
                </div>
              </div>
              <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Practice Streak</p>
                    <p className="text-3xl font-bold">{userStats.learningStreak} days</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-green-500 dark:bg-green-600 rounded-2xl p-6 text-white shadow-md border border-green-400 dark:border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white dark:text-green-100 font-medium">Practice Time</p>
                    <p className="text-3xl font-bold text-white">{formatPracticeTime(userStats.totalPracticeTime)}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-200 dark:text-green-300" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl mb-6 text-gray-900 dark:text-white">Recent Activity</h2>
              <div className="space-y-4">
                {activityLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="text-3xl">{log.icon}</div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{log.activity}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl text-gray-900 dark:text-white">Achievements</h2>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Achievement Progress</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    style={{
                      width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Learning Streak */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-2">Learning Streak 🔥</h3>
              <p className="text-4xl mb-2">{userStats.learningStreak} Days</p>
              <p className="text-sm text-white/80">Keep it up! Come back tomorrow to maintain your streak.</p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsSettingsDialogOpen(true)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Settings</span>
                </button>
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Export Data</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <AnimatePresence>
        {isEditDialogOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditDialogOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl text-gray-900 dark:text-white">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditDialogOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">Profile Picture</label>
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-4xl overflow-hidden relative group">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{profileEmoji}</span>
                        )}
                        {profileImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove profile picture"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            <Upload className="w-4 h-4" aria-hidden="true" />
                            Upload Photo
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            JPG, PNG or GIF (Max 5MB)
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or choose an avatar:</p>
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{profileEmoji}</div>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Choose Emoji
                          </button>
                        </div>
                        {showEmojiPicker && (
                          <div className="mt-3">
                            <EmojiPicker
                              onEmojiSelect={(emoji) => {
                                setProfileEmoji(emoji);
                                setProfileImage(null); // Clear uploaded image when emoji is selected
                                onProfileImageUpdate?.(null); // Notify parent that image is cleared
                                setShowEmojiPicker(false);
                              }}
                              onClose={() => setShowEmojiPicker(false)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="edit-name" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      required
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="edit-email" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="edit-email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        required
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm text-gray-900 dark:text-white mb-4">Change Password (Optional)</h3>
                    
                    {/* Current Password */}
                    <div className="mb-4">
                      <label htmlFor="current-password" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className={`w-full px-4 py-3 pr-12 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          aria-invalid={errors.currentPassword ? 'true' : 'false'}
                          aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p id="current-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                      <label htmlFor="new-password" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className={`w-full px-4 py-3 pr-12 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          aria-invalid={errors.newPassword ? 'true' : 'false'}
                          aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p id="new-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className={`w-full px-4 py-3 pr-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p id="confirm-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Settings Dialog */}
      <AnimatePresence>
        {isSettingsDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsDialogOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  <button
                    onClick={() => setIsSettingsDialogOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* DEBUG INFO */}
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded">
                    Debug: Logged in as: {user?.email || 'Not logged in'}
                  </div>

                  {/* Admin Mode Toggle - Only for aareevs@gmail.com */}
                  {/* {user?.email === 'aareevs@gmail.com' && ( */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Admin Mode</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Enable teaching tools</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newValue = !isAdminMode;
                          setIsAdminMode(newValue);
                          localStorage.setItem('vaani_admin_mode', String(newValue));
                          addToast(newValue ? 'Admin Mode Enabled' : 'Admin Mode Disabled', 'success');
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          isAdminMode ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAdminMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  {/* )} */}

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">General</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <span className="text-xs text-gray-500">Auto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                      <span className="text-xs text-gray-500">On</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
