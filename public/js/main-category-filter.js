const mainCatBtns = document.querySelectorAll('.cat-filter-main__btn');
const subCatBtns = document.querySelectorAll('.cat-filter-sub__btn');

function handleMain() {
  const curCategory = new URLSearchParams(location.search).get('cat');
  // 초기 접속 화면이거나 카테고리 '전체'를 선택한 경우
  if (curCategory === null || curCategory === 'all') {
    const all = document.querySelector('.cat-filter-main__btn.all');
    all.classList.add('active-main');
  }
  // 그 외의 카테고리를 선택한 경우
  else {
    const curMainCatBtn = document.querySelector(
      `.cat-filter-main__btn.${curCategory}`
    );
    curMainCatBtn.classList.add('active-main');

    const curSubCatBtns = document.querySelectorAll(
      '.' + curMainCatBtn.classList[1]
    );
    curSubCatBtns.forEach(Item => {
      Item.classList.add('show-sub');
    });
  }
}

function handleSub() {
  const preSubCatBtn = document.querySelector('.active-sub');
  if (preSubCatBtn !== null) preSubCatBtn.classList.remove('active-sub');
  this.classList.add('active-sub');
}

// 새로운 카테고리를 선택하면, 해당 카테고리의 스터디 리스트를 서버사이드렌더링한 파일을 제공하기 위해 해당주소(쿼리스트링)로 redirect
function changeCategory() {
  const curActiveMain = document.querySelector('.active-main');
  curActiveMain.classList.remove('active-main');

  const selectedMainCat = this.classList[1];
  location.href = `http://localhost:3000?cat=${selectedMainCat}`;
}

function init() {
  window.addEventListener('load', handleMain);

  mainCatBtns.forEach(Item => {
    Item.addEventListener('click', changeCategory);
  });

  subCatBtns.forEach(Item => {
    Item.addEventListener('click', handleSub);
  });
}

init();
