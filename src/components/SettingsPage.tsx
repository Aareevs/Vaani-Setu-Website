import { useState, useEffect } from 'react';
import { Globe, Bell, Lock, Palette, Eye, Volume2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { useAuth } from '../context/AuthContext';

// Settings type definitions to properly narrow union usage in render logic
type SettingType = 'switch' | 'select' | 'slider';

interface BaseSetting {
  id: string;
  label: string;
  description: string;
  type: SettingType;
}

interface SwitchSetting extends BaseSetting {
  type: 'switch';
  value?: boolean;
  onChange?: (checked: boolean) => void;
}

interface SelectSetting extends BaseSetting {
  type: 'select';
  options: string[];
}

interface SliderSetting extends BaseSetting {
  type: 'slider';
}

type SettingItem = SwitchSetting | SelectSetting | SliderSetting;

interface SettingsSection {
  title: string;
  icon: React.ComponentType<any>;
  settings: SettingItem[];
}

interface SettingsPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function SettingsPage({ darkMode, toggleDarkMode }: SettingsPageProps) {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState(100);
  const [speechSpeed, setSpeechSpeed] = useState(50);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('vaani_admin_mode') === 'true';
  });

  useEffect(() => {
    // Apply font size to the root element
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);
  const settingsSections: SettingsSection[] = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          id: 'theme',
          label: 'Dark Mode',
          description: 'Toggle dark mode for comfortable viewing',
          type: 'switch',
          value: darkMode,
          onChange: toggleDarkMode,
        },
      ],
    },
    {
      title: 'Accessibility',
      icon: Eye,
      settings: [
        {
          id: 'fontSize',
          label: 'Font Size',
          description: 'Adjust text size for better readability',
          type: 'slider',
        },
        {
          id: 'contrast',
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          type: 'switch',
        },
        {
          id: 'animations',
          label: 'Reduced Motion',
          description: 'Minimize animations and transitions',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Language & Region',
      icon: Globe,
      settings: [
        {
          id: 'language',
          label: 'Interface Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: ['English', 'Hindi', 'Tamil', 'Bengali', 'Telugu'],
        },
        {
          id: 'signLanguage',
          label: 'Sign Language Variant',
      description: 'Select regional ASL variant',
          type: 'select',
      options: ['Standard ASL', 'Northeast', 'Midwest', 'West Coast', 'South'],
        },
      ],
    },
    {
      title: 'Audio',
      icon: Volume2,
      settings: [
        {
          id: 'speechOutput',
          label: 'Speech Output',
          description: 'Enable text-to-speech for translations',
          type: 'switch',
        },
        {
          id: 'speechSpeed',
          label: 'Speech Speed',
          description: 'Adjust playback speed',
          type: 'slider',
        },
        {
          id: 'audioFeedback',
          label: 'Audio Feedback',
          description: 'Play sound for successful detections',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'communityNotif',
          label: 'Community Updates',
          description: 'Get notified about new posts and replies',
          type: 'switch',
        },
        {
          id: 'learningReminders',
          label: 'Learning Reminders',
          description: 'Daily reminders to practice',
          type: 'switch',
        },
        {
          id: 'systemNotif',
          label: 'System Notifications',
          description: 'Updates and important announcements',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      settings: [
        {
          id: 'saveHistory',
          label: 'Save Detection History',
          description: 'Store your interpretation history',
          type: 'switch',
        },
        {
          id: 'analytics',
          label: 'Usage Analytics',
          description: 'Help improve the app by sharing usage data',
          type: 'switch',
        },
        // Admin Mode - Only for authorized admins
        ...(user?.email && (console.log('Current user:', user.email), ['aareevs@gmail.com', 'abahuguna2007@gmail.com'].includes(user.email.toLowerCase())) ? [{
          id: 'adminMode',
          label: 'Admin Mode',
          description: 'Enable teaching tools and advanced features',
          type: 'switch' as const,
          value: isAdminMode,
          onChange: (checked: boolean) => {
            setIsAdminMode(checked);
            localStorage.setItem('vaani_admin_mode', String(checked));
            // Dispatch event for other components to react
            window.dispatchEvent(new Event('storage'));
          },
        }] : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your Vaani Setu experience</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <SectionIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl text-white">{section.title}</h2>
                  </div>
                </div>

                {/* Settings Items */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 dark:text-white mb-1">{setting.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                        </div>

                        {/* Control */}
                        <div className="flex-shrink-0">
                          {setting.type === 'switch' && (
                            <Switch
                              checked={setting.value || false}
                              onCheckedChange={setting.onChange || (() => {})}
                            />
                          )}
                          {setting.type === 'select' && (
                            <Select defaultValue={setting.options?.[0]}>
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {setting.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {setting.type === 'slider' && (
                            <div className="w-48">
                              {setting.id === 'fontSize' ? (
                                <div className="space-y-2">
                                  <Slider 
                                    value={[fontSize]} 
                                    onValueChange={(value: number[]) => setFontSize(value[0])}
                                    min={80}
                                    max={150}
                                    step={10}
                                  />
                                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">{fontSize}%</p>
                                </div>
                              ) : setting.id === 'speechSpeed' ? (
                                <div className="space-y-2">
                                  <Slider 
                                    value={[speechSpeed]} 
                                    onValueChange={(value: number[]) => setSpeechSpeed(value[0])}
                                    min={25}
                                    max={200}
                                    step={25}
                                  />
                                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">{speechSpeed}%</p>
                                </div>
                              ) : (
                                <Slider defaultValue={[50]} max={100} step={1} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl mb-4 text-gray-900 dark:text-white">Account Management</h2>
          <div className="space-y-3">
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Change Password
            </button>
            <button className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-0 sm:ml-3">
              Export Data
            </button>
            <button className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors ml-0 sm:ml-3">
              Delete Account
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 flex justify-end"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}
