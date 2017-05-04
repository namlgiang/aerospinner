(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-44699912-31', 'auto');
ga('require', 'displayfeatures');
ga('send', 'pageview');

fbq('track', 'ViewContent', {
value: 26.59,
currency: 'USD'
});

var color = 0;
var quantity = 1;
var colorName = ["Silver", "Rose Gold", "Spring", "Midnight", "Ocean"];
var _ = [21,15,33,25,34];
var __ = [17,10,22,14,24];
var ___ = [3,4,2,4,7];

$(document).ready(function() {

  if(document.cookie == "")
    document.cookie = "time=" + (new Date()).getTime();

  var lastTime = parseInt(document.cookie.split("=")[1]);
  var thisTime = (new Date()).getTime();

  if(thisTime - lastTime > 1000 * 60 * 60 * 18)
    document.cookie = "time=" + (new Date()).getTime();
  else {
    if(thisTime - lastTime > 60000) _ = __;
    if(thisTime - lastTime > 180000) _ = ___;
  }

  $(".pcolor li").click(function() {
    // console.log($(this).index(".pcolor li"));
    color = $(this).index(".pcolor li");
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

    env: 'production', // Optional: specify 'sandbox' environment

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
                  total: quantity * 26.59,
                  currency: 'USD'
                },
                item_list: {
                  items: [
                    {
                    "name": colorName[color],
                    "quantity": quantity,
                    "price": 26.59,
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
              value: 26.59*quantity,
              currency: 'USD'
            });
            window.location.href = "/thankyou/";
        });

    },

    style: {
      size: 'medium'
    }

}, '#paypal-button');
