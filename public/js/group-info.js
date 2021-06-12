function goBack() {
  window.history.back();
}

const backBtn = document.querySelector('.group-info-title__back-btn');
backBtn.addEventListener('click', goBack);
