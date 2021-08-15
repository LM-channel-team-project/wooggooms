const cat_main = document.querySelectorAll('.cat-filter-main__btn');
const cat_sub = document.querySelectorAll('.cat-filter-sub__btn');

function handleMain(event) {
  const cur_main = document.querySelector('.active-main');
  cur_main.classList.remove('active-main');

  const cur_sub = document.querySelectorAll('.show-sub');
  cur_sub.forEach(Item => {
    Item.classList.remove('show-sub');
  });

  const cat = event.target;
  const cat_name = cat.value;

  cat.classList.add('active-main');
  const selected_sub = document.querySelectorAll('.' + cat_name);

  selected_sub.forEach(Item => {
    Item.classList.add('show-sub');
  });
}

function handleSub(event) {
  const pre_sub = document.querySelector('.active-sub');
  if (pre_sub !== null) pre_sub.classList.remove('active-sub');
  event.target.classList.add('active-sub');
}

function init() {
  cat_main.forEach(Item => {
    Item.addEventListener('click', handleMain);
  });
  cat_sub.forEach(Item => {
    Item.addEventListener('click', handleSub);
  });
}

init();
