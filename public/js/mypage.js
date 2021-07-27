const myinfo_btn = document.querySelector('.myinfo__btn');
const quit_modal = document.querySelector('.quit-modal');
const quit_btn = document.querySelectorAll('.group-list__quit-btn');
const del_modal = document.querySelector('.del-modal');
const del_btn = document.querySelectorAll('.group-list__del-btn');
const no_btn = document.querySelectorAll('.modal__no-btn');
const edit_btn = document.querySelectorAll('.group-list__edit-btn');
const group_enter_btn = document.querySelectorAll('.group-list__enter-btn');
const reloadLeadGroupBtn = document.querySelector('.group-list__load-btn');
const leadgroupSection = document.querySelector('.lead-group-list');

function redirectEditPage() {
  location.href = 'http://localhost:3000/mypage/edit-myinfo';
}
function redeirectGroupEditPage() {
  location.href = 'http://localhost:3000/mypage/group-edit';
}

function openModal(modal) {
  modal.classList.add('show-modal');
}

function closeModal() {
  const cur_modal = this.closest('.show-modal');
  cur_modal.classList.remove('show-modal');
}

// 전달 받은 데이터를 사용하여 element를 생성하는 함수
function createGroup(data) {
  // group-list__item
  const newItem = document.createElement('div');
  newItem.className = 'group-list__item';
  leadgroupSection.appendChild(newItem);
  // group-tag
  const newTag = document.createElement('div');
  newTag.className = 'group-tag';
  newItem.appendChild(newTag);

  const newTagMain = document.createElement('div');
  newTagMain.className = 'group-tag__cat-main';
  newTagMain.textContent = data.main_category;
  newTag.appendChild(newTagMain);

  const newTagSub = document.createElement('div');
  newTagSub.className = 'group-tag__cat-sub';
  newTagSub.textContent = data.sub_category;
  newTag.appendChild(newTagSub);

  const newTagLoc = document.createElement('div');
  newTagLoc.className = 'group-tag__loc';
  newTagLoc.textContent = data.location;
  newTag.appendChild(newTagLoc);

  const newTagGndr = document.createElement('div');
  newTagGndr.className = 'group-tag__gndr';
  newTagGndr.textContent = data.gender;
  newTag.appendChild(newTagGndr);
  // group-list__info
  const newInfo = document.createElement('div');
  newInfo.className = 'group-list__info';
  newItem.appendChild(newInfo);

  const newInfoNum = document.createElement('span');
  newInfoNum.className = 'group-list__num';
  newInfoNum.textContent = data.current_number + '/' + data.maximum_number;
  newInfo.appendChild(newInfoNum);

  const newInfoName = document.createElement('span');
  newInfoName.className = 'group-list__name';
  newInfoName.textContent = data.name;
  newInfo.appendChild(newInfoName);
  // group-list__mgr
  const newMgr = document.createElement('div');
  newMgr.className = 'group-list__mgr';
  newItem.appendChild(newMgr);

  const newMgrForm = document.createElement('form');
  newMgrForm.className = 'group-edit__form';
  newMgrForm.action = '/mypage/group-edit/process';
  newMgrForm.method = 'POST';
  newMgr.appendChild(newMgrForm);

  const newMgrInput = document.createElement('input');
  newMgrInput.className = 'group-list__hidden-input';
  newMgrInput.name = 'study-group-id';
  newMgrInput.type = 'hidden';
  newMgrInput.value = `${data.id}`;
  newMgrForm.appendChild(newMgrInput);

  const newMgrDelBtn = document.createElement('button');
  newMgrDelBtn.className = 'group-list__del-btn';
  newMgrDelBtn.textContent = '삭제';
  newMgrForm.appendChild(newMgrDelBtn);

  const newMgrEditBtn = document.createElement('button');
  newMgrEditBtn.className = 'group-list__edit-btn';
  newMgrEditBtn.textContent = '관리';
  newMgrForm.appendChild(newMgrEditBtn);
}

// 새로운 데이터를 요청하는 함수
let idx = 0;
function getGroups() {
  idx += 4;
  fetch(`http://localhost:3000/mypage/get-groups?load=${idx}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(group => createGroup(group));
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
  //   임시적으로는 그냥 group-edit page로 redirect하지만, 추후에는 클릭된 그룹의 id도 함께 넘겨주어야 할듯
  edit_btn.forEach(Item => {
    Item.addEventListener('click', redeirectGroupEditPage);
  });
  reloadLeadGroupBtn.addEventListener('click', getGroups);
}

init();
