const cat_main = document.querySelector('.group-edit-main-category');
const cat_sub = document.querySelector('.group-edit-sub-category');
const sub_value = document.querySelector(
  '.group-edit-sub-category__input'
).value;
const backBtn = document.querySelector('.group-edit__back-btn');
const submitBtn = document.querySelector('.group-edit-submit__btn');
const editForm = document.querySelector('.group-edit-form');
const kickoutBtnAll = document.querySelectorAll(
  '.group-edit-member-action__kickout'
);
const checkForm = document.querySelector('.name-check-form');
const checkBtn = document.querySelector('.name-check-btn');
const nameInput = document.querySelector('.group-edit-name__input');

const subCatList = {
  office: ['9급', '7급', '5급'],
  lang: ['영어', '중국어', '일본어'],
  employ: ['경영/사무', 'IT/인터넷', '마케팅', '디자인', '미디어'],
  hobby: ['독서', '토론', '기타'],
  exam: ['고1', '고2', '고3', 'N수']
};

function setSub(mainValue) {
  let val = ['전체'];
  if (mainValue === '공무원') val = subCatList.office;
  else if (mainValue === '어학') val = subCatList.lang;
  else if (mainValue === '취업') val = subCatList.employ;
  else if (mainValue === '취미') val = subCatList.hobby;
  else if (mainValue === '수능') val = subCatList.exam;

  cat_sub.options.length = 0;
  for (const sub_category of val) {
    let opt = document.createElement('option');
    opt.value = sub_category;
    opt.textContent = sub_category;
    if (sub_value === sub_category) opt.selected = true;
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
  const groupId = window.location.pathname.split('/')[3];
  const groupName = nameInput.value;
  const main = document.querySelector(
    '.group-edit-main-category option:checked'
  ).value;
  const sub = document.querySelector(
    '.group-edit-sub-category option:checked'
  ).value;
  const gender = document.querySelector(
    '.group-edit-option-gender option:checked'
  ).value;
  const location = document.querySelector(
    '.group-edit-option-location option:checked'
  ).value;
  const members = document.querySelector(
    '.group-edit-option-members option:checked'
  ).value;
  fetch(`http://localhost:3000/mypage/edit_process`, {
    method: 'POST',
    body: [groupId, groupName, main, sub, gender, location, members]
  })
    .then(res => res.json())
    .then(status => submitAlert(status));
}

function submitAlert(isSubmit) {
  if (isSubmit) {
    location.href = 'http://localhost:3000/mypage';
    alert('정상적으로 수정되었습니다');
  } else {
    alert('현재 인원수보다 정원이 적을 수 없습니다.');
  }
}

function checkSubmit(e) {
  const groupId = window.location.pathname.split('/')[3];
  const groupName = nameInput.value;
  fetch(`http://localhost:3000/mypage/name-check`, {
    method: 'POST',
    body: [groupName, groupId]
  })
    .then(res => res.json())
    .then(status => checkAlert(status, groupName));
}

function checkAlert(isValid, name) {
  if (isValid) {
    alert('사용 가능한 스터디명입니다.');
    submitBtn.disabled = false;
  } else {
    alert('이미 사용 중인 스터디명입니다.');
  }
}

function kickoutSubmit(e) {
  const memberId = this.previousElementSibling.value;
  fetch(`http://localhost:3000/mypage/kickout`, {
    method: 'POST',
    body: memberId
  })
    .then(res => res.json())
    .then(result => kickoutAlert(result[0]));
}

function kickoutAlert(message) {
  if (message === 'ismanager') {
    alert('방장. 추후 참여중인 멤버에서 방장은 삭제 예정');
  } else if (message === 'kickout') {
    location.href = 'http://localhost:3000/mypage';
    alert('해당 멤버를 강퇴하였습니다.');
  } else {
    alert(message);
  }
}

function changeListener(e) {
  submitBtn.disabled = false;
}

function init() {
  submitBtn.disabled = true;
  cat_main.addEventListener('change', categoryChange);
  document.addEventListener('DOMContentLoaded', initialChange);
  backBtn.addEventListener('click', () => {
    location.href = 'http://localhost:3000/mypage';
  });
  submitBtn.addEventListener('click', editSubmit);
  kickoutBtnAll.forEach(btn => {
    btn.addEventListener('click', kickoutSubmit);
  });
  editForm.addEventListener('change', changeListener);
  checkBtn.addEventListener('click', checkSubmit);
  nameInput.onkeypress = function () {
    submitBtn.disabled = true;
  };
}

init();
