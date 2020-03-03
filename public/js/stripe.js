/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_Y8v2gaoAk4qmPbO6RAJm9cY700NNBG2kHX');

export const buyCourse = async courseId => {
  try {
    // 1. Get session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/my-courses/checkout-session/${courseId}`
    );

    console.log(session);
    // 2. Create checkout forn + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
