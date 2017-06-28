var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/coupon/:code', function(req, res) {
  if(req.params.code.toUpperCase() == "SECRET60")
    res.send("1");
  else if(req.params.code.toUpperCase() == "SPIN30")
    res.send("2");
  else if(req.params.code.toUpperCase() == "NORMANDREHER")
    res.send("3");
  else if(req.params.code.toUpperCase() == "BYRONTODD")
    res.send("4");
  else
    res.send("0");
});

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
