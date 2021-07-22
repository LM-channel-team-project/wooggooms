const mainBtn = document.querySelectorAll('.cat-filter-main__btn');
const subBtn = document.querySelectorAll('.cat-filter-sub__btn');
const mainInput = document.querySelector('.group-create-category__input-main');
const subInput = document.querySelector('.group-create-category__input-sub');

function setSubInput(e) {
  const text = e.target.textContent;
  console.log(text);
  subInput.value = text;
}
function setMainInput(e) {
  const mainCategory = e.target.textContent;
  const cat_name = e.target.classList[1];
  const selector = 'div.cat-filter-sub button.'.concat(cat_name);
  const subCategory = document.querySelector(selector);
  //   subCategory.handleSub(e);
  const pre_sub = document.querySelector('.active-sub');
  if (pre_sub !== null) pre_sub.classList.remove('active-sub');
  subCategory.classList.add('active-sub');
  console.log(mainCategory, subCategory);
  mainInput.value = mainCategory;
  subInput.value = subCategory.textContent;
}

function init() {
  mainBtn.forEach(Item => {
    Item.type = 'button';
    Item.addEventListener('click', setMainInput);
  });
  subBtn.forEach(Item => {
    Item.type = 'button';
    Item.addEventListener('click', setSubInput);
  });
}

init();
