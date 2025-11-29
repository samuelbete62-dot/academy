const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginBtn.addEventListener('click', ()=>{
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', ()=>{
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
});

// Initialize localStorage users
if(!localStorage.getItem('users')){
  localStorage.setItem('users', JSON.stringify([
    {email:'demo@neoquiz.com', password:'demo123', name:'Demo User'}
  ]));
}

// Login functionality
loginForm.addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  const loginError = document.getElementById('loginError');

  if(user){
    loginError.textContent = '';
    alert(`Welcome back, ${user.name}! Redirecting to Category Page...`);
    window.location.href = 'category.html';
  } else {
    loginError.textContent = 'Invalid email or password.';
  }
});

// Sign Up functionality
signupForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const signupError = document.getElementById('signupError');

  if(password !== confirm){
    signupError.textContent = 'Passwords do not match.';
    return;
  }

  if(users.some(u => u.email === email)){
    signupError.textContent = 'Email already registered.';
    return;
  }

  users.push({name, email, password});
  localStorage.setItem('users', JSON.stringify(users));
  signupError.textContent = '';
  alert('Sign Up Successful! You can now log in.');
  signupForm.reset();

  // Switch to login form automatically
  loginBtn.click();
});

