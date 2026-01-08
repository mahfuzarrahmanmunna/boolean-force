// src/app/worker-dashboard/(chat)/free-chat-support/page.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiMoreVertical, FiPaperclip, FiSend, FiSmile, FiPhone, FiVideo, FiInfo, FiUsers, FiSettings, FiLogOut, FiEdit3, FiCheck, FiCheckCircle } from 'react-icons/fi';

export default function FreeChatSupport() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(8);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      });
      setMessage('');
      
      // Simulate typing indicator and response
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const response = {
          id: Date.now() + 1,
          text: getRandomResponse(),
          sender: selectedChat.id,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, response]
        }));
      }, 1500);
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "That's interesting! Tell me more.",
      "I completely agree with you.",
      "Hmm, I'm not sure about that.",
      "That's a great point!",
      "Let me think about it.",
      "Thanks for sharing that with me."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const privateChats = [
    {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'AJ',
      lastMessage: 'Hey, how are you doing?',
      time: '2:30 PM',
      unread: 2,
      online: true,
      typing: false,
      messages: [
        { id: 1, text: 'Hi there!', sender: 'user1', time: '2:00 PM' },
        { id: 2, text: 'Hello! How can I help you today?', sender: 'me', time: '2:05 PM', status: 'read' },
        { id: 3, text: 'I wanted to discuss the project', sender: 'user1', time: '2:15 PM' },
        { id: 4, text: 'Sure, what about it?', sender: 'me', time: '2:20 PM', status: 'read' },
        { id: 5, text: 'Hey, how are you doing?', sender: 'user1', time: '2:30 PM' }
      ]
    },
    {
      id: 'user2',
      name: 'Sarah Williams',
      avatar: 'SW',
      lastMessage: 'Can we schedule a meeting?',
      time: '1:45 PM',
      unread: 0,
      online: true,
      typing: false,
      messages: [
        { id: 1, text: 'Hi Sarah!', sender: 'me', time: '1:30 PM', status: 'read' },
        { id: 2, text: 'Hello! How are you?', sender: 'user2', time: '1:35 PM' },
        { id: 3, text: 'I\'m doing great, thanks!', sender: 'me', time: '1:40 PM', status: 'read' },
        { id: 4, text: 'Can we schedule a meeting?', sender: 'user2', time: '1:45 PM' }
      ]
    },
    {
      id: 'user3',
      name: 'Michael Chen',
      avatar: 'MC',
      lastMessage: 'Thanks for your help!',
      time: '12:30 PM',
      unread: 0,
      online: false,
      typing: false,
      messages: [
        { id: 1, text: 'I need some assistance', sender: 'user3', time: '12:00 PM' },
        { id: 2, text: 'Of course, what do you need?', sender: 'me', time: '12:10 PM', status: 'read' },
        { id: 3, text: 'Thanks for your help!', sender: 'user3', time: '12:30 PM' }
      ]
    },
    {
      id: 'user4',
      name: 'Emma Davis',
      avatar: 'ED',
      lastMessage: 'See you tomorrow!',
      time: 'Yesterday',
      unread: 0,
      online: false,
      typing: false,
      messages: [
        { id: 1, text: 'Are we still on for tomorrow?', sender: 'me', time: 'Yesterday', status: 'read' },
        { id: 2, text: 'Yes, absolutely!', sender: 'user4', time: 'Yesterday' },
        { id: 3, text: 'See you tomorrow!', sender: 'user4', time: 'Yesterday' }
      ]
    }
  ];

  const groupChats = [
    {
      id: 'group1',
      name: 'Design Team',
      avatar: 'DT',
      lastMessage: 'John: The new mockups look great!',
      time: '3:15 PM',
      unread: 5,
      members: 8,
      online: 5,
      messages: [
        { id: 1, text: 'Team meeting at 4 PM today', sender: 'admin', time: '2:00 PM' },
        { id: 2, text: 'I\'ll be there', sender: 'me', time: '2:05 PM', status: 'read' },
        { id: 3, text: 'Count me in too', sender: 'user1', time: '2:10 PM' },
        { id: 4, text: 'The new mockups look great!', sender: 'John', time: '3:15 PM' }
      ]
    },
    {
      id: 'group2',
      name: 'Project Alpha',
      avatar: 'PA',
      lastMessage: 'Lisa: Deadline is next Friday',
      time: '11:30 AM',
      unread: 0,
      members: 12,
      online: 8,
      messages: [
        { id: 1, text: 'Project update', sender: 'admin', time: '10:00 AM' },
        { id: 2, text: 'We\'re making good progress', sender: 'me', time: '10:30 AM', status: 'read' },
        { id: 3, text: 'Deadline is next Friday', sender: 'Lisa', time: '11:30 AM' }
      ]
    },
    {
      id: 'group3',
      name: 'Weekend Plans',
      avatar: 'WP',
      lastMessage: 'Mike: Who\'s up for hiking?',
      time: 'Yesterday',
      unread: 0,
      members: 6,
      online: 2,
      messages: [
        { id: 1, text: 'Anyone free this weekend?', sender: 'Mike', time: 'Yesterday' },
        { id: 2, text: 'I am! What are you thinking?', sender: 'me', time: 'Yesterday', status: 'read' },
        { id: 3, text: 'Who\'s up for hiking?', sender: 'Mike', time: 'Yesterday' }
      ]
    }
  ];

  const allChats = activeTab === 'chats' ? privateChats : groupChats;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 flex flex-col border-r border-gray-700">
        {/* User Profile */}
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="ml-3">
                <div className="font-semibold">John Doe</div>
                <div className="text-xs text-gray-400">Active now</div>
              </div>
            </div>
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FiMoreVertical size={18} />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-700">
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    <FiUsers className="mr-3" /> New Group
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    <FiSettings className="mr-3" /> Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    <FiLogOut className="mr-3" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 mb-2">
          <button
            className={`flex-1 py-2 text-center font-medium transition-all ${
              activeTab === 'chats' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-all ${
              activeTab === 'groups' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {allChats.map(chat => (
            <div
              key={chat.id}
              className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {chat.avatar}
                </div>
                {activeTab === 'chats' && chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
                {activeTab === 'groups' && (
                  <div className="absolute bottom-0 right-0 bg-gray-700 text-xs text-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.online}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {selectedChat.avatar}
                </div>
                {activeTab === 'chats' && selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-xs text-gray-400">
                  {activeTab === 'chats' 
                    ? (selectedChat.online ? 'Active now' : 'Offline')
                    : `${selectedChat.members} members, ${selectedChat.online} online`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <FiPhone size={18} />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <FiVideo size={18} />
              </button>
              <button 
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                onClick={() => setShowChatInfo(!showChatInfo)}
              >
                <FiInfo size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-900" style={{ backgroundColor: 'rgb(7, 14, 34)' }}>
            {selectedChat.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'me' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                    {selectedChat.avatar}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'me'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end mt-1 text-xs ${
                    msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && (
                      <span className="ml-1">
                        {msg.status === 'sent' && <FiCheck size={14} />}
                        {msg.status === 'delivered' && <FiCheckCircle size={14} />}
                        {msg.status === 'read' && <FiCheckCircle size={14} className="text-blue-300" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                  {selectedChat.avatar}
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors mr-2">
                <FiPaperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2.5 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-600 rounded-full transition-colors">
                  <FiSmile size={18} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-900" style={{ backgroundColor: 'rgb(7, 14, 34)' }}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FiUsers size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Messenger</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Select a conversation from the sidebar to start messaging. You can have private chats or join group conversations.
            </p>
          </div>
        </div>
      )}

      {/* Chat Info Sidebar */}
      {showChatInfo && selectedChat && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Chat Info</h3>
            <button 
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setShowChatInfo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="p-4 flex flex-col items-center border-b border-gray-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {selectedChat.avatar}
            </div>
            <h2 className="font-semibold text-xl">{selectedChat.name}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'chats' 
                ? (selectedChat.online ? 'Active now' : 'Offline')
                : `${selectedChat.members} members`
              }
            </p>
            {activeTab === 'groups' && (
              <div className="mt-4 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Online</span>
                  <span>{selectedChat.online} members</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(selectedChat.online / selectedChat.members) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <h4 className="font-semibold mb-3">
              {activeTab === 'chats' ? 'Shared Media' : 'Members'}
            </h4>
            {activeTab === 'chats' ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {['John Doe', 'Alex Johnson', 'Sarah Williams', 'Michael Chen', 'Emma Davis', 'Lisa Anderson'].map((member, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member}</p>
                      <p className="text-xs text-gray-400">{i < 3 ? 'Active now' : 'Offline'}</p>
                    </div>
                    {i < 3 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium">
              {activeTab === 'chats' ? 'Delete Chat' : 'Leave Group'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}