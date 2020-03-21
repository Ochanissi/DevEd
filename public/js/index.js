/* eslint-disable */
// import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import {
  createCourse,
  updateCourse,
  updateReivew,
  updateUser,
  deleteCourse,
  deleteUser,
  deleteReview,
  leaveReview
} from './manageResources';
import { buyCourse } from './stripe';
import { showAlert } from './alerts';

createCourse;

// DOM ELEMENTS
const loginForm = document.querySelector('.form__login');
const signupForm = document.querySelector('.form__signup');
const leaveReviewForm = document.getElementById('form__leavereview');
const createCourseForm = document.getElementById('form__createcourse');
const updateCourseForm = document.getElementById('form__updatecourse');
const updateReviewForm = document.getElementById('form__updatereview');
const updateUserForm = document.getElementById('form__updateuser');
const logoutBtn = document.getElementById('btn__logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const buyBtn = document.getElementById('buy-course');
const filters = document.querySelector('.courses__filters');
const cardAdminDelete = document.querySelectorAll('.card__admin--delete');
const userAdminDelete = document.querySelectorAll('.user__admin--delete');
const reviewAdminDelete = document.querySelectorAll('.review__admin--delete');

// DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (leaveReviewForm) {
  leaveReviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const courseId = document.getElementById('leavereview__courseId').value;

    const rating = document.getElementById('leavereview__rating').value;
    const review = document.getElementById('leavereview__review').value;

    // console.log(courseId, rating, review);
    leaveReview(courseId, { rating, review });
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('occupation', document.getElementById('occupation').value);
    form.append('country', document.getElementById('country').value);
    form.append('about', document.getElementById('about').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (buyBtn) {
  buyBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { courseId } = e.target.dataset;
    buyCourse(courseId);
  });
}

if (filters) {
  const dropdownSubjects = document.querySelector('.dropdown__subjects');
  const dropdownTypes = document.querySelector('.dropdown__types');
  const dropdownSort = document.querySelector('.dropdown__sort');

  dropdownSubjects.onchange = function() {
    localStorage.setItem('dropdown', dropdownSubjects.value);
    location.assign(`/courses?${dropdownSubjects.value}#courses`);
  };

  dropdownTypes.onchange = function() {
    localStorage.setItem('dropdown', dropdownTypes.value);
    location.assign(`/courses?${dropdownTypes.value}#courses`);
  };

  dropdownSort.onchange = function() {
    localStorage.setItem('dropdown', dropdownSort.value);
    location.assign(`/courses?${dropdownSort.value}#courses`);
  };

  window.onload = function() {
    if (localStorage['dropdown']) {
      if (localStorage['dropdown'].startsWith('category')) {
        dropdownSubjects.value = localStorage['dropdown'];
        location.assign(`/courses?${dropdownSubjects.value}#courses`);
      }

      if (localStorage['dropdown'].startsWith('typ')) {
        dropdownTypes.value = localStorage['dropdown'];
        location.assign(`/courses?${dropdownTypes.value}#courses`);
      }

      if (localStorage['dropdown'].startsWith('sort')) {
        dropdownSort.value = localStorage['dropdown'];
        location.assign(`/courses?${dropdownSort.value}#courses`);
      }
    }
  };
}

if (createCourseForm) {
  createCourseForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', document.getElementById('course__title').value);
    form.append('subtitle', document.getElementById('course__subtitle').value);
    form.append(
      'langSound',
      document.getElementById('course__langsound').value
      // .split(', ')
    );
    form.append(
      'langSubs',
      document.getElementById('course__langsubs').value
      // .split(', ')
    );
    form.append(
      'includesVideos',
      document.getElementById('course__includesvideo').value
    );
    form.append(
      'includesArticles',
      document.getElementById('course__includesarticles').value
    );
    form.append(
      'includesContent',
      document.getElementById('course__includescontent').value
    );
    form.append(
      'learnSummary',
      document.getElementById('course__summary').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'description',
      document.getElementById('course__description').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'requirements',
      document.getElementById('course__requirements').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'priceValue',
      document.getElementById('course__pricevalue').value
    );
    form.append(
      'priceDiscount',
      document.getElementById('course__pricediscount').value
    );
    form.append(
      'teachers',
      document.getElementById('course__teachers').value
      // .toString()
    );
    form.append(
      'category',
      document.querySelector('.course__category').options[
        document.querySelector('.course__category').selectedIndex
      ].value
    );
    form.append('image', document.getElementById('course__photo').files[0]);
    createCourse(form);
  });
}

if (updateCourseForm) {
  const a = document.getElementById('updatecourse__category').value;
  const b = document.querySelector('.updatecourse__category').options;

  for (let i = 0; i < b.length; i++) {
    if (b[i].value === a) {
      b[i].selected = true;
    }
  }

  // console.log(a);
  // console.log(b);

  updateCourseForm.addEventListener('submit', e => {
    e.preventDefault();
    const courseId = document.getElementById('updatecourse__courseId').value;

    const form = new FormData();
    form.append('title', document.getElementById('updatecourse__title').value);
    form.append(
      'subtitle',
      document.getElementById('updatecourse__subtitle').value
    );
    form.append(
      'langSound',
      document.getElementById('updatecourse__langsound').value
      // .split(', ')
    );
    form.append(
      'langSubs',
      document.getElementById('updatecourse__langsubs').value
      // .split(', ')
    );
    form.append(
      'includesVideos',
      document.getElementById('updatecourse__includesvideo').value
    );
    form.append(
      'includesArticles',
      document.getElementById('updatecourse__includesarticles').value
    );
    form.append(
      'includesContent',
      document.getElementById('updatecourse__includescontent').value
    );
    form.append(
      'learnSummary',
      document.getElementById('updatecourse__summary').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'description',
      document.getElementById('updatecourse__description').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'requirements',
      document.getElementById('updatecourse__requirements').value
      // .split('. ')
      // .map(x => (!x.endsWith('.') ? x + '.' : x))
    );
    form.append(
      'priceValue',
      document.getElementById('updatecourse__pricevalue').value
    );
    form.append(
      'priceDiscount',
      document.getElementById('updatecourse__pricediscount').value
    );
    // form.append(
    //   'teachers',
    //   document.getElementById('updatecourse__teachers').value
    //   // .toString()
    // );
    form.append(
      'category',
      document.querySelector('.updatecourse__category').options[
        document.querySelector('.updatecourse__category').selectedIndex
      ].value
    );

    if (!document.getElementById('updatecourse__photo').value) {
      // console.log('Please choose a file!');
    } else {
      // console.log('File has been chosen');
      form.append(
        'image',
        document.getElementById('updatecourse__photo').files[0]
      );
    }

    // form.append(
    //   'image',
    //   document.getElementById('updatecourse__photo').files[0]
    // );

    // console.log(image);

    updateCourse(courseId, form);
  });
}

if (updateReviewForm) {
  updateReviewForm.addEventListener('submit', e => {
    e.preventDefault();

    const reviewId = document.getElementById('updatereview__reviewId').value;

    const rating = document.getElementById('updatereview__rating').value;
    const review = document.getElementById('updatereview__review').value;

    // console.log(reviewId, { rating, review });
    updateReivew(reviewId, { rating, review });
  });
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', e => {
    e.preventDefault();
    const userId = document.getElementById('updateuser__userId').value;

    const form = new FormData();
    form.append('name', document.getElementById('updateuser__name').value);
    form.append('email', document.getElementById('updateuser__email').value);
    form.append(
      'occupation',
      document.getElementById('updateuser__occupation').value
    );
    form.append(
      'country',
      document.getElementById('updateuser__country').value
    );
    form.append('about', document.getElementById('updateuser__about').value);

    if (!document.getElementById('updateuser__photo').value) {
      // console.log('Please choose a file!');
    } else {
      // console.log('File has been chosen');
      form.append(
        'photo',
        document.getElementById('updateuser__photo').files[0]
      );
    }

    updateUser(userId, form);
  });
}

if (cardAdminDelete) {
  cardAdminDelete.forEach(el => {
    el.addEventListener('click', e => {
      // console.log(e.target.parentNode.firstChild.value);
      deleteCourse(e.target.parentNode.firstChild.value);
    });
  });
}

if (userAdminDelete) {
  userAdminDelete.forEach(el => {
    el.addEventListener('click', e => {
      // console.log(e.target.parentNode.firstChild.value);
      deleteUser(e.target.parentNode.firstChild.value);
    });
  });
}

if (reviewAdminDelete) {
  reviewAdminDelete.forEach(el => {
    el.addEventListener('click', e => {
      // console.log(e.target.parentNode.firstChild.value);
      deleteReview(e.target.parentNode.firstChild.value);
    });
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
