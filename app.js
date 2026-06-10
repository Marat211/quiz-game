let currentQuestion = 0;
let score = 0;
let answered = false;
let autoNextTimeoutId = null;
let answeredQuestions = {};

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  answeredQuestions = {};
  clearAutoNextTimeout();
  document.querySelector(".welcome-section").classList.remove("active");
  document.querySelector(".quiz-section").classList.add("active");
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
  } else {
    feedback.textContent = "❌ Incorrect. " + question.fact;
    feedback.className = "feedback incorrect";
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
}
