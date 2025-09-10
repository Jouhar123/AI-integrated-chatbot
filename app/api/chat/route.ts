

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Use a Gemini model (free tier supports gemini-1.5-flash and others)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error fetching response from Gemini API" },
      { status: 500 }
    );
  }
}


//  open ai chat code 

// import OpenAI from 'openai';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req:Request){
//     try{
//         const {message} = await req.json();
//         const completion=await openai.chat.completions.create({
//             model:"gpt-3.5-turbo",
            
//             messages:[{role:'user',content:message}],
//         });
//         return Response.json({
//             response:completion.choices[0].message.content,
//         });
//     }
//     catch(error){
//         return Response.json({
//             error:'Error fetching response from OpenAI',
//         },{status:500});
//     }
// }