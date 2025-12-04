import axios from "axios";
import FormData from "form-data";
import https from "https";
import qs from "qs";
const CONCURRENCY = 10; // don't blast the server
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 15000; // 15s

const URL = "https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp";
const METHOD = "POST";
// Reusable axios instance with keepAlive agent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
  // timeout: REQUEST_TIMEOUT,
  // timeout: 10000,

  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    Cookie:
      "SameSite=None; JSESSIONID=CAB471F245987B47E22F8ACC3E34280E; cf_clearance=DKEja_7BCbTj2cQugieYxTgdnwF0Ey8LuJzs6IrNQig-1764826968-1.2.1.1-Imjs0b8OHrf3WkvJETCIh1ukBnAS.6iOsoA0ap8OuwAnoKiNMxRV_jHFoZagjJ9mLVj12B1YwNNPhsBq32prG0BZjE_Gqkcw8mreSS2uTw1ENavzJ4r.zka8GK3P1JlkBr.6pzFPT15Ly9YfUP70FAQx3vRzS_Mi9RJgdgANbtRm_2wmFCiBdtOqik5VLN5OObpN3uJFAf3fJEHrOiug30IrlziZDGIPgQpYnXyBkho; JSESSIONID=EE76D11587E00D1B3266F45FB7028BFD; SameSite=None",
  },
});

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function postForm(count) {
  let data = qs.stringify({
    semsav: "1",
    regdnum: "2512301046707",
  });

  const headers = {
    ...axiosInstance.defaults.headers,
    // ...data.getHeaders(),
    // if you still want to pass Cookie, do so here (but static cf_clearance usually fails)
    // 'Cookie': 'cf_clearance=...'
  };

  const config = {
    method: METHOD,
    url: URL,
    headers,
    data,
  };

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await axiosInstance.request(config);
      // console.log(`✅ Success count=${count} status=${resp.status} data= ${JSON.stringify(resp.data).slice(7700, 8900) }`);
      console.log(`✅ Success count=${count} status=${resp.status}`);
      return resp.data;
    } catch (error) {
      const isLast = attempt === MAX_RETRIES;

      // Detailed logging
      if (error.response) {
        console.error(
          `❌ Error at count: ${count} attempt:${attempt} status:${error.response.status}`,
          "data:",
          JSON.stringify(error.response.data).slice(0, 800)
        );
      } else if (error.request) {
        console.error(
          `❌ No response at count: ${count} attempt:${attempt}`,
          error.message
        );
      } else {
        console.error(
          `❌ Request setup error at count: ${count} attempt:${attempt}`,
          error.message
        );
      }

      // If last attempt, rethrow or return to move on
      if (isLast) {
        console.error("Giving up on count:", count);
        return null;
      }

      // Backoff: 500ms * 2^(attempt-1) + small jitter
      const backoff =
        500 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
      await delay(backoff);
    }
  }
}

async function main() {
  const TOTAL = 599 * 100; // your original plan — but suggest lowering for safety/testing
  let tasks = [];
  let inFlight = 0;
  let index = 0;

  while (index < TOTAL) {
    while (inFlight < CONCURRENCY && index < TOTAL) {
      const current = index;
      inFlight++;
      const p = postForm(current)
        .then(() => {
          inFlight--;
        })
        .catch(() => {
          inFlight--;
        }); // postForm handles errors internally but be safe
      tasks.push(p);
      index++;
    }
    await delay(200);
  }

  // wait for remaining tasks
  await Promise.all(tasks);
  console.log("All done");
}

main().catch((err) => console.error("Fatal error:", err));

//   let data = qs.stringify({
//   'semsav': '1',
//   'regdnum': '2512301046707'
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp',
//   headers: {
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
//     'Cookie': 'SameSite=None; JSESSIONID=CAB471F245987B47E22F8ACC3E34280E; cf_clearance=DKEja_7BCbTj2cQugieYxTgdnwF0Ey8LuJzs6IrNQig-1764826968-1.2.1.1-Imjs0b8OHrf3WkvJETCIh1ukBnAS.6iOsoA0ap8OuwAnoKiNMxRV_jHFoZagjJ9mLVj12B1YwNNPhsBq32prG0BZjE_Gqkcw8mreSS2uTw1ENavzJ4r.zka8GK3P1JlkBr.6pzFPT15Ly9YfUP70FAQx3vRzS_Mi9RJgdgANbtRm_2wmFCiBdtOqik5VLN5OObpN3uJFAf3fJEHrOiug30IrlziZDGIPgQpYnXyBkho; JSESSIONID=EE76D11587E00D1B3266F45FB7028BFD; SameSite=None'
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.status));
// })
// .catch((error) => {
//   console.log(error);
// });
