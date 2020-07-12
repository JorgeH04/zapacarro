exports.walletbutton = (req, res, next) => {
  // SDK de Mercado Pago
  const mercadopago = require("mercadopago");

  // Configura credenciais
  mercadopago.configure({
    //insert your access_token
   // access_token: process.env.ACCESS_TOKEN
   access_token: 'TEST-1727718622428421-041715-2360deef34519752e5bd5f1fca94cdf1-344589484',
   publicKey: 'TEST-662a163b-afb0-4994-9aea-6be1cca2decd'


  });

  // Cria um objeto de preferência
  let preference = {
    items: [
      {
        title: "Smartphone",
        unit_price: cart.totalPrice,
        quantity: cart.qty,
      }
    ]
  };

  mercadopago.preferences
    .create(preference)
    .then(function(response) {
      global.init_point = response.body.init_point;
      var preference_id = response.body.id;
      res.render("checkout", { preference_id });
    })
    .catch(function(error) {
      res.render("error");
      console.log(error);
    });
  };
