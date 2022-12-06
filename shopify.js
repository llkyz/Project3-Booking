const Shopify = require('shopify-api-node');
require('dotenv').config()

const shopify = new Shopify({
    shopName: 'sppfys.myshopify.com',
    apiKey: process.env.SHOPIFY_KEY,
    password: process.env.SHOPIFY_PASSWORD,
    autoLimit: true
});

function getData() {
  shopify.order
    .list({ limit: 5 })
    .then((orders) => console.log(orders))
    .catch((err) => console.error(err))
}

module.exports = getData

// shopify.product.count()
//     .then(async (count) => {
//         if (count > 0) {

//             const pages = Math.ceil(count / 250);
//             let products = [];

//             for (i = 0; i < pages; i++) {
//                 // use Promise.all instead of waiting for each response
//                 const result = await shopify.product.list({
//                     limit: 250,
//                     page: i + 1,
//                     fields: 'id, variants'
//                 });
//                 products = products.concat(result);
//             }
//             // products array should have all the products. Includes id and variants
//             console.log(products);
//         }
//     })
//     .catch(err => {
//         console.log(err);
//     });