
import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
Eres "El Boti Amigo", un asistente virtual experto en carretes, fiestas y coctelería chilena para la app "Salvando La Noche".
Tu tono es divertido, coloquial chileno (pero respetuoso), y experto en licores.
Tu objetivo es recomendar productos de una botillería, sugerir mezclas (piscolas, terremotos, mojitos) y ayudar a armar la previa.

INFORMACIÓN IMPORTANTE DEL NEGOCIO:
- Fonocopete / WhatsApp Oficial: +56 9 2897 3426.
- Producto Estrella: Pack de 6 Cervezas Corona a $15.000.
- Oferta Popular: Pack de 6 Latas Cristal a $12.000.

Si te preguntan por contacto, da el WhatsApp.
Si te preguntan por precios específicos que no sean los de arriba, di que pueden variar pero que busquen en el catálogo de la app.
Mantén las respuestas breves y útiles (máximo 1 párrafo).
`;

const getApiKey = () => process.env.API_KEY || '';

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;
  
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
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

export const generateImagePrompt = async (productName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      Act as an expert prompt engineer for AI image generators (like Pollinations/Midjourney).
      Create a precise, descriptive prompt in ENGLISH for the product: "${productName}".

      SPECIFIC INSTRUCTIONS:
      1. If the product is CIGARETTES ("cigarros", "cajetilla"): Describe a realistic standard cigarette pack box. EXPLICITLY state that the package has the brand name "${productName}" written clearly on the box.
      2. If the product is ALCOHOL/BEER: Describe the specific bottle or can shape associated with this type of drink. EXPLICITLY state that the label features the text "${productName}".
      3. VISUAL STYLE: Professional product photography, 8k resolution, sharp focus, cinematic lighting, neon/nightclub background blurred (bokeh).
      4. OUTPUT: Return ONLY the English prompt string. No introduction, no quotes.
      `,
    });
    return response.text || `${productName} product packaging professional photography neon background`;
  } catch (error) {
    console.error("Error generating prompt:", error);
    return `${productName} bottle professional photography dark background`;
  }
};

export const analyzeVoucherImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Clean base64 string if it has the data prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analiza este comprobante de transferencia bancaria. Extrae los siguientes datos y formatéalos en un texto muy breve y claro para enviar por WhatsApp: Banco de origen, Banco de destino, Monto transferido, Fecha/Hora y Número de operación o Folio. Si no parece un comprobante, dilo. Formato ejemplo: '✅ Transferencia Detectada: Banco Estado -> Santander. Monto: $10.000. Fecha: 12/10. Folio: 12345'."
          }
        ]
      }
    });

    return response.text || "No pude leer el comprobante automáticamente.";
  } catch (error) {
    console.error("Error analyzing voucher:", error);
    return "Error al analizar la imagen con IA.";
  }
};
