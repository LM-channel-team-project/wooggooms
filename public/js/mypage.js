const myinfo_btn = document.querySelector(".my-info__btn");
const quit_modal = document.querySelector(".quit-modal");
const quit_btn = document.querySelectorAll(".group-list__quit-btn");
const quit_no_btn = document.querySelectorAll(".quit-modal__no-btn");
const del_modal = document.querySelector(".del-modal");
const del_btn = document.querySelectorAll(".group-list__del-btn");
const del_no_btn = document.querySelectorAll(".del-modal__no-btn");


function redirectEditPage() {
    location.href = "http://localhost:3000/mypage/edit-myinfo";
}

function openQuitModal() {
    quit_modal.classList.add("show-modal");
}

function closeQuitModal() {
    quit_modal.classList.remove("show-modal");
}

function openDelModal() {
    del_modal.classList.add("show-modal");
}

function closeDelModal() {
    del_modal.classList.remove("show-modal");
}

function init() {
    myinfo_btn.addEventListener("click", redirectEditPage);
    quit_btn.forEach(Item => {
        Item.addEventListener("click", openQuitModal);
    });
    quit_no_btn.forEach(Item => {
        Item.addEventListener("click", closeQuitModal);
    });
    del_btn.forEach(Item => {
        Item.addEventListener("click", openDelModal);
    });
    del_no_btn.forEach(Item => {
        Item.addEventListener("click", closeDelModal);
    });
}

init();