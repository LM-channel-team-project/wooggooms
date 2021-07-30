const mainCatBtns = document.querySelectorAll('.cat-filter-main__btn');
const subCatBtns = document.querySelectorAll('.cat-filter-sub__btn');

function loadCategory() {
  const curMainCat = new URLSearchParams(location.search).get('main');
  const curSubCat = new URLSearchParams(location.search).get('sub');
  // 초기 접속 화면이거나 카테고리 '전체'를 선택한 경우
  if (curMainCat === null || curMainCat === '전체') {
    const all = document.querySelector('.cat-filter-main input[value="전체"]');
    all.classList.add('active-main');
  }
  // 그 외의 카테고리를 선택한 경우
  else {
    // 대분류만 선택한 경우
    const curMainCatBtn = document.querySelector(
      `.cat-filter-main input[value='${curMainCat}']`
    );
    curMainCatBtn.classList.add('active-main');
    const curSubCatBtns = document.querySelectorAll(`.${curMainCatBtn.value}`);
    curSubCatBtns.forEach(Item => {
      Item.classList.add('show-sub');
    });
    // 소분류를 선택한 경우
    if (curSubCat) {
      const curSubCatBtn = document.querySelector(
        `.cat-filter-sub input[value='${curSubCat}']`
      );
      curSubCatBtn.classList.add('active-sub');
    }
  }
}

// 카테고리가 변경되면, 해당 카테고리의 스터디 리스트를 SSR로 제공하기 위해 쿼리스트링과 함께 redirect
function changeCategory() {
  // 대분류를 바꾼 경우
  if (this.classList[0] === 'cat-filter-main__btn') {
    const prevMainCat = document.querySelector('.active-main');
    prevMainCat.classList.remove('active-main');
    const selectedMainCat = this.value;
    location.href = `http://localhost:3000?main=${selectedMainCat}`;
  }
  // 소분류를 바꾼 경우
  else {
    const curMainCat = document.querySelector('.active-main').value;
    const selectedSubCat = this.value;
    location.href = `http://localhost:3000?main=${curMainCat}&sub=${selectedSubCat}`;
  }
}

function init() {
  window.addEventListener('load', loadCategory);
  mainCatBtns.forEach(Item => {
    Item.addEventListener('click', changeCategory);
  });
  subCatBtns.forEach(Item => {
    Item.addEventListener('click', changeCategory);
  });
}

init();
