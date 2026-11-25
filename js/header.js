/* 헤더 내비 애니메이션 */

function initHeader() {
  const navLinks = [...document.querySelectorAll(".header_link")];
  const logoLink = document.querySelector(".header_logo a");
  const menuBtn = document.querySelector(".header_menu_btn");

  if (!window.gsap || !navLinks.length) return;

  const menuItems = [];

  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let pendingItem = null;

  /* 랜덤 문자 */

  function getRandomChar() {
    return randomChars[Math.floor(Math.random() * randomChars.length)];
  }

  /* 텍스트 복구 */

  function restoreText(item) {
    item.chars.forEach((char) => {
      const original = char.dataset.original;

      char.textContent = original === " " ? "\u00A0" : original;
    });
  }

  /* 소괄호 숨김 */

  function hideBrackets(item) {
    gsap.to([item.leftBracket, item.rightBracket], {
      autoAlpha: 0,
      duration: 0.15,
      ease: "power1.out",
      overwrite: true,
    });
  }

  /* 메뉴 초기화 */

  function resetMenu(item) {
    item.timeline.pause(0);

    restoreText(item);

    item.isPending = false;
    item.isHovered = false;

    item.link.classList.remove("is_active");

    gsap.killTweensOf([...item.chars, item.leftBracket, item.rightBracket]);

    gsap.set(item.chars, {
      autoAlpha: 1,
    });

    gsap.set(item.leftBracket, {
      autoAlpha: 0,
      left: "50%",
    });

    gsap.set(item.rightBracket, {
      autoAlpha: 0,
      left: "50%",
    });
  }

  /* 전체 메뉴 초기화 */

  function resetAllMenus() {
    menuItems.forEach(resetMenu);

    pendingItem = null;
  }

  /* 메뉴 선택 */

  function activateMenu(item) {
    resetAllMenus();

    item.link.classList.add("is_active");

    restoreText(item);

    gsap.set(item.chars, {
      autoAlpha: 1,
    });

    gsap.set(item.leftBracket, {
      autoAlpha: 1,
      left: "0%",
    });

    gsap.set(item.rightBracket, {
      autoAlpha: 1,
      left: "100%",
    });
  }

  /* 메뉴 생성 */

  navLinks.forEach((link) => {
    const text = link.querySelector(".header_text");

    const leftBracket = link.querySelector(".header_bracket_left");

    const rightBracket = link.querySelector(".header_bracket_right");

    const originalText = text.textContent;

    text.replaceChildren();

    /* 글자 분리 */

    [...originalText].forEach((character) => {
      const span = document.createElement("span");

      span.className = "header_char";

      span.dataset.original = character;

      span.textContent = character === " " ? "\u00A0" : character;

      text.appendChild(span);
    });

    const chars = [...text.querySelectorAll(".header_char")];

    /* 중앙 기준 그룹 생성 */

    const center = (chars.length - 1) / 2;

    const distances = [...new Set(chars.map((char, index) => Math.abs(index - center)))].sort(
      (a, b) => a - b,
    );

    const revealGroups = distances.map((distance) => {
      return chars
        .map((char, index) => ({
          char,
          distance: Math.abs(index - center),
        }))
        .filter((entry) => entry.distance === distance);
    });

    /* 메뉴 정보 */

    const item = {
      link,
      chars,

      leftBracket,
      rightBracket,

      isPending: false,
      isHovered: false,

      timeline: null,
    };

    /* 초기 상태 */

    gsap.set(leftBracket, {
      autoAlpha: 0,
      left: "50%",
    });

    gsap.set(rightBracket, {
      autoAlpha: 0,
      left: "50%",
    });

    /* 타임라인 */

    const tl = gsap.timeline({
      paused: true,

      onComplete: () => {
        restoreText(item);

        if (item.isPending) {
          const destination = link.getAttribute("href");

          activateMenu(item);

          if (destination && destination !== "#") {
            window.location.assign(destination);
          }

          return;
        }

        if (!item.isHovered && !link.classList.contains("is_active")) {
          hideBrackets(item);
        }
      },
    });

    item.timeline = tl;

    /* 텍스트 숨김 */

    tl.set(
      chars,
      {
        autoAlpha: 0,
      },
      0,
    );

    /* 소괄호 중앙에서 시작 */

    tl.set(
      leftBracket,
      {
        autoAlpha: 1,
        left: "50%",
      },
      0,
    );

    tl.set(
      rightBracket,
      {
        autoAlpha: 1,
        left: "50%",
      },
      0,
    );

    /* 중앙부터 좌우로 등장 */

    const groupDelay = 0.056;

    revealGroups.forEach((group, groupIndex) => {
      const startTime = 0.08 + groupIndex * groupDelay;

      const progress = (groupIndex + 1) / revealGroups.length;

      const leftPosition = 50 - 50 * progress;

      const rightPosition = 50 + 50 * progress;

      /* 왼쪽 소괄호 */

      tl.to(
        leftBracket,
        {
          left: `${leftPosition}%`,
          duration: groupDelay,
          ease: "none",
        },
        startTime,
      );

      /* 오른쪽 소괄호 */

      tl.to(
        rightBracket,
        {
          left: `${rightPosition}%`,
          duration: groupDelay,
          ease: "none",
        },
        startTime,
      );

      /* 글자 등장 */

      group.forEach(({ char }) => {
        const original = char.dataset.original;

        tl.set(
          char,
          {
            autoAlpha: 1,
          },
          startTime,
        );

        /* 공백 */

        if (original === " ") {
          char.textContent = "\u00A0";

          return;
        }

        /* 문자 변환 */

        const scramble = {
          progress: 0,
        };

        tl.to(
          scramble,
          {
            progress: 1,
            duration: 0.22,
            ease: "none",

            onUpdate: () => {
              char.textContent = scramble.progress < 0.88 ? getRandomChar() : original;
            },

            onComplete: () => {
              char.textContent = original;
            },
          },
          startTime,
        );
      });
    });

    menuItems.push(item);

    /* 마우스 진입 */

    link.addEventListener("mouseenter", () => {
      if (link.classList.contains("is_active") || item.isPending || pendingItem) {
        return;
      }

      item.isHovered = true;

      gsap.killTweensOf([leftBracket, rightBracket]);

      if (tl.progress() >= 1) {
        resetMenu(item);

        item.isHovered = true;
      }

      tl.play();
    });

    /* 마우스 이탈 */

    link.addEventListener("mouseleave", () => {
      item.isHovered = false;

      if (link.classList.contains("is_active") || item.isPending) {
        return;
      }

      if (tl.progress() >= 1) {
        hideBrackets(item);
      }
    });

    /* 메뉴 클릭 */

    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (link.classList.contains("is_active") || item.isPending || pendingItem) {
        return;
      }

      item.isPending = true;
      item.isHovered = true;

      pendingItem = item;

      if (tl.progress() >= 1) {
        const destination = link.getAttribute("href");

        activateMenu(item);

        if (destination && destination !== "#") {
          window.location.assign(destination);
        }

        return;
      }

      tl.play();
    });
  });

  /* 로고 클릭 */

  logoLink?.addEventListener("click", (event) => {
    event.preventDefault();

    resetAllMenus();

    document.body.classList.remove("menu_open");

    const destination = logoLink.getAttribute("href");

    if (destination && destination !== "#") {
      window.location.assign(destination);
    }
  });

  /* 현재 페이지 메뉴 선택 */
  const currentPage = window.location.pathname.split("/").pop();
  const initialActive = menuItems.find((item) => {
    const link = item.link.getAttribute("href");
    return link && link !== "#" && link.replace("./", "") === currentPage;
  });

  if (initialActive) {
    activateMenu(initialActive);
  }

  /* 태블릿 메뉴 */
  menuBtn?.addEventListener("click", () => {
    document.body.classList.toggle("menu_open");
  });
}
