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
    if(thisTime - lastTime > 180000) _ = ___;
    if(thisTime - lastTime > 60000) _ = __;
  }

  $(".pcolor li").click(function() {
    // console.log($(this).index(".pcolor li"));
    color = $(this).index(".pcolor li");
    $(".pcolor li").removeClass("active");
    $(this).addClass("active");
    $(".preview .imgs").css("top", -color*100 + "%");
    $(".textcrop ul").css("top", -color*100 + "%");
    $(".instock").text(_[color] + " in stock");
  });

  $(".quantity").keyup(function() {
    if($(this).val() < 1) $(this).val(1);
    if($(this).val() > 999) $(this).val(999);
    quantity = $(this).val();
  });

  $(".quantity").change(function() {
    if($(this).val() < 1) $(this).val(1);
    if($(this).val() > 999) $(this).val(999);
    quantity = $(this).val();
  });

  renderMenu();
  $(window).scroll(function() {
    // console.log($("body").scrollTop());
    renderMenu();
  });

  $(".menu span").click(function() {
    $("html, body").animate({scrollTop: $( $(this).attr("scrollData") ).offset().top - 60}, 500);
  });

  $(".instock").text(_[0] + " in stock");

});

function renderMenu() {
  var top = $("body").scrollTop();
  var m = 0;
  if(top > 350) m=1;
  if(top > 850) m=2;
  if(top > 1800) m=3;
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

        return paypal.rest.payment.create(env, client, {
            transactions: [
              {
                amount: {
                  total: quantity * 18.99,
                  currency: 'USD'
                },
                item_list: {
                  items: [
                    {
                    "name": colorName[color],
                    "quantity": quantity,
                    "price": 18.99,
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
            // Show a success page to the buyer
        });
    },

    style: {
      size: 'medium'
    }

}, '#paypal-button');
