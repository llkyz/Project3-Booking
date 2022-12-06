require("dotenv").config();

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Cookie", process.env.SOPHIE_COOKIE);

const myURL =
  "https://www.seeksophie.com/api/orders?q[order_customer_name_or_order_customer_email_cont]=&q[start_date_gteq]=&q[start_date_lteq]=&q[order_created_at_gteq]=&q[order_created_at_lteq]=&q[s]=start_date%20desc&custom_filter=upcoming&page=1";

async function getData() {
  const response = await fetch(myURL, { headers: myHeaders });
  let data = await response.json();

  let sophieList = data.order_items.map((data) => {
    let fetchTime = new Date(data.start_time);
    let dateTime = new Date(data.start_date);
    dateTime.setHours(fetchTime.getHours() - 8);
    dateTime.setMinutes(fetchTime.getMinutes());

    return {
      origin: "sophie",
      id: data.id,
      price: data.total_payout_amount.amount,
      participants: data.quantity,
      dateTime: dateTime,
      customer: data.order.customer_name,
      contact: data.order.contact_num,
    };
  });

  return sophieList;
}

module.exports = getData;
