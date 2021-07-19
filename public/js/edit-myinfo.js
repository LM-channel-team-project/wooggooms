const input = document.querySelectorAll("input");
const pwdInput = document.querySelectorAll(".edit-pwd__input");
const confirmPwd = document.querySelector(".confirm-pwd");
const submitBtn = document.querySelector(".edit-pwd__submit");


function checkPwd() {
    const firstInput = pwdInput[0].value;
    const secondInput = pwdInput[1].value;
    if (firstInput === secondInput) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
}

function alertMsg() {
    if (new URLSearchParams(location.search).has('status')) {
        const status = new URLSearchParams(location.search).get('status');        
        switch (status) {
            case 'unvalidnick':
                alert('이미 사용 중인 닉네임입니다.');
                break;
            case 'validnick':
                alert('닉네임이 수정되었습니다.');
                break;
            case 'validemail':
                alert('이메일이 수정되었습니다.');
                break;
            case 'validpwd':
                alert('비밀번호가 수정되었습니다.');
                break;
        }
    }
}

function init() {  
    alertMsg();
    confirmPwd.addEventListener('keyup', checkPwd);
}

init();