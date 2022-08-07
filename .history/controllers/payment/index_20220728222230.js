const express = require('express');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATczMpfFApy3QGI5x9kbR36ibyeO7i8VhgOswlkbIB9-kHraPc_u3Z1oS5JSee1Yp26hy_V7OLXLm-0m',
  'client_secret': 'EMYCWQoK2y6RkEHpslLr7AT1pGxXmnAiyqwyzKcrNSd2cVigjn3TPxIXxmBbACKxl4VB0n2WNbe-jBT-'
});

const app = express();

var coin = null;

module.exports = {
    payment:(req, res) => {
        coin = req.query.coin;
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://192.168.11.17:8000/api/pay-success",
                "cancel_url": "http://192.168.11.17:8000/api/pay-cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red Hat",
                        "sku": "001",
                        "price": coin,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": coin
                },
                "description": "Bạn đã mua thành công " + coin
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
}

  app.get('/api/pay-success', (req, res) => {
    console.log('pay success');
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("payerId",payerId,"paymentId",paymentId) 
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": 1
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log("error",error.response);
          throw error;
      } else {
          // res.sendFile(__dirname + "/success.html")
          res.send('success')
      }
  });
});

app.get('/api/pay-cancel', (req, res) => res.send('Cancelled'));

const PORT = process.env.PORT || 8000 ;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));