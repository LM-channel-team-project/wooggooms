module.exports = function templateSignIn() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>로그인</title>
    </head>
    <body>
        <div>logo</div>
        <form name="login" action="/email_post" method="post">
            <input type='email' name='email' placeholder="이메일">
            <input type='password' name='password' placeholder='비밀번호'>
            <input type='submit' value='이메일 로그인'>
        </form>
    
        <!-- SNS 로그인 -->
        <button type="button">
            <img src="images/kakao-icon.svg" alt="카카오로 로그인">
        </button>
        <button type="button">
            <img src="images/naver-icon.svg" alt="네이버로 로그인">
        </button>
        <button type="button">
            <img src="images/facebook-icon.svg" alt="페이스북으로 로그인">
        </button>
        <button type="button">
            <img src="images/apple-icon.svg" alt="Apple로 로그인">
        </button>
    </body>
    </html>
  `;
};
