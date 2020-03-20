/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const slugify = require('slugify');

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

export const updateCourse = async (courseId, data) => {
  try {
    const url = `/api/v1/courses/${courseId}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    // console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', 'Course successfully updated!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateReivew = async (reviewId, data) => {
  try {
    const url = `/api/v1/reviews/${reviewId}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    // console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', 'Review successfully updated!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const url = `/api/v1/users/${userId}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    // console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', 'User successfully updated!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteCourse = async courseId => {
  try {
    const url = `/api/v1/courses/${courseId}`;

    const res = await axios({
      method: 'DELETE',
      url
    });

    if (res.status == '204') {
      showAlert('success', 'Course successfully deleted!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Something bad happened! Please try again later.');
  }
};

export const deleteUser = async userId => {
  try {
    const url = `/api/v1/users/${userId}`;

    const res = await axios({
      method: 'DELETE',
      url
    });

    if (res.status == '204') {
      showAlert('success', 'User successfully deleted!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Something bad happened! Please try again later.');
  }
};

export const deleteReview = async reviewId => {
  try {
    const url = `/api/v1/reviews/${reviewId}`;

    const res = await axios({
      method: 'DELETE',
      url
    });

    if (res.status == '204') {
      showAlert('success', 'Review successfully deleted!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Something bad happened! Please try again later.');
  }
};
