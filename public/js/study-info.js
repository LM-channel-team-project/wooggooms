function goBack() {
  window.history.back();
}

const backBtn = document.querySelector('.study-info-title__back-btn');
backBtn.addEventListener('click', goBack);
