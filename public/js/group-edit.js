const cat_main = document.querySelector('.group-edit-main-category');
const cat_sub = document.querySelector('.group-edit-sub-category');
const sub_value = document.querySelector(
  '.group-edit-sub-category__input'
).value;
const submitBtn = document.querySelector('.group-create-submit__btn');
const editForm = document.querySelector('.group-edit-form');
// 얘네도 바뀔때마다 받아오거나 수정해야 할 것 같다
const office = ['9급', '7급', '5급'];
const lang = ['영어', '중국어', '일본어'];
const employ = ['경영/사무', 'IT/인터넷', '마케팅', '디자인', '미디어'];
const hobby = ['독서', '토론', '기타'];
const exam = ['고1', '고2', '고3', 'N수'];

function setSub(mainValue) {
  let val = ['전체'];
  if (mainValue === '공무원') val = office;
  else if (mainValue === '어학') val = lang;
  else if (mainValue === '취업') val = employ;
  else if (mainValue === '취미') val = hobby;
  else if (mainValue === '수능') val = exam;

  cat_sub.options.length = 0;
  for (let x in val) {
    let opt = document.createElement('option');
    opt.value = val[x];
    opt.textContent = val[x];
    if (sub_value === val[x]) opt.selected = true;
    cat_sub.appendChild(opt);
  }
}

function categoryChange(e) {
  let tValue = e.target.value;
  setSub(tValue);
}

function initialChange(e) {
  let tValue = cat_main.value;
  setSub(tValue);
}

function editSubmit(e) {
  editForm.submit();
}

function init() {
  cat_main.addEventListener('change', categoryChange);
  document.addEventListener('DOMContentLoaded', initialChange);
  submitBtn.addEventListener('click', editSubmit);
}

init();
