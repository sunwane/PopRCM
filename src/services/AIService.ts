class AIService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/ai';

  async chat(prompt: string): Promise<string> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      const aiResponse = "Xin hãy kiểm tra kết nối mạng hoặc thử lại sau.";
      return aiResponse;
    }

    try {
      console.log('Attempting to call real AI API...');
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      // Parse JSON response from OpenAI
      const jsonResponse = await response.json();
      console.log('AI API Response:', jsonResponse);
      
      // Extract content from OpenAI response structure
      let aiResponse = '';
      if (jsonResponse.choices && jsonResponse.choices[0]) {
        aiResponse = jsonResponse.choices[0].message?.content || jsonResponse.choices[0].text || '';
      } else if (typeof jsonResponse === 'string') {
        aiResponse = jsonResponse;
      } else {
        aiResponse = JSON.stringify(jsonResponse);
      }

      console.log('✅ AI response received');
      return aiResponse || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.';
      
    } catch (error: any) {
      console.error('❌ AI API error:', error);
      console.log('Falling back to mock AI response...');
      return this.mockChat(prompt);
    }
  }

  private mockChat(prompt: string): string {
    // Mock AI responses based on prompt content
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('phim') || lowerPrompt.includes('movie')) {
      return `Dựa trên câu hỏi của bạn về phim, tôi khuyên bạn nên xem:

🎬 **One Piece: Đảo Hải tặc** - Anime huyền thoại với hành trình tìm kho báu
🎭 **Your Name** - Anime tình cảm siêu hay về hoán đổi cơ thể  
🔥 **Demon Slayer** - Hành động đỉnh cao với đồ họa tuyệt đẹp

Bạn thích thể loại nào nhất? Tôi có thể gợi ý thêm!`;
    }
    
    if (lowerPrompt.includes('anime')) {
      return `Anime là một thế giới tuyệt vời! Dựa trên sở thích của bạn, tôi gợi ý:

✨ **Thể loại hành động:** Attack on Titan, Demon Slayer, Jujutsu Kaisen
💕 **Romance:** Your Name, A Silent Voice, Weathering with You
😄 **Comedy:** One Punch Man, Mob Psycho 100
🎭 **Drama:** Spirited Away, Princess Mononoke

Bạn muốn khám phá thể loại nào?`;
    }

    if (lowerPrompt.includes('gợi ý') || lowerPrompt.includes('recommend')) {
      return `Tôi sẽ gợi ý cho bạn những bộ phim hot nhất hiện tại:

🔥 **Top trending:**
• One Piece (Anime) - Hành trình huyền thoại
• Spirited Away - Kiệt tác Ghibli  
• Demon Slayer - Hành động mãn nhãn
• Your Name - Romance cảm động

💡 **Mẹo:** Hãy cho tôi biết bạn thích thể loại gì để tôi gợi ý chính xác hơn!`;
    }

    // Default response
    return `Xin chào! Tôi là AI assistant của PopRCM 🤖

Tôi có thể giúp bạn:
🎬 Tìm phim hay theo sở thích
📺 Gợi ý anime/series hot
⭐ Đánh giá và review phim
🔍 Tìm kiếm nội dung theo thể loại

Hãy hỏi tôi bất cứ điều gì về phim ảnh nhé! 😊`;
  }
}

export default new AIService();