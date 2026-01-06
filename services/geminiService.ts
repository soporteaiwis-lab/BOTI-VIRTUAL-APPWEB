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
      contents: `Describe visualmente el producto de licor o snack llamado "${productName}" para generar una imagen publicitaria de alta calidad. 
      La descripción debe ser en Inglés (para el generador de imágenes), corta, detallada y atractiva.
      Estilo: Fotografía de producto profesional, iluminación de estudio, fondo oscuro de bar elegante o luces de neón desenfocadas.
      Solo devuelve la descripción en inglés, nada más.`,
    });
    return response.text || `${productName} alcoholic beverage professional product photography neon background`;
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