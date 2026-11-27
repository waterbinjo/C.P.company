/* 컬렉션 데이터 */

const detailCollections = {
  /* 기본 컬렉션 */

  "01": {
    meta: "C.P. COMPANY / FW001 / 2001",

    title: "MODERN UTILITY",

    subtitle: "기능성과 현대적인 실루엣의 진화",

    description: `
      2000년대 초반 C.P. COMPANY는 기능적인 디자인과
      절제된 실루엣을 결합하며 현대적인 스타일을 선보였습니다.
      구조적인 재단과 실용적인 디테일을 중심으로 전개된
      컬렉션은 도시적인 감각과 브랜드 특유의 실험적인
      디자인 철학을 보여줍니다.
    `,

    mainImage: "img/collection/00-10/collection-00s-01.webp",
  },

  /* 1970년대 */

  "02": {
    meta: "collection-70s-01",

    title: "EARLY GRAPHIC EXPERIMENTS",

    subtitle: "초기 그래픽의 실험",

    description: `
      서핑 장면을 전면에 배치한 프린트는 의복을
      하나의 그래픽 캔버스처럼 활용한 초기 디자인
      언어를 보여준다. 인쇄 기법과 강렬한 색 대비를
      통해 일상복의 표현 영역을 확장했다.
    `,

    mainImage: "img/collection/70-80/collection-70s-01.webp",
  },

  "03": {
    meta: "collection-70s-02",

    title: "THE PRINTING LABORATORY",

    subtitle: "인쇄 기술의 출발점",

    description: `
      1977년 인쇄 작업실은 그래픽 실험이 실제 의복 제작으로
      이어지던 공간이다. 종이 인쇄에서 출발한 마시모 오스티의
      접근은 이후 가먼트 다잉과 소재 연구의 기반이 되었다.
    `,

    mainImage: "img/collection/70-80/collection-70s-02.webp",
  },

  "04": {
    meta: "collection-70s-03",

    title: "SCREEN PRINTED VISIONS",

    subtitle: "패턴과 이미지의 결합",

    description: `
      파도와 인물을 반복적으로 배치한 그래픽은 원단 자체를
      시각적 기록으로 만든다. 복합적인 프린트와 대칭 구도는
      초기 C.P. Company가 탐구한 인쇄 디자인의 실험성을 드러낸다.
    `,

    mainImage: "img/collection/70-80/collection-70s-03.webp",
  },

  "05": {
    meta: "collection-70s-04",

    title: "MILITARY UNIFORM STUDIES",

    subtitle: "군복에서 발견한 구조",

    description: `
      해군 항공복 자료에 나타난 포켓과 잠금장치, 작업복의 비례는
      C.P. Company의 기능적 디자인을 이해하는 중요한 참고 요소다.
      역사적 군복의 구조를 현대적 일상복의 관점에서 재해석했다.
    `,

    mainImage: "img/collection/70-80/collection-70s-04.webp",
  },

  "06-early": {
    meta: "collection-70s-05",

    title: "FUNCTIONAL REFERENCES",

    subtitle: "실용복을 향한 관찰",

    description: `
      여러 국가의 군복을 기록한 삽화는 보온과 보호, 수납을 위한
      구체적인 구조를 보여준다. 브랜드는 이러한 실용적 해결 방식에서
      착안해 도시 환경에 어울리는 의복을 발전시켰다.
    `,

    mainImage: "img/collection/70-80/collection-70s-05.webp",
  },

  /* 1980년대 */

  "06": {
    meta: "collection-80s-01",

    title: "ESQUIRE EDITORIAL, 1988",

    subtitle: "대중문화 속 기능성 의류",

    description: `
      1988년 Esquire 지면은 기술적인 후드 재킷을 패션 에디토리얼의
      언어로 소개한다. 보호 기능을 위해 설계된 실루엣이 당시의
      현대적인 스타일로 읽히는 장면이다.
    `,

    mainImage: "img/collection/80-90/collection-80s-01.webp",
  },

  "07": {
    meta: "collection-80s-02",

    title: "DAILY NEWS RECORD, 1987",

    subtitle: "미국 언론이 기록한 컬렉션",

    description: `
      1987년 미국 패션 전문지 Daily News Record에 소개된 컬렉션 기사다.
      이탈리아 스포츠웨어의 기능적 구성과 자유로운 실루엣이
      국제 패션 매체로 확장되던 흐름을 보여준다.
    `,

    mainImage: "img/collection/80-90/collection-80s-02.webp",
  },

  "08": {
    meta: "collection-80s-03",

    title: "KNITWEAR IN MOTION",

    subtitle: "니트웨어의 새로운 해석",

    description: `
      아가일 패턴과 스포츠웨어의 캐주얼한 실루엣이 교차하는
      에디토리얼이다. 전통적인 니트의 조직과 그래픽을 재구성해
      클래식한 소재에 실험적인 표정을 더했다.
    `,

    mainImage: "img/collection/80-90/collection-80s-03.webp",
  },

  "09": {
    meta: "collection-80s-04",

    title: "MODERN TAILORING",

    subtitle: "테일러링과 스포츠웨어",

    description: `
      절제된 수트 실루엣은 C.P. Company가 기능성 재킷 외에도
      남성복의 폭넓은 형태를 연구했음을 보여준다. 클래식한 재단에
      여유로운 비례와 실용적인 감각을 결합했다.
    `,

    mainImage: "img/collection/80-90/collection-80s-04.webp",
  },

  10: {
    meta: "collection-80s-05",

    title: "EVERYDAY EXPRESSION",

    subtitle: "일상으로 확장된 디자인",

    description: `
      넉넉한 코트와 대조적인 컬러 스타일링은 기능적 아우터가
      생활 속 패션으로 스며드는 모습을 보여준다.
      C.P. Company가 실용성과 개성을 함께 탐구했던 시각적 기록이다.
    `,

    mainImage: "img/collection/80-90/collection-80s-05.webp",
  },

  /* 2000년대 */

  11: {
    meta: "collection-00s-02",

    title: "SPACES OF IDENTITY",

    subtitle: "공간과 의복의 관계",

    description: `
      실내 공간의 거리감과 인물의 대비를 활용한 광고 이미지는
      브랜드의 조용한 실험성을 강조한다. 제품을 직접 설명하기보다
      착용 환경과 분위기로 정체성을 전달한다.
    `,

    mainImage: "img/collection/00-10/collection-00s-02.webp",
  },

  12: {
    meta: "collection-00s-03",

    title: "TRANSFORMABLE OBJECTS",

    subtitle: "의복을 넘어선 새로운 형태",

    description: `
      팽창형 구조물과 의복을 함께 제시한 이미지는
      2000년 Transformables 프로젝트의 개념과 연결된다.
      지퍼와 경량 소재를 활용해 착용 가능한 옷을
      공간적 오브제로 확장했다.
    `,

    mainImage: "img/collection/00-10/collection-00s-03.webp",
  },

  13: {
    meta: "collection-00s-04",

    title: "FASHION IN EDITORIAL",

    subtitle: "이미지로 전달하는 브랜드",

    description: `
      흑백 화보의 극적인 몸짓과 타이포그래피는 의복을 하나의
      문화적 이미지로 제시한다. 패션, 잡지, 사진의 결합을 통해
      브랜드가 보여준 다양한 표현 방식을 기록한다.
    `,

    mainImage: "img/collection/00-10/collection-00s-04.webp",
  },

  /* 2010년대 */

  14: {
    meta: "collection-10s-01",

    title: "GOGGLE CULTURE",

    subtitle: "고글 디테일의 확장",

    description: `
      고글을 연상시키는 얼굴 보호 장치와 모터사이클 장면은
      속도와 이동성의 이미지를 강조한다. 보호 장비에서 출발한
      기능적 디테일이 브랜드의 상징적인 시각 요소로 확장된다.
    `,

    mainImage: "img/collection/10-20/collection-10s-01.webp",
  },

  15: {
    meta: "collection-10s-02",

    title: "TECHNICAL OUTERWEAR",

    subtitle: "이미지로 전달하는 브랜드",

    description: `
      흑백 화보의 극적인 몸짓과 타이포그래피는 의복을 하나의
      문화적 이미지로 제시한다. 패션, 잡지, 사진의 결합을 통해
      브랜드가 보여준 다양한 표현 방식을 기록한다.
    `,

    mainImage: "img/collection/10-20/collection-10s-02.webp",
  },

  16: {
    meta: "collection-10s-03",

    title: "UTILITY IN COLOUR",

    subtitle: "포켓과 컬러의 기능적 조합",

    description: `
      오렌지색 베스트의 다층 포켓과 넉넉한 구조는 수납이라는
      실용적 요소를 디자인의 중심에 둔다.
      선명한 색감은 기술적 의복의 형태를 더욱 뚜렷하게 드러낸다.
    `,

    mainImage: "img/collection/10-20/collection-10s-03.webp",
  },

  17: {
    meta: "collection-10s-04",

    title: "MODERN PROTECTION",

    subtitle: "도시를 위한 보호의 형태",

    description: `
      화이트 톤의 후드와 렌즈 디테일은 보호성과 간결한 형태를
      함께 강조한다. 군복과 작업복에서 이어진 기능적 요소는
      현대적인 테크니컬 룩의 일부로 재구성된다.
    `,

    mainImage: "img/collection/10-20/collection-10s-04.webp",
  },

  18: {
    meta: "collection-10s-05",

    title: "COLOUR AND MATERIAL",

    subtitle: "소재 실험의 시각적 기록",

    description: `
      원단과 자연 이미지를 병치한 편집은 기능성 의복을 소재와
      환경의 관계 속에서 바라보게 한다.
      가먼트 다잉과 표면 가공 연구가 브랜드의 시각적 정체성으로 이어진다.
    `,

    mainImage: "img/collection/10-20/collection-10s-05.webp",
  },

  /* 1990년대 */

  19: {
    meta: "C.P. COMPANY / UNDERSIXTEEN / 1990",

    title: "JAMBO GRAPHICS",

    subtitle: "그래픽으로 확장된 브랜드의 표현",

    description: `
      1990년 Undersixteen의 JAMBO 그래픽은 강렬한 색채와 자유로운
      일러스트레이션을 통해 브랜드의 실험적인 감각을 보여줍니다.
      의복을 넘어 인쇄물과 시각 디자인으로 확장된 표현은
      C.P. COMPANY만의 독창적인 그래픽 정체성을 드러냅니다.
    `,

    mainImage: "img/collection/90-00/collection-90s-01.webp",
  },

  20: {
    meta: "C.P. COMPANY / UNDERSIXTEEN / 1990",

    title: "URBAN SILHOUETTE",

    subtitle: "도시적 감각으로 재해석된 기능성",

    description: `
      기능적인 포켓과 구조적인 재단을 바탕으로 절제된 도시적
      실루엣을 선보입니다. 실용적인 디테일과 세련된 스타일링의
      결합은 여성복으로 확장된 C.P. COMPANY의 디자인 철학을 보여줍니다.
    `,

    mainImage: "img/collection/90-00/collection-90s-02.webp",
  },

  21: {
    meta: "C.P. COMPANY / UNDERSIXTEEN / 1992",

    title: "YOUNG EXPLORERS",

    subtitle: "새로운 세대로 이어지는 기능적 디자인",

    description: `
      1992년 Undersixteen 컬렉션은 브랜드의 상징적인 고글 디테일을
      아동복에 적용했습니다. 활동적인 움직임을 고려한 실용적 구조와
      자유로운 스타일링은 세대를 넘어 이어지는 브랜드의 정체성을 보여줍니다.
    `,

    mainImage: "img/collection/90-00/collection-90s-03.webp",
  },

  22: {
    meta: "C.P. COMPANY / TRANSFORMABLES / SS000",

    title: "TRANSFORMABLE DESIGNL",

    subtitle: "의복의 구조적 한계를 넘어선 실험",

    description: `
      모레노 페라리의 Transformables 컬렉션은 의복의 형태와
      기능을 자유롭게 변화시키는 실험에서 출발했습니다.
      가벼운 나일론 소재와 지퍼, 벨크로를 활용한 구조적 설계는
      하나의 의복이 새로운 오브제로 변형될 수 있는 가능성을 보여줍니다.
    `,

    mainImage: "img/collection/90-00/collection-90s-04.webp",
  },

  23: {
    meta: "C.P. COMPANY / TRANSFORMABLES KITE / SS000",

    title: "BEYOND GARMENTS",

    subtitle: "의복에서 새로운 오브제로",

    description: `
      반투명 나일론 소재로 제작된 후드 케이프는 구조적인 변형을
      통해 연으로 재탄생합니다. 착용의 목적을 넘어 새로운 기능을
      구현한 디자인은 소재와 기술에 대한 끊임없는 탐구와
      C.P. COMPANY의 실험적인 철학을 보여줍니다.
    `,

    mainImage: "img/collection/90-00/collection-90s-05.webp",
  },
};

/* URL에서 컬렉션 번호 가져오기 */

const detailParams = new URLSearchParams(window.location.search);
const detailId = detailParams.get("id") || "01";

const detailData = detailCollections[detailId];

/* 상세페이지 요소 가져오기 */

const detailRoot = document.querySelector(".detail");
const detailMainImg = document.getElementById("detailMainImg");

/* 메인 이미지 방향 및 비율 확인 */

function setOrientationClass() {
  const width = detailMainImg.naturalWidth;
  const height = detailMainImg.naturalHeight;

  if (!width || !height) return;

  /* 이미지 원본 비율 계산 */

  const ratio = width / height;

  detailRoot.style.setProperty("--image-ratio", ratio);

  /* 기존 방향 클래스 제거 */

  detailRoot.classList.remove("is-portrait", "is-landscape");

  /* 가로형 및 세로형 클래스 적용 */

  if (width > height) {
    detailRoot.classList.add("is-landscape");
  } else {
    detailRoot.classList.add("is-portrait");
  }
}

/* 이미지 로드 후 방향 확인 */

detailMainImg.addEventListener("load", setOrientationClass);

/* 컬렉션별 콘텐츠 변경 */

if (detailData) {
  /* 텍스트 변경 */

  document.getElementById("detailMeta").textContent = detailData.meta;
  document.getElementById("detailTitle").textContent = detailData.title;
  document.getElementById("detailSubtitle").textContent = detailData.subtitle;
  document.getElementById("detailDesc").innerHTML = detailData.description;

  /* 메인 이미지 변경 */

  detailMainImg.src = detailData.mainImage;
  detailMainImg.alt = detailData.title + " 메인 이미지";

  /* 브라우저 제목 변경 */

  document.title = detailData.title + " | C.P. COMPANY ARCHIVE";
}

/* 이미 로드된 이미지 확인 */

if (detailMainImg.complete) {
  setOrientationClass();
}
/* 768px 상세페이지 높이 자동 조절 */

const tabletModal = window.frameElement?.closest(".detail-modal");
const tabletInner = document.querySelector(".detail_inner");

function fitTabletModal() {
  if (!tabletModal) return;

  const isTablet = window.innerWidth > 480 && window.innerWidth <= 768;

  if (isTablet) {
    const modalHeight = window.parent.innerHeight * 0.65;

    /* 보조 이미지 크기 유지 */

    tabletInner.style.setProperty("--tablet-gallery-height", (modalHeight / 0.75) * 0.24 + "px");

    /* 콘텐츠에 맞춰 모달 높이 조절 */

    tabletModal.style.height =
      Math.min(Math.ceil(tabletInner.getBoundingClientRect().height * 0.75), modalHeight) + "px";
  } else {
    tabletModal.style.removeProperty("height");
    tabletInner.style.removeProperty("--tablet-gallery-height");
  }
}

if (tabletModal) {
  const observer = new ResizeObserver(fitTabletModal);

  observer.observe(tabletInner);

  window.addEventListener("resize", fitTabletModal);
  detailMainImg.addEventListener("load", fitTabletModal);

  window.addEventListener("pagehide", () => {
    observer.disconnect();
    tabletModal.style.removeProperty("height");
  });

  fitTabletModal();
}
