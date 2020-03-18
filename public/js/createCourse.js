/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const slugify = require('slugify');

// type is either 'password' or 'data'
export const createCourse = async data => {
  try {
    const url = '/api/v1/courses';

    const res = await axios({
      method: 'POST',
      url,
      data
    });

    if (res.data.status === 'success') {
      // console.log('5', res.data.data.data.title);

      showAlert('success', 'Course successfully created!');
      window.setTimeout(() => {
        location.assign(
          `/course/${slugify(res.data.data.data.title, { lower: true })}`
        );
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
