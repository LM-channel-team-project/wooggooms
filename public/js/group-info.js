const backBtn = document.querySelector('.group-info-title__back-btn');
const applyBtn = document.querySelector('.group-info-apply__btn');
const commentBtn = document.querySelector('.group-info-qna__send-btn');
const commentInput = document.querySelector('.group-info-qna__text');
const deleteBtns = document.querySelectorAll('.group-info-qna__btn');

function goBack() {
  window.history.back();
}

function disableBtn() {
  applyBtn.disabled = true;
}

function postGroupId() {
  if (commentBtn.value === 'false') {
    alert('스터디에 지원하려면 로그인을 해주세요.');
  } else {
    fetch(`http://localhost:3000/group/post-group-id`, {
      method: 'POST',
      body: this.value
    }).then(disableBtn());
  }
}

function renderElements(commentData, commentContent) {
  const commentListWrap = document.querySelector('.group-info-qna__list-wrap');
  commentListWrap.className = 'group-info-qna__list-wrap';
  const commentList = document.createElement('div');
  commentList.className = 'group-info-qna__list';
  commentListWrap.append(commentList);

  const imgCtr = document.createElement('div');
  imgCtr.className = 'group-info-qna__img-ctr';
  const img = document.createElement('img');
  img.className = 'group-info-qna__img';
  img.src = '/public/img/test-profile.png';
  imgCtr.append(img);
  const text = document.createElement('div');
  text.className = 'group-info-qna__text';
  commentList.append(imgCtr, text);

  const header = document.createElement('div');
  header.className = 'group-info-qna__header';
  const message = document.createElement('div');
  message.className = 'group-info-qna__message';
  message.textContent = commentContent;
  const btns = document.createElement('div');
  btns.className = 'group-info-qna__btns';
  const btn = document.createElement('button');
  btn.className = 'group-info-qna__btn';
  btn.textContent = '삭제';
  btn.value = commentData[0];
  btn.addEventListener('click', deleteComment);
  text.append(header, message, btns);
  btns.append(btn);

  const nickname = document.createElement('span');
  nickname.className = 'group-info-qna__nickname';
  nickname.textContent = commentData[1];
  const datetime = document.createElement('span');
  datetime.className = 'group-info-qna__datetime';
  datetime.textContent = commentData[2];
  header.append(nickname, datetime);
}

function deleteElements(parentNode) {
  parentNode.remove();
}

function checkIsCreator(commentUserId, loggedInUserId) {
  return commentUserId === loggedInUserId ? true : false;
}

function createComment() {
  const isLoggedIn = this.value;
  const groupId = applyBtn.value;
  const commentContent = commentInput.value;
  if (isLoggedIn === 'true') {
    if (commentContent === '') {
      alert('내용을 입력해주세요.');
    } else {
      fetch(`http://localhost:3000/group/create-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commentContent,
          groupId: groupId
        })
      })
        .then(res => res.json())
        .then(commentData => renderElements(commentData, commentContent))
        .then((commentInput.value = ''));
    }
  } else {
    alert('댓글을 등록하려면 로그인을 해주세요.');
  }
}

function deleteComment() {
  const btnValues = this.value.split(',');
  const [commentId, commentUserId, loggedInUserId] = btnValues;
  if (checkIsCreator(commentUserId, loggedInUserId)) {
    const parentNode = this.closest('.group-info-qna__list');
    fetch(`http://localhost:3000/group/delete-comment`, {
      method: 'POST',
      body: commentId
    }).then(deleteElements(parentNode));
  } else {
    alert('다른 회원의 댓글은 삭제할 수 없습니다.');
  }
}

function init() {
  backBtn.addEventListener('click', goBack);
  applyBtn.addEventListener('click', postGroupId);
  commentBtn.addEventListener('click', createComment);
  deleteBtns.forEach(deleteBtn =>
    deleteBtn.addEventListener('click', deleteComment)
  );
}

init();
