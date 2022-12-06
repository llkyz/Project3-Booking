const Shopify = require("shopify-api-node");
require("dotenv").config();

const shopify = new Shopify({
  shopName: "sppfys.myshopify.com",
  apiKey: process.env.SHOPIFY_KEY,
  password: process.env.SHOPIFY_PASSWORD,
  autoLimit: true,
});

async function getData() {
  let data = await shopify.order.list();
  let shopifyList = data.map((order) => {
    if (order.line_items[0].properties[1]) {
      dateTime = new Date(order.line_items[0].properties[1].value);
    }
    return {
      origin: "shopify",
      id: order.id,
      price: order.current_total_price,
      participants: order.line_items[0].properties[3]
        ? order.line_items[0].properties[3].value
        : 0,
      dateTime: dateTime ? dateTime : "N/A",
      customer: order.customer.first_name + order.customer.last_name,
      contact: order.customer.phone ? order.customer.phone : "N/A",
    };
  });

  return shopifyList;
}

module.exports = getData;
