import axios from 'axios';
import io from 'socket.io-client';

export async function connectSocket(address = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'){
    return axios
      .get(`${address}/createNamespace`)
      .then(function (res) {
        return io(`${address}/${res.data.namespace}`);
      })
      .catch(function (err) {
        console.log('error in creating namespace', err);
      });
};
