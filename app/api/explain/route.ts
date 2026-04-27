import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { code, line, scope, stack } = await req.json();

    const prompt = `
      You are an expert programming educator. Explain the current step of code execution.
      
      CODE:
      ${code}
      
      CURRENT STEP:
      - Line Number: ${line}
      - Variables in Scope: ${JSON.stringify(scope)}
      - Call Stack: ${JSON.stringify(stack)}
      
      Explain:
      1. What is happening on this line?
      2. Why did the variables change (or not change)?
      3. What will happen next?
      
      Keep the explanation concise, encouraging, and clear for a beginner.
      Use Markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text });
  } catch (error: any) {
    console.error("AI Explanation Error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
