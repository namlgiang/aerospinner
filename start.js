var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/coupon/:code', function(req, res) {
  if(req.params.code.toUpperCase() == "SECRET60")
    res.send("1");
  else
    res.send("0");
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})
