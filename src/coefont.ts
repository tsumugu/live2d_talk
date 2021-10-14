import axios from 'axios';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

export let s_instance: CoeFont = null;
export class CoeFont {
  constructor() {
  }
  public static getInstance(): CoeFont {
    if (s_instance == null) {
      s_instance = new CoeFont();
    }
    return s_instance;
  }
  public getWAVUrl(text: string): string {
    //console.log(process.env.COEFONT_ID);
    const accessKey = process.env.COEFONT_ACCESS_KEY
    const accessSecret = process.env.COEFONT_ACCESS_SECRET
    const coefontId = process.env.COEFONT_ID
    const data = JSON.stringify({
      'coefont': coefontId,
      'text': text
    })
    const date = String(Math.floor(Date.now() / 1000))
    const signature = Base64.stringify(hmacSHA256(date+data, accessSecret));
    //const signature = crypto.createHmac('sha256', accessSecret).update(date+data).digest('hex')
    axios.post('https://api.coefont.cloud/v1/text2speech', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessKey,
        'X-Coefont-Date': date,
        'X-Coefont-Content': signature
      }
      /*,responseType: 'stream'*/
    })
    .then(response => {
      // CORSでエラー出るのでだめだった。
      console.log(response, response.request.responseURL)
    })
    .catch(error => {
      console.log(error)
    })
    return "";
  }
}