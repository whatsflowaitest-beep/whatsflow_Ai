import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
  /**
   * Get response from OpenAI
   */
  static async getOpenAIResponse(prompt: string, context: string = '') {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are a helpful WhatsApp assistant. Context: ${context}` },
          { role: 'user', content: prompt },
        ],
      });
      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw error;
    }
  }

  /**
   * Get response from Gemini
   */
  static async getGeminiResponse(prompt: string, context: string = '') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const fullPrompt = `Context: ${context}\n\nUser Question: ${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for RAG (using OpenAI)
   */
  static async generateEmbeddings(text: string) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('Embedding Error:', error);
      throw error;
    }
  }
}
