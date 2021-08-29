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
const optionsAll = document.querySelectorAll('select');
const checkForm = document.querySelector('.name-check-form');
const checkBtn = document.querySelector('.name-check-btn');
const nameInput = document.querySelector('.group-edit-name__input');
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
    alert('해당 멤버를 강퇴하였습니다.');
  } else {
    alert(message);
  }
}

function alertMsg() {
  const status = new URLSearchParams(location.search).get('status');
  if (status) {
    switch (status) {
      case 'invalidmembers':
        alert('현재 인원수보다 정원이 적을 수 없습니다.');
        break;
    }
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
    window.history.back();
  });
  submitBtn.addEventListener('click', editSubmit);
  for (let i = 0; i < kickoutBtnAll.length; i++) {
    kickoutBtnAll[i].addEventListener('click', kickoutSubmit);
  }
  editForm.addEventListener('change', changeListener);
  checkBtn.addEventListener('click', checkSubmit);
  nameInput.onkeypress = function () {
    submitBtn.disabled = true;
  };
  alertMsg();
}

init();
