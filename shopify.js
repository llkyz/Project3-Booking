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
    .list()
    .then((orders) => orders.forEach((orders)=>{
      console.log("====================================")
      console.log("Origin: Shopify")
      console.log("ID:", orders.id)
      console.log("Price:", orders.current_total_price)
      console.log("Participants: ", orders.line_items[0].properties[3]?orders.line_items[0].properties[3].value:"N/A")
      console.log("Date: ", orders.line_items[0].properties[1]? orders.line_items[0].properties[1].value:"N/A")
      console.log("Customer Name: ", orders.customer.first_name + orders.customer.last_name)
      console.log("Phone Number: ", orders.customer.phone ? orders.customer.phone: "N/A")
    }))
    .catch((err) => console.error(err))
}

module.exports = getData