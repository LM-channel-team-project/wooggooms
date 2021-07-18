const myinfo_btn = document.querySelector(".my-info__btn");
const quit_modal = document.querySelector(".quit-modal");
const quit_btn = document.querySelectorAll(".group-list__quit-btn");
const del_modal = document.querySelector(".del-modal");
const del_btn = document.querySelectorAll(".group-list__del-btn");
const no_btn = document.querySelectorAll(".modal__no-btn");

function redirectEditPage() {
    location.href = "http://localhost:3000/mypage/edit-myinfo";
}

function openModal(modal) {
    modal.classList.add("show-modal");
}

function closeModal() {
    const cur_modal = this.closest(".show-modal");
    cur_modal.classList.remove("show-modal");
}

function init() {
    myinfo_btn.addEventListener("click", redirectEditPage);
    quit_btn.forEach(Item => {
        Item.addEventListener("click", () => openModal(quit_modal));
    });

    del_btn.forEach(Item => {
        Item.addEventListener("click", () => openModal(del_modal));
    });

    no_btn.forEach(Item => {
        Item.addEventListener("click", closeModal)
    })
}

init();