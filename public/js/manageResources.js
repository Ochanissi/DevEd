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
