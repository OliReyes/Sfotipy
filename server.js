var http = require('http'),
    st   = require('node-static'),
    opts = { cache: false },
    file = new st.Server('./app', opts),
    port = process.env.PORT || 9000;

http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(port);

console.log("App running on http://localhost:%s", port);
