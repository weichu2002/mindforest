// functions/ai.js - 极简稳定版
export default {
  async fetch(request, env) {
    // 1. 设置CORS头（必须）
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // 2. 处理预检请求（必须）
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // 3. 只处理POST请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: '只支持POST请求' 
      }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // 4. 读取请求体
      const userRequest = await request.json();
      
      // 5. 从环境变量获取API Key
      const API_KEY = env.API_KEY || "sk-26d09fa903034902928ae380a56ecfd3";
      
      // 6. 调用DeepSeek API（简化版，不使用流式）
      const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-v3",
          messages: userRequest.messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      // 7. 返回结果
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      // 8. 错误处理
      return new Response(JSON.stringify({
        error: "AI服务暂时不可用",
        message: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
}
