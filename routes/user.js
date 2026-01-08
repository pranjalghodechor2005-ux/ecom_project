var express = require("express");
var exe = require("../conn");
var router = express.Router();


router.get('/', async (req,res) => {

    var sql = "SELECT * FROM slider";
    let slider = await exe(sql);
    
    sql = "SELECT * FROM category";
    let categories = await exe(sql);

    sql = " SELECT * FROM products, product_variations WHERE products.product_id = product_variations.product_id AND products.is_most_selling = 'Yes'";
    let most_selling = await exe(sql);

    sql = "SELECT * FROM products, product_variations WHERE products.product_id = product_variations.product_id AND products.is_highlighted = 'Yes'";
    let highlighted = await exe(sql);

    var packet = {slider, categories, most_selling, highlighted};
    res.render('user/index.ejs',packet);

});

// router.get('/products',async (req,res) =>{
//     var sql = "SELECT * FROM products , product_variations WHERE products.product_id = product_variations.product_id";
//     let products = await exe(sql);

//     sql= "SELECT * FROM category WHERE category_status = 'active'";
//     let categories = await exe(sql);
//     var packet = {products, categories};
//     res.render('user/products.ejs',packet);
// })


router.get('/products', async (req,res) => {

    var category_id = req.url_data.category_id;
      var cond = "";

    if(category_id)
    {
     cond = " AND (";
        if(!Array.isArray(category_id))
            {
                category_id = [category_id];

        }

        for(var i=0;i<category_id.length;i++)
        {
           cond += ((i!=0) ? " OR " : '') + " products.category_id = " + category_id[i]+" ";
  }
        cond += ") ";
  console.log(cond);

}
    // console.log(category_id);

    var sql = "SELECT * FROM products, product_variations WHERE products.product_id = product_variations.product_id  " + cond + " ";
    let products = await exe(sql);

    sql = "SELECT * FROM category WHERE category_status = 'Active'";
    let categories = await exe(sql);

    var url_data = req.url_data;
    console.log(url_data);

    var packet = {products, categories, url_data};
    res.render('user/products.ejs',packet);
  
});

router.get("/product_details/:product_id/:variation_id", async (req,res) => {
    var product_id = req.params.product_id;
    var variation_id = req.params.variation_id;
    var sql = `SELECT * FROM products WHERE product_id = ?`;
    let product = await exe(sql, [product_id]);

    sql = `SELECT * FROM product_variations WHERE product_id = ?`;
    let variations_list = await exe(sql, [product_id]);

    sql = `SELECT * FROM product_variations WHERE product_id = ? AND variation_id = ?`;
    let product_variation = await exe(sql, [product_id, variation_id]);

    sql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND variation_id = ? AND color = ?';
    let cart = await exe(sql, [req.session.user_id, product_id, variation_id, req.query.color]);

    var packet = {product, variations_list, product_variation, req, cart};
    res.render('user/product_details.ejs',packet);
});


router.get("/create-account", function (req,res){
    res.render('user/create_account.ejs');
});

router.post("/save-account", async function(req,res){
    var d = req.body;
    var sql = "INSERT INTO users (first_name, last_name, email, phone, password, confirm_password, date_of_birth, news_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let data = await exe(sql, [d.first_name, d.last_name, d.email, d.phone, d.password, d.confirm_password, d.date_of_birth, d.news_letter]);
    res.send(data);
    res.redirect('/login');


});

router.get("/login",function(req,res){
    var packet = {req};
    res.render('user/login.ejs',packet);
});

router.post("/login",async function(req,res){
    var d = req.body;
    var sql = "SELECT * FROM users WHERE  email = ? AND password = ?";
    let data = await exe(sql, [d.email, d.password]);
    if(data.length > 0){
        req.session.user_id = data[0].user_id;
        req.session.user_name = data[0].first_name + " " +data[0].last_name;
        req.session.user_email = data[0].email;
        req.session.user_phone = data[0].phone;
    }
    else{
        res.send("Invalid Email or Password");
    }
    res.redirect(d.redirect ||'/');
    // res.send(data);
})



// "first_name": "Pranjal",
// "last_name": "Ghodechor",
// "email": "pranjalghodechor2005@gmail.com",
// "phone": "8080282214",
// "password": "pranjal2611",
// "confirm_Password": "pranjal2611",
// "date_of_birth": "2025-10-04",
// "news_letter": "on"

function checkLogin(req,res,next){
    req.session.user_id = 1;
    if(req.session.user_id){
        next();
    }
    else{
        res.redirect('/login?redirect='+ encodeURIComponent(req.url));
    }
}

router.get("/add_to_cart",checkLogin, async function(req,res){
    var user_id = req.session.user_id;
    var d = req.query;

    var sql = "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND variation_id = ? AND color = ?";

    let data = await exe(sql, [user_id, d.product_id, d.variation_id, d.color]);
    if(data.length > 0){
        var sql = "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND variation_id = ? AND color = ?";
        let data = await exe(sql, [d.quantity, user_id, d.product_id, d.variation_id, d.color]);
    }
    else{
    var sql = "INSERT INTO cart(user_id, product_id, variation_id, color, quantity) VALUES (?, ?, ?, ?, ?)";
    let data = await exe(sql, [user_id, d.product_id, d.variation_id, d.color, d.quantity]);
   }
    // res.send(data);
    // res.redirect(d.redirect || '/');
    res.redirect("/product_details/"+d.product_id+"/"+d.variation_id);
});

router.get("/cart",checkLogin, async function(req,res){
    var user_id = req.session.user_id;
    var sql = "SELECT * FROM cart, products,product_variations WHERE cart.user_id =? AND cart.product_id = products.product_id AND cart.variation_id = product_variations.variation_id";
    let data = await exe(sql, [user_id]);
    var packet = {data};
    res.render('user/cart.ejs', packet);
})

router.get("/remove_from_cart/:cart_id", checkLogin,async function(req,res){
    var user_id = req.session.user_id;
    var cart_id = req.params.cart_id;
    var sql = "DELETE FROM cart WHERE cart_id = ? AND user_id = ?";
    let data = await exe(sql, [cart_id, user_id]);
    res.redirect("/cart")
})


router.get("/increment_quantity/:cart_id", checkLogin, async function(req, res){
    
    try{
        var cart_id = req.params.cart_id;
        var user_id = req.session.user_id;

        var sql = "UPDATE cart SET quantity = quantity + 1 WHERE cart_id = ? AND user_id = ?";

        await exe(sql, [cart_id, user_id]);

        sql = "SELECT cart.*, product_variations.variation_price FROM cart, product_variations WHERE cart.variation_id = product_variations.variation_id AND cart.cart_id = ? AND cart.user_id = ?";
        let rows = await exe(sql, [cart_id, user_id]);
        if(rows.length === 0){
            return res.status(404).send({error: "Cart item not found"});
        }

        const item = rows[0];

        sql = "SELECT SUM(cart.quantity * product_variations.variation_price) AS subtotal, SUM(cart.quantity) AS total_items FROM cart, product_variations WHERE cart.user_id = ? AND cart.variation_id = product_variations.variation_id";
        let sums = await exe(sql, [user_id]);
        const subtotal = sums[0]?.subtotal || 0;
        const total_items = sums[0]?.total_items || 0;

        res.send({
            cart_id: item.cart_id,
            quantity: item.quantity,
            unit_price: item.variation_price,
            line_total: item.quantity * item.variation_price,
            subtotal,
            total_items
        });
    }catch(err){
        console.error(err);
        res.status(500).send({error: "Something went wrong"});
    }
});

router.get("/decrement_quantity/:cart_id", checkLogin, async function(req, res){
    try{
        var cart_id = req.params.cart_id;
        var user_id = req.session.user_id;

        // Ensure we don't go below 1
        var sql = "UPDATE cart SET quantity = CASE WHEN quantity > 1 THEN quantity - 1 ELSE 1 END WHERE cart_id = ? AND user_id = ?";
        await exe(sql, [cart_id, user_id]);

        // Fetch updated cart row with pricing info
        sql = "SELECT cart.*, product_variations.variation_price FROM cart, product_variations WHERE cart.variation_id = product_variations.variation_id AND cart.cart_id = ? AND cart.user_id = ?";
        let rows = await exe(sql, [cart_id, user_id]);
        if(rows.length === 0){
            return res.status(404).send({error: "Cart item not found"});
        }

        const item = rows[0];

        // Compute subtotal and total items
        sql = "SELECT SUM(cart.quantity * product_variations.variation_price) AS subtotal, SUM(cart.quantity) AS total_items FROM cart, product_variations WHERE cart.user_id = ? AND cart.variation_id = product_variations.variation_id";
        let sums = await exe(sql, [user_id]);
        const subtotal = sums[0]?.subtotal || 0;
        const total_items = sums[0]?.total_items || 0;

        res.send({
            cart_id: item.cart_id,
            quantity: item.quantity,
            unit_price: item.variation_price,
            line_total: item.quantity * item.variation_price,
            subtotal,
            total_items
        });
    }catch(err){
        console.error(err);
        res.status(500).send({error: "Something went wrong"});
    }
});

router.get("/checkout",checkLogin,async function(req,res){
    var user_id = req.session.user_id;
    var sql = "SELECT * FROM cart, products,product_variations WHERE cart.user_id =? AND cart.product_id = products.product_id AND cart.variation_id = product_variations.variation_id";
    let carts = await exe(sql, [user_id]);
    var packet = {carts};
    res.render('user/checkout.ejs',packet);
});

router.get('/placeorder', (req, res) => {
    res.render('user/place_holder'); 
});


router.post("/place_holder", checkLogin, async function(req,res){

    var sql = "SELECT SUM(cart.quantity * product_variations.variation_price) As total_amount FROM cart, product_variations WHERE cart.user_id = ? AND cart.variation_id = product_variations.variation_id";
    let total_amount = await exe(sql, [req.session.user_id]);
    // Ensure total_amount is a valid non-null number
    var computed_total_amount = Number(total_amount[0]?.total_amount) || 0;
    if(computed_total_amount <= 0){
        return res.redirect('/cart');
    }
var o ={}
    o['user_id'] = req.session.user_id;
    o['first_name'] = req.body.first_name;
    o['last_name'] = req.body.last_name;
    o['email'] = req.body.email;
    o['phone'] = req.body.phone;
    o['address'] = req.body.address;
    o['city'] = req.body.city;
    o['state'] = req.body.state;
    o['zip_code'] = req.body.zip_code;
    o['payment'] = req.body.payment;
    o['payment_status'] = 'pending';
    o['transaction_id'] ='';
    o['notes'] = req.body.notes;
    o['total_amount'] = computed_total_amount;
    o['order_date'] = new Date().toLocaleDateString('en-CA');
    o['dispatch_date'] = '';
    o['deliver_date'] = '';
    o['return_date'] = '';
    o['refund_date'] = '';
    o['cancel_date'] = '';
    o['order_status'] = 'pending';


    var sql = `INSERT INTO orders (user_id, first_name, last_name, email, phone, address, city, state, zip_code,
    payment, payment_status, transaction_id, notes, total_amount,
    order_date, dispatch_date, deliver_date, return_date, refund_date, cancel_date, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let data = await exe(sql, [o.user_id, o.first_name, o.last_name, o.email, o.phone, o.address, o.city, o.state, o.zip_code, o.payment, o.payment_status, o.transaction_id, o.notes, o.total_amount, o.order_date,
       o.dispatch_date, o.deliver_date, o.return_date, o.refund_date, o.cancel_date, o.order_status]);
   
       var order_id = data.insertId;

       var cart = `SELECT * FROM cart, products, product_variations WHERE cart.user_id = ? AND 
        cart.product_id = products.product_id AND cart.variation_id = product_variations.variation_id`;
       let cart_data = await exe(cart, [req.session.user_id]);

       for(var i=0; i<cart_data.length; i++)
        {
       var sql = `INSERT INTO order_products (order_id, user_id, product_id, variation_id, product_name, product_market_price, 
        product_price, product_color,product_quantity, product_total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

       var p = {};
       p['order_id'] = order_id;
       p['user_id'] = req.session.user_id;
       p['product_id'] = cart_data[i].product_id;
       p['variation_id'] = cart_data[i].variation_id;
       p['product_name'] = cart_data[i].product_name;
       p['product_market_price'] = cart_data[i].product_market_price;
       p['variation_price'] = cart_data[i].variation_price;
       p['product_color'] = cart_data[i].color;
       p['product_quantity'] = cart_data[i].quantity;
       p['product_total_price'] = cart_data[i].product_total_price * cart_data[i].quantity;

       let data = await exe(sql, [
        order_id,
        req.session.user_id,
        cart_data[i].product_id,
        cart_data[i].variation_id,
        cart_data[i].product_name,
        cart_data[i].product_market_price,
        // Store the selected variation's unit price as product_price
        cart_data[i].variation_price,
        // Color chosen in cart
        cart_data[i].color,
        // Quantity from cart
        cart_data[i].quantity,
        // Line total = unit price * quantity
        (cart_data[i].variation_price * cart_data[i].quantity)
       ]);
       }

       var sql =    `DELETE FROM  cart WHERE user_id = ?`;
       data = await exe(sql, [req.session.user_id]);

    //    res.send(data);
    if(req.body.payment == 'online'){
        res.redirect('/pay-now/'+order_id);
    }
    else{
        res.redirect('/order-success');
        // res.send(data)
    }


});

router.get("/pay-now/:order_id",checkLogin, async function(req,res){
	var order_id = req.params.order_id;
	var sql = "SELECT * FROM orders WHERE order_id = ?";
	let order = await exe(sql, [order_id]);
	var packet = {order};
	res.render('user/pay_now.ejs',packet);
});

router.post("/verify-payment/:order_id",checkLogin, async function(req,res){
    var order_id = req.params.order_id;
    var sql = `UPDATE orders SET payment_status = 'paid', transaction_id = ? WHERE order_id = ?`;
    let data = await exe(sql, [req.body.razorpay_payment_id, order_id]);
    res.redirect('/order-success');
})

router.get("/order-success", checkLogin, async function(req,res){
    res.render('user/order_success.ejs');
});

router.get("/orders",checkLogin, async function(req,res){
    var sql = `SELECT * FROM orders WHERE user_id = ?`;
    let orders = await exe(sql, [ req.session.user_id]);

    for(var i=0; i<orders.length; i++)
        {
        var sql = `SELECT * FROM order_products, products, product_variations WHERE order_products.order_id = ? AND 
        order_products.product_id = products.product_id AND order_products.variation_id = product_variations.variation_id`;
        let order_products = await exe(sql, [orders[i].order_id]);
        orders[i].products = order_products;
    }
    // res.send(orders);
    var packet = {orders};
    res.render('user/orders.ejs',packet);
})



module.exports = router;
