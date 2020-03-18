/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

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
