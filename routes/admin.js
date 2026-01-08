var express = require("express");
var exe = require("../conn");
var router = express.Router();
router.get("/",(req,res)=> {
    res.render("admin/index.ejs");
});

router.get('/category',async (req,res) => {
    var sql = "SELECT * FROM category";
    let categories = await exe(sql);
    var packet={categories};
    res.render('admin/category.ejs',packet);
})

router.post('/save_category', async (req,res) =>{
    var d = req.body;
    var file_name = null;
    
    if(req.files && req.files.category_image){
        file_name = Date.now() + req.files.category_image.name;
        req.files.category_image.mv('./public/uploads/' + file_name, (err) => {
            if(err) {
                console.log('File upload error:', err);
                return res.status(500).send('File upload failed');
            }
        });
    }

    var sql = "INSERT INTO category (category_name, category_image, category_status) VALUES (?, ?, ?)";
    let data = await exe(sql, [d.category_name, file_name, d.category_status]);
    res.redirect('/admin/category');
})

router.get('/edit_category/:id', async (req,res) => {
    var id = req.params.id;
    var sql = 'SELECT * FROM category WHERE category_id = ?';
    let info = await exe(sql, [id]);
    var packet = {info};
    res.render('admin/admin_edit.ejs', packet);
});

router.post('/update_admin', async (req,res) => {
    var d = req.body;
    var file_name = null;
    
    // Handle file upload if new image is provided
    if(req.files && req.files.new_category_image){
        file_name = Date.now() + req.files.new_category_image.name;
        req.files.new_category_image.mv('./public/uploads/' + file_name, (err) => {
            if(err) {
                console.log('File upload error:', err);
                return res.status(500).send('File upload failed');
            }
        });
    }
    
    // Update query - include image if new one is uploaded
    var sql, params;
    if(file_name) {
        sql = `UPDATE category SET category_name = ?, category_status = ?, category_image = ? WHERE category_id = ?`;
        params = [d.new_category_name, d.new_category_status, file_name, d.category_id];
    } else {
        sql = `UPDATE category SET category_name = ?, category_status = ? WHERE category_id = ?`;
        params = [d.new_category_name, d.new_category_status, d.category_id];
    }
    
    await exe(sql, params);
    res.redirect('/admin/category');
})

router.get('/delete_category/:id', async (req, res) => {
    var id = req.params.id;
    var sql = 'DELETE FROM category WHERE category_id = ?';
    await exe(sql, [id]);
    res.redirect('/admin/category');
});

router.get("/products", async (req,res) => {
    var sql = "SELECT * FROM category";
    let categories = await exe(sql);
    var packet = {categories};
res.render('admin/products.ejs',packet);
});

router.post("/save_product", async (req,res) =>{
    var file_name = null;
    if(req.files){
        file_name = Date.now()+ req.files.product_main_image.name;
        req.files.product_main_image.mv('public/uploads/' + file_name);
    }
    var d = req.body;
    var sql = "INSERT INTO products(category_id, product_name, product_brand, product_details, product_colors, product_main_image, is_highlighted, is_most_selling) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    let data = await exe(sql, [d.category_id, d.product_name, d.product_brand, d.product_details, d.product_colors, file_name, d.is_highlighted, d.is_most_selling]);
    res.redirect('/admin/products');
    // res.send(data);
})

router.get("/products_list", async (req,res) => {
    var sql = "SELECT * FROM products";
    let products = await exe(sql);
    var packet = {products};
    res.render('admin/products_list.ejs',packet);
});
    
    router.get('/edit_product_variation/:id', async (req,res) =>{
        var id = req.params.id;
        var sql = 'SELECT * FROM product_variations WHERE variation_id = ?';
        let product = await exe(sql, [id]);
        var packet = {product};
        res.render('admin/product_variation_edit.ejs', packet);
    })
router.get('/edit_product/:id', async (req,res) =>{
var id = req.params.id;
var sql = 'SELECT * FROM products WHERE product_id = ?';
let info = await exe(sql, [id]);
var sql2 = "SELECT * FROM category";
let categories = await exe(sql2);
var packet = {info, categories};
res.render('admin/product_edit.ejs', packet);
});

router.post('/update_product', async (req,res) => {
    var d = req.body;
    var file_name = null;
    
    if(req.files && req.files.product_main_image){
        file_name = Date.now() + req.files.product_main_image.name;
        req.files.product_main_image.mv('public/uploads/' + file_name);
    }
    
    var sql, params;
    if(file_name) {
        sql = `UPDATE products SET 
               category_id = ?, product_name = ?, product_brand = ?, 
               product_details = ?, product_colors = ?, product_main_image = ?, 
               is_highlighted = ?, is_most_selling = ?  
               
               WHERE product_id = ?`;
        params = [d.category_id, d.product_name, d.product_brand, d.product_details, 
                 d.product_colors, file_name, d.is_highlighted, d.is_most_selling, 
                   d.product_id];
    } else {
        sql = `UPDATE products SET 
               category_id = ?, product_name = ?, product_brand = ?, 
               product_details = ?, product_colors = ?, 
               is_highlighted = ?, is_most_selling = ?
               WHERE product_id = ?`;
        params = [d.category_id, d.product_name, d.product_brand, d.product_details, 
                 d.product_colors, d.is_highlighted, d.is_most_selling, 
                 d.product_id];
    }
    
    await exe(sql, params);
    res.redirect('/admin/products_list');
});


router.get("/add_product_varients/:id", async (req,res)=>{
    var id = req.params.id;
        var sql = "SELECT * FROM products WHERE product_id = ?";
        let product = await exe(sql, [id]);
        
        sql = "SELECT * FROM product_variations WHERE product_id =?";
        let product_variations = await exe(sql, [id]);
    
        var packet = {product,product_variations};
        res.render('admin/add_product_varients.ejs',packet)
    });

router.post("/save_product_varients", async (req,res) =>{
    var d = req.body;
    var sql = "INSERT INTO product_variations(product_id, variation_title, variation_market_price, variation_price, available_stock) VALUES (?, ?, ?, ?, ?)";
    let data = await exe(sql, [d.product_id, d.variation_title, d.variation_market_price, d.variation_price, d.available_stock]);
    // res.send(data);
    res.redirect("/admin/products_list");
});

router.get('/edit_product_variation/:id', async (req,res) =>{
    var id = req.params.id;
    var sql = 'SELECT * FROM product_variations WHERE variation_id = ?';
    let product = await exe(sql, [id]);
    var packet = {product};
    res.render('admin/product_variation_edit.ejs', packet);
})

router.post('/update_product_variation', async (req,res) =>{
    var d = req.body;
    var sql = 'UPDATE product_variations SET variation_title = ?, variation_market_price = ?, variation_price = ?, available_stock = ? WHERE variation_id = ?';
    await exe(sql, [d.variation_title, d.variation_market_price, d.variation_price, d.available_stock, d.variation_id]);
    res.redirect('/admin/add_product_varients/' + d.product_id);
});

router.get('/delete_product_variation/:id', async (req, res) => {
var id = req.params.id;
// First, get the product_id so we can redirect back to the correct product's variants page
var sql = 'SELECT product_id FROM product_variations WHERE variation_id = ?';
let result = await exe(sql, [id]);
if (result.length === 0) {
    // If not found, redirect to products list
    return res.redirect('/admin/products_list');
}
var product_id = result[0].product_id;

// Now delete the variation
sql = 'DELETE FROM product_variations WHERE variation_id = ?';
await exe(sql, [id]);

// Redirect back to the variants page for the product
res.redirect('/admin/add_product_varients/' + product_id);
});


router.get("/slider",async (req,res) =>{
    var sql = "SELECT * FROM slider";
    let slider = await exe(sql);
    var packet = {slider};
    res.render('admin/slider.ejs', packet);
});


router.post("/save_slider", async (req,res) =>{
    var d = req.body;
    var file_name = null;
    if(req.files && req.files.slider_image){
        file_name = Date.now() + req.files.slider_image.name;
        req.files.slider_image.mv('public/uploads/' + file_name);
    }
    var sql = " INSERT INTO slider (slider_image, slider_title, slider_description, slider_button_text, slider_button_link) VALUES (?, ?, ?, ?, ?)";
   let data = await exe(sql, [file_name, d.slider_title, d.slider_description, d.slider_button_text, d.slider_button_link]);
    res.redirect('/admin/slider');
})

router.get('/edit_slider/:id', async (req, res) => {
    var id = req.params.id;
    var sql = 'SELECT * FROM slider WHERE slider_id = ?';
    let info = await exe(sql, [id]);
    if (!info || info.length === 0) {
        return res.redirect('/admin/slider');
    }
    var packet = { info };
    res.render('admin/slider_edit.ejs', packet);
});


router.post('/update_slider', async (req, res) => {
    var d = req.body;
    var file_name = d.old_slider_image || null;

    if (req.files && req.files.slider_image) {
        file_name = Date.now() + req.files.slider_image.name;
        req.files.slider_image.mv('public/uploads/' + file_name);
    }

    var sql = `UPDATE slider SET 
        slider_image = ?,
        slider_title = ?,
        slider_description = ?,
        slider_button_text = ?,
        slider_button_link = ?
        WHERE slider_id = ?`;

    await exe(sql, [file_name, d.slider_title, d.slider_description, d.slider_button_text, d.slider_button_link, d.slider_id]);
    res.redirect('/admin/slider');
});


router.get('/delete_slider/:id', async (req, res) => {
    var id = req.params.id;
    var sql = 'DELETE FROM slider WHERE slider_id = ?';
    await exe(sql, [id]);
    res.redirect('/admin/slider');
});

router.get("/pending_orders", async(req,res) =>{
    var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
    let orders = await exe(sql);
    var packet = {orders};
    res.render('admin/pending_orders.ejs',packet);
})

router.get("/order_details/:order_id",async (req,res) =>{
    var order_id = req.params.order_id;
    var sql = "SELECT * FROM orders WHERE order_id = ?";
    let order = await exe(sql,[order_id]);

    sql = "SELECT * FROM order_products, products, product_variations WHERE order_products.order_id = ? AND order_products.product_id = products.product_id AND order_products.variation_id = product_variations.variation_id";
   let order_products = await exe(sql, [order_id]);
    

    var packet = {order, order_products};
    res.render('admin/order_details.ejs',packet);
});


// router.get("/dispatch_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// })

// router.get("/delivered_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'delivered'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// })

// router.get("/cancelled_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// })

// router.get("/return_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// });

// router.get("/refund_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// })

// router.get("/rejected_orders", async(req,res) =>{
//     var sql = "SELECT * FROM orders WHERE order_status = 'pending'";
//     let orders = await exe(sql);
//     var packet = {orders};
//     res.render('/admin/orders.ejs',packet);
// })



module.exports = router;