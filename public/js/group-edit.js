const cat_main = document.querySelector('.group-edit-main-category');

function categoryChange(e) {
  const office = ['9급', '7급', '5급'];
  const lang = ['영어', '중국어', '일본어'];
  const employ = ['경영/사무', 'IT/인터넷', '마케팅', '디자인', '미디어'];
  const hobby = ['독서', '토론', '기타'];
  let tValue = e.target.value;
  let sub = document.querySelector('.group-edit-sub-category');

  let val = ['전체'];
  if (tValue === 'officiary') val = office;
  else if (tValue === 'language') val = lang;
  else if (tValue === 'employee') val = employ;
  else if (tValue === 'hobby') val = hobby;

  sub.options.length = 0;
  for (let x in val) {
    let opt = document.createElement('option');
    opt.value = val[x];
    opt.textContent = val[x];
    sub.appendChild(opt);
  }
}

function init() {
  cat_main.addEventListener('change', categoryChange);
}

init();
