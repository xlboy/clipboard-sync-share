import Axios from 'axios';

export const axios = Axios.create({
  baseURL: 'http://127.0.0.1:5000/'
});

// axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    switch (error.response.status) {
      case 401:
        window.location.href = '/user/login';
        break;
    }

    return Promise.reject(error);
  }
);
