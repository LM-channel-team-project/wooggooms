const myinfo_btn = document.querySelector(".my-info__btn");
const delete_modal = document.querySelector(".delete-modal");
const delete_btn = document.querySelectorAll(".group-list__del-btn");
const no_btn = document.querySelector(".delete-modal__no-btn");

function redirectEditPage() {
    location.href = "http://localhost:3000/mypage/edit-myinfo";
}

function showModal() {
    delete_modal.classList.add("show-modal");
}

function closeModal() {
    delete_modal.classList.remove("show-modal");
}

function init() {
    myinfo_btn.addEventListener("click", redirectEditPage);
    delete_btn.forEach(Item => {
        Item.addEventListener("click", showModal);
    })
    no_btn.addEventListener("click", closeModal);
}

init();