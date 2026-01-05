import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
Eres "El Boti Amigo", un asistente virtual experto en carretes, fiestas y coctelería chilena para la app "Salvando La Noche".
Tu tono es divertido, coloquial chileno (pero respetuoso), y experto en licores.
Tu objetivo es recomendar productos de una botillería, sugerir mezclas (piscolas, terremotos, mojitos) y ayudar a armar la previa.
Si te preguntan por precios específicos, di que pueden variar pero que busquen en el catálogo de la app.
Mantén las respuestas breves y útiles (máximo 1 párrafo).
`;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY || ''; 
  // Note: In a real app, handle missing API key gracefully. 
  // Here we assume it might be missing and the UI should handle the error if calls fail.
  
  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = initializeChat();
    const response = await chat.sendMessage({ message });
    return response.text || "¡Salud! No pude procesar eso, ¿intentamos de nuevo?";
  } catch (error) {
    console.error("Error talking to Gemini:", error);
    return "Ups, parece que me tomé uno de más. Hubo un error al conectar con el cerebro digital. Intenta más tarde.";
  }
};