const form = document.querySelector('form');
const backBtn = document.querySelector('.group-create-title__back-btn');
const mainCatBtns = document.querySelectorAll('.cat-filter-main__btn');
const subCatBtns = document.querySelectorAll('.cat-filter-sub__btn');
const mainCatInput = document.querySelector(
  '.group-create-category__input-main'
);
const subCatInput = document.querySelector('.group-create-category__input-sub');
const createBtn = document.querySelector('.group-create-submit__btn');
const groupName = document.querySelector('.group-create-name__input');
const groupLoc = document.querySelector(
  '.group-create-condition select[name=location]'
);
const groupGen = document.querySelector(
  '.group-create-condition select[name=gender]'
);
const groupMem = document.querySelector(
  '.group-create-condition select[name=members]'
);
const groupDesc = document.querySelector('.group-create-intro__text');
const submitBtn = document.querySelector('.group-create-submit__btn');

function preventSubmit(e) {
  if (e.keyCode === 13) e.preventDefault();
}

function goBack() {
  window.history.back();
}

function setInput() {
  const text = this.textContent;
  const parentClass = this.parentNode.getAttribute('class');
  if (parentClass === 'cat-filter-main') {
    mainCatInput.value = text;
    subCatInput.value = '';
  } else {
    subCatInput.value = text;
  }
}

function checkValid() {
  if (
    groupName.value &&
    groupLoc.value &&
    groupGen.value &&
    groupMem.value &&
    subCatInput.value &&
    groupDesc.value
  ) {
    return true;
  }
  return false;
}

function submit() {
  if (checkValid()) form.submit();
  else alert('작성되지 않은 항목이 있습니다!');
}

function init() {
  groupName.addEventListener('keydown', preventSubmit);
  backBtn.addEventListener('click', goBack);
  mainCatBtns.forEach(Item => {
    Item.type = 'button';
    Item.addEventListener('click', setInput);
  });
  subCatBtns.forEach(Item => {
    Item.type = 'button';
    Item.addEventListener('click', setInput);
  });
  createBtn.addEventListener('click', submit);
}

init();
