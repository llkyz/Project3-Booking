const myHeaders = new Headers()
myHeaders.append('Accept', 'application/json')
myHeaders.append('Accept-Encoding', 'gzip, deflate, br')
myHeaders.append('Accept-Language', 'en-GB,en-US;q=0.9,en;q=0.8')
// myHeaders.append('Connection', 'keep-alive')
myHeaders.append('Host', 'www.seeksophie.com')
myHeaders.append('Referer', 'https://www.seeksophie.com/partner/orders?q%5Bs%5D=start_date%20desc&custom_filter=upcoming&page=1')
myHeaders.append('sec-ch-ua', '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"')
myHeaders.append('sec-ch-ua-mobile', '?0')
myHeaders.append('sec-ch-ua-platform', "macOS")
myHeaders.append('Sec-Fetch-Dest', 'empty')
myHeaders.append('Sec-Fetch-Mode', 'cors')
myHeaders.append('Sec-Fetch-Site', 'same-origin')
myHeaders.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36')
myHeaders.append('Cookie', 'maxmind_result=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkludGNJbU5wZEhsY0lqcDdYQ0puWlc5dVlXMWxYMmxrWENJNk1UZzRNREkxTWl4Y0ltNWhiV1Z6WENJNmUxd2laR1ZjSWpwY0lsTnBibWRoY0hWeVhDSXNYQ0psYmx3aU9sd2lVMmx1WjJGd2IzSmxYQ0lzWENKbGMxd2lPbHdpVTJsdVoyRndkWEpjSWl4Y0ltWnlYQ0k2WENKVGFXNW5ZWEJ2ZFhKY0lpeGNJbXBoWENJNlhDTGpncmZqZzdQamdxempnNTNqZzd6amc2dGNJaXhjSW5CMExVSlNYQ0k2WENKVGFXNW5ZWEIxY21GY0lpeGNJbkoxWENJNlhDTFFvZEM0MEwzUXM5Q3cwTC9SZzlHQVhDSXNYQ0o2YUMxRFRsd2lPbHdpNXBhdzVZcWc1WjJoWENKOWZTeGNJbU52Ym5ScGJtVnVkRndpT250Y0ltTnZaR1ZjSWpwY0lrRlRYQ0lzWENKblpXOXVZVzFsWDJsa1hDSTZOakkxTlRFME55eGNJbTVoYldWelhDSTZlMXdpWkdWY0lqcGNJa0Z6YVdWdVhDSXNYQ0psYmx3aU9sd2lRWE5wWVZ3aUxGd2laWE5jSWpwY0lrRnphV0ZjSWl4Y0ltWnlYQ0k2WENKQmMybGxYQ0lzWENKcVlWd2lPbHdpNDRLaTQ0SzQ0NEtpWENJc1hDSndkQzFDVWx3aU9sd2l3NEZ6YVdGY0lpeGNJbkoxWENJNlhDTFFrTkMzMExqUmoxd2lMRndpZW1ndFEwNWNJanBjSXVTNm11YTBzbHdpZlgwc1hDSmpiM1Z1ZEhKNVhDSTZlMXdpWjJWdmJtRnRaVjlwWkZ3aU9qRTRPREF5TlRFc1hDSnBjMjlmWTI5a1pWd2lPbHdpVTBkY0lpeGNJbTVoYldWelhDSTZlMXdpWkdWY0lqcGNJbE5wYm1kaGNIVnlYQ0lzWENKbGJsd2lPbHdpVTJsdVoyRndiM0psWENJc1hDSmxjMXdpT2x3aVUybHVaMkZ3ZFhKY0lpeGNJbVp5WENJNlhDSlRhVzVuWVhCdmRYSmNJaXhjSW1waFhDSTZYQ0xqZ3Jmamc3UGpncXpqZzUzamc3empnNnRjSWl4Y0luQjBMVUpTWENJNlhDSlRhVzVuWVhCMWNtRmNJaXhjSW5KMVhDSTZYQ0xRb2RDNDBMM1FzOUN3MEwvUmc5R0FYQ0lzWENKNmFDMURUbHdpT2x3aTVwYXc1WXFnNVoyaFhDSjlmU3hjSW14dlkyRjBhVzl1WENJNmUxd2lZV05qZFhKaFkzbGZjbUZrYVhWelhDSTZNVEFzWENKc1lYUnBkSFZrWlZ3aU9qRXVNekF6Tml4Y0lteHZibWRwZEhWa1pWd2lPakV3TXk0NE5UVTBMRndpZEdsdFpWOTZiMjVsWENJNlhDSkJjMmxoTDFOcGJtZGhjRzl5WlZ3aWZTeGNJbkJ2YzNSaGJGd2lPbnRjSW1OdlpHVmNJanBjSWpFNFhDSjlMRndpY21WbmFYTjBaWEpsWkY5amIzVnVkSEo1WENJNmUxd2laMlZ2Ym1GdFpWOXBaRndpT2pFNE9EQXlOVEVzWENKcGMyOWZZMjlrWlZ3aU9sd2lVMGRjSWl4Y0ltNWhiV1Z6WENJNmUxd2laR1ZjSWpwY0lsTnBibWRoY0hWeVhDSXNYQ0psYmx3aU9sd2lVMmx1WjJGd2IzSmxYQ0lzWENKbGMxd2lPbHdpVTJsdVoyRndkWEpjSWl4Y0ltWnlYQ0k2WENKVGFXNW5ZWEJ2ZFhKY0lpeGNJbXBoWENJNlhDTGpncmZqZzdQamdxempnNTNqZzd6amc2dGNJaXhjSW5CMExVSlNYQ0k2WENKVGFXNW5ZWEIxY21GY0lpeGNJbkoxWENJNlhDTFFvZEM0MEwzUXM5Q3cwTC9SZzlHQVhDSXNYQ0o2YUMxRFRsd2lPbHdpNXBhdzVZcWc1WjJoWENKOWZTeGNJbTVsZEhkdmNtdGNJanBjSWpFd015NHlOVEl1TWpBd0xqQXZNakpjSW4waSIsImV4cCI6IjIwMjItMTItMjlUMDI6MzU6MjkuNTIxWiIsInB1ciI6ImNvb2tpZS5tYXhtaW5kX3Jlc3VsdCJ9fQ%3D%3D--99ffaff8adf80f51232187d4d14e63145e8343ac; lcid=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik16WT0iLCJleHAiOiIyMDIyLTEyLTI5VDAyOjM1OjI5LjUyNFoiLCJwdXIiOiJjb29raWUubGNpZCJ9fQ%3D%3D--7007b758625c045ec7f71dbff1eed7d3690a0b70; lcoid=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik1URXoiLCJleHAiOiIyMDIyLTEyLTI5VDAyOjM1OjI5LjUyNVoiLCJwdXIiOiJjb29raWUubGNvaWQifX0%3D--3dce7318b3eb514b788746e1697b3be2611f37bf; _seeksophie_session_v2=jS75KcftOZMVGbopwRgctzOTXY0csI84QaKmf%2F0DColQfR9L5TaSEl8%2Fx8j6o5LraBzJn0Go5E0Y8ZbixLe47xdDyOQOS4svZshuVtjjmGoOyIAqD1TXMya4dG8qmdV3RoGk1zQMRZpSpymDXthV0RCMjQdeugYbBZRSpmzq1KXvSDAWPF0W8uWURD9QXZQSieA60pJAPfcRc%2B7N8gTrCWL6EJ%2FDS6JIGs%2BE7kq6xdSta%2FrGmGJ%2FXXElQQyHY4nJ8LpHGVtoMrNt5bsn3jxxEnSpgxwifolf9E5u5jKMv2dL%2F6T0xsJReyYcJJs7hWOK3DPlRs%2BryHI7AsfSMsI8lIVVBOO9iWHklf7TGHcc16IIPKx7pqxthRRS03MoLQ5%2BtCjZvfCzSyZ20b0PccrioAAIO9%2FHUIl4hpm5iqexZtiW%2BYzX7vIpBt0YN55dTmncS52aRHiUNizbtyBDh1MjLg%3D%3D--W2DRkJFlsL4AfRZ%2B--w38if3mOKAZIzdryYHI1Yg%3D%3D')

const myURL = 'https://www.seeksophie.com/api/orders?q[order_customer_name_or_order_customer_email_cont]=&q[start_date_gteq]=&q[start_date_lteq]=&q[order_created_at_gteq]=&q[order_created_at_lteq]=&q[s]=start_date%20desc&custom_filter=upcoming&page=1'

let data = ""
const getData = async () => {
      const response = await fetch(
        myURL
      ,{headers: myHeaders});
      data = await response.json();
    //   console.log(data)
    //   console.log(Object.keys(data))
      console.log(data.order_items[0])
}

getData()

