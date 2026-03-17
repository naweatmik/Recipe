# 🍳 우리집 냉장고 털어먹기

냉장고에 있는 재료를 입력하면 AI가 만들 수 있는 한식 레시피를 추천해주는 웹앱입니다.

## 주요 기능

- **재료 입력** — 직접 타이핑하거나 자주 쓰는 재료(달걀, 김치, 두부 등) 빠른 추가
- **조리 옵션** — 조리 시간(15분 / 30분 / 1시간)과 난이도(쉬움 / 보통 / 어려움) 선택
- **AI 레시피 추천** — Groq API(llama-3.3-70b)가 보유 재료 기반으로 한식 메뉴 추천
- **상세 레시피 카드** — 사용 재료, 추가 필요 재료, 단계별 조리법, 요리 팁 제공

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 19, Vite 8, CSS Modules |
| 백엔드 | Vercel Serverless Function (Express 5) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| 배포 | Vercel |

## 로컬 실행

```bash
# 패키지 설치
npm install

# .env 파일 생성
echo "GROQ_API_KEY=your_key_here" > .env

# 개발 서버 실행 (프론트 + 백엔드 각각)
npm run dev      # Vite 프론트 (포트 5173)
npm run server   # Express 백엔드 (포트 3001)
```

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com)에서 발급 |

## 프로젝트 구조

```
recipe-app/
├── api/
│   └── recipes.js          # Vercel 서버리스 함수 (AI 호출)
├── server.js               # 로컬 개발용 Express 서버
├── vercel.json             # Vercel 배포 설정
└── src/
    ├── App.jsx
    ├── hooks/
    │   └── useGroqRecipe.js
    └── components/
        ├── IngredientInput.jsx
        ├── OptionSelector.jsx
        └── RecipeCard.jsx
```
