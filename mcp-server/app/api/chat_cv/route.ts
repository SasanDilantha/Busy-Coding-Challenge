import { NextResponse } from 'next/server';
import { Ollama } from '@langchain/ollama';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { parseResume } from '../../../lib/parseResume';

interface ChatRequest {
  question: string;
  useImage?: boolean;
}

const llm = new Ollama({
  model: 'gemma3n:4b',
  baseUrl: 'http://ollama:11434',
  temperature: 0.7,
});

const prompt = PromptTemplate.fromTemplate(
  'Based on this resume text: {resume_text}\n{image_prompt}\nAnswer the question: {question}. Use multimodal understanding if image is provided.'
);

const chain = new LLMChain({ llm, prompt });

export async function POST(request: Request) {
  try {
    const { question, useImage = false } = (await request.json()) as ChatRequest;
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    const { text: resumeText, image } = await parseResume(useImage);
    let imagePrompt = '';
    if (image) {
      imagePrompt = `And analyze this resume image: <image_data>${image}</image_data>`;
    }
    const response = await chain.run({
      question,
      resume_text: resumeText.slice(0, 2000),
      image_prompt: imagePrompt,
    });
    return NextResponse.json({ answer: response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}