import { useState, useRef } from 'react';
import { Edit, Mail, MapPin, Calendar, Award, TrendingUp, Target, Trophy, X, Camera, Eye, EyeOff, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePageProps {
  userName: string;
  onNavigate: (page: any) => void;
}

export default function ProfilePage({ userName, onNavigate }: ProfilePageProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(`${userName.toLowerCase()}@email.com`);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(`${userName.toLowerCase()}@email.com`);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileEmoji, setProfileEmoji] = useState('👤');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Update displayed name and email
    setDisplayName(editName);
    setDisplayEmail(editEmail);
    // In a real app, this would save to a backend
    setIsEditDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const profileEmojiOptions = ['👤', '👨', '👩', '🧑', '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🎨', '🎯', '⭐', '🚀', '💼', '🎓'];
  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed first tutorial', icon: '🎯', unlocked: true },
    { id: 2, title: 'Quick Learner', description: 'Completed 5 tutorials', icon: '📚', unlocked: true },
    { id: 3, title: 'Interpreter', description: '100 signs interpreted', icon: '🎥', unlocked: true },
    { id: 4, title: 'Community Helper', description: '10 helpful posts', icon: '💬', unlocked: false },
    { id: 5, title: 'Week Streak', description: '7 days in a row', icon: '🔥', unlocked: true },
    { id: 6, title: 'Master', description: 'Completed all tutorials', icon: '🏆', unlocked: false },
  ];

  const stats = [
    { label: 'Signs Interpreted', value: '234', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { label: 'Tutorials Completed', value: '12', icon: Target, color: 'from-purple-500 to-purple-600' },
    { label: 'Community Posts', value: '8', icon: Trophy, color: 'from-pink-500 to-pink-600' },
    { label: 'Days Active', value: '45', icon: Award, color: 'from-green-500 to-green-600' },
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-6xl shadow-xl overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileEmoji}</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 mt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl text-gray-900 dark:text-white mb-2">{displayName}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                  <button 
                    onClick={() => {
                      setEditName(displayName);
                      setEditEmail(displayEmail);
                      setIsEditDialogOpen(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 self-start md:self-auto"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </motion.div>
                );
              })}
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
              <p className="text-4xl mb-2">7 Days</p>
              <p className="text-sm text-white/80">Keep it up! Come back tomorrow to maintain your streak.</p>
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
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            JPG, PNG or GIF (Max 5MB)
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or choose an avatar:</p>
                        <div className="flex flex-wrap gap-2">
                          {profileEmojiOptions.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setProfileEmoji(emoji);
                                handleRemoveImage();
                              }}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all ${
                                profileEmoji === emoji && !profileImage
                                  ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm text-gray-900 dark:text-white mb-4">Change Password (Optional)</h3>
                    
                    {/* Current Password */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}