const myGroups = document.querySelectorAll('.create-panel-list__item');

function toGroupInfo() {
  const groupID = this.querySelector('.create-panel-list-item__input').value;
  location.href = `http://localhost:3000/group/info/${groupID}`;
}

function init() {
  myGroups.forEach(myGroup => {
    myGroup.addEventListener('click', toGroupInfo);
  });
}

init();
