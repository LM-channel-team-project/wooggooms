const http = require("http");
const fs = require("fs");
const url = require("url");

const portNum = "3000";

const app = http.createServer((req, res) => {
  let _url = req.url; // /?id=html
  const myURL = new URL(`http://localhost:${portNum}` + _url);
  let queryDataId = myURL.searchParams.get("id"); // html
  let pathname = myURL.pathname;

  if (pathname == !"/") {
    res.writeHead(404);
    res.end("Not found");
  } else {
    switch (queryDataId) {
      case null:
        res.writeHead(200);
        const templateMain = require("./views/template-main.js");
        res.end(templateMain);
      case "signin":
        res.writeHead(200);
        const templateSignIn = require("./views/template-sign-in.js");
        res.end(templateSignIn);
      case "signup":
        res.writeHead(200);
        const templateSignUp = require("./views/template-sign-up.js");
        res.end(templateSignUp);
      case "create":
        res.writeHead(200);
        const templateCreate = require("./views/template-create.js");
        res.end(templateCreate);
      case "mypage":
        res.writeHead(200);
        const templateMyPage = require("./views/template-my-page.js");
        res.end(templateMyPage);
    }
  }
});

app.listen(`${portNum}`, function () {
  console.log("listening on 3000");
});
