var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/coupon/:code', function(req, res) {
  if(req.params.code.toUpperCase() == "SECRET60")
    res.send("1");
  else if(req.params.code.toUpperCase() == "SPECIAL30")
    res.send("2");
  else
    res.send("0");
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})
