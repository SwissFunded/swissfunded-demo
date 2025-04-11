import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Settings</h1>
        
        <div className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-xl p-6 space-y-8`}>
          {/* Avatar Section */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className={`w-24 h-24 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`} />
                )}
                <button
                  onClick={handleAvatarClick}
                  className={`absolute bottom-0 right-0 p-2 rounded-full ${
                    isDarkMode ? 'bg-background-lighter' : 'bg-background-lightMode-lighter'
                  } ${isDarkMode ? 'text-text' : 'text-text-lightMode'} hover:bg-primary transition-colors`}
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                  Upload a profile picture to personalize your account
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                  Recommended size: 200x200 pixels
                </p>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Appearance</h2>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Theme</p>
                  <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-primary text-white' : 'bg-background-lightMode-lighter text-text-lightMode'
                  }`}
                >
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Account Settings</h2>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'}`}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 rounded-md ${
                      isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'
                    } ${isDarkMode ? 'text-text' : 'text-text-lightMode'} border ${
                      isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-1`}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 rounded-md ${
                      isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'
                    } ${isDarkMode ? 'text-text' : 'text-text-lightMode'} border ${
                      isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 