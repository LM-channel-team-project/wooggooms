const searchList = document.querySelector('.search-list');
const categoryBtns = document.querySelectorAll(
  '.cat-filter input[type=button]'
);

function renderGroup(group) {
  const groupItem = document.createElement('div');
  groupItem.className = 'search-list__item';

  const groupImage = document.createElement('img');
  groupImage.className = 'search-list__img';
  groupItem.appendChild(groupImage);
  groupImage.src = '/public/img/test-thumnail.png';

  const groupContent = document.createElement('div');
  groupContent.className = 'search-list__item';
  groupItem.appendChild(groupContent);

  const groupName = document.createElement('div');
  groupName.className = 'search-list__name';
  groupContent.appendChild(groupName);
  groupName.textContent = group.name;

  const groupLoc = document.createElement('div');
  groupLoc.className = 'search-list__loc';
  groupContent.appendChild(groupLoc);
  groupLoc.textContent = group.location;

  const groupNum = document.createElement('div');
  groupNum.className = 'search-list__num';
  groupContent.appendChild(groupNum);
  groupNum.textContent = `${group.current_number} / ${group.maximum_number}`;

  const groupTag = document.createElement('div');
  groupTag.className = 'search-list__tag';
  groupContent.appendChild(groupTag);
  groupTag.textContent = `#${group.main_category} #${group.sub_category} #${group.gender}`;

  const groupId = document.createElement('input');
  groupId.className = 'search-list__id-hidden';
  groupContent.appendChild(groupId);
  groupId.type = 'hidden';
  groupId.value = group.id;

  groupItem.addEventListener('click', () => {
    location.href = `/group/info/${group.id}`;
  });

  searchList.appendChild(groupItem);
}

function fetchGroups(category) {
  fetch(`http://localhost:3000/list/${category}`)
    .then(res => res.json())
    .then(data => data.map(group => renderGroup(group)));
}

function buttonDisplay(button) {
  if (button.classList[0] === 'cat-filter-main__btn') {
    const prevActiveMainBtn = document.querySelector('.active-main');
    const prevShowSubBtns = document.querySelectorAll('.show-sub');

    if (prevActiveMainBtn) {
      prevActiveMainBtn.classList.remove('active-main');
      prevShowSubBtns.forEach(button => button.classList.remove('show-sub'));
    }
    button.classList.add('active-main');
    const curActiveMainBtn = document.querySelector('.active-main');
    const curShowSubBtns = document.querySelectorAll(
      `.${curActiveMainBtn.value}`
    );
    curShowSubBtns.forEach(button => button.classList.add('show-sub'));
  } else {
    const prevActiveSubBtn = document.querySelector('.active-sub');

    if (prevActiveSubBtn) {
      prevActiveSubBtn.classList.remove('active-sub');
    }
    button.classList.add('active-sub');
  }
}

function init() {
  fetchGroups('전체');
  categoryBtns.forEach(button =>
    button.addEventListener('click', e => {
      searchList.innerHTML = '';
      buttonDisplay(e.target);
      fetchGroups(e.target.value);
    })
  );
}

init();
