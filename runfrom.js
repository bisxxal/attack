// runFormTrident.js
import { createClient, sendRequest, buildFormData } from './httpClient';

async function submitTridentForm(instance, count) {
  // build fields (strings)
  const fields = {
    'name-1': 'Hillary Hall',
    'email-1': 'kesa@mailinator.com',
    'phone-1': '83434 25325',
    'select-1': 'Engineering (B.Tech.)',
    'consent-1': 'checked',
    'referer_url': '',
    'forminator_nonce': '99c3190398',
    '_wp_http_referer': '/wp-admin/admin-ajax.php',
    'form_id': '1121',
    'page_id': '877',
    'form_type': 'default',
    'current_url': 'https://trident.ac.in/',
    'render_id': '0',
    'action': 'forminator_submit_form_custom-forms',
    'input_6': ''
  };

  const { data, headers } = buildFormData(fields);

  const config = {
    method: 'post',
    url: 'https://trident.ac.in/wp-admin/admin-ajax.php',
    headers: {
      ...headers,
      origin: 'https://trident.ac.in',
      referer: 'https://trident.ac.in/',
      'x-requested-with': 'XMLHttpRequest'
      // optionally Cookie header if required
    },
    data
  };

  const resp = await sendRequest(instance, config, { retries: 3 });
  console.log(`count=${count} status=${resp.status}`);
  return resp.data;
}

(async () => {
  const client = createClient({ timeout: 15000 });
  // single call example:
  try {
    await submitTridentForm(client, 1);
  } catch (err) {
    console.error('Submit failed', err.message || err);
  }
})();


// const axios = require('axios');
// const qs = require('qs');
// let data = qs.stringify({
//   'semsav': '1',
//   'regdnum': '2512301046707' 
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp',
//   headers: { 
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
//     'accept-language': 'en-GB,en;q=0.9', 
//     'cache-control': 'max-age=0', 
//     'content-type': 'application/x-www-form-urlencoded', 
//     'origin': 'https://ais.tact.ac.in', 
//     'priority': 'u=0, i', 
//     'referer': 'https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp', 
//     'sec-ch-ua': '"Brave";v="143", "Chromium";v="143", "Not A(Brand";v="24"', 
//     'sec-ch-ua-mobile': '?0', 
//     'sec-ch-ua-platform': '"macOS"', 
//     'sec-fetch-dest': 'document', 
//     'sec-fetch-mode': 'navigate', 
//     'sec-fetch-site': 'same-origin', 
//     'sec-fetch-user': '?1', 
//     'sec-gpc': '1', 
//     'upgrade-insecure-requests': '1', 
//     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 
//     'Cookie': 'SameSite=None; JSESSIONID=CAB471F245987B47E22F8ACC3E34280E; cf_clearance=DKEja_7BCbTj2cQugieYxTgdnwF0Ey8LuJzs6IrNQig-1764826968-1.2.1.1-Imjs0b8OHrf3WkvJETCIh1ukBnAS.6iOsoA0ap8OuwAnoKiNMxRV_jHFoZagjJ9mLVj12B1YwNNPhsBq32prG0BZjE_Gqkcw8mreSS2uTw1ENavzJ4r.zka8GK3P1JlkBr.6pzFPT15Ly9YfUP70FAQx3vRzS_Mi9RJgdgANbtRm_2wmFCiBdtOqik5VLN5OObpN3uJFAf3fJEHrOiug30IrlziZDGIPgQpYnXyBkho; JSESSIONID=EE76D11587E00D1B3266F45FB7028BFD; SameSite=None'
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });
