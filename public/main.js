(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-44699912-31', 'auto');
ga('require', 'displayfeatures');
ga('send', 'pageview');

fbq('track', 'ViewContent', {
value: 22.80,
currency: 'USD'
});

var color = 0;
var quantity = 1;
var colorName = ["Silver", "Rose Gold", "Spring", "Midnight", "Ocean"];
var _ = [43,24,67,41,49];
var __ = [37,15,44,21,38];
var ___ = [6,5,2,9,12];
var cd = 1000 * 60 * 60 * 18;

function showTime(cd) {
  var day = Math.floor(cd/1000/60/60/24);
  if(day < 10) day = '0' + day;
  $(".day").html(day);
  var hour = Math.floor(cd/1000/60/60%24);
  if(hour < 10) hour = '0' + hour;
  $(".hour").html(hour);
  var minute = Math.floor(cd/1000/60%60);
  if(minute < 10) minute = '0' + minute;
  $(".minute").html(minute);
  var second = Math.floor(cd/1000%60);
  if(second < 10) second = '0' + second;
  $(".second").html(second);
}

$(document).ready(function() {

  if(document.cookie == "")
    document.cookie = "time=" + (new Date()).getTime();

  var lastTime = parseInt(document.cookie.split("=")[1]);
  var thisTime = (new Date()).getTime();
  if(isNaN(lastTime))
    lastTime = thisTime;

  if(thisTime - lastTime > 1000 * 60 * 60 * 18 - 1000 * 60 * 24) {
    document.cookie = "time=" + (new Date()).getTime();
    lastTime = thisTime;
  }
  else {
    if(thisTime - lastTime > 30000) _ = __;
    if(thisTime - lastTime > 600000) _ = ___;
  }

  cd = 1000 * 60 * 60 * 18 - 1000 * 60 * 24 - (thisTime - lastTime);
  showTime(cd);
  setInterval(function(lastTime) {
    var thisTime = (new Date()).getTime();
    cd = 1000 * 60 * 60 * 18 - 1000 * 60 * 24 - (thisTime - lastTime);
    showTime(cd);
  }, 1000, lastTime);

  $(".pcolor li").click(function() {
    // console.log($(this).index(".pcolor li"));
    color = $(this).index(".pcolor li");

    ga('send', 'event', 'Select ' + colorName[color], 1);

    $(".pcolor li").removeClass("active");
    $(this).addClass("active");
    $(".preview .imgs").css("top", -color*100 + "%");
    $(".textcrop ul").css("top", -color*100 + "%");
    $(".instock").text(_[color] + " in stock");
    $(".quantity").change();
  });

  $(".quantity").keyup(function() {
    if($(this).val() < 1) $(this).val(1);
    if($(this).val() > _[color]) $(this).val(_[color]);
    quantity = $(this).val();
  });

  $(".quantity").change(function() {
    if($(this).val() < 1) $(this).val(1);
    if($(this).val() > _[color]) $(this).val(_[color]);
    quantity = $(this).val();
  });

  renderMenu();
  $(window).scroll(function() {
    console.log($("body").scrollTop());
    renderMenu();
  });

  $(".menu span").click(function() {
    $("html, body").animate({scrollTop: $( $(this).attr("scrollData") ).offset().top - 60}, 500);
  });

  $(".ordernow").click(function() {
    $("html, body").animate({scrollTop: $(".p4").offset().top - 60}, 500);
  });

  $(".instock").text(_[0] + " in stock");

  var el = window.location.href.match(/goto=[^&]*/g)[0].replace('goto=', '');
  $("html, body").delay(500).animate({scrollTop: $(el).offset().top - 60}, 500);
});

function renderMenu() {
  var top = $("body").scrollTop();
  var m = 0;
  if(top > 250) m=1;
  if(top > 750) m=2;
  if(top > 1250) m=3;
  if(top > 1800) m=4;
  $(".menu span").removeClass("active");
  $(".menu span:eq("+m+")").addClass("active");
}

paypal.Button.render({

    env: 'sandbox', // Optional: specify 'sandbox' environment

    client: {
        sandbox:    'AeeQuc30epxndsZcys556s8BUccDPn7iphKvcVdJGRxEufT_J27f21i5YMLWZjiBEfNC23G5sA_fwvDr',
        production: 'AcnCWAY1tL8UX-IiKSJzGpmAZRuDH-O54vyrU_iF__Ct83GpkR6MDQ2J18mSHQLj5HQkn9TG6_okh-cl'
    },

    payment: function() {

        var env    = this.props.env;
        var client = this.props.client;

        ga('send', 'event', 'Purchase ' + colorName[color], quantity);
        fbq('track', 'InitiateCheckout');
        console.log('InitiateCheckout');

        return paypal.rest.payment.create(env, client, {
            transactions: [
              {
                amount: {
                  total: Math.round(quantity * 22.80 * 100)/100,
                  currency: 'USD'
                },
                item_list: {
                  items: [
                    {
                    "name": colorName[color],
                    "quantity": quantity,
                    "price": 22.80,
                    "currency": "USD"
                    }
                  ]
                }
              }
            ]
        });
    },

    commit: true, // Optional: show a 'Pay Now' button in the checkout flow

    onAuthorize: function(data, actions) {

        // Optional: display a confirmation page here

        return actions.payment.execute().then(function() {
            fbq('track', 'Purchase', {
              value: 22.80*quantity,
              currency: 'USD'
            });
            window.location.href = "/thankyou/";
        });

    },

    style: {
      size: 'medium'
    },

    onError: function(err) {
        ga('send', 'event', 'error: ' + err, quantity);
    }

}, '#paypal-button');
