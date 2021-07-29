const myinfo_btn = document.querySelector('.myinfo__btn');
const quit_modal = document.querySelector('.quit-modal');
const quit_btn = document.querySelectorAll('.group-list__quit-btn');
const del_modal = document.querySelector('.del-modal');
const del_btn = document.querySelectorAll('.group-list__del-btn');
const no_btn = document.querySelectorAll('.modal__no-btn');
const desc_btn = document.querySelector('.group-list__desc-btn');
const edit_btn = document.querySelectorAll('.group-list__edit-btn');
const edit_input = document.querySelectorAll('.group-list__hidden-input');
const group_enter_btn = document.querySelectorAll('.group-list__enter-btn');
const form = document.querySelector('.group-edit__form');
// 임시 '더 보기' 버튼
// const loadJoinGroupBtn = document.querySelector('.group-list__load-lead-btn');
// const loadLeadGroupBtn = document.querySelector('.group-list__load-lead-btn');
const joingroupSection = document.querySelector('.join-group-list');
const leadgroupSection = document.querySelector('.lead-group-list');

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

function alertMsg() {
  const status = new URLSearchParams(location.search).get('status');
  if (status) {
    switch (status) {
      case 'invalidname':
        alert('이미 사용 중인 스터디명입니다.');
        break;
      case 'invalidmembers':
        alert('현재 인원수보다 정원이 적을 수 없습니다.');
        break;
      case 'edit':
        alert('정상적으로 수정되었습니다.');
        break;
      case 'ismanager':
        alert('방장. 추후 참여중인 멤버에서 방장은 삭제 예정');
        break;
      case 'kickout':
        alert('해당 멤버를 강퇴하였습니다.');
        break;
    }
  }
}

// 전달 받은 데이터를 사용하여 '참여 중인 스터디' 또는 '진행 중인 스터디'에 element를 생성하는 함수
function createGroup(data, section) {
  // group-list__item
  const newItem = document.createElement('div');
  newItem.className = 'group-list__item';
  section.appendChild(newItem);
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

// '참여 중인 스터디' 추가 요청하는 함수
let joingroupIdx = 0;
function getJoingroups() {
  joingroupIdx += 4;
  fetch(`http://localhost:3000/mypage/get-joingroups?load=${joingroupIdx}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(group => createGroup(group, joingroupSection));
    });
}

// '진행 중인 스터디' 추가 요청하는 함수
let leadgroupIdx = 0;
function getLeadgroups() {
  leadgroupIdx += 4;
  fetch(`http://localhost:3000/mypage/get-leadgroups?load=${leadgroupIdx}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(group => createGroup(group, leadgroupSection));
    });
}

// 스크롤이 끝가지 내려지면, 새로운 데이터를 요청하여 출력하는 함수
function loadJoingroups() {
  const sectionHegiht = this.scrollHeight;
  const viewHeight = this.clientHeight;
  if (this.scrollTop === sectionHegiht - viewHeight) getJoingroups();
}
function loadLeadgroups() {
  const sectionHegiht = this.scrollHeight;
  const viewHeight = this.clientHeight;
  if (this.scrollTop === sectionHegiht - viewHeight) getLeadgroups();
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
  joingroupSection.addEventListener('scroll', loadJoingroups);
  leadgroupSection.addEventListener('scroll', loadLeadgroups);
  alertMsg();
}

init();
