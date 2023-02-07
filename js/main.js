// #Catch Elements
// Quiz App
let quizContainer = document.querySelector(".quiz-app .quiz-container");
// Info Part
let questionsNumber = document.querySelector(".quiz-info .q-count span");
// Questions Part
let questionTitle = document.querySelector(".question-area h2");
// Answers Part
let answersBox = document.querySelector(".answer-area");
// Submit Button
let submitBtn = document.querySelector(".quiz-app .submit");
// Progress Part
let bulletsContainer = document.querySelector(".bullets");
let timeBox = document.querySelector(".countdown");
// Result Part
let result = document.querySelector(".quiz-app .result");
let gradBox = document.querySelector(".result .grad");
let yourMark = document.querySelector(".result .your-mark");
let totalMark = document.querySelector(".result .total-mark");

// #Variables
let timer = 20;
// Current Question Index
let currentInedx = 0;
// Quiz Mark
let mark = 0;
// TimeInterval
let countTimeInterval;

// Main Function
getQuestion();

// Add Checked Attribute To Answer
selectAnswer();

// #Functions
// Get Questions From JSON File
function getQuestion() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("Get", "json/html_questions.json", true);
  myRequest.send();

  myRequest.onreadystatechange = function () {
    // Notes
    // readyState = 0 => no request
    // readyState = 1 => request sent by me
    // readyState = 2 => request received by server
    // readyState = 3 => request under processing on server
    // readyState = 4 => response is sent to me
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      // Create Bullets & Set Questions Count
      setQuestionsCount(qCount);
      // Add Questions To Page
      addData(questionsObject[currentInedx], qCount);

      countDown(timer, qCount);

      // Check Answer Then  Go To Next Question ################################# Submit Button
      nextQuestion(questionsObject, qCount);
    }
  };
}

// Set Questions Number & Create Bullets Function
function setQuestionsCount(num) {
  // Set Questions Count
  questionsNumber.innerHTML = num;
  // Create Bulltes
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.classList.add("current");
    }
    // Add Bullets To Page
    bulletsContainer.appendChild(bullet);
  }
}

// Next Question Function
function nextQuestion(obj, qCount) {
  let count = qCount;
  submitBtn.onclick = function () {
    if (qCount >= 1) {
      clearInterval(countTimeInterval);
      countDown(timer, count);
      let correctAnswer = obj[currentInedx]["right_answer"];
      let checkedAnswer = "";
      // Get Checked Answer
      document.querySelectorAll(".answer input").forEach((input) => {
        if (input.hasAttribute("checked")) {
          checkedAnswer = input.dataset.answer;
        }
      });
      // Check Answers
      checkAnswer(checkedAnswer, correctAnswer);
      // Show Next Question
      currentInedx++;
      questionTitle.innerHTML = "";
      answersBox.innerHTML = "";
      addData(obj[currentInedx], qCount);
      qCount--;
      // Change Bullets
      if (currentInedx < obj.length) {
        document
          .querySelectorAll(".bullets span")
          [currentInedx].classList.add("current");
      }
    }
    if (qCount === 0) {
      clearInterval(countTimeInterval);
      quizContainer.style.display = "none";
      // Dispaly The Result
      showResult(mark, obj.length);
    }
    // clearInterval(countTimeInterval);
  };
}

// Add Questions Function
const addData = (obj, count) => {
  if (count > 1) {
    // Add Question Title
    questionTitle.appendChild(document.createTextNode(obj.title));
    // Add Answers
    for (let i = 0; i < 4; i++) {
      // Create Radio Buttons
      let radioBtn = document.createElement("input");
      radioBtn.type = "radio";
      radioBtn.id = `answer_${i + 1}`;
      radioBtn.name = "answer";
      radioBtn.setAttribute("data-answer", obj[`answer_${i + 1}`]);
      // Creates labels
      let qlabel = document.createElement("label");
      qlabel.innerHTML = obj[`answer_${i + 1}`];
      qlabel.htmlFor = `answer_${i + 1}`;
      // Create Answer Div
      let answer = document.createElement("div");
      answer.classList.add("answer");
      answer.appendChild(radioBtn);
      answer.append(qlabel);

      // Add Answers To Answers Box
      answersBox.append(answer);
    }
  }
};

// Check Answer Function
const checkAnswer = function (checked, correct) {
  if (checked === correct) {
    mark++;
  }
};

// Select Answer Function
function selectAnswer() {
  answersBox.addEventListener("click", function (e) {
    if (e.target.type === "radio") {
      document
        .querySelectorAll(".answer input")
        .forEach((input) => input.removeAttribute("checked"));
      e.target.setAttribute("checked", "");
    }
  });
}

// CountDown Function
function countDown(duration, count) {
  if (currentInedx < count) {
    let minutes, seconds;
    countTimeInterval = setInterval(function () {
      minutes =
        parseInt(duration / 60) < 10
          ? `0${parseInt(duration / 60)}`
          : `${parseInt(duration / 60)}`;
      seconds = duration % 60 < 10 ? `0${duration % 60}` : `${duration % 60}`;

      timeBox.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countTimeInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}

// Result Function
function showResult(mark, qCount) {
  // Show The Final Grad & Mark
  yourMark.innerHTML = mark;
  totalMark.innerHTML = qCount;
  if (mark === qCount) {
    gradBox.classList.add("perfect");
    gradBox.innerHTML = "Perfect";
    yourMark.classList.add("perfect");
  }
  if (mark > Math.floor(qCount / 2) && mark < qCount) {
    gradBox.classList.add("good");
    gradBox.innerHTML = "Good";
    yourMark.classList.add("good");
  }
  if (mark <= Math.floor(qCount / 2)) {
    gradBox.classList.add("bad");
    gradBox.innerHTML = "Bad";
    yourMark.classList.add("bad");
  }
  result.style.display = "block";
}
// ###########################################################
