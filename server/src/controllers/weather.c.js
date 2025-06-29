import OpenAI from "openai";

export default class WeatherController {
    constructor() {
        this.weatherUrl = process.env.WEATHER_URL;
        this.apiKey = process.env.WEATHER_API_KEY;
        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.API_KEY_2,
        });
    }

    getInfoWeather = async (req, res, next) => {
        try {
            const { lat, lon } = req.body;
            const url = `${this.weatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }

            const data = await response.json();
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    getInfoWeatherFuture = async (req, res, next) => {
        try {
            const { lat, lon } = req.body;
            const url = `${this.weatherUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch future weather data: ${response.statusText}`);
            }

            const data = await response.json();
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    analysisWeather = async (req, res, next) => {
        try {
            const { mapFilter, models, lang } = req.body;
            const { lat, lng } = mapFilter;

            const urlCurrent = `${this.weatherUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`;
            const urlFuture = `${this.weatherUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`;

            const resCurrent = await fetch(urlCurrent);
            const dataCurrent = await resCurrent.json();

            const resFuture = await fetch(urlFuture);
            const dataFuture = await resFuture.json();

            const modelMap = {
                'deepseek-chat-v3-0324': 'deepseek/deepseek-chat-v3-0324:free',
                'deepseek-r1-0528': 'deepseek/deepseek-r1-0528:free',
                'gpt-4o': 'openai/gpt-4o-2024-11-20',
                'gpt-4.1': 'openai/gpt-4.1',
                'gemma-3n-e4b-it': 'google/gemma-3n-e4b-it:free',
                'llama-3.1-8b-instruct': 'meta-llama/llama-3.1-8b-instruct:free',
                'llama-4-maverick': 'meta-llama/llama-4-maverick:free',
            };

            const selectedModelName = modelMap[models] || modelMap['deepseek-chat-v3-0324'];

            const langMap = {
                vi: `Trả lời bằng tiếng Việt. Đây là thông tin thời tiết hiện tại: ${JSON.stringify(dataCurrent)} và thông tin thời tiết dự báo trong 5 ngày tới: ${JSON.stringify(dataFuture)}. Hãy tóm tắt và phân tích tình hình thời tiết tổng thể, nhấn mạnh các điểm đáng chú ý nếu có.`,
                en: `Reply in English. Here is the current weather information: ${JSON.stringify(dataCurrent)} and the forecast for the next 5 days: ${JSON.stringify(dataFuture)}. Please summarize and analyze the overall weather condition, highlighting any significant trends or changes.`,
                ja: `日本語で答えてください。以下は現在の天気情報です：${JSON.stringify(dataCurrent)} と、今後5日間の予報情報：${JSON.stringify(dataFuture)}。これらの情報を要約し、全体の天気の傾向や注目すべき点を分析してください。`,
                ko: `한국어로 답변해주세요. 현재 날씨 정보는 다음과 같습니다: ${JSON.stringify(dataCurrent)}, 그리고 앞으로 5일간의 일기예보 정보는 다음과 같습니다: ${JSON.stringify(dataFuture)}. 이 정보를 요약하고 날씨의 전반적인 흐름과 주목할 만한 사항들을 분석해주세요.`,
            };

            const prompt = langMap[lang] || langMap['en'];

            const completion = await this.openai.chat.completions.create({
                model: selectedModelName,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: ['gpt-4o', 'gpt-4.1'].includes(models) ? 4000 : undefined,
            });

            return res.json({
                message: completion.choices[0].message.content,
                current: dataCurrent,
                future: dataFuture
            });
        } catch (error) {
            next(error);
        }
    }
}
