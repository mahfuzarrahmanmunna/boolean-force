// src/app/dashboard/(chat)/layout.js
"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { ChatProvider } from '@/app/contexts/ChatContext';
import ChatSystem from '@/app/components/ChatSystem/ChatSystem';

export default function ChatLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
            <div className="w-16 h-16 bg-blue-600 rounded-full relative flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  // Store user data in localStorage when session is available
  useEffect(() => {
    if (session?.user) {
      const userData = {
        _id: session.user.id || session.user._id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.avatar,
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Chat Support - Admin Dashboard</title>
        <meta name="description" content="Free chat support system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ChatProvider>
        {/* Chat Layout Container - Full Screen without Dashboard Layout */}
        <div className="h-screen w-full overflow-hidden bg-gray-900">
          
          {/* Optional: Chat Header with Back to Dashboard */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-lg font-semibold text-white">Chat Support</h1>
            </div>
            
            {/* User Info in Chat Header */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{session.user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Content - Full Height Remaining */}
          <div className="h-[calc(100vh-57px)]">
            <ChatSystem />
          </div>
        </div>
      </ChatProvider>

      {/* Global Styles for Chat */}
      <style jsx global>{`
        /* Custom scrollbar for chat */
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        /* Animation for typing indicator */
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .animate-bounce-delay-1 {
          animation: bounce 1.4s infinite;
        }
        .animate-bounce-delay-2 {
          animation: bounce 1.4s infinite 0.2s;
        }
        .animate-bounce-delay-3 {
          animation: bounce 1.4s infinite 0.4s;
        }

        /* Message animations */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .message-slide-left {
          animation: slideInLeft 0.3s ease-out;
        }
        .message-slide-right {
          animation: slideInRight 0.3s ease-out;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </>
  );
}