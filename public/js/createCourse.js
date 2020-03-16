/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const slugify = require('slugify');

// type is either 'password' or 'data'
export const createCourse = async (
  title,
  subtitle,
  langSound,
  langSubs,
  includesVideos,
  includesArticles,
  includesContent,
  learnSummary,
  description,
  requirements,
  priceValue,
  priceDiscount,
  teachers,
  category,
  image
) => {
  try {
    const url = '/api/v1/courses';

    const res = await axios({
      method: 'POST',
      url,
      data: {
        title,
        subtitle,
        langSound,
        langSubs,
        includesVideos,
        includesArticles,
        includesContent,
        learnSummary,
        description,
        requirements,
        priceValue,
        priceDiscount,
        teachers,
        category,
        image
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Course successfully created!');
      window.setTimeout(() => {
        location.assign(`/course/${slugify(title, { lower: true })}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
