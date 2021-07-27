const backBtn = document.querySelector('.group-info-title__back-btn');
const applyBtn = document.querySelector('.group-info-apply__btn');

function goBack() {
  window.history.back();
}

function disableBtn() {
  applyBtn.disabled = true;
}

function postGroupId() {
  fetch(`http://localhost:3000/group/post-group-id`, {
    method: 'POST',
    body: this.value
  }).then(disableBtn());
}

function init() {
  backBtn.addEventListener('click', goBack);
  applyBtn.addEventListener('click', postGroupId);
}

init();
