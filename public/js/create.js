const backBtn = document.querySelector('.group-create-title__back-btn');
const mainCatBtns = document.querySelectorAll('.cat-filter-main__btn');
const subCatBtns = document.querySelectorAll('.cat-filter-sub__btn');
const mainCatInput = document.querySelector(
  '.group-create-category__input-main'
);
const subCatInput = document.querySelector('.group-create-category__input-sub');

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

// const group_name = document.querySelector('.group-create-name__input');
// const group_loc = document.querySelector('.group-create-condition select[name=location]');
// const group_gen = document.querySelector('.group-create-condition select[name=gender]');
// const group_mem = document.querySelector('.group-create-condition select[name=members]');
// const group_desc = document.querySelector('.group-create-intro__text');
// const submit_btn = document.querySelector('.group-create-submit__btn');
// function checkValid() {
//     let valid_name = false;
//     let valid_loc = false;
//     let valid_gen = false;
//     let valid_mem = false;
//     let valid_cat = false;
//     let vaild_desc = false;
//     if(group_name.value) valid_name = true;
//     if(group_loc.value) valid_loc = true;
//     if(group_gen.value) valid_gen = true;
//     if(group_mem.value) valid_mem = true;
//     if(input_sub.value) valid_cat = true;
//     if(group_desc.value) vaild_desc = true;
//     if(valid_name && valid_loc && valid_gen && valid_mem && valid_cat && vaild_desc) submit_btn.removeAttribute("disabled");
//     else submit_btn.setAttribute("disabled", true);
// }

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
  // mainCatBtns.forEach(Item => Item.addEventListener('click', checkValid));
  // subCatBtns.forEach(Item => Item.addEventListener('click', checkValid));
  // document.addEventListener('input', checkValid);
}

init();
