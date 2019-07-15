import axios from 'axios';

export default function request(url = '', method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: typeof method === 'string' ? method : 'GET',
      data,
    })
      .then(res => {
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      })
      .catch(err => {
        reject(err.response && err.response.data);
      });
  });
}
