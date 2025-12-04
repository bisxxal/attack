// runAis.js
import { createClient, sendRequest, buildUrlEncoded } from './httpClient.js';

async function postAisAttendance(instance, regdnum, semsav = '1') {
  const { data, headers } = buildUrlEncoded({ semsav, regdnum });
  const config = {
    method: 'post',
    url: 'https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp',
    headers: {
      ...headers,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-language': 'en-GB,en;q=0.9',
      origin: 'https://ais.tact.ac.in',
      referer: 'https://ais.tact.ac.in/ais/studportal/attendancedetails.jsp'
    },
    data
  };

  const resp = await sendRequest(instance, config, { retries: 3 });
  return resp.data;
}

const client = createClient({ timeout: 20000 });
postAisAttendance(client, '2512301046707')
  .then(html => console.log('HTML length:', html.length))
  .catch(err => console.error('Attendance request failed:', err.message));
