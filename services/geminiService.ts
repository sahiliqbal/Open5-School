import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getClient = () => {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getTutorResponse = async (
    courseTitle: string,
    query: string,
    history: { role: string; text: string }[] = [],
    customSystemInstruction?: string
): Promise<string> => {
    try {
        const ai = getClient();
        
        // Construct a context-aware system instruction or use provided one
        const defaultSystemInstruction = `You are an expert tutor specializing in ${courseTitle}. 
        Your goal is to help the student understand concepts clearly and concisely. 
        Keep your answers encouraging, educational, and suitable for a mobile app interface (keep it relatively brief unless asked for detail).
        Use markdown for formatting if needed.`;

        const systemInstruction = customSystemInstruction || defaultSystemInstruction;

        const model = "gemini-2.5-flash";

        // Create a chat session with the configured system instruction
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const response: GenerateContentResponse = await chat.sendMessage({
             message: query 
        });

        return response.text || "I'm sorry, I couldn't generate a response at the moment.";

    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        return "I'm having trouble connecting to the tutor network. Please check your internet connection.";
    }
};

export interface TrafficUpdate {
    text: string;
    mapUri?: string;
    sourceTitle?: string;
}

export const getTrafficInsight = async (location: string, lat?: number, lng?: number): Promise<TrafficUpdate> => {
    try {
        const ai = getClient();
        
        const requestConfig: any = {
            tools: [{ googleMaps: {} }],
        };

        // If coordinates are provided, ground the query to that specific location
        if (lat && lng) {
            requestConfig.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: lat,
                        longitude: lng
                    }
                }
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `What are the current traffic conditions around ${location}? Provide a very concise summary (max 2 sentences) suitable for a school bus tracker.`,
            config: requestConfig
        });
        
        const text = response.text || "Traffic info unavailable.";
        
        // Extract Grounding URI from groundingChunks if available
        let mapUri: string | undefined;
        let sourceTitle: string | undefined;

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
            // Iterate to find a valid web uri or maps uri
            for (const chunk of chunks) {
                // Check specifically for maps provider or web provider that has a URI
                if (chunk.web?.uri) {
                    mapUri = chunk.web.uri;
                    sourceTitle = chunk.web.title;
                    break;
                }
                // Sometimes maps data is structured differently, check for any valid URI
                if ((chunk as any).maps?.uri) {
                    mapUri = (chunk as any).maps.uri;
                    break;
                }
            }
        }

        return {
            text,
            mapUri,
            sourceTitle
        };

    } catch (error) {
        console.error("Traffic API Error:", error);
        return { text: "Unable to connect to live traffic updates." };
    }
};