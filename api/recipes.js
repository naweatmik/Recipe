export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { ingredients, time, difficulty } = req.body

  if (!ingredients?.length) {
    return res.status(400).json({ error: '재료를 입력해주세요.' })
  }

  const prompt = `냉장고에 있는 재료: ${ingredients.join(', ')}
조리 시간: ${time}
난이도: ${difficulty}

위 재료와 조건으로 만들 수 있는 한국 가정식 메뉴 3가지를 추천해주세요.

조리 방법은 요리를 한 번도 해본 적 없는 완전 초보자도 따라할 수 있도록 작성해주세요:
- 각 단계는 하나의 동작만 설명 (예: "팬을 중불로 켜세요", "기름을 2큰술 두르세요")
- 불 세기, 시간, 양을 구체적으로 명시 (예: "중불에서 3분간", "소금 1/2 티스푼")
- 재료 손질 방법도 상세히 설명 (예: "양파는 껍질을 벗기고 0.5cm 두께로 채썰어주세요")
- 초보자가 실수하기 쉬운 부분은 주의사항 포함
- 최소 6단계 이상으로 상세하게 작성

반드시 아래 JSON 형식으로만 응답하고, 다른 텍스트는 절대 포함하지 마세요:
{
  "menus": [
    {
      "name": "메뉴명",
      "time": "예상 조리시간(예: 20분)",
      "difficulty": "쉬움 또는 보통 또는 어려움",
      "ingredients_used": ["냉장고에 있는 재료 중 사용한 것들"],
      "extra_needed": ["냉장고에 없지만 필요한 재료들, 없으면 빈 배열"],
      "steps": [
        "1. 재료 손질: 양파는 껍질을 벗기고 얇게 채썰어 주세요.",
        "2. 팬 준비: 팬을 중불(가스레인지 중간 눈금)에 올리고 30초간 달궈주세요.",
        "3. 기름 두르기: 식용유 1큰술을 팬에 두르고 기름이 살짝 달궈질 때까지 20초 기다려주세요.",
        "이런 식으로 초보자도 이해할 수 있게 구체적으로..."
      ],
      "tip": "초보자가 꼭 알아야 할 핵심 팁 (실패하지 않는 방법 위주)"
    }
  ]
}`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: '당신은 한국 가정식 요리 전문가입니다. 요청받은 JSON 형식으로만 정확히 응답하세요. JSON 외의 다른 텍스트나 마크다운 코드블록을 절대 포함하지 마세요.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.error?.message || 'AI 서버 오류' })
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content || ''
    const jsonStr = content.trim().replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
    const parsed = JSON.parse(jsonStr)

    res.json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
