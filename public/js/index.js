/* eslint-disable */
// import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { deleteCourse } from './manageResources';
import { createCourse } from './createCourse';
import { buyCourse } from './stripe';
import { showAlert } from './alerts';

createCourse;

// DOM ELEMENTS
const loginForm = document.querySelector('.form__login');
const signupForm = document.querySelector('.form__signup');
const createcourseForm = document.querySelector('.form__createcourse');
const logoutBtn = document.getElementById('btn__logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const buyBtn = document.getElementById('buy-course');
const filters = document.querySelector('.courses__filters');
const cardAdminDelete = document.querySelectorAll('.card__admin--delete');

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

if (createcourseForm) {
  createcourseForm.addEventListener('submit', e => {
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

if (cardAdminDelete) {
  cardAdminDelete.forEach(el => {
    el.addEventListener('click', e => {
      // console.log(e.target.parentNode.firstChild.value);
      deleteCourse(e.target.parentNode.firstChild.value);
    });
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
