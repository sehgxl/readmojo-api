import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "langchain/prompts";
import dotenv from "dotenv";

dotenv.config();

const getSummary = async (body) => {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
  const text = body;
  const model = new OpenAI({
    temperature: 0,
    OpenAIApi: process.env.OPENAI_API_KEY,
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  const map_prompt = `You are a friendly professor, reading interesting articles around the web. Draw cliff notes from the following text. Illustrate insights with examples. Text: {text} Notes: `;

  const map_template = new PromptTemplate({
    inputVariables: ["text"],
    template: map_prompt,
  });

  const coherence_prompt = `Notes: {text}
You are a friendly professor. Elaborate on the above notes and don't refer to yourself:`;

  const coherence_template = new PromptTemplate({
    inputVariables: ["text"],
    template: coherence_prompt,
  });

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model, {
    type: "map_reduce",
    combineMapPrompt: map_template,
    combinePrompt: coherence_template,
  });
  const res = await chain.call({
    input_documents: docs,
  });
  return res.text;
};

export default getSummary;
