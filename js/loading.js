/* 인트로 로딩 */
const intro = document.querySelector(".intro");
const introPlayed = sessionStorage.getItem("introPlayed");

if (intro && introPlayed === "true") {
  // 이미 로딩을 실행했다면 바로 제거
  intro.remove();
} else if (intro && window.gsap) {
  // 최초 실행 기록 저장
  sessionStorage.setItem("introPlayed", "true");
  const texts = intro.querySelectorAll(".intro_text");
  const logo = intro.querySelector(".intro_logo");
  const logoLeft = intro.querySelector(".intro_logo-left");
  const logoRight = intro.querySelector(".intro_logo-right");

  /* 속도 설정 */

  const speed = {
    textIn: 0.1, // 텍스트 등장
    textStay: 0.15, // 텍스트 유지
    textOut: 0.12, // 텍스트 사라짐

    silence: 0.12, // 로고 등장 전 대기

    logoIn: 0.2, // 로고 등장
    logoStay: 0.5, // 로고 중앙 정지
    logoOpen: 0.38, // 로고 좌우 분리

    fadeOut: 0.18, // 메인 화면 전환
  };

  /* 스크롤 방지 */

  const originalOverflow = document.documentElement.style.overflow;

  document.documentElement.style.overflow = "hidden";

  /* 텍스트 저장 */

  const messages = Array.from(texts).map(function (text) {
    return text.textContent.trim();
  });

  const textDisplay = texts[0];

  /* 초기 상태 설정 */

  gsap.set(texts, {
    autoAlpha: 0,
  });

  gsap.set(logo, {
    autoAlpha: 0,
  });

  gsap.set([logoLeft, logoRight], {
    x: 0,
    opacity: 1,
  });

  /* 애니메이션 타임라인 */

  const timeline = gsap.timeline({
    onComplete: function () {
      intro.remove();

      document.documentElement.style.overflow = originalOverflow;
    },
  });

  /* 텍스트 변경 */

  for (let i = 0; i < messages.length; i++) {
    // 문구 변경
    timeline.call(function () {
      textDisplay.textContent = messages[i];
    });

    // 텍스트 등장
    timeline.to(textDisplay, {
      autoAlpha: 1,
      duration: speed.textIn,
      ease: "power1.out",
    });

    // 텍스트 유지
    timeline.to(
      {},
      {
        duration: speed.textStay,
      },
    );

    // 텍스트 사라짐
    timeline.to(textDisplay, {
      autoAlpha: 0,
      duration: speed.textOut,
      ease: "power1.in",
    });
  }

  /* 로고 등장 전 대기 */

  timeline.to(
    {},
    {
      duration: speed.silence,
    },
  );

  /* 로고 등장 */

  timeline.to(logo, {
    autoAlpha: 1,
    duration: speed.logoIn,
    ease: "power1.out",
  });

  /* 로고 중앙 정지 */

  timeline.to(
    {},
    {
      duration: speed.logoStay,
    },
  );

  /* 로고 좌우 분리 */

  timeline.to(logoLeft, {
    x: -(window.innerWidth + 200),
    duration: speed.logoOpen,
    ease: "power2.in",
  });

  timeline.to(
    logoRight,
    {
      x: window.innerWidth + 200,
      duration: speed.logoOpen,
      ease: "power2.in",
    },
    "<",
  );

  /* 로고 사라짐 */

  timeline.to(
    [logoLeft, logoRight],
    {
      opacity: 0,
      duration: 0.16,
      ease: "none",
    },
    "<+=0.22",
  );

  /* 메인 화면 전환 */

  timeline.to(intro, {
    opacity: 0,
    duration: speed.fadeOut,
    ease: "none",
  });
}
