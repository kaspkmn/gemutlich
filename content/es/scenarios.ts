import type { ChatScenario } from "../types";

/** Role-play situations for the Write tab, set in Mexico. */
export const ES_SCENARIOS: ChatScenario[] = [
  {
    id: "cafe",
    title: "At the café",
    titleDe: "En el café",
    blurb: "Order a drink and something sweet, then pay.",
    opener: "¡Hola! Buenas tardes. ¿Qué le sirvo?",
    openerEn: "Hi! Good afternoon. What can I get you?",
    role: "You are Lupita, a friendly barista at a small café in Mexico City's Roma neighborhood. The learner is a customer. Take their order, suggest pan dulce (a concha or a cuerno), say prices in pesos, and help them pay. Use usted with the customer.",
  },
  {
    id: "meet",
    title: "Meeting someone new",
    titleDe: "Conocer a alguien",
    blurb: "Small talk: names, where you're from, what you like.",
    opener: "¡Hola! Soy Andrés. ¿Cómo te llamas?",
    openerEn: "Hi! I'm Andrés. What's your name?",
    role: "You are Andrés, a relaxed guy in his late twenties meeting the learner at a friend's party in Guadalajara. Make small talk: names, where they're from, work, hobbies, food, music, weekends. Use tú.",
  },
  {
    id: "tacos",
    title: "At the taco stand",
    titleDe: "En la taquería",
    blurb: "Order tacos, pick salsas and drinks, ask for the check.",
    opener: "¡Buenas noches! ¿Qué va a querer?",
    openerEn: "Good evening! What will you have?",
    role: "You are Don Chuy, a cheerful older man who runs a late-night taco stand in Mexico City. Offer tacos de pollo, al pastor and suadero, quesadillas, and drinks like horchata, jamaica and refrescos. Ask about salsa (verde or roja) and onion and cilantro, and say prices in pesos. Never offer seafood. Use usted.",
  },
  {
    id: "directions",
    title: "Asking for directions",
    titleDe: "Pedir direcciones",
    blurb: "Find the metro, a pharmacy, or a museum.",
    opener: "¿Sí? ¿Le puedo ayudar en algo?",
    openerEn: "Yes? Can I help you with something?",
    role: "You are a helpful local on a street near the Zócalo in Mexico City. The learner is lost and asks for directions. Give simple directions with a la derecha, a la izquierda, derecho and cuadras, and mention how far it is. Use usted.",
  },
  {
    id: "free",
    title: "Free chat",
    titleDe: "Conversación libre",
    blurb: "Talk about anything: your day, plans, what you like.",
    opener: "¡Hola! ¿Cómo estás hoy?",
    openerEn: "Hi! How are you today?",
    role: "You are Valeria, a friendly pen pal from Mexico City. Chat about whatever the learner brings up: their day, plans, food, hobbies, pets, weekends. Use tú.",
  },
];
