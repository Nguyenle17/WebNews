import OpenAI from "openai";

export default class SummaryController {
    constructor() {
        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.API_KEY,
        });
    }

    summarize = async (req, res, next) => {
        try {
            const { data, models } = req.body;

            const modelMap = {
                'deepseek-chat-v3-0324': 'deepseek/deepseek-chat-v3-0324:free',
                'deepseek-r1-0528': 'deepseek/deepseek-r1-0528:free',
                'gpt-4o': 'openai/gpt-4o-2024-11-20',
                'meta-llama-3.3-8b': 'meta-llama/llama-3.3-8b-instruct:free',
                'gemma-3n-e4b-it': 'google/gemma-3n-e4b-it:free',
                'llama-3.1-8b-instruct': 'meta-llama/llama-3.1-8b-instruct:free',
                'llama-4-maverick': 'meta-llama/llama-4-maverick:free',
                'gpt-4.1': 'openai/gpt-4.1',
            };

            const selectedModelName = modelMap[models.models] || modelMap['deepseek-chat-v3-0324'];

            const langMap = {
                en: `Respond in English. Summarize the following content: ${data.content} in a concise manner while preserving the main ideas and important information. Ensure the text is clearly presented, easy to understand, and free of unnecessary characters or symbols.`,

                vi: `Trả lời bằng tiếng Việt. Hãy tóm tắt thông tin sau đây ${data.content} theo phong cách ngắn gọn mà vẫn giữ được ý nghĩa và thông tin chính. Đảm bảo rằng nội dung được trình bày rõ ràng và dễ hiểu, không có ký tự hoặc biểu tượng không cần thiết.`,

                ja: `日本語で回答してください。以下の内容を簡潔に要約してください: ${data.content}。重要な情報と意味を保ちながら、明確で分かりやすい文章にしてください。不要な記号や文字は含めないでください。`,

                ko: `한국어로 답변해주세요. 다음 내용을 간결하게 요약해주세요: ${data.content}. 주요 내용과 의미를 유지하면서 명확하고 이해하기 쉬운 형식으로 작성해주세요. 불필요한 기호나 문자는 포함하지 마세요.`,
            };


            const content = langMap[data.hl] || langMap["en"];

            const completion = await this.openai.chat.completions.create({
                model: selectedModelName,
                messages: [{ role: 'user', content: content }],
                max_tokens: ['gpt-4o', 'gpt-4.1'].includes(models.models) ? 4000 : undefined,
            });
            return res.json({ message: completion.choices[0].message });

        } catch (error) {
            next(error);
        }
    }
}