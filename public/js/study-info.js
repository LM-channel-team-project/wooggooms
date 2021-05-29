function goBack() {
  window.history.back();
}

function openForm() {
  document.getElementById('chatPopUp').style.display = 'block';
}

function closeForm() {
  document.getElementById('chatPopUp').style.display = 'none';
}

const backBtn = document.querySelector('.study-info__back-btn');
backBtn.addEventListener('click', goBack);

const openBtn = document.querySelector('.study-info__chat-btn');
openBtn.addEventListener('click', openForm);

const closeBtn = document.querySelector('.chat-popup__cncl-btn');
closeBtn.addEventListener('click', closeForm);
