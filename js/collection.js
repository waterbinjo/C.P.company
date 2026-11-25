/* 컬렉션 카테고리 */

const categories = [
  {
    id: "10-20",
    label: "'10 - '20",
    folder: "10-20",
    prefix: "10s",
    count: 5,
  },
  {
    id: "00-10",
    label: "'00 - '10",
    folder: "00-10",
    prefix: "00s",
    count: 4,
  },
  {
    id: "90-00",
    label: "'90 - '00",
    folder: "90-00",
    prefix: "90s",
    count: 5,
  },
  {
    id: "80-90",
    label: "'80 - '90",
    folder: "80-90",
    prefix: "80s",
    count: 5,
  },
  {
    id: "80-70",
    label: "'80 - '70",
    folder: "70-80",
    prefix: "70s",
    count: 5,
  },
];

/* 상세페이지 링크 */

const DETAIL_LINKS = {
  /* 2010년대 */

  "10-20-01": "./detail.html?id=14",
  "10-20-02": "./detail.html?id=15",
  "10-20-03": "./detail.html?id=16",
  "10-20-04": "./detail.html?id=17",
  "10-20-05": "./detail.html?id=18",

  /* 2000년대 */

  "00-10-01": "./detail.html?id=01",
  "00-10-02": "./detail.html?id=11",
  "00-10-03": "./detail.html?id=12",
  "00-10-04": "./detail.html?id=13",

  /* 1990년대 */

  "90-00-01": "./detail.html?id=19",
  "90-00-02": "./detail.html?id=20",
  "90-00-03": "./detail.html?id=21",
  "90-00-04": "./detail.html?id=22",
  "90-00-05": "./detail.html?id=23",

  /* 1980년대 */

  "80-90-01": "./detail.html?id=06",
  "80-90-02": "./detail.html?id=07",
  "80-90-03": "./detail.html?id=08",
  "80-90-04": "./detail.html?id=09",
  "80-90-05": "./detail.html?id=10",

  /* 1970년대 */

  "80-70-01": "./detail.html?id=02",
  "80-70-02": "./detail.html?id=03",
  "80-70-03": "./detail.html?id=04",
  "80-70-04": "./detail.html?id=05",
  "80-70-05": "./detail.html?id=06-early",
};

/* 컬렉션 이미지 목록 */

const collections = categories.flatMap((category) =>
  Array.from({ length: category.count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const id = `${category.id}-${number}`;

    return {
      id,
      category: category.id,
      title: `${category.label} Collection ${number}`,
      image: `./img/collection/${category.folder}/collection-${category.prefix}-${number}.webp`,
      link: DETAIL_LINKS[id] || "",
    };
  }),
);

/* 이미지 랜덤 배열 */

function shuffleCollections(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* 페이지 진입 시 한 번만 랜덤 배치 */

const randomCollections = shuffleCollections(collections);

/* HTML 요소 선택 */

const section = document.querySelector("#collection");
const scene = document.querySelector(".collection-scene");
const gallery = document.querySelector("#collectionGallery");
const gridSurface = document.querySelector(".grid-surface");

const selectedGallery = document.querySelector("#selectedGallery");
const overlay = document.querySelector("#collectionOverlay");

const categoryMenu = document.querySelector("#categoryMenu");
const categoryTrigger = document.querySelector("#categoryTrigger");
const categoryPanel = document.querySelector("#categoryPanel");
const categoryClose = document.querySelector("#categoryClose");
const categoryList = document.querySelector("#categoryList");
const categoryLabel = document.querySelector("#categoryLabel");

/* 상세페이지 요소 */

const detailModal = document.querySelector("#detailModal");
const detailFrame = document.querySelector("#detailFrame");

/* 기본 상태 */

let selectedCategory = "all";
let menuOpen = false;
let wheelFrame = 0;

/* 화면별 열 개수 */

function getLayoutMode() {
  if (window.innerWidth <= 480) return 2;
  if (window.innerWidth <= 768) return 3;

  return 4;
}

let currentLayout = getLayoutMode();

/* 배경 그리드 생성 */

const SVG_NS = "http://www.w3.org/2000/svg";
const gridSVG = document.createElementNS(SVG_NS, "svg");

gridSVG.setAttribute("id", "roomGrid");
gridSVG.setAttribute("preserveAspectRatio", "none");
gridSVG.setAttribute("aria-hidden", "true");

gridSurface.appendChild(gridSVG);

/* 그리드 크기 고정 */

const GRID_CELL = 61.44;
const GRID_RADIUS = 729.6;

/* 그리드 곡률 계산 */

function drawGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  gridSVG.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const centerX = w / 2;
  const centerY = h / 2;

  const cell = GRID_CELL;
  const radius = GRID_RADIUS;

  let paths = "";

  /* 세로선 생성 */

  const verticalCount = Math.ceil((Math.asinh(w / radius) * radius) / cell) + 3;

  for (let i = -verticalCount; i <= verticalCount; i++) {
    const x = centerX + radius * Math.sinh(((i + 0.67) * cell) / radius);

    paths += `
      <path d="
        M ${x} 0
        L ${x} ${h}
      "/>
    `;
  }

  /* 가로 곡선 생성 */

  const horizontalCount = Math.ceil(h / cell) + 3;

  for (let i = -horizontalCount; i <= horizontalCount; i++) {
    let d = "";

    for (let j = 0; j <= 80; j++) {
      const x = (j / 80) * w;

      const depth = Math.sqrt(1 + Math.pow((x - centerX) / radius, 2));

      const y = centerY + i * cell * depth;

      d += `${j === 0 ? "M" : "L"} ${x} ${y} `;
    }

    paths += `<path d="${d}" />`;
  }

  /* 그리드 선 스타일 */

  gridSVG.innerHTML = `
    <g
      fill="none"
      stroke="#050505"
      stroke-width="1.2"
      opacity="0.82"
    >
      ${paths}
    </g>
  `;
}

/* 컬렉션 이미지 생성 */

function createImage(item, className) {
  const card = document.createElement("a");

  card.className = className;
  card.href = item.link || "#";

  card.setAttribute("aria-label", item.title);

  if (item.link) {
    card.setAttribute("aria-haspopup", "dialog");
  }

  const img = document.createElement("img");

  img.src = item.image;
  img.alt = item.title;
  img.loading = "lazy";
  img.decoding = "async";

  card.appendChild(img);

  return card;
}

/* 상세페이지 열기 */

function openDetail(link) {
  if (!link || link === "#" || detailModal.open) return;

  detailFrame.src = link;

  detailModal.showModal();
}

/* 상세페이지 닫기 */

function closeDetail() {
  if (!detailModal.open) return;

  detailModal.close();
}

/* 상세페이지 닫힌 후 초기화 */

detailModal.addEventListener("close", () => {
  detailFrame.src = "about:blank";
});

/* 컬렉션 이미지 클릭 */

section.addEventListener("click", (event) => {
  const card = event.target.closest(".collection-item, .selected-item");

  if (!card) return;

  event.preventDefault();

  const link = card.getAttribute("href");

  openDetail(link);
});

/* 상세페이지 바깥 클릭 */

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeDetail();
  }
});

/* 상세페이지 내부 ESC 처리 */

detailFrame.addEventListener("load", () => {
  if (!detailModal.open) return;

  detailFrame.contentDocument?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    }
  });
});

/* 전체 컬렉션 생성 */

function createGallery() {
  const fragment = document.createDocumentFragment();

  /* 24장씩 3개 구간을 동일한 랜덤 순서로 반복 */

  for (let i = 0; i < 3; i++) {
    randomCollections.forEach((item) => {
      fragment.appendChild(createImage(item, "collection-item"));
    });
  }

  gallery.replaceChildren(fragment);

  /* 가운데 복제 구간에서 시작 */

  const cycleHeight = gallery.scrollHeight / 3;

  const startOffset = window.innerWidth <= 768 ? 45 : window.innerHeight * 0.25;

  scene.scrollTop = cycleHeight + startOffset;

  requestMobileWheel();
}

/* 무한 스크롤 */

function infiniteScroll() {
  const cycleHeight = gallery.scrollHeight / 3;

  if (!cycleHeight) return;

  const scroll = scene.scrollTop;

  /* 첫 번째 구간에서 가운데로 이동 */

  if (scroll < cycleHeight) {
    scene.scrollTop = scroll + cycleHeight;
  } else if (scroll >= cycleHeight * 2) {

  /* 세 번째 구간에서 가운데로 이동 */
    scene.scrollTop = scroll - cycleHeight;
  }

  requestMobileWheel();
}

/* 스크롤 이벤트 */

scene.addEventListener("scroll", infiniteScroll, {
  passive: true,
});

/* 모바일 원통형 스크롤 */

function requestMobileWheel() {
  if (window.innerWidth > 480 || wheelFrame) return;

  wheelFrame = requestAnimationFrame(() => {
    wheelFrame = 0;

    updateMobileWheel();
  });
}

/* 모바일 오목한 곡률 계산 */

function updateMobileWheel() {
  const items = gallery.querySelectorAll(".collection-item");

  const screenCenter = scene.clientHeight / 2;

  const rowHeight = parseFloat(getComputedStyle(gallery).gridAutoRows);

  /* 원통 반지름 */

  const radius = scene.clientHeight * 0.68;

  items.forEach((item, index) => {
    const row = Math.floor(index / 2);

    /* 이미지의 화면상 세로 위치 */

    const centerY = (row + 0.5) * rowHeight - scene.scrollTop;

    const distance = centerY - screenCenter;

    /* 화면 밖의 이미지 숨김 */

    if (Math.abs(distance) > scene.clientHeight * 0.9) {
      item.style.visibility = "hidden";

      return;
    }

    item.style.visibility = "visible";

    /* 원통 회전 각도 */

    const angle = Math.max(-1.35, Math.min(1.35, distance / radius));

    /* 원형 궤도에 따른 세로 위치 */

    const curvedY = Math.sin(angle) * radius;
    const moveY = curvedY - distance;

    /* 가운데는 안쪽, 위아래는 앞쪽 */

    const depth = 140 * (1 - Math.cos(angle));

    /* 오목한 형태로 회전 */

    const rotateX = angle * 38;

    /* CSS 변수로 위치와 회전값 전달 */

    item.style.setProperty("--wheel-y", `${moveY}px`);
    item.style.setProperty("--wheel-z", `${depth}px`);
    item.style.setProperty("--wheel-x", `${rotateX}deg`);
  });
}

/* 카테고리 메뉴 열기 및 닫기 */

function toggleCategoryMenu(open) {
  menuOpen = open;

  categoryMenu.classList.toggle("is-open", open);

  categoryTrigger.setAttribute("aria-expanded", String(open));

  categoryPanel.setAttribute("aria-hidden", String(!open));

  categoryPanel.inert = !open;
  categoryTrigger.inert = open;
}

/* 카테고리 열기 */

categoryTrigger.addEventListener("click", () => {
  toggleCategoryMenu(true);
});

/* 카테고리 닫기 */

categoryClose.addEventListener("click", () => {
  toggleCategoryMenu(false);
});

/* 카테고리 선택 */

function selectCategory(categoryId) {
  selectedCategory = categoryId;

  toggleCategoryMenu(false);

  const current = categories.find((category) => category.id === categoryId);

  const label = current ? current.label : "ALL";

  /* 선택한 카테고리 이름 표시 */

  categoryLabel.textContent = `( ${label} )`;

  /* 카테고리 선택 상태 갱신 */

  categoryList.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === categoryId));
  });

  const isSelected = categoryId !== "all";

  /* 배경 블러 적용 */

  section.classList.toggle("is-selected", isSelected);

  /* 배경 클릭 영역 활성화 */

  overlay.hidden = !isSelected;

  /* 선택된 컬렉션 표시 */

  selectedGallery.classList.toggle("is-visible", isSelected);

  selectedGallery.setAttribute("aria-hidden", String(!isSelected));

  selectedGallery.inert = !isSelected;

  /* 배경 갤러리 클릭 비활성화 */

  scene.inert = isSelected;

  if (isSelected) {
    /* 해당 카테고리 이미지 전체 가져오기 */

    const images = collections.filter((item) => item.category === categoryId);

    /* 이미지 개수에 따라 CSS 배치 변경 */

    selectedGallery.dataset.count = images.length;

    selectedGallery.replaceChildren(...images.map((item) => createImage(item, "selected-item")));
  } else {
    selectedGallery.replaceChildren();

    delete selectedGallery.dataset.count;
  }
}

/* 카테고리 클릭 이벤트 */

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");

  if (!button) return;

  selectCategory(button.dataset.category);
});

/* 카테고리 선택 해제 */

overlay.addEventListener("click", () => {
  selectCategory("all");
});

/* ESC 키 처리 */

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  /* 상세페이지가 열려 있으면 상세페이지만 닫기 */

  if (detailModal.open) {
    event.preventDefault();

    closeDetail();

    return;
  }

  /* 카테고리 메뉴 닫기 */

  if (menuOpen) {
    toggleCategoryMenu(false);

    categoryTrigger.focus();
  } else if (selectedCategory !== "all") {

  /* 카테고리 선택 해제 */
    selectCategory("all");
  }
});

/* 화면 크기 변경 */

function resizeCollection() {
  drawGrid();

  const nextLayout = getLayoutMode();

  /* 열 개수가 변경되면 갤러리 다시 생성 */

  if (nextLayout !== currentLayout) {
    currentLayout = nextLayout;

    createGallery();
  } else {
    /* 모바일에서 PC 또는 태블릿으로 변경된 경우 */

    if (nextLayout !== 2) {
      gallery.querySelectorAll(".collection-item").forEach((item) => {
        item.style.visibility = "";
      });
    }

    requestMobileWheel();
  }
}

window.addEventListener("resize", resizeCollection);

/* 초기 실행 */

drawGrid();
createGallery();
selectCategory("all");
