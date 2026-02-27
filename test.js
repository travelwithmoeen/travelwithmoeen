import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,          // 100 virtual users
  duration: '30s',   // for 30 seconds
};

export default function () {
  http.get('https://travelwithmoeen.com');
  sleep(1);
}