const QUIZ = [
  { q: "りんごの英語は？", choices: ["apple","banana","grape","peach"], a: 0 },
  { q: "I am hungry. の意味は？", choices: ["ねむい","おなかがすいた","うれしい","かなしい"], a: 1 },
  { q: "library の意味は？", choices: ["図書館","病院","駅","公園"], a: 0 },
];

let i = 0;
let score = 0;
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
  elProgress.textContent = `Question ${i + 1} / ${QUIZ.length}`;
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

  buttons.forEach((b, k) => {
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

elNext.onclick = () => {
  i = (i + 1) % QUIZ.length;
  render();
};

elRestart.onclick = () => {
  i = 0;
  score = 0;
  render();
};

render();
