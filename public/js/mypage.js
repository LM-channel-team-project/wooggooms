const myinfo_btn = document.querySelector('.myinfo__btn');
const quit_modal = document.querySelector('.quit-modal');
const quit_btn = document.querySelectorAll('.group-list__quit-btn');
const del_modal = document.querySelector('.del-modal');
const del_btn = document.querySelectorAll('.group-list__del-btn');
const no_btn = document.querySelectorAll('.modal__no-btn');
const edit_btn = document.querySelectorAll('.group-list__edit-btn');
const edit_input = document.querySelectorAll('.group-list__hidden-input');
const group_enter_btn = document.querySelectorAll('.group-list__enter-btn');
const form = document.querySelector('.group-edit__form');

function redirectEditPage() {
  location.href = 'http://localhost:3000/mypage/edit-myinfo';
}
// redirectGroupEditPage보다 renderGroupEditPage에 더 적합한 듯
function renderGroupEditPage() {
  form.submit();
}

function openModal(modal) {
  modal.classList.add('show-modal');
}

function closeModal() {
  const cur_modal = this.closest('.show-modal');
  cur_modal.classList.remove('show-modal');
}

function fetchGroups() {
  fetch('http://localhost:3000/mypage/fetch-group', {
    headers: {
      Accept: 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      let count = 0;
      // 개수에 맞게 렌더링 하기 위해서 ejs대신 createElement를 사용하는건 어떨까?
      // 초기에는 "운영중인 스터디가 없습니다." if(data[0].length > 0)이면 그거 지우고 createElement하는 방식
      // ?: 애초에 ejs를 사용한 이유가? - 위키에 작성하거나 ejs를 차근차근 대체해 나가야할듯?
      edit_input.forEach(Item => {
        Item.value = data[0][count].study_group_id;
        count++;
      });
    });
}

function init() {
  myinfo_btn.addEventListener('click', redirectEditPage);
  quit_btn.forEach(Item => {
    Item.addEventListener('click', () => openModal(quit_modal));
  });

  del_btn.forEach(Item => {
    Item.addEventListener('click', () => openModal(del_modal));
  });

  no_btn.forEach(Item => {
    Item.addEventListener('click', closeModal);
  });
  edit_btn.forEach(Item => {
    Item.addEventListener('click', renderGroupEditPage);
  });
  window.addEventListener('load', fetchGroups);
}

init();
