/**
 * AppFooter.js - 공통 푸터 웹 컴포넌트
 * 
 * 이 컴포넌트는 모든 페이지에서 공통으로 사용되는 푸터를 제공합니다.
 * 회사 정보, 고객센터 연락처 등을 포함합니다.
 * 
 * 사용 방법:
 * <app-footer></app-footer>
 * 
 * @module components/AppFooter
 */

// ============================================================================
// AppFooter 웹 컴포넌트 클래스
// ============================================================================

/**
 * 공통 푸터 웹 컴포넌트
 * Shadow DOM을 사용하지 않아 외부 CSS와 호환됩니다.
 */
class AppFooter extends HTMLElement {
  /**
   * 컴포넌트 생성자
   */
  constructor() {
    super();
  }

  // ==========================================================================
  // 라이프사이클 메서드
  // ==========================================================================

  /**
   * 컴포넌트가 DOM에 연결될 때 호출됩니다.
   * 초기 렌더링을 수행합니다.
   */
  connectedCallback() {
    this.render();
  }

  // ==========================================================================
  // 렌더링 메서드
  // ==========================================================================

  /**
   * 컴포넌트의 HTML을 렌더링합니다.
   */
  render() {
    const currentYear = new Date().getFullYear();
    
    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            ${this._renderCompanyInfo()}
            ${this._renderCustomerService()}
          </div>
          <div class="footer-bottom">
            <p class="copyright">© ${currentYear} EduEdu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  /**
   * 회사 정보 섹션을 렌더링합니다.
   * @returns {string} 회사 정보 HTML
   */
  _renderCompanyInfo() {
    return `
      <div class="footer-section">
        <h3>회사 정보</h3>
        <p>온라인 강의 플랫폼</p>
        <p>EduEdu는 누구나 쉽게 배우고 성장할 수 있는 온라인 교육 플랫폼입니다.</p>
      </div>
    `;
  }

  /**
   * 고객센터 섹션을 렌더링합니다.
   * @returns {string} 고객센터 HTML
   */
  _renderCustomerService() {
    return `
      <div class="footer-section">
        <h3>고객센터</h3>
        <p>
          <span class="footer-label">전화:</span>
          <a href="tel:1588-0000" class="footer-link">1588-0000</a>
        </p>
        <p>
          <span class="footer-label">이메일:</span>
          <a href="mailto:support@eduedu.com" class="footer-link">support@eduedu.com</a>
        </p>
        <p>
          <span class="footer-label">운영시간:</span>
          평일 09:00 - 18:00
        </p>
      </div>
    `;
  }
}

// ============================================================================
// 웹 컴포넌트 등록
// ============================================================================

// 커스텀 엘리먼트 등록 (아직 등록되지 않은 경우에만)
if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}

export default AppFooter;
