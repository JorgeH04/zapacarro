exports.createPayment = (req, res, next) => {
  var response = JSON.parse(JSON.stringify(req.body));
  console.log(response);

  var mercadopago = require("mercadopago");
  //insert your access_token
 // mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);
 mercadopago.configurations.setAccessToken('TEST-1727718622428421-041715-2360deef34519752e5bd5f1fca94cdf1-344589484');

  var payment_data = {
    transaction_amount: Number(req.body.amount),
    token: response.token,
    description: "Smartphone",
    installments: Number(req.body.installmentsOption),
    binary_mode: true,
    payment_method_id: req.body.paymentMethodId,
    payer: {
      email: "jhessle04@gmail.com"
    }
  };

  // Save and posting the payment
  mercadopago.payment
    .save(payment_data)
    .then(function(data) {
      console.log(data);

      let status = JSON.stringify(data.response.status);
      let id = JSON.stringify(data.response.id);
      let date_created = JSON.stringify(data.response.date_created);
      let status_detail = JSON.stringify(data.response.status_detail);
      let amount = JSON.stringify(data.response.transaction_amount);
      let installments = JSON.stringify(data.response.installments);
      let payment_method_id = JSON.stringify(data.response.payment_method_id);

      res.render("status", {
        status,
        id,
        date_created,
        status_detail,
        amount,
        installments,
        payment_method_id
      });
    })
    .catch(function(error) {
      res.render("error");
      console.log(error);
    });
};
