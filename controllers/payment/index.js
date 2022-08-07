
const paypal = require('paypal-rest-sdk');
const apiString = require('../../constants/api');
const models = require("../../models");

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'ATczMpfFApy3QGI5x9kbR36ibyeO7i8VhgOswlkbIB9-kHraPc_u3Z1oS5JSee1Yp26hy_V7OLXLm-0m',
	'client_secret': 'EMYCWQoK2y6RkEHpslLr7AT1pGxXmnAiyqwyzKcrNSd2cVigjn3TPxIXxmBbACKxl4VB0n2WNbe-jBT-'
});


let coinPrice = null, coin = 0, idUser = null
const ratio = 0.0000428100


module.exports = {
	payment: (req, res) => {
		idUser = req.userIsLogged._id;
		coin = parseInt(req.query.coin)
		coinPrice = req.query.coinPrice;

		const create_payment_json = {
			"intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": req.protocol + '://' + req.headers.host + apiString.paySuccess,
				"cancel_url": req.protocol + '://' + req.headers.host + apiString.payCancel
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
				for (let i = 0; i < payment.links.length; i++) {
					if (payment.links[i].rel === 'approval_url') {
						return res.status(200).send({ data: payment.links[i].href })
					}
				}
			}
		});
	},

	paySuccess: async (req, res) => {
		const { PayerID, paymentId } = req.query.PayerID;
		const execute_payment_json = {
			"payer_id": PayerID,
			"transactions": [{
				"amount": {
					"currency": "USD",
					"total": (coinPrice * ratio).toFixed(2)
				}
			}]
		};
		paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
			if (error) {
				throw error;
			} else {
				const oldCoin = await models.users.findOne({ _id: idUser })
				const result = await models.users.findByIdAndUpdate(idUser, { $set: { coin: parseInt(coin + oldCoin.coin) } }, { new: true })
				result && res.send({success: true, message: 'Buy coin successfully'})
			}
		});
	},

	payCancel: (req, res) => res.send({success: true, message: 'Cancel'})

}



