'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, HelpCircle, Briefcase, Palette, Globe, Cpu, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';

const QUICK_ACTIONS = [
    { icon: <Briefcase className="w-4 h-4" />, text: "Tell me about your services", query: "What services does booleanforce offer?" },
    { icon: <Palette className="w-4 h-4" />, text: "Brand Identity", query: "Tell me about your brand visual identity services" },
    { icon: <Globe className="w-4 h-4" />, text: "Website Development", query: "What kind of websites do you develop?" },
    { icon: <Cpu className="w-4 h-4" />, text: "ERP Solutions", query: "How can your ERP solutions help my business?" },
    { icon: <ShoppingBag className="w-4 h-4" />, text: "POS Systems", query: "What features do your POS systems have?" },
    { icon: <HelpCircle className="w-4 h-4" />, text: "How to get started?", query: "How can I get started with booleanforce services?" }
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 0,
            role: 'assistant',
            content: 'Hello! I\'m here to help you learn about booleanforce services. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [error, setError] = useState(null);
    const [messageIdCounter, setMessageIdCounter] = useState(1);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async (messageText) => {
        const messageToSend = messageText || input;
        if (messageToSend.trim() === '' || isLoading) return;

        setError(null);

        const messageId = messageIdCounter;
        setMessageIdCounter(prev => prev + 1);

        const userMessage = {
            id: messageId,
            role: 'user',
            content: messageToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setShowQuickActions(false);
        setIsLoading(true);

        try {
            console.log('Sending message:', messageToSend);

            // Prepare messages for API (excluding system messages and only including role and content)
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

            const assistantMessage = {
                id: messageId + 1000,
                role: 'assistant',
                content: data.message,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);

            const errorMessage = {
                id: messageId + 2000,
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
                timestamp: new Date(),
                isError: true
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
                timestamp: new Date()
            }
        ]);
        setShowQuickActions(true);
        setError(null);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Bot className="w-5 h-5 mr-2" />
                            <h3 className="font-semibold">booleanforce Assistant</h3>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={resetChat}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors mr-2"
                                title="Reset chat"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleChat}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.isError
                                            ? 'bg-red-50 border border-red-200 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        {message.role === 'assistant' && (
                                            <Bot className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${message.isError ? 'text-red-600' : ''}`} />
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        {message.role === 'user' && (
                                            <User className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="text-xs mt-1 opacity-70">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Quick Actions */}
                        {showQuickActions && messages.length === 1 && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">You can ask me about:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {QUICK_ACTIONS.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.query)}
                                            className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 rounded-md p-2 transition-colors"
                                        >
                                            <span className="mr-1 text-blue-600">{action.icon}</span>
                                            <span className="text-left">{action.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                                    <div className="flex items-center">
                                        <Bot className="w-4 h-4 mr-2" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="flex justify-start">
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 max-w-[80%]">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Error occurred</p>
                                            <p className="text-xs mt-1">{error}</p>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={retryLastMessage}
                                                    className="text-xs text-red-600 hover:text-red-800 underline"
                                                >
                                                    Try again
                                                </button>
                                                <button
                                                    onClick={resetChat}
                                                    className="text-xs text-red-600 hover:text-red-800 underline"
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
                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-center">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about our services..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                                disabled={isLoading}
                                rows={1}
                                style={{ minHeight: '36px', maxHeight: '120px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                }}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || input.trim() === ''}
                                className="ml-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat button */}
            <button
                onClick={toggleChat}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;