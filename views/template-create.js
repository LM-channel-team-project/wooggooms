module.exports = function templateCreate() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <a href="/">👉Home</a>
        <p>This is study creating page.</p>
        <form action="/create_process" method="post">
            <p>
                <input type="submit">
            </p>
        </form>
    </body>
    </html>
  `;
};
