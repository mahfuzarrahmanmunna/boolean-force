"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  HelpCircle,
  Briefcase,
  Palette,
  Globe,
  Cpu,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Mic,
  MicOff,
  Search,
  Moon,
  Sun,
  Check,
  CheckCheck,
  Paperclip,
  MoreVertical,
  ThumbsUp,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Copy,
  Share2,
  Star,
  Zap,
  Maximize2,
  Minimize2,
  Settings,
  Download,
  Trash2,
  Keyboard,
  Star as StarIcon,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  ArrowRight,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    text: "Our Services",
    desc: "Web, ERP, POS & More",
    query: "What services does booleanforce offer?",
    color: "blue",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    text: "Brand Identity",
    desc: "Logo, Colors, Guidelines",
    query: "Tell me about your brand visual identity services",
    color: "purple",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    text: "Web Development",
    desc: "React, Next.js, Node.js",
    query: "What kind of websites do you develop?",
    color: "green",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    text: "ERP Solutions",
    desc: "Business Automation",
    query: "How can your ERP solutions help my business?",
    color: "red",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    text: "POS Systems",
    desc: "Retail Management",
    query: "What features do your POS systems have?",
    color: "yellow",
  },
  {
    icon: <HelpCircle className="w-6 h-6" />,
    text: "Getting Started",
    desc: "Project Estimation",
    query: "How can I get started with booleanforce services?",
    color: "indigo",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      type: "text",
      content:
        "Hello! I'm here to help you learn about booleanforce services. How can I assist you today?",
      timestamp: new Date(),
      read: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [error, setError] = useState(null);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
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
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const optionsMenuRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }
    };
    if (showOptionsMenu)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptionsMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        toggleMinimize();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        toggleDarkMode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        exportChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        resetChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "?") {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
        setShowOptionsMenu(false);
      }
      if (e.key === "Escape") {
        setShowOptionsMenu(false);
        setShowSettings(false);
        setShowKeyboardShortcuts(false);
        setShowRatingDialog(false);
        setShowClearConfirmation(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showKeyboardShortcuts]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (autoScrollEnabled && !isUserScrolling) scrollToBottom();
  }, [messages, autoScrollEnabled, isUserScrolling, scrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowScrollToBottom(!isAtBottom);
      setIsUserScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(
        () => setIsUserScrolling(false),
        1000,
      );
    };
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value && !isTyping) setIsTyping(true);
    else if (!e.target.value && isTyping) setIsTyping(false);

    // FIX: Only set the height directly. DO NOT reset to 'auto' inside the handler
    // This prevents the cursor jumping/scrolling issue.
    const newHeight = Math.min(e.target.scrollHeight, 150);
    e.target.style.height = `${newHeight}px`;
  };

  const handleSendMessage = async (messageText) => {
    const messageToSend = messageText || input;
    if (messageToSend.trim() === "" || isLoading) return;
    setError(null);
    setIsTyping(false);
    const messageId = messageIdCounter;
    setMessageIdCounter((prev) => prev + 1);
    const userMessage = {
      id: messageId,
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
      read: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowQuickActions(false);
    setIsLoading(true);
    setConnectionStatus("connecting");

    try {
      const apiMessages = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({ role: msg.role, content: msg.content }))
        .concat({ role: "user", content: messageToSend });
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      setConnectionStatus("connected");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg,
        ),
      );
      setMessages((prev) => [
        ...prev,
        {
          id: messageId + 1000,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          read: true,
        },
      ]);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setConnectionStatus("disconnected");
      setMessages((prev) => [
        ...prev,
        {
          id: messageId + 2000,
          role: "assistant",
          content: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
          timestamp: new Date(),
          isError: true,
          read: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 300);
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
  };
  const handleQuickAction = (query) => {
    handleSendMessage(query);
  };
  const retryLastMessage = () => {
    const lastUserMessageIndex = messages.findLastIndex(
      (msg) => msg.role === "user",
    );
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[lastUserMessageIndex];
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].isError) newMessages.pop();
        return newMessages;
      });
      handleSendMessage(lastUserMessage.content);
    }
  };
  const resetChat = () => {
    setMessages([
      {
        id: 0,
        role: "assistant",
        content:
          "Hello! I'm here to help you learn about booleanforce services. How can I assist you today?",
        timestamp: new Date(),
        read: true,
      },
    ]);
    setShowQuickActions(true);
    setError(null);
    setShowOptionsMenu(false);
  };
  const clearChatHistory = () => {
    setMessages([
      {
        id: 0,
        role: "assistant",
        content:
          "Hello! I'm here to help you learn about booleanforce services. How can I assist you today?",
        timestamp: new Date(),
        read: true,
      },
    ]);
    setShowQuickActions(true);
    setError(null);
    setShowOptionsMenu(false);
    setShowClearConfirmation(false);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "You" : "Assistant"} (${formatTimestamp(msg.timestamp)}): ${msg.content}`,
      )
      .join("\n\n");
    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booleanforce-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowOptionsMenu(false);
  };

  const formatTimestamp = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const handleReaction = (messageId, reaction) => {
    if (reaction === "like") {
      setLikedMessageIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(messageId)) newSet.delete(messageId);
        else newSet.add(messageId);
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
        title: "booleanforce Assistant Message",
        text: content,
      });
    }
  };
  const submitRating = () => {
    setShowRatingDialog(false);
    setRating(0);
    setShowOptionsMenu(false);
  };

  const filteredMessages = searchQuery
    ? messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  // --- RENDER ---
  return (
    <div className={`fixed z-50 ${darkMode ? "dark" : ""}`}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <div
            className={`absolute inset-0 rounded-full bg-white opacity-0 ${isHovering ? "opacity-20" : ""} transition-opacity duration-300`}
          ></div>
          <MessageCircle className="w-6 h-6 relative z-10" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* MAIN CHAT CONTAINER */}
      {/* MOBILE: Full Screen (App Mode) | DESKTOP: Widget Mode */}
      {isOpen && (
        <div
          className={`
                        fixed flex flex-col overflow-hidden shadow-2xl border transition-all duration-500 ease-[cubic-bezier_0.32_0.72_0_1]
                        ${isMinimized ? "h-14 opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}
                        ${isFullscreen ? "inset-0 rounded-none w-full h-full" : ""}
                        ${
                          !isFullscreen
                            ? "bottom-0 right-0 w-full md:w-[420px] h-[100dvh] md:h-[650px] rounded-none md:rounded-3xl"
                            : ""
                        }
                        ${
                          darkMode
                            ? "bg-[#0f172a] border-slate-800 text-white"
                            : "bg-gray-50 border-slate-200 text-slate-900"
                        }
                    `}
          ref={chatContainerRef}
        >
          {/* --- HEADER --- */}
          <div
            className={`flex-shrink-0 p-4 flex justify-between items-center border-b ${darkMode ? "bg-slate-900/90 border-slate-800 backdrop-blur-xl" : "bg-white/90 border-slate-200 backdrop-blur-xl"}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${darkMode ? "border-slate-900" : "border-white"} ${connectionStatus === "connected" ? "bg-emerald-500" : connectionStatus === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"}`}
                ></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base md:text-lg leading-tight">
                  BooleanForce AI
                </h3>
                <p className="text-[10px] md:text-xs font-medium flex items-center gap-1.5 text-emerald-500">
                  <Wifi className="w-3 h-3" /> Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mobile: Only show Settings menu, Desktop: All controls */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {/* Mobile Options Sheet */}
                {showOptionsMenu && (
                  <div
                    className={`absolute right-0 z-20 top-12  w-48 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-xl shadow-2xl border overflow-hidden`}
                  >
                    {[
                      {
                        icon: <Settings />,
                        label: "Settings",
                        action: () => {
                          setShowSettings(true);
                          setShowOptionsMenu(false);
                        },
                      },
                      {
                        icon: <Download />,
                        label: "Export Chat",
                        action: exportChat,
                      },
                      {
                        icon: <Trash2 />,
                        label: "Clear Chat",
                        action: () => {
                          setShowClearConfirmation(true);
                          setShowOptionsMenu(false);
                        },
                        color: "text-red-500",
                      },
                      {
                        icon: <X />,
                        label: "Close Chat",
                        action: toggleChat,
                        color: "text-red-500",
                      },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border-b last:border-0 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
                      >
                        <div
                          className={`p-1.5 rounded-lg ${item.color ? "bg-red-100 dark:bg-red-900/20" : "bg-slate-100 dark:bg-slate-700"}`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${item.color || ""}`}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Controls */}
              <div className="hidden md:block relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showOptionsMenu && (
                  <div
                    className={`absolute right-0 top-full z-50 mt-2 w-80 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-xl shadow-2xl border overflow-hidden`}
                  >
                    <div
                      className={`p-4 border-b z-50 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
                    >
                      <h3 className="font-semibold flex items-center">
                        <Settings className="w-4 h-4 mr-2" /> Options
                      </h3>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          toggleMinimize();
                          setShowOptionsMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium"
                      >
                        {isMinimized ? (
                          <Maximize2 className="w-4 h-4 mr-3" />
                        ) : (
                          <Minimize2 className="w-4 h-4 mr-3" />
                        )}{" "}
                        {isMinimized ? "Expand" : "Minimize"}
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(!showSettings);
                          setShowOptionsMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium"
                      >
                        <Settings className="w-4 h-4 mr-3" /> Settings
                      </button>
                      <button
                        onClick={exportChat}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium"
                      >
                        <Download className="w-4 h-4 mr-3" /> Export Chat
                      </button>
                      <button
                        onClick={() => {
                          setShowClearConfirmation(true);
                          setShowOptionsMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-3" /> Clear History
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleChat}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* --- SEARCH & SETTINGS --- */}
          {showSearch && !isMinimized && (
            <div
              className={`p-3 border-b ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-200"}`}
            >
              <div className="relative">
                <Search
                  className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"} focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-sm`}
                />
              </div>
            </div>
          )}
          {showSettings && !isMinimized && (
            <div
              className={`p-4 border-b ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-200"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Settings</h4>
                <button onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Volume2 className="w-4 h-4 mr-2" /> Sound Effects
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${soundEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${soundEnabled ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                  </div>
                  <button
                    onClick={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                    className={`w-11 h-6 rounded-full relative transition-colors ${notificationsEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationsEnabled ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <ChevronDown className="w-4 h-4 mr-2" /> Auto-scroll
                  </div>
                  <button
                    onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${autoScrollEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoScrollEnabled ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- MESSAGES AREA --- */}
          {!isMinimized && (
            <>
              <div
                className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth pb-24 ${darkMode ? "bg-slate-950/50" : "bg-slate-50/50"}`}
              >
                {filteredMessages.length === 0 && searchQuery ? (
                  <div className="text-center py-10 text-sm opacity-50">
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`flex items-end gap-2.5 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white shadow-md ${message.role === "user" ? "bg-slate-700" : "bg-gradient-to-tr from-blue-500 to-indigo-600"}`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <Bot className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`relative px-4 py-3 shadow-sm text-sm md:text-base leading-relaxed break-words
                                                    ${
                                                      message.role === "user"
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                                        : message.isError
                                                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-2xl rounded-tl-sm"
                                                          : `${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border rounded-2xl rounded-tl-sm`
                                                    }`}
                        >
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {/* Timestamp & Actions */}
                          <div
                            className={`flex items-center gap-2 mt-2 ${message.role === "user" ? "justify-end text-blue-100 opacity-80" : "justify-between"}`}
                          >
                            <span className="text-[10px] opacity-60">
                              {formatTimestamp(message.timestamp)}
                            </span>
                            {message.role === "user" &&
                              (message.read ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              ))}
                          </div>

                          {/* Hover Actions */}
                          {!message.isError && (
                            <div
                              className={`flex gap-2 mt-2 ${message.role === "user" ? "justify-end" : ""}`}
                            >
                              <button
                                onClick={() =>
                                  handleReaction(message.id, "like")
                                }
                                className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${likedMessageIds.has(message.id) ? "text-blue-400" : "opacity-50"}`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  copyMessage(message.id, message.content)
                                }
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 opacity-50"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* --- RICH QUICK ACTIONS --- */}
                {showQuickActions && messages.length === 1 && (
                  <div className="mt-8 animate-fade-in">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4 text-center">
                      Popular Topics
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {QUICK_ACTIONS.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(action.query)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.01] hover:shadow-md group
                                                        ${darkMode ? "bg-slate-800/80 border-slate-700 hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-lg ${action.color === "blue" ? "bg-blue-100 text-blue-600" : action.color === "purple" ? "bg-purple-100 text-purple-600" : action.color === "green" ? "bg-green-100 text-green-600" : action.color === "red" ? "bg-red-100 text-red-600" : action.color === "yellow" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"}`}
                            >
                              {action.icon}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-bold opacity-90 group-hover:opacity-100">
                                {action.text}
                              </span>
                              <span className="text-xs opacity-50 group-hover:opacity-70">
                                {action.desc}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`flex items-end gap-2.5`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <Bot className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                      >
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <div className={`flex items-end gap-2.5`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <Bot className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shadow-sm max-w-[90%]">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Error</p>
                            <p className="text-xs mt-1 opacity-90">{error}</p>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={retryLastMessage}
                                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md px-2 py-1.5"
                              >
                                Retry
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll To Bottom Button */}
              {showScrollToBottom && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-24 right-4 md:right-6 p-2.5 rounded-full shadow-lg border ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'} animate-bounce z-20"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* --- INPUT AREA (Sticky Bottom) --- */}
              <div
                className={`p-3 md:p-4 border-t ${darkMode ? "bg-slate-900/95 border-slate-800 backdrop-blur-xl" : "bg-white/95 border-slate-200 backdrop-blur-xl"}`}
              >
                <div className="flex items-end gap-2 md:gap-3">
                  <button
                    className={`hidden md:flex p-3 rounded-full ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors flex-shrink-0`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="relative flex-1 flex-shrink-0">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className={`w-full border rounded-2xl px-4 py-3 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all
                                                ${darkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-100 border-transparent text-slate-900 placeholder-slate-400"}
                                            `}
                      disabled={isLoading}
                      rows={1}
                      style={{ minHeight: "48px", maxHeight: "150px" }}
                    />
                    {input.trim() === "" && (
                      <div
                        className={`absolute right-3 top-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                      >
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-full flex-shrink-0 transition-colors ${isRecording ? "bg-red-500 text-white animate-pulse" : darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || input.trim() === ""}
                    className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p
                  className={`text-[10px] md:text-xs text-center mt-2 opacity-40 flex items-center justify-center`}
                >
                  <Zap className="w-3 h-3 mr-1" /> BooleanForce AI
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- FULL-SCREEN MOBILE MODALS --- */}
      {showRatingDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <h3 className="text-xl font-bold mb-2">Rate this conversation</h3>
            <p
              className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              How was your experience?
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <StarIcon
                    className={`w-8 h-8 transition-colors ${star <= rating ? "text-amber-500 fill-current" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRatingDialog(false)}
                className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <h3 className="text-xl font-bold mb-4 text-red-500">
              Clear chat history?
            </h3>
            <p
              className={`text-sm mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
            >
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearChatHistory}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
