let currentQuestion = 0;
let score = 0;
let answered = false;
let autoNextTimeoutId = null;
let answeredQuestions = {};

const mascotMessages = {
  welcome: [
    "Ready for animal adventure? 🐾",
    "Let's find your favorite animal! 🌟",
    "Join the animal squad and have fun! 🎉"
  ],
  question: [
    "Can you guess this animal? 🧠",
    "Time to show your animal superpowers! 💥",
    "This one is a wild favorite! 🐾"
  ],
  correct: [
    "Yay! You're a champ! 🎉",
    "That was a smart pick! ✨",
    "Awesome job, little explorer! 🚀"
  ],
  incorrect: [
    "Oops! Try the next one! 😺",
    "Nice try! Keep going! 💪",
    "Almost there, little explorer! 🌈"
  ],
  result: [
    "Great job! Ready to play again? 🎊",
    "You rocked it! Let's try another round! 🐾",
    "Amazing score! Want a rematch? 😄"
  ]
};

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateMascot(message, emoji = "🦊") {
  const mascotEmoji = document.getElementById("mascotEmoji");
  const mascotMessage = document.getElementById("mascotMessage");
  if (mascotEmoji) mascotEmoji.textContent = emoji;
  if (mascotMessage) mascotMessage.textContent = message;
}

function showHint(question) {
  const hintElement = document.getElementById("questionHint");
  if (!hintElement) return;
  if (question.hint) {
    hintElement.textContent = `Hint: ${question.hint}`;
    hintElement.style.display = "block";
  } else {
    hintElement.style.display = "none";
  }
}

function confettiBurst() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 80 + 10}%`;
    piece.style.top = `${Math.random() * 20 + 5}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${Math.random() * 10 + 8}px`;
    piece.style.height = `${Math.random() * 10 + 8}px`;
    piece.style.animationDuration = `${Math.random() * 0.8 + 1.2}s`;
    container.appendChild(piece);
    setTimeout(() => {
      piece.remove();
    }, 1800);
  }
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  answeredQuestions = {};
  clearAutoNextTimeout();
  document.querySelector(".welcome-section").classList.remove("active");
  document.querySelector(".quiz-section").classList.add("active");
  updateMascot(randomFrom(mascotMessages.question), "🦊");
  showQuestion();
}

function showQuestion() {
  clearAutoNextTimeout();
  const question = quizData[currentQuestion];
  document.getElementById("questionNumber").textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
  document.getElementById("questionEmoji").textContent = question.emoji;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  showHint(question);
  updateMascot(randomFrom(mascotMessages.question), question.emoji || "🦊");
  answered = false;

  const progress = ((currentQuestion) / quizData.length) * 100;
  document.getElementById("progressFill").style.width = progress + "%";

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(button);
  });

  document.getElementById("prevButton").style.display = currentQuestion > 0 ? "inline-block" : "none";

  if (answeredQuestions[currentQuestion] !== undefined) {
    answered = true;
    const savedAnswer = answeredQuestions[currentQuestion];
    const isCorrect = checkAnswer(question, savedAnswer.answerIndex);
    const options = document.querySelectorAll(".option");
    
    options.forEach((option, optIndex) => {
      option.disabled = true;
      if (optIndex === question.correct) {
        option.classList.add("correct");
      } else if (optIndex === savedAnswer.answerIndex && !isCorrect) {
        option.classList.add("incorrect");
      }
    });

    document.getElementById("feedback").textContent = savedAnswer.feedback;
    document.getElementById("feedback").className = savedAnswer.feedbackClass;

    autoNextTimeoutId = setTimeout(() => {
      nextQuestion();
    }, 2000);
  }
}

function selectAnswer(index) {
  if (answered) return;

  answered = true;
  const question = quizData[currentQuestion];
  const options = document.querySelectorAll(".option");
  const isCorrect = checkAnswer(question, index);

  options.forEach((option, optIndex) => {
    option.disabled = true;
    if (optIndex === question.correct) {
      option.classList.add("correct");
    } else if (optIndex === index && !isCorrect) {
      option.classList.add("incorrect");
    }
  });

  updateScore(isCorrect);
  if (isCorrect) {
    confettiBurst();
  }
  showAnswerFeedback(question, isCorrect);

  const feedbackText = document.getElementById("feedback").textContent;
  const feedbackClass = document.getElementById("feedback").className;

  answeredQuestions[currentQuestion] = {
    answerIndex: index,
    isCorrect: isCorrect,
    feedback: feedbackText,
    feedbackClass: feedbackClass
  };

  autoNextTimeoutId = setTimeout(() => {
    nextQuestion();
  }, 2000);
}

function checkAnswer(question, selectedIndex) {
  return selectedIndex === question.correct;
}

function updateScore(isCorrect) {
  if (isCorrect) {
    score++;
  }
}

function showAnswerFeedback(question, isCorrect) {
  const feedback = document.getElementById("feedback");
  if (isCorrect) {
    feedback.textContent = "✅ Correct! " + question.fact;
    feedback.className = "feedback correct";
    updateMascot(randomFrom(mascotMessages.correct), "🎉");
  } else {
    feedback.textContent = "❌ Incorrect. " + question.fact;
    feedback.className = "feedback incorrect";
    updateMascot(randomFrom(mascotMessages.incorrect), "🤔");
  }
}

function nextQuestion() {
  clearAutoNextTimeout();
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function previousQuestion() {
  clearAutoNextTimeout();
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function clearAutoNextTimeout() {
  if (autoNextTimeoutId !== null) {
    clearTimeout(autoNextTimeoutId);
    autoNextTimeoutId = null;
  }
}

function showResults() {
  clearAutoNextTimeout();
  document.querySelector(".quiz-section").classList.remove("active");
  document.querySelector(".results-section").classList.add("active");

  const percentage = Math.round((score / quizData.length) * 100);
  document.getElementById("finalScore").textContent = score;
  document.getElementById("scoreBreakdown").textContent = `You got ${percentage}% correct!`;

  let message = "";
  let emoji = "";

  if (score === 10) {
    emoji = "🏆";
    message = "Perfect Score! You're an Animal Expert! 🌟";
  } else if (score >= 8) {
    emoji = "🥇";
    message = "Excellent! You really know your animals! 👏";
  } else if (score >= 6) {
    emoji = "🥈";
    message = "Great job! You're an Animal Enthusiast! 🎉";
  } else if (score >= 4) {
    emoji = "🥉";
    message = "Good effort! Keep learning about animals! 📚";
  } else {
    emoji = "📚";
    message = "Nice try! Learn more and try again! 💪";
  }

  document.getElementById("resultEmoji").textContent = emoji;
  document.getElementById("resultMessage").textContent = message;
  updateMascot(randomFrom(mascotMessages.result), "🥳");
  if (score >= 8) {
    confettiBurst();
    setTimeout(confettiBurst, 300);
  }

  let countdown = 5;
  const timerElement = document.getElementById("restartTimer");
  timerElement.textContent = `Restarting in ${countdown}s...`;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      timerElement.textContent = `Restarting in ${countdown}s...`;
    } else {
      clearInterval(countdownInterval);
      restartQuiz();
    }
  }, 1000);
}

function restartQuiz() {
  document.querySelector(".results-section").classList.remove("active");
  document.querySelector(".welcome-section").classList.add("active");
  updateMascot(randomFrom(mascotMessages.welcome), "🦊");
}
