const form = document.querySelector('.sign-up-form');
const emailInput = document.querySelector('.sign-up-form__input[name=email]');
const pwdInput = document.querySelector('.sign-up-form__input[name=pwd]');
const pwd2Input = document.querySelector('.sign-up-form__input[name=pwd2]');
const nameInput = document.querySelector('.sign-up-form__input[name=nickname]');
const submitBtn = document.querySelector('.sign-up-form__submit');

const emailValidDiv = document.querySelector('.sign-up-form__email');
const pwdValidDiv = document.querySelector('.sign-up-form__pwd');
const pwd2ValidDiv = document.querySelector('.sign-up-form__pwd2');
const nameValidDiv = document.querySelector('.sign-up-form__name');

function showIsValid(element, text) {
  element.innerText = text;
}

async function checkDuplicateEmail() {
  const userInput = emailInput.value;
  const res = await fetch(`http://localhost:3000/auth/check-duplicate-email`, {
    method: 'POST',
    body: userInput
  });
  const isValid = await res.json();
  if (!isValid) {
    showIsValid(emailValidDiv, '이미 사용 중인 이메일입니다.');
  }
  return isValid;
}

async function checkDuplicateName() {
  const userInput = nameInput.value;
  const res = await fetch(
    `http://localhost:3000/auth/check-duplicate-nickname`,
    {
      method: 'POST',
      body: userInput
    }
  );
  const isValid = await res.json();
  if (!isValid) {
    showIsValid(nameValidDiv, '이미 사용 중인 닉네임입니다.');
  }
  return isValid;
}

function checkValidEmail() {
  const regExp =
    /^[\w!#$%&'*+/=?^_{|}~-]+(?:\.[\w!#$%&'*+/=?^_{|}~-]+)*@(?:\w+\.)+\w+$/;

  if (emailInput.value === '' || regExp.test(emailInput.value)) {
    showIsValid(emailValidDiv, '');
    return true;
  } else {
    showIsValid(emailValidDiv, '올바른 이메일 주소를 입력해 주세요.');
    return false;
  }
}

function checkStrongPwd() {
  const regExp =
    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]).{8,16}$/;

  if (pwdInput.value === '' || regExp.test(pwdInput.value)) {
    showIsValid(pwdValidDiv, '');
    return true;
  } else {
    showIsValid(
      pwdValidDiv,
      '8~16자 영문 대 소문자, 숫자, 특수문자를 사용해 주세요.'
    );
    return false;
  }
}

function checkEqualPwd() {
  if (pwd2Input.value !== '' && pwdInput.value === pwd2Input.value) {
    showIsValid(pwd2ValidDiv, '');
    return true;
  } else {
    showIsValid(pwd2ValidDiv, '비밀번호가 일치하지 않습니다.');
    return false;
  }
}

function checkValidName() {
  if (nameInput.value === '' || nameInput.value.length <= 10) {
    showIsValid(nameValidDiv, '');
    return true;
  } else {
    showIsValid(nameValidDiv, '10자 이하를 입력해 주세요.');
    return false;
  }
}

async function checkValidAll() {
  const inputs = [emailInput, pwdInput, pwd2Input, nameInput];
  const divs = [emailValidDiv, pwdValidDiv, pwd2ValidDiv, nameValidDiv];

  inputs.forEach((Item, i) => {
    if (!Item.value) {
      showIsValid(divs[i], '필수 정보입니다.');
    }
  });

  const isDuplicateEmail = await checkDuplicateEmail();
  const isDuplicateName = await checkDuplicateName();

  if (
    checkValidEmail() &&
    checkStrongPwd() &&
    checkEqualPwd() &&
    isDuplicateEmail &&
    isDuplicateName
  ) {
    form.submit();
  } else {
    alert('입력하신 정보를 확인하세요.');
  }
}

function init() {
  emailInput.addEventListener('keyup', checkValidEmail);
  emailInput.addEventListener('focusout', checkDuplicateEmail);
  pwdInput.addEventListener('keyup', checkStrongPwd);
  pwdInput.addEventListener('keyup', checkEqualPwd);
  pwd2Input.addEventListener('keyup', checkEqualPwd);
  nameInput.addEventListener('keyup', checkValidName);
  nameInput.addEventListener('focusout', checkDuplicateName);
  submitBtn.addEventListener('click', checkValidAll);
}

init();
