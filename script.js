/* ===============================
   NAVIGATION / SPA LOGIC
=============================== */
const app = {
  views: {
    home: document.getElementById('view-home'),
    login: document.getElementById('view-login'),
    categories: document.getElementById('view-categories'),
    semesters: document.getElementById('view-semesters'),
    courses: document.getElementById('view-courses'),
    quiz: document.getElementById('view-quiz'),
    leaderboard: null // Placeholder
  },
  
  nav: function(viewName) {
    // Hide all views
    for (const key in this.views) {
      if (this.views[key]) {
        this.views[key].classList.add('hidden-view');
        this.views[key].classList.remove('active-view');
      }
    }
    
    // Show requested view
    const target = this.views[viewName] || this.views['home'];
    target.classList.remove('hidden-view');
    target.classList.add('active-view');

    // Specific logic when entering views
    if (viewName === 'quiz') {
      quizGame.start();
    }
  }
};

/* ===============================
   LOGIN / SIGNUP LOGIC
=============================== */
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Toggle between forms
loginBtn.addEventListener('click', () => {
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
});

// Seed demo user
if(!localStorage.getItem('users')){
  localStorage.setItem('users', JSON.stringify([
    {email:'demo@neoquiz.com', password:'demo123', name:'Demo User'}
  ]));
}

// Handle Login
loginForm.addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const user = users.find(u => u.email === email && u.password === password);
  const loginError = document.getElementById('loginError');

  if(user){
    loginError.textContent = '';
    alert(`Welcome back, ${user.name}!`);
    app.nav('categories'); // Redirect to categories
  } else {
    loginError.textContent = 'Invalid email or password.';
  }
});

// Handle Signup
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
  alert('Sign Up Successful! Please Log In.');
  signupForm.reset();
  loginBtn.click(); // Switch to login view
});

/* ===============================
   QUIZ LOGIC
=============================== */
const quizGame = {
  data: [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctIndex: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctIndex: 1
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "Shakespeare", "Mark Twain", "Jane Austen"],
      correctIndex: 1
    },
    {
      question: "What is 2 + 2 x 2?",
      options: ["6", "8", "4", "10"],
      correctIndex: 0
    }
  ],
  currentIndex: 0,
  
  elements: {
    question: document.getElementById("question"),
    options: document.querySelectorAll(".option"),
    submitBtn: document.getElementById("submitAnswerBtn"),
    feedback: document.getElementById("feedback")
  },

  start: function() {
    this.currentIndex = 0;
    this.elements.submitBtn.disabled = false;
    this.elements.feedback.textContent = "";
    this.loadQuestion();
    
    // Attach click events to options
    this.elements.options.forEach(opt => {
      // Remove old listeners to prevent stacking (cloning technique)
      const newOpt = opt.cloneNode(true);
      opt.parentNode.replaceChild(newOpt, opt);
    });
    
    // Re-select fresh DOM elements
    this.elements.options = document.querySelectorAll(".option");
    
    this.elements.options.forEach((opt, index) => {
      opt.addEventListener("click", () => {
        this.elements.options.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
      });
    });

    // Submit Listener (Remove old one, add new)
    const newSubmit = this.elements.submitBtn.cloneNode(true);
    this.elements.submitBtn.parentNode.replaceChild(newSubmit, this.elements.submitBtn);
    this.elements.submitBtn = newSubmit;

    this.elements.submitBtn.addEventListener("click", () => this.checkAnswer());
  },

  loadQuestion: function() {
    const current = this.data[this.currentIndex];
    this.elements.question.textContent = `${this.currentIndex + 1}. ${current.question}`;
    this.elements.options.forEach((opt, i) => {
      opt.textContent = `${String.fromCharCode(65+i)}) ${current.options[i]}`;
      opt.classList.remove("selected");
    });
    this.elements.feedback.textContent = "";
  },

  checkAnswer: function() {
    const selected = document.querySelector(".option.selected");
    if (!selected) {
      this.elements.feedback.style.color = "#ff6b6b";
      this.elements.feedback.textContent = "Please select an option.";
      return;
    }

    // Determine selected index based on DOM order
    let selectedIndex = -1;
    this.elements.options.forEach((opt, i) => {
      if(opt === selected) selectedIndex = i;
    });

    const correctIndex = this.data[this.currentIndex].correctIndex;

    if (selectedIndex === correctIndex) {
      this.elements.feedback.style.color = "#00ff6a";
      this.elements.feedback.textContent = "Correct!";
    } else {
      this.elements.feedback.style.color = "#ff6b6b";
      this.elements.feedback.textContent = `Wrong! Answer: ${this.data[this.currentIndex].options[correctIndex]}`;
    }

    // Next Question logic
    this.currentIndex++;
    if(this.currentIndex < this.data.length){
      setTimeout(() => this.loadQuestion(), 1500);
    } else {
      setTimeout(() => {
        this.elements.feedback.style.color = "#00ffff";
        this.elements.feedback.textContent = "Quiz Completed! Returning to categories...";
        this.elements.submitBtn.disabled = true;
        setTimeout(() => app.nav('categories'), 2000);
      }, 1500);
    }
  }
};
