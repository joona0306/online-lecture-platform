# 온라인 강의 플랫폼 - 처음부터 만들기 실습 가이드

이 문서는 **빈 폴더에서 시작하여** 온라인 강의 플랫폼을 처음부터 완성하는 단계별 실습 가이드입니다.  
UI/UX 디자인 강의에서 학생들이 각 단계를 따라 하며 완전한 웹 애플리케이션을 만들 수 있도록 구성했습니다.

---

## 📋 실습 가이드 구성

| 단계 | 문서                                              | 내용                                     | 예상 시간 |
| ---- | ------------------------------------------------- | ---------------------------------------- | --------- |
| 0    | [필요 개념 정리](./01-concepts.md)                | UI/UX 핵심 개념, HTML/CSS/JS 기초        | 30분      |
| 1    | [프로젝트 셋업](./02-step1-setup.md)              | 폴더 구조, 기본 파일 생성                | 30분      |
| 2    | [메인 페이지 HTML](./03-step2-html-main.md)       | index.html 작성, 시맨틱 마크업           | 1시간     |
| 3    | [디자인 시스템 구축](./04-step3-design-system.md) | variables.css, 색상·타이포·간격 정의     | 1시간     |
| 4    | [공통 스타일 작성](./05-step4-common-styles.md)   | style.css, 레이아웃·헤더·푸터 스타일     | 1.5시간   |
| 5    | [컴포넌트 스타일](./06-step5-components.md)       | components.css, 버튼·카드·폼 스타일      | 1.5시간   |
| 6    | [반응형 디자인](./07-step6-responsive.md)         | responsive.css, 모바일·태블릿·데스크톱   | 1시간     |
| 7    | [JavaScript 기초](./08-step7-js-basics.md)        | 데이터 구조, storage.js, utils.js        | 1시간     |
| 8    | [메인 페이지 기능](./09-step8-js-main.md)         | main.js, Swiper 캐러셀, 강의 목록 렌더링 | 1.5시간   |
| 9    | [추가 페이지 작성](./10-step9-more-pages.md)      | courses.html, course-detail.html 등      | 2시간     |
| 10   | [최종 완성 및 테스트](./11-step10-final.md)       | 전체 기능 통합, 테스트, 배포             | 1시간     |

**총 예상 시간**: 약 12~14시간

### 문서 현황

| 단계 | 문서                 | 상태              |
| ---- | -------------------- | ----------------- |
| 0~4  | 01 ~ 05-step4        | ✅ 상세 작성 완료 |
| 5~10 | 06-step5 ~ 11-step10 | ✅ 상세 작성 완료 |

가이드만 따라 **현재 프로젝트를 완성**하려면 5~10단계 문서를 순서대로 진행하세요. 각 단계 문서에 코드 예시·실습 단계·체크리스트가 포함되어 있습니다.  
전체 검토 결과는 [README-REVIEW.md](./README-REVIEW.md)를 참고하세요.

---

## 🎯 학습 목표

이 실습을 완료하면 다음을 할 수 있습니다.

### 기술 역량

- **HTML**: 시맨틱 마크업, 접근성 고려한 구조 설계
- **CSS**: 디자인 시스템, 컴포넌트 기반 스타일, 반응형 레이아웃
- **JavaScript**: 모듈화, 데이터 관리(localStorage), DOM 조작, 이벤트 처리

### UI/UX 역량

- 디자인 토큰으로 일관성 유지
- 사용자 중심 인터페이스 설계
- 반응형·접근성 고려한 실무 감각

---

## 📁 완성 후 프로젝트 구조

```
online-lecture-platform/
├── index.html                 # 메인 페이지
├── courses.html               # 강의 목록
├── course-detail.html         # 강의 상세
├── course-player.html         # 강의 수강
├── dashboard.html             # 학습 대시보드
├── login.html, signup.html    # 인증
├── cart.html, checkout.html   # 장바구니, 결제
├── profile.html, orders.html  # 프로필, 주문 내역
├── css/
│   ├── variables.css          # 디자인 토큰
│   ├── style.css              # 공통 스타일
│   ├── components.css         # 컴포넌트 스타일
│   └── responsive.css         # 반응형
├── js/
│   ├── app.js                 # 앱 진입점
│   ├── components/            # 웹 컴포넌트
│   │   ├── AppHeader.js
│   │   ├── AppFooter.js
│   │   └── CourseCard.js
│   ├── modules/               # 공용 모듈
│   │   ├── api.js
│   │   ├── storage.js
│   │   ├── utils.js
│   │   └── modal.js
│   └── pages/                 # 페이지별 로직
│       ├── main.js
│       ├── courses.js
│       ├── course-detail.js
│       └── ...
├── data/
│   ├── courses.json           # 강의 데이터
│   └── users.json             # 사용자 데이터
└── docs/                      # 문서
```

---

## 💡 실습 진행 방법

### 1. 준비물

- **에디터**: VS Code 권장
- **브라우저**: Chrome (개발자 도구 사용)
- **로컬 서버**: Live Server 확장 또는 Python/Node.js

### 2. 진행 순서

1. **순서대로** 단계를 따라가세요 (건너뛰면 안 됩니다)
2. 각 단계의 **코드를 직접 타이핑**하세요 (복붙 금지!)
3. 단계마다 **브라우저에서 확인**하세요
4. **체크리스트**로 완료 여부 점검

### 3. 학습 팁

- 🔴 **에러가 나면 멈추지 말고** 개발자 도구 콘솔을 확인하세요
- 💾 **자주 저장**하고 브라우저를 새로고침하세요
- 📸 **단계별 스크린샷**을 찍어 진행 상황을 기록하세요
- 🤝 **막히면 동료와 토론**하거나 검색하세요

---

## 🚀 시작하기

준비되었다면 [01-concepts.md](./01-concepts.md)에서 필요 개념을 먼저 확인하세요.  
그 다음 [02-step1-setup.md](./02-step1-setup.md)부터 실습을 시작합니다!
