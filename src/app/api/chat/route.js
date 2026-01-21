import axios from 'axios';
import { NextResponse } from 'next/server';


// System prompt for the AI assistant
const OPENROUTER_SYSTEM_PROMPT = `
You are a helpful and expert assistant for booleanforce. Your knowledge base is exclusively about booleanforce services.
Your persona should be friendly, professional, and highly knowledgeable.

You can answer questions about:
- What booleanforce is and its core mission
- The services offered by booleanforce (web development, brand identity, ERP solutions, POS systems, etc.)
- How to get started with booleanforce services
- The benefits of using booleanforce services
- Technical details about booleanforce solutions
- Pricing and packages (if available)

Guidelines:
- Always be helpful and professional
- If a question is not about booleanforce, politely state that you can only answer questions related to booleanforce services
- Provide detailed and informative answers
- If you don't know something, be honest about it
- Keep responses concise but comprehensive
- Use a friendly but professional tone
`;

// List of available models to try in order
const AVAILABLE_MODELS = [
    'meta-llama/llama-3-70b-instruct:free',
    'microsoft/wizardlm-2-8x22b:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-7b-it:free',
    'meta-llama/llama-3-8b-instruct', // Try without :free
    'anthropic/claude-3-haiku',
    'openai/gpt-3.5-turbo'
];

export async function POST(request) {
    try {
        // Parse the request body
        const { messages } = await request.json();

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages array is required and cannot be empty' },
                { status: 400 }
            );
        }

        // Validate message structure
        const isValidMessage = messages.every(msg =>
            msg &&
            typeof msg === 'object' &&
            typeof msg.role === 'string' &&
            typeof msg.content === 'string' &&
            ['user', 'assistant', 'system'].includes(msg.role)
        );

        if (!isValidMessage) {
            return NextResponse.json(
                { error: 'Invalid message format. Each message must have role and content properties.' },
                { status: 400 }
            );
        }

        // Check if OpenRouter API key is configured
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error('OpenRouter API key is not configured');
            return NextResponse.json(
                { error: 'AI service is not properly configured. Please contact support.' },
                { status: 500 }
            );
        }

        // Validate API key format (OpenRouter keys typically start with 'sk-or-v1-')
        if (!apiKey.startsWith('sk-or-v1-') && !apiKey.startsWith('sk-or-')) {
            console.error('OpenRouter API key format appears to be invalid');
            return NextResponse.json(
                { error: 'AI service configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // Prepare the messages for OpenRouter API
        const apiMessages = [
            { role: 'system', content: OPENROUTER_SYSTEM_PROMPT },
            ...messages
        ];

        console.log('Sending request to OpenRouter with messages:', apiMessages);

        // Try each model until one works
        let lastError = null;
        let botReply = null;
        let successfulModel = null;

        for (const model of AVAILABLE_MODELS) {
            try {
                console.log(`Trying model: ${model}`);

                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: model,
                        messages: apiMessages,
                        max_tokens: 1000, // Limit response length
                        temperature: 0.7, // Balance between creativity and consistency
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'HTTP-Referer': process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://boolean-force.vercel.app',
                            'X-Title': 'Booleanforce Expert Chatbot',
                            'Content-Type': 'application/json',
                        },
                        timeout: 30000, // 30 second timeout
                    }
                );

                // Extract the AI response
                botReply = response.data.choices[0]?.message?.content;
                successfulModel = model;

                if (botReply) {
                    console.log(`Successfully used model: ${model}`);
                    break;
                }
            } catch (error) {
                const errorData = error.response?.data || {};
                const errorMessage = errorData.error?.message || error.message;
                const errorCode = error.response?.status || error.code;
                
                console.error(`Error with model ${model}:`, {
                    message: errorMessage,
                    code: errorCode,
                    status: error.response?.status,
                    data: errorData
                });
                
                lastError = error;
                
                // If it's a 401 error, it's likely an authentication issue - don't try other models
                if (error.response?.status === 401) {
                    console.error('Authentication failed - API key may be invalid or expired');
                    break; // Stop trying other models if auth fails
                }
                
                // Continue to the next model for other errors
            }
        }

        if (!botReply) {
            const lastErrorData = lastError?.response?.data || {};
            const lastErrorMessage = lastErrorData.error?.message || lastError?.message;
            const lastErrorStatus = lastError?.response?.status;
            
            console.error('All models failed. Last error:', {
                message: lastErrorMessage,
                status: lastErrorStatus,
                data: lastErrorData
            });
            
            // Provide more specific error messages
            if (lastErrorStatus === 401) {
                return NextResponse.json(
                    { 
                        error: 'AI service authentication failed. The API key may be invalid or expired. Please contact support.',
                        details: 'Authentication error (401)'
                    },
                    { status: 500 }
                );
            }
            
            if (lastErrorStatus === 429) {
                return NextResponse.json(
                    { 
                        error: 'AI service is currently rate-limited. Please try again in a moment.',
                        details: 'Rate limit exceeded (429)'
                    },
                    { status: 429 }
                );
            }
            
            return NextResponse.json(
                { 
                    error: 'All AI models are currently unavailable. Please try again later.',
                    details: lastErrorMessage || 'Unknown error'
                },
                { status: 500 }
            );
        }

        console.log('Received response from OpenRouter using model:', successfulModel);

        // Return the successful response
        return NextResponse.json({
            message: botReply,
            model: successfulModel // Include which model was used for debugging
        });

    } catch (error) {
        // Enhanced error logging
        console.error('Error calling OpenRouter API:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            return NextResponse.json(
                { error: 'AI service authentication failed. Please contact support.' },
                { status: 500 }
            );
        }

        if (error.response?.status === 429) {
            return NextResponse.json(
                { error: 'AI service is currently busy. Please try again in a moment.' },
                { status: 429 }
            );
        }

        if (error.response?.status === 404) {
            return NextResponse.json(
                { error: 'AI model not available. Please try again later.' },
                { status: 500 }
            );
        }

        // Generic error response
        return NextResponse.json(
            { error: 'Failed to get response from AI. Please try again later.' },
            { status: 500 }
        );
    }
}

// Handle unsupported HTTP methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}