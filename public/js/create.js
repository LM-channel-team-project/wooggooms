const form = document.querySelector('form');
const backBtn = document.querySelector('.group-create-title__back-btn');
const mainCatBtns = document.querySelectorAll('.cat-filter-main__btn');
const subCatBtns = document.querySelectorAll('.cat-filter-sub__btn');
const mainCatInput = document.querySelector(
  '.group-create-category__input-main'
);
const subCatInput = document.querySelector('.group-create-category__input-sub');
const createBtn = document.querySelector('.group-create-submit__btn');

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

const group_name = document.querySelector('.group-create-name__input');
const group_loc = document.querySelector(
  '.group-create-condition select[name=location]'
);
const group_gen = document.querySelector(
  '.group-create-condition select[name=gender]'
);
const group_mem = document.querySelector(
  '.group-create-condition select[name=members]'
);
const group_desc = document.querySelector('.group-create-intro__text');
const submit_btn = document.querySelector('.group-create-submit__btn');
function checkValid() {
  let valid_name = false;
  let valid_loc = false;
  let valid_gen = false;
  let valid_mem = false;
  let valid_cat = false;
  let vaild_desc = false;
  if (group_name.value) valid_name = true;
  if (group_loc.value) valid_loc = true;
  if (group_gen.value) valid_gen = true;
  if (group_mem.value) valid_mem = true;
  if (subCatInput.value) valid_cat = true;
  if (group_desc.value) vaild_desc = true;
  if (
    valid_name &&
    valid_loc &&
    valid_gen &&
    valid_mem &&
    valid_cat &&
    vaild_desc
  )
    return true;
}

function submit() {
  if (checkValid()) form.submit();
  else alert('모든 항목을 작성해주세요!');
}

function init() {
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
