'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    MessageCircle, Send, X, Bot, User, HelpCircle, Briefcase, Palette,
    Globe, Cpu, ShoppingBag, AlertCircle, RefreshCw, Sparkles,
    Mic, MicOff, Search, Moon, Sun, Check, CheckCheck, Paperclip,
    MoreVertical, ThumbsUp, Clock, Wifi, WifiOff, ChevronDown,
    ChevronUp, Copy, Share2, Star, Zap, Maximize2, Minimize2,
    Settings, Download, Filter, TrendingUp, Award, Users, BarChart3, Target, Lightbulb,
    Trash2, MessageSquare, Keyboard, Star as StarIcon, Volume2, VolumeX, Bell, BellOff
} from 'lucide-react';

const QUICK_ACTIONS = [
    { icon: <Briefcase className="w-5 h-5" />, text: "Our Services", query: "What services does booleanforce offer?", color: "blue", gradient: "from-blue-500 to-blue-600" },
    { icon: <Palette className="w-5 h-5" />, text: "Brand Identity", query: "Tell me about your brand visual identity services", color: "purple", gradient: "from-purple-500 to-purple-600" },
    { icon: <Globe className="w-5 h-5" />, text: "Website Development", query: "What kind of websites do you develop?", color: "green", gradient: "from-green-500 to-green-600" },
    { icon: <Cpu className="w-5 h-5" />, text: "ERP Solutions", query: "How can your ERP solutions help my business?", color: "red", gradient: "from-red-500 to-red-600" },
    { icon: <ShoppingBag className="w-5 h-5" />, text: "POS Systems", query: "What features do your POS systems have?", color: "yellow", gradient: "from-yellow-500 to-yellow-600" },
    { icon: <HelpCircle className="w-5 h-5" />, text: "Getting Started", query: "How can I get started with booleanforce services?", color: "indigo", gradient: "from-indigo-500 to-indigo-600" }
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
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
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [likedMessageIds, setLikedMessageIds] = useState(new Set());
    const [showSettings, setShowSettings] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [rating, setRating] = useState(0);
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const optionsMenuRef = useRef(null);

    // Track window size for responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle click outside to close options menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        };

        if (showOptionsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptionsMenu]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + M to minimize
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                toggleMinimize();
            }
            // Ctrl/Cmd + D to toggle dark mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                toggleDarkMode();
            }
            // Ctrl/Cmd + S to export chat
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                exportChat();
            }
            // Ctrl/Cmd + R to reset chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                resetChat();
            }
            // Ctrl/Cmd + ? to show keyboard shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '?') {
                e.preventDefault();
                setShowKeyboardShortcuts(!showKeyboardShortcuts);
                setShowOptionsMenu(false);
            }
            // Escape to close menus
            if (e.key === 'Escape') {
                setShowOptionsMenu(false);
                setShowSettings(false);
                setShowKeyboardShortcuts(false);
                setShowRatingDialog(false);
                setShowClearConfirmation(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showKeyboardShortcuts]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (autoScrollEnabled && !isUserScrolling) {
            scrollToBottom();
        }
    }, [messages, autoScrollEnabled, isUserScrolling]);

    useEffect(() => {
        const handleScroll = () => {
            if (!chatContainerRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

            setShowScrollToBottom(!isAtBottom);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            setIsUserScrolling(true);

            scrollTimeoutRef.current = setTimeout(() => {
                setIsUserScrolling(false);
            }, 1000);
        };

        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
            return () => {
                chatContainer.removeEventListener('scroll', handleScroll);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, []);

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

        // Adjust textarea height
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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
        // Trigger pulse animation when opening
        if (!isOpen) {
            setPulseAnimation(true);
            setTimeout(() => setPulseAnimation(false), 1000);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        setShowOptionsMenu(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setShowOptionsMenu(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        setShowOptionsMenu(false);
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
        setShowOptionsMenu(false);
        setShowClearConfirmation(false);
    };

    const clearChatHistory = () => {
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
        setShowOptionsMenu(false);
        setShowClearConfirmation(false);
    };

    const exportChat = () => {
        const chatContent = messages.map(msg =>
            `${msg.role === 'user' ? 'You' : 'Assistant'} (${formatTimestamp(msg.timestamp)}): ${msg.content}`
        ).join('\n\n');

        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booleanforce-chat-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowOptionsMenu(false);
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReaction = (messageId, reaction) => {
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

    const submitRating = () => {
        // In a real implementation, you would send the rating to your server
        console.log(`User rated the conversation: ${rating} stars`);
        setShowRatingDialog(false);
        setRating(0);
        setShowOptionsMenu(false);
    };

    const filteredMessages = searchQuery
        ? messages.filter(msg =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : messages;

    // Responsive width calculation
    const getChatWidth = () => {
        if (isFullscreen) return 'w-full';
        if (windowSize.width < 640) return 'w-full';
        if (windowSize.width < 768) return 'w-11/12';
        if (windowSize.width < 1024) return 'w-10/12 max-w-lg';
        return 'w-96';
    };

    const getChatHeight = () => {
        if (isFullscreen) return 'h-full';
        if (windowSize.height < 700) return 'h-[500px]';
        return 'h-[600px]';
    };

    return (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${darkMode ? 'dark' : ''}`}>
            {isOpen && (
                <div className={`mb-4 ${getChatWidth()} ${isMinimized ? 'h-14' : getChatHeight()} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-100'} transition-all duration-300 ease-in-out transform ${pulseAnimation ? 'animate-pulse' : ''}`} ref={chatContainerRef}>
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${darkMode ? 'from-indigo-700 to-purple-800' : 'from-indigo-600 to-purple-600'} text-white p-4 flex justify-between items-center rounded-t-2xl relative overflow-hidden`}>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 -translate-x-full animate-shimmer"></div>

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
                                onClick={toggleFullscreen}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                title="Toggle dark mode"
                            >
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    setShowOptionsMenu(false);
                                }}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                title="Search messages"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <div className="relative" ref={optionsMenuRef}>
                                <button
                                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all duration-200 mr-1"
                                    title="More options"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                                {showOptionsMenu && (
                                    <div className={`absolute right-0 top-full mt-2 w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-visible z-[9999] animate-fadeIn`}>
                                        <div className={`p-2 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Chat Options</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMinimize();
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{isMinimized ? 'Expand' : 'Minimize'}</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isMinimized ? 'Show chat window' : 'Hide chat window'}</p>
                                                </div>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>Ctrl+M</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSettings(!showSettings);
                                                    setShowOptionsMenu(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <Settings className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Settings</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customize your experience</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    exportChat();
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <Download className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Export chat</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Download conversation</p>
                                                </div>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>Ctrl+S</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowRatingDialog(true);
                                                    setShowOptionsMenu(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <StarIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Rate conversation</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Help us improve</p>
                                                </div>
                                            </button>
                                        </div>

                                        <div className={`p-2 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Advanced</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowClearConfirmation(true);
                                                    setShowOptionsMenu(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-red-900/30 group-hover:bg-red-900/50' : 'bg-red-50 group-hover:bg-red-100'} mr-3 transition-colors`}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-red-500">Clear chat history</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delete all messages</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    resetChat();
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <RefreshCw className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Reset chat</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start new conversation</p>
                                                </div>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>Ctrl+R</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowKeyboardShortcuts(true);
                                                    setShowOptionsMenu(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <Keyboard className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Keyboard shortcuts</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View all shortcuts</p>
                                                </div>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>Ctrl+?</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // In a real implementation, you would open a help page
                                                    alert('Help & Support page would open here');
                                                    setShowOptionsMenu(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors group`}
                                            >
                                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} mr-3 transition-colors`}>
                                                    <HelpCircle className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Help & Support</p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get assistance</p>
                                                </div>
                                            </button>
                                        </div>
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

                    {/* Settings Panel */}
                    {showSettings && !isMinimized && (
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} animate-fadeIn`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sound Effects</span>
                                    </div>
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${soundEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {notificationsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notifications</span>
                                    </div>
                                    <button
                                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Auto-scroll</span>
                                    <button
                                        onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${autoScrollEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${autoScrollEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Keyboard Shortcuts Modal */}
                    {showKeyboardShortcuts && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-6 max-w-md w-full mx-4 animate-fadeIn`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                                    <button
                                        onClick={() => setShowKeyboardShortcuts(false)}
                                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Minimize chat</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Ctrl+M</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Toggle dark mode</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Ctrl+D</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Export chat</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Ctrl+S</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Reset chat</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Ctrl+R</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Show shortcuts</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Ctrl+?</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Close menus</span>
                                        <span className={`text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>Esc</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rating Dialog */}
                    {showRatingDialog && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-6 max-w-md w-full mx-4 animate-fadeIn`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Rate this conversation</h3>
                                    <button
                                        onClick={() => setShowRatingDialog(false)}
                                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>How would you rate your experience with our assistant?</p>
                                <div className="flex justify-center space-x-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-colors"
                                        >
                                            <StarIcon
                                                className={`w-8 h-8 ${star <= rating ? 'text-yellow-500 fill-current' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowRatingDialog(false)}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitRating}
                                        disabled={rating === 0}
                                        className={`px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Clear Confirmation Dialog */}
                    {showClearConfirmation && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-6 max-w-md w-full mx-4 animate-fadeIn`}>
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-3">
                                        <Trash2 className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Clear chat history?</h3>
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                                    This will permanently delete all messages in this conversation. This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowClearConfirmation(false)}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={clearChatHistory}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        Clear History
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    {showSearch && !isMinimized && (
                        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} animate-fadeIn`}>
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
                            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
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
                                                            ? 'bg-gray-800 text-white border border-gray-700'
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
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 font-medium flex items-center justify-center`}>
                                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                            Popular questions:
                                        </p>
                                        <div className={`grid ${isFullscreen ? 'grid-cols-3' : windowSize.width < 640 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                                            {QUICK_ACTIONS.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleQuickAction(action.query)}
                                                    className={`flex items-center text-sm ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-indigo-500' : 'bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300'} border rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-md`}
                                                >
                                                    <span className={`mr-3 bg-gradient-to-r ${action.gradient} text-white rounded-lg p-2`}>
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
                                        <div className={`${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-100'} rounded-2xl px-4 py-3 shadow-sm border`}>
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

                            {/* Scroll to Bottom Button */}
                            {showScrollToBottom && (
                                <button
                                    onClick={scrollToBottom}
                                    className={`absolute bottom-20 right-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-full p-2 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-200 hover:scale-110 animate-bounce`}
                                    title="Scroll to bottom"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}

                            {/* Input */}
                            <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'} p-4`}>
                                <div className="flex items-center">
                                    <button
                                        className={`mr-2 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                                        title="Attach file"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <div className="relative">
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask about our services"
                                            className={`w-full border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'} rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-all duration-200`}
                                            disabled={isLoading}
                                            rows={1}
                                            style={{ minHeight: '44px', maxHeight: '120px' }}
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
                
                @keyframes shimmer {
                    0% {
                        transform: -skew-x-12 -translate-x-full;
                    }
                    100% {
                        transform: -skew-x-12 translate-x-full;
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Chatbot;