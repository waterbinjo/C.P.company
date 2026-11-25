/* 01. 영상 소리 켜기 / 끄기 */

const labVideo = document.querySelector("#labVideo");
const labSound = document.querySelector("#labSound");

if (labVideo && labSound) {
  function updateSoundIcon() {
    labSound.setAttribute("aria-pressed", String(!labVideo.muted));

    labSound.setAttribute("aria-label", labVideo.muted ? "소리 켜기" : "소리 끄기");
  }

  updateSoundIcon();

  labSound.addEventListener("click", () => {
    labVideo.muted = !labVideo.muted;
    updateSoundIcon();
  });
}

/* 02. 스크롤 요소 */

const process = document.querySelector("#labProcess");

const dyeScene = document.querySelector("#labDyeScene");
const beaker = document.querySelector(".lab_beaker");
const water = document.querySelector("#labWater");
const steps = document.querySelectorAll(".lab_step");
const progressFill = document.querySelector("#labProgressFill");

const patternScene = document.querySelector("#labPatternScene");
const patternInner = document.querySelector("#labPatternInner");
const parts = document.querySelectorAll(".lab_part");

const notesBox = document.querySelector(".lab_pattern_notes");
const patternLabel = document.querySelector(".lab_pattern_label");
const patternNotes = document.querySelectorAll(".lab_pattern_note");
const patternBars = document.querySelectorAll(".lab_pattern_bar");
const patternProgress = document.querySelector(".lab_pattern_progress");

const completeScene = document.querySelector("#labCompleteScene");
const completeCoat = document.querySelector("#labCompleteCoat");
const completeCopy = document.querySelector("#labCompleteCopy");

/* 03. 공통 함수 */
const colors = ["#6D9465", "#436A9C", "#CE693B", "#963B46"];
const clamp = (value) => Math.max(0, Math.min(1, value));
const section = (value, start, end) => clamp((value - start) / (end - start));

/* 04. 데스크톱 / 1024px 패턴 스크롤 잠금 */

let patternReady = false;
let patternLocked = false;
let patternLockY = 0;

function blockScroll(event) {
  if (patternLocked) {
    event.preventDefault();
  }
}

window.addEventListener("wheel", blockScroll, {
  passive: false,
});

window.addEventListener("touchmove", blockScroll, {
  passive: false,
});

window.addEventListener("keydown", (event) => {
  const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];

  if (patternLocked && scrollKeys.includes(event.key)) {
    event.preventDefault();
  }
});

/* 패턴 자동 등장 완료 */

if (patternScene) {
  patternScene.addEventListener("animationend", (event) => {
    if (window.innerWidth <= 768) return;
    if (event.target !== patternNotes[3]) return;
    if (event.animationName !== "labLineIn") return;
    if (event.pseudoElement !== "::after") return;

    patternReady = true;
    patternLocked = false;

    updateLabScroll();
  });
}

/* 05. 모바일 패턴 설명 */

function updateMobilePattern(progress) {
  /* 설명 시작 구간 */
  const noteStart = 0.52;

  /* 설명 종료 구간 */
  const noteEnd = 0.78;

  let stage = -1;

  if (progress >= noteStart) {
    const noteProgress = section(progress, noteStart, noteEnd);

    stage = Math.min(3, Math.floor(noteProgress * 4));
  }

  /* 설명 한 개씩 표시 */
  patternNotes.forEach((note, i) => {
    note.classList.toggle("is-active", i === stage);
  });

  /* 진행 바 순차적으로 채우기 */
  patternBars.forEach((bar, i) => {
    bar.classList.toggle("is-active", i <= stage);
  });

  /* 설명 등장 완료 */
  patternReady = progress >= noteEnd;
}

/* 모바일 패턴 초기화 */

function resetMobilePattern() {
  patternNotes.forEach((note) => {
    note.classList.remove("is-active");
  });

  patternBars.forEach((bar) => {
    bar.classList.remove("is-active");
  });

  patternReady = false;
}

/* 06. 스크롤 애니메이션 */

function updateLabScroll() {
  if (!process || !dyeScene || !beaker || !water || !patternScene || !completeScene) return;

  /* 화면 크기 구분 */

  const mobile = window.innerWidth <= 768;

  const tablet1024 = window.innerWidth > 768 && window.innerWidth <= 1024;

  /* 모바일 스크롤 잠금 해제 */

  if (mobile) {
    patternLocked = false;
  }

  /* 데스크톱 / 1024px 스크롤 잠금 위치 유지 */

  if (!mobile && patternLocked && Math.abs(window.scrollY - patternLockY) > 1) {
    window.scrollTo({
      top: patternLockY,
      behavior: "instant",
    });

    return;
  }

  /* 전체 스크롤 진행률 */

  const distance = Math.max(1, process.offsetHeight - window.innerHeight);

  const scrolled = -process.getBoundingClientRect().top;

  /* 1024px 반응형 스크롤 진행률 */

  const processTop = window.scrollY + process.getBoundingClientRect().top;

  const dyeEnd = Math.max(
    1,
    Math.min(distance * 0.8, 2953 * (window.innerWidth / 1024) - processTop),
  );

  const tail = Math.max(1, Math.min(650, process.offsetHeight - window.innerHeight - dyeEnd));

  const progress = tablet1024
    ? scrolled < dyeEnd
      ? 0.49 * clamp(scrolled / dyeEnd)
      : 0.49 + 0.51 * section(scrolled, dyeEnd, dyeEnd + tail)
    : clamp(scrolled / distance);

  /* 07. 비커 물 채우기 */

  const dye = clamp(progress / 0.36);

  water.style.height = `${dye * 100}%`;

  if (mobile) {
    /* 모바일 설명 한 개씩 변경 */

    const stage = Math.min(3, Math.floor(dye * 4));

    water.style.backgroundColor = colors[stage];

    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i === stage);
    });

    /* 염색 진행 바 */

    if (progressFill) {
      progressFill.style.width = `${dye * 100}%`;
    }
  } else {
    /* 데스크톱 / 1024px 설명 누적 등장 */

    const stage = Math.min(4, Math.floor(dye * 5));

    water.style.backgroundColor = colors[Math.max(0, stage - 1)];

    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i < stage);
    });
  }

  /* 08. 비커 확대 */

  const zoom = section(progress, 0.36, 0.48);

  beaker.style.transform = `scale(${1 + zoom * 9})`;

  beaker.style.transformOrigin = "50% 50%";

  dyeScene.style.opacity = 1 - section(progress, 0.43, 0.5);

  /* 1024px 비커 장면 숨기기 */

  if (tablet1024) {
    dyeScene.style.visibility = progress >= 0.49 ? "hidden" : "visible";
  }

  /* 09. 패턴 장면 등장 */

  if (mobile) {
    /* 모바일 스크롤에 따라 패턴 설명 변경 */

    if (progress >= 0.49) {
      patternScene.classList.add("is-playing");

      updateMobilePattern(progress);
    } else {
      patternScene.classList.remove("is-playing");

      resetMobilePattern();
    }
  } else {
    /* 데스크톱 / 1024px 패턴 자동 등장 */

    if (progress >= 0.49) {
      if (!patternReady && !patternLocked) {
        patternLocked = true;

        patternLockY = tablet1024
          ? processTop + dyeEnd
          : window.scrollY + process.getBoundingClientRect().top + distance * 0.5;

        window.scrollTo({
          top: patternLockY,
          behavior: "instant",
        });
      }

      patternScene.classList.add("is-playing");
    } else if (!patternLocked) {
      patternScene.classList.remove("is-playing");

      patternReady = false;
    }
  }

  /* 10. 패턴에서 완성된 옷으로 전환 */

  const finish = patternReady ? section(progress, mobile ? 0.93 : 0.91, mobile ? 0.995 : 0.99) : 0;

  /* 패턴 장면 투명도 */

  const patternVisibility = mobile ? (progress >= 0.49 ? 1 : 0) : section(progress, 0.46, 0.5);

  patternScene.style.opacity = patternVisibility * (1 - finish);

  /* 완성된 옷 등장 */

  completeScene.style.opacity = finish;

  /* 11. 패턴 조각 입체 결합 */

  if (patternInner) {
    /* 결합 중심 가로 좌표 */

    const targetX = mobile
      ? patternInner.clientWidth / 2
      : window.innerWidth <= 1024
        ? patternInner.clientWidth * 0.38
        : patternInner.clientWidth / 2 - 238 * (window.innerWidth / 1920);

    /* 결합 중심 세로 좌표 */

    const targetY =
      patternInner.clientHeight / 2 -
      (window.innerWidth > 1024 ? 68 * (window.innerWidth / 1920) : 0);

    parts.forEach((part, i) => {
      /* 설명 종료 후 패턴 결합 시작 */

      const start = mobile ? 0.8 + i * 0.015 : 0.72 + i * 0.018;

      const end = mobile ? 0.93 : 0.96;

      const raw = patternReady ? section(progress, start, end) : 0;

      /* 부드러운 가속과 감속 */

      const gather = (1 - Math.cos(raw * Math.PI)) / 2;

      /* 결합 중심까지 이동 거리 */

      const x = targetX - (part.offsetLeft + part.offsetWidth / 2);

      const y = targetY - (part.offsetTop + part.offsetHeight / 2);

      const angle = Number(part.dataset.rotate || 0);

      /* 입체 깊이와 회전 */

      const depth = Math.sin(gather * Math.PI) * 100;

      const tilt = Math.sin(gather * Math.PI) * 18;

      const scale = 1 - gather * 0.78;

      /* 패턴 조각 결합 */

      part.style.transform = `
        translate3d(
          ${x * gather}px,
          ${y * gather}px,
          ${depth}px
        )
        rotateY(${tilt}deg)
        rotate(${angle * (1 - gather)}deg)
        scale(${scale})
      `;
    });
  }

  /* 12. 설명과 진행 바 사라지기 */

  const fade = 1 - section(progress, mobile ? 0.8 : 0.7, mobile ? 0.87 : 0.77);

  if (notesBox) {
    notesBox.style.opacity = fade;
  }

  if (patternLabel) {
    patternLabel.style.filter = `opacity(${fade})`;
  }

  if (patternProgress) {
    patternProgress.style.opacity = fade;
  }

  /* 13. 완성된 의류 등장 */

  if (completeCoat) {
    completeCoat.style.setProperty("--coat-scale", 0.87 + finish * 0.13);
  }

  if (completeCopy) {
    completeCopy.style.opacity = patternReady
      ? section(progress, mobile ? 0.96 : 0.94, mobile ? 0.999 : 0.99)
      : 0;
  }
}

/* 14. 이벤트 실행 */

window.addEventListener("scroll", updateLabScroll, {
  passive: true,
});

window.addEventListener("resize", updateLabScroll);

updateLabScroll();
