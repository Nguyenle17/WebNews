
import OpenAI from 'openai'
import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";
dotenv.config();

export default class NewsController {
    constructor() {
        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.API_KEY,
        })
    }

    getNews = async (req, res, next) => {
        try {
            const data = req.body
            const response = await fetch(process.env.NEWS_URL, {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.X_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                return res.status(response.status).json({ error: errorText });
            }

            const news = await response.json();
            return res.json({ news: news.news });
        } catch (error) {
            next(error)
        }
    }

    summaryNews = async (req, res, next) => {
        try {
            const { data, models } = req.body;
            let response = await fetch(process.env.NEWS_URL, {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.X_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                return res.status(response.status).json({ error: errorText });
            }

            const news = await response.json();
            const newsData = news.news.map(item => item.title + '\t' + item.snippet + '\t' + item.link);

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

            if (newsData.length === 0) {
                return res.status(404).json({ message: { content: `No information about ${data.q} in 24h.` }, news: news.news });
            }
            const selectedModelName = modelMap[models.models] || modelMap['deepseek-chat-v3-0324'];
            const langMap = {
                en: `Here is the list of information: ${newsData}. These are the ${newsData.length} latest pieces of news about ${data.q} in the past 24 hours. Please visit each article link and summarize the main content of each one.
Each article should be presented in the following format:
Information number i: Article Title – Summary of the content.
Add a line break between each article to make it easier to read.After summarizing all the articles, provide your comments and analysis of the overall information. The text should be presented clearly, concisely, and without unnecessary symbols or punctuation`,

                vi: `Trả lời bằng tiếng Việt. Dưới đây là danh sách các thông tin: ${newsData}. Đây là ${newsData.length} thông tin mới nhất về ${data.q} trong vòng 1 ngày vừa qua hãy truy cập link bài báo và tóm tắt nội dung chính của từng bài. Mỗi bài nên trình bày theo định dạng:
Thông tin thứ i: Tiêu đề thông tin – Tóm tắt nội dung.
Giữa các bài, xuống dòng để phân tách rõ ràng. Sau khi tóm tắt thông tin hãy đưa ra nhận xét và phân tích những thông tin này. Văn bản, phân tích và nhận xét cần trình bày gọn gàng, không chứa ký tự đặc biệt,ký tự để định dạng markdown hoặc dấu không cần thiết.`,

                ja: `以下は情報の一覧です：${newsData}。これは過去24時間以内に${data.q}に関する最新の${newsData.length}件の情報です。
各記事のリンクにアクセスし、内容の要点を要約してください。
各記事は以下の形式で記述してください：
情報 i 番目：記事のタイトル – 内容の要約。
記事ごとに改行して、見やすくしてください。すべての要約が終わったら、それらの情報に対するコメントと分析を加えてください。テキストは明確かつ簡潔に、不要な記号や句読点を使わずに書いてください。`,
                ko: `다음은 정보 목록입니다: ${newsData}.
이는 지난 24시간 동안 ${data.q}에 대한 최신 정보 ${newsData.length}건입니다.
각 기사 링크에 접속하여 주요 내용을 요약해 주세요.
각 기사는 다음 형식으로 작성해야 합니다:
정보 i번째: 기사 제목 – 주요 내용 요약.
각 기사 사이에는 줄 바꿈을 추가하여 명확히 구분해 주세요.모든 요약 후에는 이 정보들에 대한 의견과 분석을 작성해 주세요.텍스트는 깔끔하고 간결하게 작성하며, 불필요한 기호나 문장 부호는 사용하지 마세요.
`,
            };

            const content = langMap[data.hl] || langMap["en"];

            const completion = await this.openai.chat.completions.create({
                model: selectedModelName,
                messages: [{ role: 'user', content: content }],
                max_tokens: ['gpt-4o', 'gpt-4.1'].includes(models.models) ? 4000 : undefined,
            });
            return res.json({ message: completion.choices[0].message, news: news.news });
        } catch (error) {
            next(error)
        }
    }
}