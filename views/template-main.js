module.exports = function templateMain() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>우리가 꿈꾸는 스터디</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <!-- logo, login Button -->
        <header>
            <div class="logo">우리가 꿈꾸는 스터디</div>
            <button class="loginBtn" onclick="location.href='login.html'">로그인</button>
        </header>
    
        <!-- Create Study Button --> 
        <section>
            <button class="createStudy" onclick="location.href='create-study.html'">+</button>
        </section>
        
        <!-- Filtering Button -->
        <nav>
            <!-- 대분류 -->
            <div id="filterBtnContainer"></div> 
                <button class="btn" onclick="filterSelection('all')"">전체</button>
                <button class="btn" onclick="filterSelection('job')">취업</button>
                <button class="btn" onclick="filterSelection('language')">어학</button>
                <button class="btn" onclick="filterSelection('public')">공무원</button>
            </div>
            <!-- 중분류 -->
            <div class="container">
                <div class="filterDiv job">경영/사무</div>
                <div class="filterDiv job">마케팅</div>
                <div class="filterDiv job">IT/인터넷</div>
                <div class="filterDiv job">디자인</div>
                <div class="filterDiv job">미디어</div>
                <div class="filterDiv job">영업</div>
                <div class="filterDiv job">기타</div>
    
                <div class="filterDiv language">영어</div>
                <div class="filterDiv language">중국어</div>
                <div class="filterDiv language">일본어</div>
                <div class="filterDiv language">프랑스어</div>
                <div class="filterDiv language">스페인어</div>
                <div class="filterDiv language">독일어</div>
                <div class="filterDiv language">러시아어</div>
                <div class="filterDiv language">기타</div>
    
                <div class="filterDiv public">9급</div>
                <div class="filterDiv public">7급</div>
                <div class="filterDiv public">5급</div>
                <div class="filterDiv public">기타</div>
            </div>
        </nav>
    
        <!-- 검색창-->
        <section>
            <form role="search" method="get" class="search-form" action="">
                <input type="search" class="search-filed" placeholder="검색">
            </form>
        </section>
    
        <!-- 스터디 리스트 -->
        <section>
    
        </section>
        
        <script src="./javascripts/main.js"></script>
    </body>
    </html>
  `;
};
