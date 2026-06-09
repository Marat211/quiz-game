let currentQuestion = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  document.querySelector(".welcome-section").classList.remove("active");
  document.querySelector(".quiz-section").classList.add("active");
  showQuestion();
}

function showQuestion() {
  const question = quizData[currentQuestion];
  document.getElementById("questionNumber").textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
  document.getElementById("questionEmoji").textContent = question.emoji;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("nextButton").style.display = "none";
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

  document.getElementById("nextButton").style.display = "inline-block";
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
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
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
}

function restartQuiz() {
  document.querySelector(".results-section").classList.remove("active");
  document.querySelector(".welcome-section").classList.add("active");
}
