
// 중분류 열기
function filterSelection(filterName) {
  let filterDivClass = document.getElementsByClassName("filterDiv");

  for (let i = 0; i < filterDivClass.length; i++) {
    removeClass(filterDivClass[i], "show");
    if (filterDivClass[i].className.indexOf(filterName) > -1) addClass(filterDivClass[i], "show");
  }

  if (filterName == "all") {
      removeClass(filterDivClass[0], "show");
  }
}

function addClass(element, name) {
  let arr1 = element.className.split(" ");
  let arr2 = name.split(" ");
  for (let i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function removeClass(element, name) {
  let arr1 = element.className.split(" ");
  let arr2 = name.split(" ");
  for (let i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// 대분류를 클릭하면 active 고정 (작동 안함)
let filterBtnContainer = document.getElementById("filterBtnContainer");
let btns = filterBtnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");

    // If there's no active class
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }

    // Add the active class to the current/clicked button
    this.className += " active";
  });
}