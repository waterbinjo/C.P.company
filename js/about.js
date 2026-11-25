/* GSAP 시작 */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.log("GSAP이 연결되지 않았습니다.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 영상 자동재생 */

  const video = document.querySelector(".hero_video video");

  if (video) {
    video.muted = true;
    video.play().catch(() => {
      console.log("영상 자동재생이 제한되었습니다.");
    });
  }

  /* 움직임 최소화 */

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(
        ".founder, .philosophy_title, .philosophy_list, .history_title, .history_item, #ending",
      )
      .forEach((element) => element.classList.add("is-visible"));

    document.querySelector(".timeline").classList.add("is-complete");
    gsap.set(".timeline .line", { scaleY: 1 });

    return;
  }

  const intro = document.querySelector("#intro");
  const panels = document.querySelector(".panels");
  const founder = document.querySelector(".founder");
  const timeline = document.querySelector(".timeline");

  /* 영상과 가로 스크롤 */

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

      /* 첫 화면 초기 상태 */

      gsap.set(".hero_title", {
        autoAlpha: 0,
        y: 70,
      });

      gsap.set(".hero_desc", {
        autoAlpha: 0,
        y: 30,
      });

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
            if (self.progress >= 0.66) {
              founder.classList.add("is-visible");
            } else if (self.progress < 0.6) {
              founder.classList.remove("is-visible");
            }
          },
        },
      });

      /* 영상 화면 유지 */

      introMotion.to(hold, {
        value: 1,
        duration: 0.3,
        ease: "none",
      });

      /* 영상 어두워짐 */

      introMotion.to(".dark", {
        opacity: 0.78,
        duration: 0.65,
        ease: "none",
      });

      /* 큰 글씨 등장 */

      introMotion.to(".hero_title", {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      });

      /* 작은 글씨 등장 */

      introMotion.to(".hero_desc", {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      /* 텍스트 화면 유지 */

      introMotion.to(hold, {
        value: 2,
        duration: 0.65,
        ease: "none",
      });

      /* 가로 스크롤 */

      introMotion.to(panels, {
        xPercent: -50,
        duration: 1.45,
        ease: "none",
      });

      /* PC, 1024px 창립자 화면 유지 */

      if (!isMobile && !is768) {
        introMotion.to(hold, {
          value: 3,
          duration: 0.5,
          ease: "none",
        });
      }

      return () => founder.classList.remove("is-visible");
    },
  );

  /* 디자인 철학 */

  ScrollTrigger.create({
    trigger: ".philosophy_title",
    start: "top 85%",

    onEnter: () => {
      document.querySelector(".philosophy_title").classList.add("is-visible");
    },

    onLeaveBack: () => {
      document.querySelector(".philosophy_title").classList.remove("is-visible");
    },
  });

  ScrollTrigger.create({
    trigger: ".philosophy_list",
    start: "top 80%",

    onEnter: () => {
      document.querySelector(".philosophy_list").classList.add("is-visible");
    },

    onLeaveBack: () => {
      document.querySelector(".philosophy_list").classList.remove("is-visible");
    },
  });

  /* HISTORY 제목 */

  ScrollTrigger.create({
    trigger: "#history",
    start: "top 80%",

    onEnter: () => {
      document.querySelector(".history_title").classList.add("is-visible");
    },

    onLeaveBack: () => {
      document.querySelector(".history_title").classList.remove("is-visible");
    },
  });

  /* HISTORY 중앙선 */

  gsap.fromTo(
    ".timeline .line",
    {
      scaleY: 0,
    },
    {
      scaleY: 1,
      ease: "none",

      scrollTrigger: {
        trigger: ".timeline",
        start: "top 72%",
        end: "bottom 72%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );

  /* 연혁 등장 */

  const histories = gsap.utils.toArray(".history_item");

  histories.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 72%",

      onEnter: () => {
        item.classList.add("is-visible");
      },

      onLeaveBack: () => {
        item.classList.remove("is-visible");
      },
    });
  });

  /* 타임라인 화살표 */

  ScrollTrigger.create({
    trigger: ".timeline",
    start: "bottom 72%",

    onEnter: () => {
      timeline.classList.add("is-complete");
    },

    onLeaveBack: () => {
      timeline.classList.remove("is-complete");
    },
  });

  /* 마지막 문구 */

  const ending = document.querySelector("#ending");

  ScrollTrigger.create({
    trigger: ending,
    start: "top 75%",

    onEnter: () => {
      ending.classList.add("is-visible");
    },

    onLeaveBack: () => {
      ending.classList.remove("is-visible");
    },
  });

  /* 화면 크기 재계산 */

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});
