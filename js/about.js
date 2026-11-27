document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.log("GSAP이 연결되지 않았습니다.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 영상 자동재생
  const video = document.querySelector(".hero_video video");

  if (video) {
    video.muted = true;
    video.play().catch(() => {
      console.log("영상 자동재생이 제한되었습니다.");
    });
  }

  // 움직임 최소화
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(
        ".founder, .philosophy_title, .philosophy_list, .history_title, .history_item, #ending",
      )
      .forEach((element) => element.classList.add("is-visible"));

    document.querySelector(".timeline")?.classList.add("is-complete");
    gsap.set(".timeline .line", { scaleY: 1 });

    return;
  }

  const intro = document.querySelector("#intro");
  const panels = document.querySelector(".panels");
  const founder = document.querySelector(".founder");
  const timeline = document.querySelector(".timeline");

  // 영상과 가로 스크롤
  const introMedia = gsap.matchMedia();

  introMedia.add(
    {
      mobile: "(max-width: 480px)",
      tablet: "(max-width: 768px)",
      all: "all",
    },
    (context) => {
      const isMobile = context.conditions.mobile;
      const is768 = context.conditions.tablet && !isMobile;

      const hold = { value: 0 };

      // 화살표 요소
      const videoArrow = intro.querySelector(".about_scroll_arrow--video");
      const darkArrow = intro.querySelector(".about_scroll_arrow--dark");

      // 중요: 창립자 화살표는 panels 바깥에 있으므로 document에서 선택
      const founderArrow = document.querySelector(".about_scroll_arrow--founder");

      // 창립자 화면 진행 위치
      let founderProgress = 1;

      // 화살표 초기 상태
      gsap.set(videoArrow, { autoAlpha: 1 });
      gsap.set([darkArrow, founderArrow], { autoAlpha: 0 });

      // 첫 화면 초기 상태
      gsap.set(".hero_title", {
        autoAlpha: 0,
        y: 70,
      });

      gsap.set(".hero_desc", {
        autoAlpha: 0,
        y: 30,
      });

      // 인트로 타임라인
      const introMotion = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: "top top",
          end: () => "+=" + window.innerHeight * (isMobile ? 2.7 : is768 ? 3.1 : 4.7),

          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            // 창립자 콘텐츠 등장
            if (self.progress >= 0.66) {
              founder.classList.add("is-visible");
            }

            // 창립자 화면이 완전히 나타났을 때 화살표 표시
            if (self.progress >= founderProgress && self.progress < 1) {
              gsap.set(founderArrow, { autoAlpha: 1 });
            } else {
              gsap.set(founderArrow, { autoAlpha: 0 });
            }
          },
        },
      });

      // 01. 영상 화면 유지
      introMotion.to(hold, {
        value: 1,
        duration: 0.3,
        ease: "none",
      });

      // 02. 영상 어두워짐
      introMotion.to(".dark", {
        opacity: 0.78,
        duration: 0.65,
        ease: "none",
      });

      // 첫 번째 화살표 숨기기
      introMotion.to(
        videoArrow,
        {
          autoAlpha: 0,
          duration: 0.15,
          ease: "none",
        },
        "<",
      );

      // 두 번째 화살표 표시
      introMotion.to(
        darkArrow,
        {
          autoAlpha: 1,
          duration: 0.15,
          ease: "none",
        },
        "<",
      );

      // 03. 큰 글씨 등장
      introMotion.to(".hero_title", {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      });

      // 04. 작은 글씨 등장
      introMotion.to(".hero_desc", {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // 05. 텍스트 화면 유지
      introMotion.to(hold, {
        value: 2,
        duration: 0.65,
        ease: "none",
      });

      // 어두워진 영상 화면 위치
      introMotion.addLabel("dark");

      // 06. 가로 스크롤
      introMotion.to(panels, {
        xPercent: -50,
        duration: 1.45,
        ease: "none",
      });

      // 가로 스크롤 시작과 함께 두 번째 화살표 숨기기
      introMotion.to(
        darkArrow,
        {
          autoAlpha: 0,
          duration: 0.15,
          ease: "none",
        },
        "<",
      );

      // 창립자 화면 위치
      introMotion.addLabel("founder");

      // 07. 창립자 화면 유지
      introMotion.to(hold, {
        value: 3,
        duration: isMobile || is768 ? 1.2 : 0.5,
        ease: "none",
      });

      // 창립자 화면에 도달하는 스크롤 진행률 계산
      founderProgress = introMotion.labels.founder / introMotion.duration();

      // 특정 타임라인 위치로 이동
      const moveToLabel = (label) => {
        const trigger = introMotion.scrollTrigger;
        const labelTime = introMotion.labels[label];

        const progress = labelTime / introMotion.duration();

        const target = trigger.start + (trigger.end - trigger.start) * progress;

        window.scrollTo({
          top: target,
          behavior: "smooth",
        });
      };

      // 첫 번째 화살표 클릭
      const goToDark = () => {
        moveToLabel("dark");
      };

      // 두 번째 화살표 클릭
      const goToFounder = () => {
        moveToLabel("founder");
      };

      // 창립자 화살표 클릭
      // 다음에 표시되는 섹션으로 세로 스크롤
      const goToNextSection = () => {
        const nextSections = [
          document.querySelector(".founder_quote"),
          document.querySelector("#philosophy"),
        ];

        // display: none인 섹션은 건너뛰기
        const nextSection = nextSections.find((section) => {
          return section && window.getComputedStyle(section).display !== "none";
        });

        if (!nextSection) return;

        const trigger = introMotion.scrollTrigger;

        // 다음 섹션의 실제 문서 위치
        const sectionPosition = nextSection.getBoundingClientRect().top + window.scrollY;

        // 핀 구간이 끝난 뒤 다음 섹션으로 이동
        const targetPosition = Math.max(sectionPosition, trigger.end + 1);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      };

      // 화살표 클릭 이벤트 연결
      videoArrow.addEventListener("click", goToDark);
      darkArrow.addEventListener("click", goToFounder);
      founderArrow.addEventListener("click", goToNextSection);

      // GSAP matchMedia 정리
      return () => {
        videoArrow.removeEventListener("click", goToDark);
        darkArrow.removeEventListener("click", goToFounder);
        founderArrow.removeEventListener("click", goToNextSection);

        founder.classList.remove("is-visible");
      };
    },
  );

  // 디자인 철학 제목
  ScrollTrigger.create({
    trigger: ".philosophy_title",
    start: "top 85%",
    once: true,

    onEnter: () => {
      document.querySelector(".philosophy_title").classList.add("is-visible");
    },
  });

  // 디자인 철학 목록
  ScrollTrigger.create({
    trigger: ".philosophy_list",
    start: "top 80%",
    once: true,

    onEnter: () => {
      document.querySelector(".philosophy_list").classList.add("is-visible");
    },
  });

  // 히스토리 제목
  ScrollTrigger.create({
    trigger: "#history",
    start: "top 80%",
    once: true,

    onEnter: () => {
      document.querySelector(".history_title").classList.add("is-visible");
    },
  });

  // 히스토리 중앙선
  let maxLineProgress = 0;

  ScrollTrigger.create({
    trigger: ".timeline",
    start: "top 72%",
    end: "bottom 72%",
    invalidateOnRefresh: true,

    onUpdate: (self) => {
      if (self.progress > maxLineProgress) {
        maxLineProgress = self.progress;

        gsap.set(".timeline .line", {
          scaleY: maxLineProgress,
        });
      }
    },
  });

  // 연혁 등장
  const histories = gsap.utils.toArray(".history_item");

  histories.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 72%",
      once: true,

      onEnter: () => {
        item.classList.add("is-visible");
      },
    });
  });

  // 타임라인 화살표
  ScrollTrigger.create({
    trigger: ".timeline",
    start: "bottom 72%",
    once: true,

    onEnter: () => {
      timeline.classList.add("is-complete");
    },
  });

  // 마지막 문구
  const ending = document.querySelector("#ending");

  ScrollTrigger.create({
    trigger: ending,
    start: "top 75%",
    once: true,

    onEnter: () => {
      ending.classList.add("is-visible");
    },
  });

  // 화면 크기 재계산
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});
