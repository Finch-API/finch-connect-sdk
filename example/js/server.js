const express = require('express');
const path = require('path');

// Simple server to serve index.html. This is needed to test
// iframe communications as it wouldn't work with a static page
// opened from file system
const app = express();
app.use('/', express.static(__dirname));
app.listen(8083, function () {
  console.log('listening on port 8083');
});

app.get('/finch-connect.js', function (req, res) {
  res.sendFile(path.join(__dirname, './../../dist/index.js'));
});

