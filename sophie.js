require('dotenv').config()

const myHeaders = new Headers()
myHeaders.append('Accept', 'application/json')
myHeaders.append('Cookie', process.env.SOPHIE_COOKIE)

const myURL = 'https://www.seeksophie.com/api/orders?q[order_customer_name_or_order_customer_email_cont]=&q[start_date_gteq]=&q[start_date_lteq]=&q[order_created_at_gteq]=&q[order_created_at_lteq]=&q[s]=start_date%20desc&custom_filter=upcoming&page=1'

async function getData() {
      const response = await fetch(
        myURL
      ,{headers: myHeaders});
      let data = await response.json();
      // console.log(data)
      // console.log(Object.keys(data))
      console.log(data.order_items[0])
      //order_items
      //pagination_info
}

module.exports = getData

// getData()