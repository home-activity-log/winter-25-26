const QUIZ = [
  { q: ""sealの意味は？", choices: ["アザラシ","リス","ウマ","イルカ"], a:0 },
  { q: ""時間を「はかる」の漢字は？", choices: ["図る", "計る", "測る", "量る"], a: 1 },
  { q: ""２を１０個かけ合わせた数は？", choices: ["1024", "1048", "20", "200"], a:0 },
];

let i = 0;
let score =0;
let locked = false;

const elQ = document.getElementById("question");
const elChoices = document.getElementById("choices");
const elFeedback = document.getElementById("feedback");
const elNext = document.getElementById("next");
const elRestart = document.getElementById("restart");
const elProgress = document.getElementById("progress");
const elScore = document.getElementById("score");

function render() {
  locked = false;
  elNext.disabled = true;
  elFeedback.textContent = "";
  elChoices.innerHTML = "";

const item = QUIZ[i];
elQ.textContent = item.q;
elProgress.textContent = "";
elChoices.innerHTML = "";

const item = QUIZ[i];
  elQ.textContent = item.q;
  elProgress.textContent = `Question ${i + 1} / &{QUIZ.length}`;
  elScore.textContent = `Score ${score}`;

  item.choices.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.onclick = () => answer(idx);
    elChoices.appendChild(btn);
  });
}

function answer(idx) {
  if (locked) return;
  locked = true;

  const item = QUIZ[i];
  const buttons = [...document.querySelectorAll(".choice")];

  buttons.forEach((b,k) => {
    if (k === item.a) b.dataset.correct = "1";
    b.disabled = true;
  });

  if (idx === item.a) {
    score += 1;
    elFeedback.textContent = "正解！";
  } else {
    elFeedback.textContent = "ちがうよ";
    buttons[idx].dataset.wrong = "1";
  }

  elScore.textContent = `Score ${score}`;
  elNext.disabled = false;
}

elNext.oonclick = () => {
  i = (i + 1) % QUIZ.length;
  render();
};

elRestart.onclick = () => {
  i = (i + 1) % QUIZ.length;
  render();
};

render();
    
