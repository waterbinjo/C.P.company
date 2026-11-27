(() => {
  "use strict";

  /* 시그니처 디자인의 기원 */
  const originItems = [...document.querySelectorAll(".dna_origin_item")];
  const originImages = [...document.querySelectorAll(".dna_origin_main")];

  /* 반응형 썸네일 이미지 적용 */
  originItems.forEach((item, index) => {
    const thumbnailImage = item.querySelector(".dna_origin_thumb img");
    const mainImage = originImages[index]?.querySelector("img");

    if (thumbnailImage && mainImage) {
      const imagePath = mainImage.getAttribute("src");
      if (imagePath) thumbnailImage.setAttribute("src", imagePath);
    }
  });

  let openOriginIndex = -1;
  let lastOriginImageIndex = 0;

  /* 아코디언 및 이미지 변경 */
  function selectOrigin(index) {
    const isSameItem = openOriginIndex === index;

    if (isSameItem) {
      openOriginIndex = -1;
    } else {
      openOriginIndex = index;
      lastOriginImageIndex = index;
    }

    originItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === openOriginIndex;
      const button = item.querySelector(".dna_origin_head");
      const description = item.querySelector(".dna_origin_desc");

      item.classList.toggle("dna_active", isActive);
      if (button) button.setAttribute("aria-expanded", String(isActive));
      if (description) description.setAttribute("aria-hidden", String(!isActive));
    });

    /* 마지막으로 선택한 이미지 유지 */
    originImages.forEach((image, imageIndex) => {
      const isActive = imageIndex === lastOriginImageIndex;
      image.classList.toggle("dna_active", isActive);
      image.setAttribute("aria-hidden", String(!isActive));
    });
  }

  /* 제목 및 썸네일 클릭 */
  originItems.forEach((item, index) => {
    const button = item.querySelector(".dna_origin_head");
    const thumbnail = item.querySelector(".dna_origin_thumb");

    if (button) button.addEventListener("click", () => selectOrigin(index));
    if (thumbnail) thumbnail.addEventListener("click", () => selectOrigin(index));
  });

  /* 첫 번째 항목 활성화 */
  if (originItems.length && originImages.length) selectOrigin(0);

  /* 디자인 구조의 분석 */
  const seamButtons = [...document.querySelectorAll(".dna_seams_point")];
  const seamBoxes = [...document.querySelectorAll(".dna_seams_box")];

  /* 480px 모바일 전용 공통 설명 영역 */
  const seamMobileView = window.matchMedia("(max-width: 480px)");
  const seamMobileInfo = document.querySelector(".dna_seams_mobile_info");
  const seamMobileTitle = document.querySelector(".dna_seams_mobile_title");
  const seamMobileNum = document.querySelector(".dna_seams_mobile_num");
  const seamMobileDesc = document.querySelector(".dna_seams_mobile_desc");

  let seamActiveIndex = 0;
  let seamAnimation = null;

  /* 선택한 카드의 제목과 설명 변경 */
  function updateSeamMobile(index, animate = false) {
    if (
      !seamMobileView.matches ||
      !seamMobileInfo ||
      !seamMobileTitle ||
      !seamMobileNum ||
      !seamMobileDesc
    )
      return;

    const title = seamBoxes[index]?.querySelector(".dna_seams_detail_title");
    const desc = seamBoxes[index]?.querySelector(".dna_seams_detail_desc");

    if (!title || !desc) return;

    seamMobileTitle.textContent = title.textContent.trim();

    seamMobileNum.textContent = `${String(index + 1).padStart(2, "0")} / ${String(seamBoxes.length).padStart(2, "0")}`;

    seamMobileDesc.replaceChildren(...Array.from(desc.childNodes, (node) => node.cloneNode(true)));

    /* 설명 변경 시 페이드 효과 */
    if (seamAnimation) seamAnimation.cancel();

    if (
      animate &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      typeof seamMobileInfo.animate === "function"
    ) {
      seamAnimation = seamMobileInfo.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 250,
        easing: "ease-out",
      });
    }
  }

  /* 선택 상태 변경 */
  function selectSeam(index) {
    const changed = seamActiveIndex !== index;
    seamActiveIndex = index;

    seamButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;

      button.classList.toggle("dna_active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    seamBoxes.forEach((box, boxIndex) => {
      box.classList.toggle("dna_active", boxIndex === index);

      if (seamMobileView.matches) {
        box.setAttribute("aria-pressed", String(boxIndex === index));
      }
    });

    updateSeamMobile(index, changed);
  }

  /* 재킷 위 + 버튼 클릭 */
  seamButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectSeam(index));
  });

  /* 상세 사진 카드 클릭 */
  seamBoxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 800px)").matches) {
        selectSeam(index);
      }
    });

    /* 모바일 카드 키보드 조작 */
    box.addEventListener("keydown", (event) => {
      if (!seamMobileView.matches || (event.key !== "Enter" && event.key !== " ")) return;

      event.preventDefault();
      selectSeam(index);
    });
  });

  /* 화면 크기 변경 시 선택 상태 유지 */
  function syncSeamMobile() {
    seamBoxes.forEach((box, index) => {
      if (seamMobileView.matches) {
        box.setAttribute("role", "button");
        box.setAttribute("tabindex", "0");

        box.setAttribute(
          "aria-label",
          seamButtons[index]?.getAttribute("aria-label") || `디테일 ${index + 1} 보기`,
        );

        box.setAttribute("aria-pressed", String(index === seamActiveIndex));
      } else {
        box.removeAttribute("role");
        box.removeAttribute("tabindex");
        box.removeAttribute("aria-label");
        box.removeAttribute("aria-pressed");
      }
    });

    updateSeamMobile(seamActiveIndex);
  }

  /* 첫 번째 카드 활성화 */
  if (seamButtons.length && seamBoxes.length) {
    selectSeam(0);
    syncSeamMobile();

    seamMobileView.addEventListener("change", syncSeamMobile);
  }
  /* 스크롤 등장 효과 */
  const revealTargets = document.querySelectorAll(
    [
      ".dna_origin_num",
      ".dna_origin_list",
      ".dna_origin_main_img",
      ".dna_seams_num",
      ".dna_seams_text",
      ".dna_seams_clothes",
      ".dna_seams_detail",
      ".dna_identity_content",
      ".dna_archive_num",
      ".dna_archive_list",
    ].join(", "),
  );

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("dna_visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    revealTargets.forEach((target, index) => {
      target.classList.add("dna_reveal");
      target.style.transitionDelay = `${(index % 3) * 80}ms`;
      observer.observe(target);
    });
  }
})();

/* 디테일 아카이브 */
document.addEventListener("DOMContentLoaded", () => {
  const archiveList = document.querySelector(".dna_archive_list");
  if (!archiveList || typeof gsap === "undefined") return;

  const archiveItems = gsap.utils.toArray(".dna_archive_item", archiveList);
  if (!archiveItems.length) return;

  const expandSize = 4.2;
  const tabletView = window.matchMedia("(max-width: 768px)");
  const mobileView = window.matchMedia("(max-width: 480px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIndex = 0;
  let currentLayout = "";

  /* 반응형 화면 구분 */
  function getLayout() {
    if (mobileView.matches) return "mobile";
    if (tabletView.matches) return "tablet";
    return "desktop";
  }

  /* 화면별 카드 높이 */
  function getCardHeights() {
    return mobileView.matches
      ? { expanded: "45vw", collapsed: "19vw" }
      : { expanded: "33vw", collapsed: "8vw" };
  }

  /* 이미지 너비 설정 */
  function setImageWidth() {
    if (tabletView.matches) {
      archiveItems.forEach((item) => {
        const img = item.querySelector(".dna_archive_img img");
        if (img) img.style.removeProperty("width");
      });
      return;
    }

    const style = getComputedStyle(archiveList);
    const gap = parseFloat(style.columnGap) || 0;
    const totalWidth = archiveList.clientWidth - gap * (archiveItems.length - 1);
    const expandedWidth = totalWidth * (expandSize / (expandSize + archiveItems.length - 1));

    archiveItems.forEach((item) => {
      const img = item.querySelector(".dna_archive_img img");
      if (img) img.style.width = `${expandedWidth}px`;
    });
  }

  /* 가로 및 세로 카드 확장 */
  function archiveActive(index, immediate = false) {
    activeIndex = index;
    const isVertical = tabletView.matches;
    const heights = isVertical ? getCardHeights() : null;

    archiveItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.classList.toggle("dna_active", isActive);

      const target = isVertical
        ? { height: isActive ? heights.expanded : heights.collapsed }
        : { flexGrow: isActive ? expandSize : 1 };

      gsap.to(item, {
        ...target,
        duration: immediate || reduceMotion ? 0 : 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }

  /* 화면 크기에 따른 초기화 */
  function syncArchiveLayout() {
    const layout = getLayout();

    if (layout !== currentLayout) {
      currentLayout = layout;
      gsap.killTweensOf(archiveItems);

      archiveItems.forEach((item) => {
        gsap.set(item, { clearProps: "flexGrow,height" });
      });
    }

    archiveActive(activeIndex, true);
    setImageWidth();
  }

  syncArchiveLayout();
  window.addEventListener("resize", syncArchiveLayout);

  /* 마우스 호버 및 클릭 */
  archiveItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) archiveActive(index);
    });

    item.addEventListener("click", () => archiveActive(index));
  });

  /* 첫 번째 카드로 복귀 */
  archiveList.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover: hover)").matches) archiveActive(0);
  });
});
