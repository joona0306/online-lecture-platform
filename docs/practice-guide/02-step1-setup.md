# 1단계: 프로젝트 셋업

빈 폴더에서 시작하여 프로젝트 구조를 만들고 기본 파일을 생성합니다.

---

## 학습 목표

- 프로젝트 폴더 구조 이해
- 기본 HTML 파일 생성
- 로컬 서버 실행 방법 습득

---

## 실습 단계

### 1단계: 프로젝트 폴더 생성

1. 원하는 위치에 `online-lecture-platform` 폴더 생성
2. VS Code로 해당 폴더 열기

### 2단계: 폴더 구조 만들기

프로젝트 루트에서 다음 폴더를 생성하세요.

```
online-lecture-platform/
├── css/
├── js/
├── data/
└── docs/
```

**VS Code에서 폴더 만들기:**
- 좌측 탐색기에서 폴더 아이콘 클릭 or 우클릭 → New Folder

### 3단계: index.html 생성

프로젝트 루트에 `index.html` 파일을 생성하고 기본 구조를 작성합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>온라인 강의 플랫폼</title>
</head>
<body>
  <h1>온라인 강의 플랫폼</h1>
  <p>실습 프로젝트를 시작합니다!</p>
</body>
</html>
```

**타이핑 팁:**
- `!` 입력 후 Tab 키를 누르면 기본 HTML 구조가 자동 완성됩니다 (Emmet)

### 4단계: 로컬 서버 실행

**방법 1: VS Code Live Server (권장)**

1. VS Code 확장에서 "Live Server" 설치
2. `index.html` 파일에서 우클릭
3. "Open with Live Server" 선택
4. 브라우저가 자동으로 열립니다 (`http://127.0.0.1:5500`)

**방법 2: Python**

```bash
# 프로젝트 폴더에서 실행
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

**방법 3: Node.js**

```bash
# http-server 글로벌 설치 (최초 1회)
npm install -g http-server

# 프로젝트 폴더에서 실행
http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

### 5단계: 브라우저 확인

브라우저에 "온라인 강의 플랫폼"과 "실습 프로젝트를 시작합니다!" 메시지가 보이면 성공!

---

## 추가 파일 생성 (미리 만들기)

다음 단계를 위해 빈 파일들을 미리 생성해 둡니다.

### CSS 파일

`css/` 폴더에 다음 파일 생성:
- `variables.css` (빈 파일)
- `style.css` (빈 파일)
- `components.css` (빈 파일)
- `responsive.css` (빈 파일)

### JavaScript 파일

`js/` 폴더에 `app.js` 파일 생성 (빈 파일)

---

## 체크리스트

- [ ] `online-lecture-platform` 폴더 생성
- [ ] `css/`, `js/`, `data/`, `docs/` 폴더 생성
- [ ] `index.html` 작성 완료
- [ ] 로컬 서버로 실행 성공
- [ ] 브라우저에서 "온라인 강의 플랫폼" 확인
- [ ] CSS, JS 빈 파일 생성 완료

---

## 문제 해결

### Q1: Live Server가 작동하지 않아요
A: 파일을 저장했는지 확인하고 (Ctrl+S), VS Code를 재시작해 보세요.

### Q2: 한글이 깨져요
A: `<meta charset="UTF-8">`이 `<head>` 안에 있는지 확인하세요.

### Q3: 파일 구조가 헷갈려요
A: VS Code 좌측 탐색기에서 폴더 트리가 다음과 같아야 합니다:
```
online-lecture-platform/
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   └── app.js
├── data/
├── docs/
└── index.html
```

---

**다음**: [03-step2-html-main.md](./03-step2-html-main.md) - 메인 페이지 HTML 구조 작성
