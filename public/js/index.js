/* eslint-disable */
// import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { buyCourse } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const loginForm = document.querySelector('.form__login');
const signupForm = document.querySelector('.form__signup');
const logoutBtn = document.getElementById('btn__logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const buyBtn = document.getElementById('buy-course');
const dropdown = document.getElementById('dropdown');

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

if (dropdown) {
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

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
