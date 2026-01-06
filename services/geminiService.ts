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

// --- RUT VALIDATION LOGIC (Modulo 11) ---
const validateRutChile = (rut: string): boolean => {
  if (!rut || rut.trim().length < 3) return false;
  
  // Limpiar el RUT de puntos y guiones
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  if (cleanRut.length < 2) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  let calculatedDv = '';
  
  if (expectedDv === 11) calculatedDv = '0';
  else if (expectedDv === 10) calculatedDv = 'K';
  else calculatedDv = expectedDv.toString();

  return calculatedDv === dv;
};

export const analyzeVoucherImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Clean base64 string
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
            text: "Analiza este comprobante de transferencia bancaria. Extrae TODOS los datos posibles: Banco origen, Banco destino, Monto, Fecha, Folio y especialmente el RUT del ordenante (quien transfiere). Formato de salida: Texto plano resumiendo los datos."
          }
        ]
      }
    });

    const text = response.text || "No pude leer el comprobante.";

    // Intentar encontrar y validar RUTs en la respuesta de la IA
    // Regex simple para encontrar patrones parecidos a RUTs (12.345.678-9 o 12345678-9)
    const rutRegex = /(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])/g;
    const foundRuts = text.match(rutRegex);
    
    let validationMsg = "";
    
    if (foundRuts && foundRuts.length > 0) {
      const validRuts = foundRuts.filter(r => validateRutChile(r));
      if (validRuts.length > 0) {
        validationMsg = ` [RUT Valido: ${validRuts[0]}]`;
      } else {
        validationMsg = ` [RUT Detectado pero Inválido]`;
      }
    } else {
      validationMsg = " [Sin RUT visible]";
    }

    return text + validationMsg;

  } catch (error) {
    console.error("Error analyzing voucher:", error);
    return "Error al analizar la imagen con IA.";
  }
};

export const prepareOrderMessage = async (orderDetails: any): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Prompt simplificado: Sin teléfono de cliente, solo lo esencial.
    const prompt = `
    Act as a sales assistant for "Salvando La Noche".
    Create a VERY SIMPLE, CLEAN WhatsApp message in Spanish.
    
    DATA:
    Store: ${orderDetails.storeName}
    Client Name: ${orderDetails.customerName}
    Items: ${orderDetails.items.join(", ")}
    Subtotal: ${orderDetails.subtotal}
    Is Delivery: ${orderDetails.isDelivery}
    Address: ${orderDetails.address}
    Total: ${orderDetails.total}
    Payment Method: ${orderDetails.paymentMethod}
    Voucher Text Analysis: ${orderDetails.voucherAnalysis || "N/A"}

    OUTPUT FORMAT:
    Hola *${orderDetails.storeName}*! Nuevo Pedido 🛒
    Cliente: ${orderDetails.customerName}
    
    [List of Items]
    
    Total: $${orderDetails.total}
    Entrega: ${orderDetails.isDelivery ? "Delivery 🛵 a " + orderDetails.address : "Retiro en Local 🏪"}
    Pago: ${orderDetails.paymentMethod}
    
    ${orderDetails.voucherAnalysis ? "--- DATOS VOUCHER ---\n" + orderDetails.voucherAnalysis : ""}

    DO NOT include the client's phone number.
    DO NOT use markdown on numbers.
    Return ONLY the text string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || "Error generando mensaje.";
  } catch (error) {
    console.error("Error preparing message:", error);
    // Fallback manual seguro y simple
    return `Hola ${orderDetails.storeName}, soy ${orderDetails.customerName}. Mi pedido es: ${orderDetails.items.join(", ")}. Total: $${orderDetails.total}. ${orderDetails.voucherAnalysis ? "Datos Pago: " + orderDetails.voucherAnalysis : ""}`;
  }
};