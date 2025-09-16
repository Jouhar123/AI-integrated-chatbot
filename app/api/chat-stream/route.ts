import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream(message);

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const content = chunk.text();
            if (content) {
              controller.enqueue(
                encoder.encode(`data:${JSON.stringify({ content })}\n\n`)
              );
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}

// open Ai Stream code

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request) {
//   try {
//     const { message } = await request.json();

//     const stream = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: message }],
//       stream: true,
//     });

//     const encoder = new TextEncoder();

//     const readable = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of completion) {
//             const content = chunk.choices[0]?.delta?.content;
//             if (content) {
//               controller.enqueue(
//                 encoder.encode(`data:${JSON.stringify({ content })}\n\n`)
//               );
//             }
//           }
//         } catch (err) {
//           controller.error(err);
//         } finally {
//           controller.close();
//         }
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         'Cache-Control': 'no-cache',
//         'Connection': " keep-alive",
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response("Error", { status: 500 });
//   }
// }
