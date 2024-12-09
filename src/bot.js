import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-YLyveShW1wP4mzit8JsF8G1i",
  project: "proj_ssMUQdC9JMTIjTDUEtDNUekg",
});

export async function main(promptText, max_tokens, temperature) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { "role": "system", "content":promptText },
        
      ],
      max_tokens: max_tokens,
      temperature: temperature,
    });
    console.log("Resposta da API OpenAI:", response);
    return response;
  } catch (error) {
    console.error("Erro na solicitação à API OpenAI:", error);
    throw error;
  }
}