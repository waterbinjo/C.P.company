import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

/* 기본 요소 */

const home = document.querySelector("#home");
const gallery = document.querySelector("#spiralGallery");
const lensCanvas = document.querySelector("#lensCanvas");
const gridContainer = document.querySelector(".grid-surface");

const detailModal = document.querySelector("#detailModal");
const detailFrame = document.querySelector("#detailFrame");

const getWidth = () => home.clientWidth;
const getHeight = () => home.clientHeight;

/* 반응형 단위 변환 */

function getCSSPixel(variable) {
  const value = getComputedStyle(home).getPropertyValue(variable).trim();
  const number = parseFloat(value);

  if (value.endsWith("vw")) {
    return (number / 100) * window.innerWidth;
  }

  if (value.endsWith("vh")) {
    return (number / 100) * window.innerHeight;
  }

  return number;
}

/* 나선형 설정 */

const SPIRAL = {
  count: 24,
  postersPerTurn: 10,
  spacing: 70,
  radiusX: 0.25,
  radiusZ: 400,
  speed: 0.1,
  smooth: 0.055,
  startAngle: -0.5,
  centerOffset: 0.18,
};

/* 자동 스크롤 설정 */

const AUTO_SCROLL = {
  speed: 13,
  delay: 500,
};

/* 렌즈 회전 설정 */

const LENS_ROTATION = {
  speed: 1.6,
};

/* 반응형 나선 설정 */

function updateSpiralSettings() {
  const style = getComputedStyle(home);

  SPIRAL.radiusX = parseFloat(style.getPropertyValue("--spiral-radius-x")) || 0.25;

  SPIRAL.spacing = getCSSPixel("--spiral-spacing") || 70;

  const offset = parseFloat(style.getPropertyValue("--spiral-center-offset"));

  SPIRAL.centerOffset = Number.isFinite(offset) ? offset : 0.18;
}

/* 포스터 데이터 */

const posterData = [
  /* 00-10 */
  { image: "./img/home/00-10/collection-00s-01.webp", link: "./detail.html?id=01" },
  { image: "./img/home/00-10/collection-00s-02.webp", link: "./detail.html?id=11" },
  { image: "./img/home/00-10/collection-00s-03.webp", link: "./detail.html?id=12" },
  { image: "./img/home/00-10/collection-00s-04.webp", link: "./detail.html?id=13" },

  /* 10-20 */
  { image: "./img/home/10-20/collection-10s-01.webp", link: "./detail.html?id=14" },
  { image: "./img/home/10-20/collection-10s-02.webp", link: "./detail.html?id=15" },
  { image: "./img/home/10-20/collection-10s-03.webp", link: "./detail.html?id=16" },
  { image: "./img/home/10-20/collection-10s-04.webp", link: "./detail.html?id=17" },
  { image: "./img/home/10-20/collection-10s-05.webp", link: "./detail.html?id=18" },

  /* 70-80 */
  { image: "./img/home/70-80/collection-70s-01.webp", link: "./detail.html?id=02" },
  { image: "./img/home/70-80/collection-70s-02.webp", link: "./detail.html?id=03" },
  { image: "./img/home/70-80/collection-70s-03.webp", link: "./detail.html?id=04" },
  { image: "./img/home/70-80/collection-70s-04.webp", link: "./detail.html?id=05" },
  { image: "./img/home/70-80/collection-70s-05.webp", link: "./detail.html?id=06-early" },

  /* 80-90 */
  { image: "./img/home/80-90/collection-80s-01.webp", link: "./detail.html?id=06" },
  { image: "./img/home/80-90/collection-80s-02.webp", link: "./detail.html?id=07" },
  { image: "./img/home/80-90/collection-80s-03.webp", link: "./detail.html?id=08" },
  { image: "./img/home/80-90/collection-80s-04.webp", link: "./detail.html?id=09" },
  { image: "./img/home/80-90/collection-80s-05.webp", link: "./detail.html?id=10" },

  /* 90-00 */
  { image: "./img/home/90-00/collection-90s-01.webp", link: "./detail.html?id=19" },
  { image: "./img/home/90-00/collection-90s-02.webp", link: "./detail.html?id=20" },
  { image: "./img/home/90-00/collection-90s-03.webp", link: "./detail.html?id=21" },
  { image: "./img/home/90-00/collection-90s-04.webp", link: "./detail.html?id=22" },
  { image: "./img/home/90-00/collection-90s-05.webp", link: "./detail.html?id=23" },
].map((poster, i) => ({
  number: String(i + 1).padStart(2, "0"),
  ...poster,
}));

/* 렌즈 장면 */

const lensScene = new THREE.Scene();

const lensCamera = new THREE.PerspectiveCamera(35, getWidth() / getHeight(), 0.1, 100);

lensCamera.position.set(0, 0, 13);

const lensRenderer = new THREE.WebGLRenderer({
  canvas: lensCanvas,
  antialias: true,
  alpha: true,
});

const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

lensRenderer.setPixelRatio(pixelRatio);
lensRenderer.outputColorSpace = THREE.SRGBColorSpace;
lensRenderer.toneMapping = THREE.ACESFilmicToneMapping;
lensRenderer.toneMappingExposure = 1.1;

/* 렌즈 조명 */

const ambient = new THREE.AmbientLight(0xffffff, 1.4);
lensScene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(-4, 5, 8);
lensScene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xccccff, 1.3);
fillLight.position.set(5, -2, 5);
lensScene.add(fillLight);

const reflectionLight = new THREE.PointLight(0xffffff, 32, 18);
reflectionLight.position.set(-3, 4, 5);
lensScene.add(reflectionLight);

/* 렌즈 그룹 */

const lensGroup = new THREE.Group();
lensScene.add(lensGroup);

const lensRadius = 1.8;
const lensDepth = 0.5;
const ovalRatio = 1;

/* 렌즈 반응형 크기 */

function updateLensSize() {
  const w = getWidth();

  if (w <= 480) {
    lensGroup.scale.setScalar(0.55);
  } else if (w <= 768) {
    lensGroup.scale.setScalar(0.7);
  } else {
    lensGroup.scale.setScalar(0.9);
  }
}

updateLensSize();

/* 렌즈 재질 */

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  metalness: 0.15,
  roughness: 0.38,
  clearcoat: 0.85,
  clearcoatRoughness: 0.14,
});

const sideMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x202020,
  metalness: 0.12,
  roughness: 0.3,
  clearcoat: 0.9,
  clearcoatRoughness: 0.12,
});

const rimMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x353535,
  metalness: 0.18,
  roughness: 0.25,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});

const grooveMaterial = new THREE.MeshStandardMaterial({
  color: 0x050505,
  roughness: 0.8,
});

/* 렌즈 본체 */

const bodyGeometry = new THREE.CylinderGeometry(lensRadius, lensRadius, lensDepth, 128);

bodyGeometry.scale(1, 1, ovalRatio);

const body = new THREE.Mesh(bodyGeometry, [sideMaterial, bodyMaterial, bodyMaterial]);

body.rotation.x = Math.PI / 2;
lensGroup.add(body);

/* 렌즈 테두리 */

function createOvalRing(radius, tube, z, material) {
  const geometry = new THREE.TorusGeometry(radius, tube, 16, 128);
  const ring = new THREE.Mesh(geometry, material);

  ring.scale.y = ovalRatio;
  ring.position.z = z;

  lensGroup.add(ring);

  return ring;
}

createOvalRing(1.77, 0.055, -0.27, grooveMaterial);
createOvalRing(1.81, 0.035, -0.03, rimMaterial);
createOvalRing(1.77, 0.085, 0.27, bodyMaterial);
createOvalRing(1.57, 0.025, 0.305, grooveMaterial);
createOvalRing(1.51, 0.018, 0.315, rimMaterial);

/* 렌즈 앞면 */

const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x222222,
  metalness: 0.12,
  roughness: 0.18,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  side: THREE.DoubleSide,
});

const front = new THREE.Mesh(new THREE.CircleGeometry(1.55, 128), frontMaterial);

front.scale.y = ovalRatio;
front.position.z = 0.315;

lensGroup.add(front);

/* 렌즈 로고 */

function createLogoTexture() {
  const logoCanvas = document.createElement("canvas");

  logoCanvas.width = 1024;
  logoCanvas.height = 1024;

  const ctx = logoCanvas.getContext("2d");

  ctx.clearRect(0, 0, 1024, 1024);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "bold 115px Georgia";
  ctx.fillText("C.P.", 512, 180);

  ctx.font = "bold 88px Georgia";
  ctx.fillText("COMPANY", 512, 835);

  const texture = new THREE.CanvasTexture(logoCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

const logoMaterial = new THREE.MeshBasicMaterial({
  map: createLogoTexture(),
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const logo = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 3.05 * ovalRatio), logoMaterial);

logo.position.z = 0.332;
lensGroup.add(logo);

/* 렌즈 반사광 */

function createReflectionTexture() {
  const reflectionCanvas = document.createElement("canvas");

  reflectionCanvas.width = 512;
  reflectionCanvas.height = 512;

  const ctx = reflectionCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);

  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0)");
  gradient.addColorStop(0.48, "rgba(255,255,255,0.16)");
  gradient.addColorStop(0.56, "rgba(255,255,255,0.04)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(reflectionCanvas);
}

const reflection = new THREE.Mesh(
  new THREE.CircleGeometry(1.48, 128),
  new THREE.MeshBasicMaterial({
    map: createReflectionTexture(),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
);

reflection.scale.y = ovalRatio;
reflection.position.z = 0.34;

lensGroup.add(reflection);

/* 렌즈 뒷면 */

const back = new THREE.Mesh(new THREE.CircleGeometry(1.68, 128), bodyMaterial);

back.scale.y = ovalRatio;
back.rotation.y = Math.PI;
back.position.z = -0.29;

lensGroup.add(back);

/* 배경 격자 */

const gridSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

gridSVG.setAttribute("id", "roomGrid");
gridSVG.setAttribute("preserveAspectRatio", "none");
gridSVG.setAttribute("aria-hidden", "true");

gridContainer.appendChild(gridSVG);

function drawGrid() {
  const w = getWidth();
  const h = getHeight();

  gridSVG.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const centerX = w / 2;
  const centerY = h / 2;

  const cell = 1440 * 0.032;
  const radius = 1440 * 0.38;

  let paths = "";

  /* 세로선 */

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

  /* 가로선 */

  const horizontalCount = Math.ceil(h / cell) + 2;

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

/* 포스터 앞쪽 레이어 */

const frontLayer = document.createElement("div");
frontLayer.className = "spiral-front";

const frontGallery = document.createElement("div");
frontGallery.className = "spiral-gallery";

frontLayer.appendChild(frontGallery);
home.appendChild(frontLayer);

/* 포스터 3D 장면 */

const backPosterScene = new THREE.Scene();
const frontPosterScene = new THREE.Scene();

/* 포스터 원근감 */

const POSTER_PERSPECTIVE = 4000;

const posterCamera = new THREE.PerspectiveCamera(
  THREE.MathUtils.radToDeg(2 * Math.atan(getHeight() / (2 * POSTER_PERSPECTIVE))),
  getWidth() / getHeight(),
  0.1,
  5000,
);

posterCamera.position.z = POSTER_PERSPECTIVE;

/* 포스터 렌더러 */

function createPosterRenderer(parent) {
  const posterCanvas = document.createElement("canvas");

  posterCanvas.className = "poster-canvas";
  parent.appendChild(posterCanvas);

  const posterRenderer = new THREE.WebGLRenderer({
    canvas: posterCanvas,
    alpha: true,
    antialias: true,
  });

  posterRenderer.setPixelRatio(pixelRatio);
  posterRenderer.outputColorSpace = THREE.SRGBColorSpace;
  posterRenderer.setClearColor(0x000000, 0);

  return posterRenderer;
}

const backPosterRenderer = createPosterRenderer(gallery);
const frontPosterRenderer = createPosterRenderer(frontGallery);

/* 포스터 이미지 텍스처 */

function createPosterTexture(poster) {
  const texture = new THREE.Texture();

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  if (poster.image) {
    const image = new Image();

    image.onload = () => {
      /* 가로 이미지 중앙 자르기 */

      if (image.width > image.height) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.height = image.height;
        canvas.width = Math.round(image.height * (2 / 3));

        const cropX = (image.width - canvas.width) / 2;

        ctx.drawImage(
          image,
          cropX,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        texture.image = canvas;
      } else {
        /* 세로 이미지 원본 유지 */

        texture.image = image;
      }

      texture.needsUpdate = true;
    };

    image.src = poster.image;
  }

  return texture;
}

/* 포스터 생성 */

let posterWidth = 160;
let posterHeight = 240;

function readPosterSize() {
  posterWidth = getCSSPixel("--poster-width") || 160;
  posterHeight = getCSSPixel("--poster-height") || 240;
}

readPosterSize();

const cards = [];

function createPosterGeometry() {
  return new THREE.PlaneGeometry(posterWidth, posterHeight, 32, 32);
}

posterData.forEach((poster, index) => {
  const geometry = createPosterGeometry();

  const material = new THREE.MeshBasicMaterial({
    map: createPosterTexture(poster),
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.frustumCulled = false;
  backPosterScene.add(mesh);

  const link = document.createElement("a");

  link.className = "gallery-item";
  link.href = poster.link;

  link.setAttribute("aria-label", `C.P. Company Collection ${poster.number}`);

  gallery.appendChild(link);

  cards.push({
    mesh,
    link,
    index,
    x: 0,
    y: 0,
  });
});

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

/* 포스터 클릭 */

home.addEventListener("click", (event) => {
  const card = event.target.closest(".gallery-item");

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

/* 스크롤 변수 */

let targetScroll = 0;
let currentScroll = 0;

let lastScrollDirection = 1;
let lastScrollTime = performance.now();

/* 공통 스크롤 처리 */

function applyScroll(delta) {
  if (delta === 0) return;

  lastScrollDirection = Math.sign(delta);
  lastScrollTime = performance.now();

  targetScroll += delta * SPIRAL.speed;
}

/* 마우스 휠 스크롤 */

window.addEventListener(
  "wheel",
  (event) => {
    if (detailModal.open) return;

    event.preventDefault();

    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? getHeight() : 1;

    applyScroll(event.deltaY * multiplier);
  },
  { passive: false },
);

/* 모바일 터치 스크롤 */

let touchStartY = null;

window.addEventListener(
  "touchstart",
  (event) => {
    if (detailModal.open) return;

    touchStartY = event.touches[0].clientY;
    lastScrollTime = performance.now();
  },
  { passive: true },
);

window.addEventListener(
  "touchmove",
  (event) => {
    if (detailModal.open) return;
    if (touchStartY === null) return;

    const y = event.touches[0].clientY;

    applyScroll(touchStartY - y);
    touchStartY = y;
  },
  { passive: true },
);

function endTouch() {
  touchStartY = null;
  lastScrollTime = performance.now();
}

window.addEventListener("touchend", endTouch);
window.addEventListener("touchcancel", endTouch);

/* 무한 스크롤 계산 */

function wrap(value, max) {
  return ((value % max) + max) % max;
}

/* 포스터 위치 갱신 */

function updateGallery() {
  const w = getWidth();
  const h = getHeight();

  const angleStep = (Math.PI * 2) / SPIRAL.postersPerTurn;
  const scrollPosition = currentScroll / SPIRAL.spacing;

  /* 반응형 중심 위치 */

  const centerOffset = h * SPIRAL.centerOffset;

  /* 화면 높이에 맞는 세로 간격 */

  const isResponsive = w <= 1024;

  const verticalSpacing = isResponsive ? Math.max(SPIRAL.spacing, h / 15) : SPIRAL.spacing;

  cards.forEach((card, index) => {
    const rawPosition = index - scrollPosition;

    const position = wrap(rawPosition + SPIRAL.count / 2, SPIRAL.count) - SPIRAL.count / 2;

    const angle = position * angleStep + SPIRAL.startAngle;

    /* 포스터 가로 위치 */

    const sidePadding = w > 480 && w <= 768 ? 50 : 0;

    let x = Math.sin(angle) * (w - sidePadding * 2) * SPIRAL.radiusX;

    /* 포스터 깊이 */

    const z = Math.cos(angle) * SPIRAL.radiusZ;

    /* 포스터 간격 */

    const perspective = 1400 / (1400 - z);

    const cameraPerspective = POSTER_PERSPECTIVE / (POSTER_PERSPECTIVE - z);

    const spacing = z > 0 ? verticalSpacing : verticalSpacing * perspective;

    const y = position * spacing + centerOffset;

    /* 렌즈 중심을 바라보는 포스터 회전 */

    const rotateY = THREE.MathUtils.radToDeg(Math.atan2(-x, -z));

    /* 원근감 */

    const scale = perspective / cameraPerspective;

    /* 480px 나선 반경 조정 */

    if (w <= 480) {
      const mobileRadius = w * SPIRAL.radiusX;
      x = Math.sin(angle) * mobileRadius;
    }

    /* 깊이에 따른 이미지 밝기 */

    const opacity = 1;
    const depthRatio = (z + SPIRAL.radiusZ) / (SPIRAL.radiusZ * 2);
    const brightness = 0.05 + depthRatio * 1.1;

    /* 포스터 3D 위치 */

    card.mesh.position.set(x / cameraPerspective, -y / cameraPerspective, z);

    card.mesh.rotation.y = THREE.MathUtils.degToRad(rotateY);

    /* 원본 이미지 비율 유지 */

    const image = card.mesh.material.map.image;

    if (image && image.width && image.height) {
      const imageRatio = image.width / image.height;
      const posterRatio = posterWidth / posterHeight;

      if (imageRatio > posterRatio) {
        card.mesh.scale.set(scale, (scale * posterRatio) / imageRatio, scale);
      } else {
        card.mesh.scale.set((scale * imageRatio) / posterRatio, scale, scale);
      }
    } else {
      card.mesh.scale.setScalar(scale);
    }

    /* 스크롤에 따른 이미지 휘어짐 */

    const velocity = THREE.MathUtils.clamp((targetScroll - currentScroll) * 0.4, -15, 15);

    const vertices = card.mesh.geometry.attributes.position;
    const uv = card.mesh.geometry.attributes.uv;

    for (let i = 0; i < vertices.count; i++) {
      const u = uv.getX(i);
      const v = uv.getY(i);

      const px = (u - 0.5) * posterWidth;
      const py = (v - 0.5) * posterHeight;

      const bend = Math.pow(v - 0.5, 2) * 4;

      vertices.setXYZ(i, px, py, bend * velocity);
    }

    vertices.needsUpdate = true;

    card.mesh.material.opacity = opacity;
    card.mesh.material.color.setScalar(brightness);
    card.mesh.visible = true;
    card.mesh.renderOrder = z;

    /* 렌즈 앞뒤 구분 */

    const targetScene = z > 0 ? frontPosterScene : backPosterScene;

    if (card.mesh.parent !== targetScene) {
      targetScene.add(card.mesh);
    }

    /* 클릭 영역 위치 */

    card.link.style.transform = `
      translate(-50%, -50%)
      translate3d(${x / cameraPerspective}px, ${y / cameraPerspective}px, ${z}px)
      rotateY(${rotateY}deg)
      scale3d(${card.mesh.scale.x}, ${card.mesh.scale.y}, 1)
    `;

    card.link.style.visibility = "visible";
    card.link.style.pointerEvents = "auto";

    const targetParent = z > 0 ? frontGallery : gallery;

    if (card.link.parentElement !== targetParent) {
      targetParent.appendChild(card.link);
    }

    card.x = x;
    card.y = y;
  });
}

/* 애니메이션 */

function animate(time, deltaTime) {
  const dt = Math.min(deltaTime / 1000, 0.05);

  /* 자동 스크롤 */

  if (performance.now() - lastScrollTime >= AUTO_SCROLL.delay && touchStartY === null) {
    targetScroll -= lastScrollDirection * AUTO_SCROLL.speed * dt;
  }

  /* 나선형 이동 */

  currentScroll += (targetScroll - currentScroll) * SPIRAL.smooth;

  /* 렌즈 자동 회전 */

  const spiralRotation = (currentScroll / SPIRAL.spacing) * ((Math.PI * 2) / SPIRAL.postersPerTurn);

  lensGroup.rotation.y = spiralRotation * LENS_ROTATION.speed;

  lensGroup.rotation.x = 0;

  /* 렌즈 반사광 */

  reflection.rotation.z = 0;
  reflection.material.opacity = 0.55;

  /* 포스터 위치 갱신 */

  updateGallery();

  /* 화면 렌더링 */

  backPosterRenderer.render(backPosterScene, posterCamera);
  lensRenderer.render(lensScene, lensCamera);
  frontPosterRenderer.render(frontPosterScene, posterCamera);
}

/* 화면 크기 변경 */

function resize() {
  const w = getWidth();
  const h = getHeight();

  lensCamera.aspect = w / h;
  lensCamera.updateProjectionMatrix();

  lensRenderer.setSize(w, h, false);

  /* 렌즈 크기 */

  updateLensSize();

  /* 포스터 카메라 */

  posterCamera.aspect = w / h;

  posterCamera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(h / (2 * POSTER_PERSPECTIVE)));

  posterCamera.updateProjectionMatrix();

  backPosterRenderer.setSize(w, h, false);
  frontPosterRenderer.setSize(w, h, false);

  /* 반응형 나선 설정 */

  const previousSpacing = SPIRAL.spacing;

  updateSpiralSettings();

  /* 화면 변경 시 스크롤 위치 유지 */

  currentScroll *= SPIRAL.spacing / previousSpacing;
  targetScroll *= SPIRAL.spacing / previousSpacing;

  /* 포스터 크기 변경 확인 */

  const previousWidth = posterWidth;
  const previousHeight = posterHeight;

  readPosterSize();

  if (posterWidth !== previousWidth || posterHeight !== previousHeight) {
    cards.forEach((card) => {
      const oldGeometry = card.mesh.geometry;
      const newGeometry = createPosterGeometry();

      card.mesh.geometry = newGeometry;
      oldGeometry.dispose();
    });
  }

  drawGrid();
  updateGallery();
}

/* 실행 */

window.addEventListener("resize", resize);

resize();
gsap.ticker.add(animate);
