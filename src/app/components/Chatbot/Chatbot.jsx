'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    MessageCircle, Send, X, Bot, User, HelpCircle, Briefcase, Palette,
    Globe, Cpu, ShoppingBag, AlertCircle, RefreshCw, Sparkles,
    Mic, MicOff, Search, Moon, Sun, Check, CheckCheck, Paperclip,
    MoreVertical, ThumbsUp, Clock, Wifi, WifiOff, ChevronDown,
    ChevronUp, Copy, Share2, Star, Zap
} from 'lucide-react';

const QUICK_ACTIONS = [
    { icon: <Briefcase className="w-4 h-4" />, text: "Our Services", query: "What services does booleanforce offer?", color: "blue" },
    { icon: <Palette className="w-4 h-4" />, text: "Brand Identity", query: "Tell me about your brand visual identity services", color: "purple" },
    { icon: <Globe className="w-4 h-4" />, text: "Website Development", query: "What kind of websites do you develop?", color: "green" },
    { icon: <Cpu className="w-4 h-4" />, text: "ERP Solutions", query: "How can your ERP solutions help my business?", color: "red" },
    { icon: <ShoppingBag className="w-4 h-4" />, text: "POS Systems", query: "What features do your POS systems have?", color: "yellow" },
    { icon: <HelpCircle className="w-4 h-4" />, text: "Getting Started", query: "How can I get started with booleanforce services?", color: "indigo" }
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [messages, setMessages] = useState([
        {
            id: 0,
            role: 'assistant',
            content: 'Hello! I\'m here to help you learn about booleanforce services. How can I assist you today?',
            timestamp: new Date(),
            read: true
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [error, setError] = useState(null);
    const [messageIdCounter, setMessageIdCounter] = useState(1);
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, connecting, disconnected
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [likedMessageIds, setLikedMessageIds] = useState(new Set());
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Simulate connection status changes
        const interval = setInterval(() => {
            setConnectionStatus(prev => {
                if (prev === 'connected') return 'connected';
                return 'connected';
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (e.target.value && !isTyping) {
            setIsTyping(true);
        } else if (!e.target.value && isTyping) {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async (messageText) => {
        const messageToSend = messageText || input;
        if (messageToSend.trim() === '' || isLoading) return;

        setError(null);
        setIsTyping(false);

        const messageId = messageIdCounter;
        setMessageIdCounter(prev => prev + 1);

        const userMessage = {
            id: messageId,
            role: 'user',
            content: messageToSend,
            timestamp: new Date(),
            read: false
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setShowQuickActions(false);
        setIsLoading(true);
        setConnectionStatus('connecting');

        try {
            console.log('Sending message:', messageToSend);

            // Prepare messages for API
            const apiMessages = messages
                .filter(msg => msg.role !== 'system')
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
                .concat({ role: 'user', content: messageToSend });

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: apiMessages
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to get response');
            }

            const data = await response.json();
            setConnectionStatus('connected');

            // Mark user message as read
            setMessages(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, read: true } : msg
            ));

            const assistantMessage = {
                id: messageId + 1000,
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
                read: true
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);
            setConnectionStatus('disconnected');

            const errorMessage = {
                id: messageId + 2000,
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
                timestamp: new Date(),
                isError: true,
                read: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setError(null);
        if (!isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // In a real implementation, you would handle voice recording here
    };

    const handleQuickAction = (query) => {
        handleSendMessage(query);
    };

    const retryLastMessage = () => {
        const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === 'user');
        if (lastUserMessageIndex !== -1) {
            const lastUserMessage = messages[lastUserMessageIndex];
            // Remove the last error message if exists
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1].isError) {
                    newMessages.pop();
                }
                return newMessages;
            });
            handleSendMessage(lastUserMessage.content);
        }
    };

    const resetChat = () => {
        setMessages([
            {
                id: 0,
                role: 'assistant',
                content: 'Hello! I\'m here to help you learn about booleanforce services. How can I assist you today?',
                timestamp: new Date(),
                read: true
            }
        ]);
        setShowQuickActions(true);
        setError(null);
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReaction = (messageId, reaction) => {
        // In a real implementation, you would send this reaction to your backend
        console.log(`Reacted with ${reaction} to message ${messageId}`);

        if (reaction === 'like') {
            setLikedMessageIds(prev => {
                const newSet = new Set(prev);
                if (newSet.has(messageId)) {
                    newSet.delete(messageId);
                } else {
                    newSet.add(messageId);
                }
                return newSet;
            });
        }
    };

    const copyMessage = (messageId, content) => {
        navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const shareMessage = (content) => {
        if (navigator.share) {
            navigator.share({
                title: 'booleanforce Assistant Message',
                text: content
            });
        }
    };

    const filteredMessages = searchQuery
        ? messages.filter(msg =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : messages;

    const getColorClasses = (color) => {
        const colorMap = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            red: 'from-red-500 to-red-600',
            yellow: 'from-yellow-500 to-yellow-600',
            indigo: 'from-indigo-500 to-indigo-600'
        };
        return colorMap[color] || 'from-gray-500 to-gray-600';
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 ${darkMode ? 'dark' : ''}`}>
            {isOpen && (
                <div className={`mb-4 w-96 ${isMinimized ? 'h-14' : 'h-[600px]'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'} transition-all duration-300 ease-in-out transform`} ref={chatContainerRef}>
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${darkMode ? 'from-indigo-700 to-purple-800' : 'from-indigo-600 to-purple-600'} text-white p-4 flex justify-between items-center rounded-t-2xl relative overflow-hidden`}>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

                        <div className="flex items-center relative z-10">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${connectionStatus === 'connected' ? 'bg-green-400 border-white' : connectionStatus === 'connecting' ? 'bg-yellow-400 border-white animate-pulse' : 'bg-red-400 border-white'}`}></div>
                            </div>
                            <div className="ml-3">
                                <h3 className="font-semibold text-lg">booleanforce Assistant</h3>
                                <p className="text-xs opacity-90 flex items-center">
                                    {connectionStatus === 'connected' ? (
                                        <>
                                            <Wifi className="w-3 h-3 mr-1" />
                                            Online
                                        </>
                                    ) : connectionStatus === 'connecting' ? (
                                        <>
                                            <Wifi className="w-3 h-3 mr-1 animate-pulse" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <WifiOff className="w-3 h-3 mr-1" />
                                            Offline
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center relative z-10">
                            <button
                                onClick={toggleDarkMode}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                title="Toggle dark mode"
                            >
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                title="Search messages"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                    title="More options"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                                {showOptionsMenu && (
                                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} overflow-hidden z-20`}>
                                        <button
                                            onClick={toggleMinimize}
                                            className={`flex items-center w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                                        >
                                            {isMinimized ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                                            {isMinimized ? 'Expand' : 'Minimize'}
                                        </button>
                                        <button
                                            onClick={resetChat}
                                            className={`flex items-center w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Reset chat
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={toggleChat}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {showSearch && !isMinimized && (
                        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="relative">
                                <Search className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {!isMinimized && (
                        <>
                            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
                                {filteredMessages.length === 0 && searchQuery ? (
                                    <div className="text-center py-8">
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No messages found matching "{searchQuery}"</p>
                                    </div>
                                ) : (
                                    filteredMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                                    : message.isError
                                                        ? 'bg-red-50 border border-red-200 text-red-800'
                                                        : darkMode
                                                            ? 'bg-gray-700 text-white border border-gray-600'
                                                            : 'bg-white text-gray-800 border border-gray-100'
                                                    }`}
                                            >
                                                <div className="flex items-start">
                                                    {message.role === 'assistant' && (
                                                        <div className={`mr-2 mt-0.5 flex-shrink-0 ${message.isError ? 'text-red-600' : 'text-indigo-600'}`}>
                                                            <Bot className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                                    {message.role === 'user' && (
                                                        <div className="ml-2 mt-0.5 flex-shrink-0 text-white opacity-80">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`flex items-center justify-between mt-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                                                    <div className={`text-xs ${message.role === 'user' ? 'text-white opacity-70' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatTimestamp(message.timestamp)}
                                                    </div>
                                                    {message.role === 'user' && (
                                                        <div className="flex items-center ml-2">
                                                            {message.read ? (
                                                                <CheckCheck className="w-4 h-4 text-white opacity-70" />
                                                            ) : (
                                                                <Check className="w-4 h-4 text-white opacity-70" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {!message.isError && (
                                                    <div className="flex mt-2 space-x-2">
                                                        <button
                                                            onClick={() => handleReaction(message.id, 'like')}
                                                            className={`text-xs ${likedMessageIds.has(message.id) ? 'text-indigo-600' : darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors`}
                                                            title="Like"
                                                        >
                                                            <ThumbsUp className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => copyMessage(message.id, message.content)}
                                                            className={`text-xs ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors`}
                                                            title="Copy"
                                                        >
                                                            {copiedMessageId === message.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => shareMessage(message.content)}
                                                            className={`text-xs ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors`}
                                                            title="Share"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Quick Actions */}
                                {showQuickActions && messages.length === 1 && (
                                    <div className="mt-6 animate-fadeIn">
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 font-medium flex items-center`}>
                                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                            Popular questions:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {QUICK_ACTIONS.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleQuickAction(action.query)}
                                                    className={`flex items-center text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-indigo-500' : 'bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300'} border rounded-xl p-3 transition-all duration-200 transform hover:scale-105 hover:shadow-md`}
                                                >
                                                    <span className={`mr-2 bg-gradient-to-r ${getColorClasses(action.color)} text-white rounded-lg p-1.5`}>
                                                        {action.icon}
                                                    </span>
                                                    <span className="text-left font-medium">{action.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="flex justify-start animate-fadeIn">
                                        <div className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-100'} rounded-2xl px-4 py-3 shadow-sm border`}>
                                            <div className="flex items-center">
                                                <Bot className="w-5 h-5 mr-2 text-indigo-600" />
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error Display */}
                                {error && (
                                    <div className="flex justify-start animate-fadeIn">
                                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl px-4 py-3 shadow-sm max-w-[85%]">
                                            <div className="flex items-start">
                                                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium">Something went wrong</p>
                                                    <p className="text-xs mt-1 opacity-90">{error}</p>
                                                    <div className="flex gap-3 mt-3">
                                                        <button
                                                            onClick={retryLastMessage}
                                                            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md px-3 py-1.5 transition-colors font-medium flex items-center"
                                                        >
                                                            <RefreshCw className="w-3 h-3 mr-1" />
                                                            Try again
                                                        </button>
                                                        <button
                                                            onClick={resetChat}
                                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md px-3 py-1.5 transition-colors font-medium"
                                                        >
                                                            Reset chat
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'} p-4`}>
                                <div className="flex items-center">
                                    <button
                                        className={`mr-2 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                                        title="Attach file"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <div className="relative flex-1">
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask about our services..."
                                            className={`w-full border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'} rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-all duration-200`}
                                            disabled={isLoading}
                                            rows={1}
                                            style={{ minHeight: '44px', maxHeight: '120px' }}
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                            }}
                                        />
                                        {input.trim() === '' && (
                                            <div className={`absolute right-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={toggleRecording}
                                        className={`ml-2 p-2 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                                        title={isRecording ? "Stop recording" : "Start voice input"}
                                    >
                                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={isLoading || input.trim() === ''}
                                        className="ml-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-3 hover:shadow-lg transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center flex items-center justify-center`}>
                                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                                    booleanforce Assistant typically responds instantly
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Chat button */}
            <button
                onClick={toggleChat}
                className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse opacity-75"></div>
                {isOpen ? (
                    <X className="w-6 h-6 relative z-10" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6 relative z-10" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </>
                )}
            </button>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Chatbot;