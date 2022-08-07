
const paypal = require('paypal-rest-sdk');
const link = 'http://192.168.11.17:8000'
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATczMpfFApy3QGI5x9kbR36ibyeO7i8VhgOswlkbIB9-kHraPc_u3Z1oS5JSee1Yp26hy_V7OLXLm-0m',
  'client_secret': 'EMYCWQoK2y6RkEHpslLr7AT1pGxXmnAiyqwyzKcrNSd2cVigjn3TPxIXxmBbACKxl4VB0n2WNbe-jBT-'
});



var coinPrice = null;
let coin = 0
const ratio = 0.0000428100
module.exports = {
    payment:(req, res) => {
        console.log("payment");
        coin = req.query.coin
        console.log("coin", coin);

        coinPrice = req.query.coinPrice;
        // console.log('coinPrice tofix', (coinPrice / ().toFixed())
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${link}/api/pay-success`,
                "cancel_url": `${link}/api/pay-cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "",
                        "sku": "001",
                        "price": (coinPrice * ratio).toFixed(2),
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": (coinPrice * ratio).toFixed(2)
                },
                "description": "Bạn đã mua coin thành công"
            }]
        };
        
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error;
          } else {
              for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                  // res.redirect(payment.links[i].href);
                  return res.status(200).send({data:payment.links[i].href})
                }
              }
          }
        });
    },
    paySuccess:(req, res )=>{
        console.log('pay success');
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        console.log("payerId",payerId,"paymentId",paymentId) 
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total": (coinPrice * ratio).toFixed(2)
              }
          }]
        };
      
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log("error",error.response);
              throw error;
          } else {
              // res.sendFile(__dirname + "/success.html")
              res.send('')
          }
      });
    },

    payCancel:(req, res) => res.send('Cancelled')

}



 