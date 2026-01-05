let questions = [];
let currentQ = 0;
let score = 0;
let timer;
let totalTime = 600; // 10 mins

async function startQuiz() {
  const name = document.getElementById('studentName').value;
  const cls = document.getElementById('studentClass').value;
  if (!name || !cls) { alert('Enter your name and class'); return; }

  // Load questions
  const response = await fetch('data/questions.json');
  questions = await response.json();
  questions = questions.sort(() => Math.random() - 0.5); // randomize

  document.querySelector('.login-screen').style.display = 'none';
  document.querySelector('.quiz-screen').style.display = 'block';

  startTimer();
  showQuestion();
}

function startTimer() {
  timer = setInterval(() => {
    totalTime--;
    const minutes = Math.floor(totalTime/60);
    const seconds = totalTime%60;
    document.getElementById('timer').innerText = `Time: ${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
    if(totalTime <= 0) { endQuiz(); }
  }, 1000);
}

function showQuestion() {
  if(currentQ >= questions.length) { endQuiz(); return; }
  const q = questions[currentQ];
  const container = document.getElementById('question-container');
  container.innerHTML = `<h3>Q${currentQ+1}: ${q.question}</h3>` +
    q.options.map((o,i) => `<button onclick="selectAnswer(${i})">${o}</button>`).join('<br>');
}

function selectAnswer(selected) {
  if(selected === questions[currentQ].answer) score++;
  currentQ++;
  showQuestion();
}

function nextQuestion() { showQuestion(); }

function endQuiz() {
  clearInterval(timer);
  document.querySelector('.quiz-screen').style.display = 'none';
  document.querySelector('.result-screen').style.display = 'block';
  document.getElementById('score').innerText = `Your Score: ${score} / ${questions.length}`;
}

function downloadScore() {
  const name = document.getElementById('studentName').value;
  const cls = document.getElementById('studentClass').value;
  const data = `Student Name: ${name}\nClass: ${cls}\nScore: ${score}/${questions.length}`;
  const blob = new Blob([data], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}_score.txt`;
  a.click();
}
