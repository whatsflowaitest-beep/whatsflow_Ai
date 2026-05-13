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

// Groq Configuration (using standard OpenAI client structure)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// OpenRouter Configuration
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "https://whatsflow.ai", // Site URL
    "X-Title": "WhatsFlow AI", // Site Name
  }
});

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
   * Get response from Groq (Ultra Fast)
   */
  static async getGroqResponse(prompt: string, context: string = '', model: string = 'qwen/qwen3-32b') {
    try {
      try {
        const response = await groq.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: prompt },
          ],
          temperature: 0.6,
          max_completion_tokens: 4096,
          top_p: 0.95,
        } as any);
        
        return response.choices[0]?.message?.content || 'No response generated';
      } catch (modelError) {
        console.warn(`[AIService] Model ${model} failed, attempting fallback to llama-3.3-70b-versatile...`);
        const fallback = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1024,
        });
        return fallback.choices[0]?.message?.content || 'No response generated';
      }
    } catch (error) {
      console.error('Groq Error:', error);
      throw error;
    }
  }

  /**
   * Get response from OpenRouter
   */
  static async getOpenRouterResponse(prompt: string, context: string = '', model: string = 'google/gemini-flash-1.5') {
    try {
      const response = await openrouter.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
      });
      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenRouter Error:', error);
      throw error;
    }
  }

  /**
   * Helper to map frontend model IDs to OpenRouter standard IDs
   */
  private static mapToOpenRouterModel(modelStr: string): string {
    const m = modelStr.toLowerCase();
    
    // OpenAI
    if (m.includes('gpt-4o-mini')) return 'openai/gpt-4o-mini';
    if (m.includes('gpt-4o')) return 'openai/gpt-4o';
    if (m.includes('o1-preview')) return 'openai/o1-preview';
    if (m.includes('o1-mini')) return 'openai/o1-mini';
    if (m.includes('gpt-4-turbo')) return 'openai/gpt-4-turbo';
    if (m.includes('gpt-3.5')) return 'openai/gpt-3.5-turbo';

    // Anthropic
    if (m.includes('claude-3-5-sonnet')) return 'anthropic/claude-3.5-sonnet';
    if (m.includes('claude-3-5-haiku')) return 'anthropic/claude-3.5-haiku';
    if (m.includes('claude-3-opus')) return 'anthropic/claude-3-opus';

    // Meta
    if (m.includes('llama-3-1-70b')) return 'meta-llama/llama-3.1-70b-instruct';
    if (m.includes('llama-3-1-8b')) return 'meta-llama/llama-3.1-8b-instruct';
    if (m.includes('llama-3.3-70b')) return 'meta-llama/llama-3.3-70b-instruct';

    // DeepSeek
    if (m.includes('deepseek-chat')) return 'deepseek/deepseek-chat';
    if (m.includes('deepseek-coder')) return 'deepseek/deepseek-coder';

    // Grok
    if (m.includes('grok-2')) return 'x-ai/grok-2';

    // Perplexity
    if (m.includes('sonar-small')) return 'perplexity/sonar-small-chat';
    if (m.includes('sonar-medium')) return 'perplexity/sonar-medium-chat';

    // Default / Fallback via OpenRouter
    return 'google/gemini-flash-1.5';
  }

  /**
   * Get a response from an AI agent persona (with conversation history).
   * Production-hardened: timeout, structured logging, provider fallback chain.
   */
  static async getAgentResponse(
    message:      string,
    systemPrompt: string,
    history:      { role: 'user' | 'assistant'; content: string }[] = [],
    modelStr:     string = 'gemini-1.5-flash'
  ): Promise<string> {
    const normalized = (modelStr || '').toLowerCase()
    const AI_TIMEOUT = parseInt(process.env.AI_RESPONSE_TIMEOUT_MS ?? '20000', 10)

    // Wrap with timeout so a slow provider never blocks the queue worker
    async function withTimeout<T>(fn: () => Promise<T>, label: string): Promise<T> {
      let timer: ReturnType<typeof setTimeout>
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${AI_TIMEOUT}ms`)), AI_TIMEOUT)
      })
      try {
        const result = await Promise.race([fn(), timeout])
        clearTimeout(timer!)
        return result
      } catch (err) {
        clearTimeout(timer!)
        throw err
      }
    }

    try {
      // Route 1: Gemini
      if (normalized.includes('gemini')) {
        const targetModel = normalized.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash'
        const gModel = genAI.getGenerativeModel({ model: targetModel })

        let ctx = `${systemPrompt}\n\n`
        if (history.length > 0) {
          ctx += 'Conversation History:\n'
          history.forEach((h) => { ctx += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}\n` })
          ctx += '\n'
        }
        ctx += `User: ${message}\nAssistant:`

        return await withTimeout(() => gModel.generateContent(ctx).then((r) => r.response.text()), 'Gemini')
      }

      // Route 2: OpenAI GPT
      const hasOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('your_')
      if (hasOpenAI && (normalized.includes('gpt') || normalized.includes('openai'))) {
        const res = await withTimeout(
          () => openai.chat.completions.create({
            model:      'gpt-4o',
            messages:   [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: message }],
            max_tokens: 500,
          }),
          'OpenAI'
        )
        return res.choices[0]?.message?.content ?? 'No response'
      }

      // Route 3: Groq
      if (normalized.includes('llama') || normalized.includes('groq')) {
        const groqModel = normalized.includes('instant') ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile'
        const res = await withTimeout(
          () => groq.chat.completions.create({
            model:      groqModel,
            messages:   [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: message }],
            max_tokens: 500,
          }),
          'Groq'
        )
        return res.choices[0]?.message?.content ?? 'No response'
      }

      // Route 4: OpenRouter
      if (process.env.OPENROUTER_API_KEY) {
        const orModel = this.mapToOpenRouterModel(normalized)
        const res = await withTimeout(
          () => openrouter.chat.completions.create({
            model:      orModel,
            messages:   [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: message }],
            max_tokens: 800,
          }),
          'OpenRouter'
        )
        return res.choices[0]?.message?.content ?? 'No response'
      }

      // Route 5: Gemini default
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      return await withTimeout(
        () => fallbackModel.generateContent(`${systemPrompt}\n\nUser: ${message}\nAssistant:`).then((r) => r.response.text()),
        'Gemini-default'
      )

    } catch (error) {
      console.error('[AIService] Primary routing failed:', (error as Error).message)

      // Final safety fallback — never throw to the queue worker
      try {
        const emergency = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await Promise.race([
          emergency.generateContent(`${systemPrompt}\n\nUser: ${message}\nAssistant:`),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Emergency timeout')), 10_000))
        ])
        return (result as Awaited<ReturnType<typeof emergency.generateContent>>).response.text()
          || 'Our AI assistant is temporarily unavailable. A team member will be in touch shortly.'
      } catch {
        return 'Our AI assistant is temporarily unavailable. A team member will be in touch shortly.'
      }
    }
  }

  /**
   * Analyze conversation history to determine the appropriate Lead Stage automatically.
   * Helps move leads through the pipeline (New -> Contacted -> Qualifying -> ... -> Booked)
   */
  static async evaluateLeadStage(
    history: { role: 'user' | 'assistant'; content: string }[],
    currentStage: string
  ): Promise<string | null> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const validStages = ['New', 'Contacted', 'Qualifying', 'Qualified', 'Proposal', 'Booked', 'Lost'];
      
      const systemPrompt = `You are a CRM AI. Analyze this conversation history between our business assistant and a potential lead (user) to determine the most accurate lead stage.
      
Available pipeline stages:
- "New": Just reached out.
- "Contacted": The lead has replied to our initial message.
- "Qualifying": The assistant is learning requirements or the lead is asking about prices, services, availability.
- "Qualified": Lead exhibits high intent and matches core product/service parameters.
- "Proposal": An explicit proposal, quote, price estimate, or booking appointment link has been provided.
- "Booked": User confirmed they have scheduled the meeting, placed order, or paid.
- "Lost": Lead said they are not interested or opted out.

Current Stage: "${currentStage}"

Instructions:
1. Carefully analyze the full text.
2. Choose the BEST stage from the list: ${validStages.join(', ')}.
3. Output ONLY the exact word of the selected stage. Do not write a sentence, do not wrap in punctuation.
4. If no shift in intent occurred, or you are unsure, output "${currentStage}".`;

      let context = `${systemPrompt}\n\nRecent Conversation:\n`;
      history.forEach((h) => {
        context += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}\n`;
      });
      context += `\nOutput exactly one word for the stage:`;

      const response = await Promise.race([
        model.generateContent(context).then((r) => r.response.text()),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('AI stage analysis timeout')), 6000))
      ]);

      const parsed = response.replace(/["'`.!]/g, '').trim();
      
      // Match to valid options case-insensitively
      const matched = validStages.find(s => s.toLowerCase() === parsed.toLowerCase());
      
      if (matched && matched.toLowerCase() !== currentStage.toLowerCase()) {
        console.log(`[AIService] Auto-stage changed for lead from "${currentStage}" -> "${matched}"`);
        return matched;
      }
      
      return null;
    } catch (err) {
      console.warn('[AIService] evaluateLeadStage failed safely:', (err as Error).message);
      return null;
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
