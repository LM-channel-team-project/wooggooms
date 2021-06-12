const myinfo_btn = document.querySelector(".my-info__btn");

function redirectEditPage() {
    location.href = "http://localhost:3000/mypage/edit-myinfo";
}

function init() {
    myinfo_btn.addEventListener('click', redirectEditPage);
}

init();