const QUIZ = [
  { q: "sealの意味は？", choices: ["アザラシ","のり","皮","天井"], a: 0 },
  { q: "時間を「はかる」の漢字は？", choices: ["測る","計る","量る",図る"], a:1 },
  { q: "２を１０回かけるといくつ？", choices: ["1024","1048","20","200"], a:0 },
];

// --- 状態 ---
let i = 0;
let score = 0;
let locked = false;

let reviewMode = false;          // false: 1周目 / true: 復習周回
let reviewQueue = [];            // 復習対象（元QUIZのindex）
let currentPool = QUIZ.map((_, idx) => idx); // いま出題しているindex配列（最初は全問）

// --- DOM ---
const elQ = document.getElementById("question");
const elChoices = document.getElementById("choices");
const elFeedback = document.getElementById("feedback");
const elNext = document.getElementById("next");
const elRestart = document.getElementById("restart");
const elProgress = document.getElementById("progress");
const elScore = document.getElementById("score");

// --- 表示 ---
function render() {
  locked = false;
  elNext.disabled = true;
  elFeedback.textContent = "";
  elChoices.innerHTML = "";

  const qIndex = currentPool[i];
  const item = QUIZ[qIndex];

  const modeLabel = reviewMode ? "復習" : "本番";
  elProgress.textContent = `${modeLabel} ${i + 1} / ${currentPool.length}`;
  elScore.textContent = `Score ${score}`;

  elQ.textContent = item.q;

  item.choices.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.onclick = () => answer(idx);
    elChoices.appendChild(btn);
  });
}

// --- 回答処理 ---
function answer(choiceIdx) {
  if (locked) return;
  locked = true;

  const qIndex = currentPool[i];
  const item = QUIZ[qIndex];

  const buttons = [...document.querySelectorAll(".choice")];
  buttons.forEach((b, k) => {
    if (k === item.a) b.dataset.correct = "1";
    b.disabled = true;
  });

  const correct = (choiceIdx === item.a);

  if (correct) {
    elFeedback.textContent = "正解！";
    // 復習モード中に正解できたら、復習キューから外す
    if (reviewMode) {
      reviewQueue = reviewQueue.filter(x => x !== qIndex);
    } else {
      score += 1;
      elScore.textContent = `Score ${score}`;
    }
  } else {
    elFeedback.textContent = "ちがうよ";
    buttons[choiceIdx].dataset.wrong = "1";

    // 間違えた問題を復習キューへ（重複は入れない）
    if (!reviewQueue.includes(qIndex)) reviewQueue.push(qIndex);
  }

  elNext.disabled = false;
}

// --- 次へ ---
function next() {
  i += 1;

  if (i < currentPool.length) {
    render();
    return;
  }

  // いまの周回が終わった
  if (reviewQueue.length === 0) {
    elFeedback.textContent = "全問クリア！🎉（最初から を押すとやり直せます）";
    elNext.disabled = true;
    return;
  }

  // 復習周回へ移行（または継続）
  reviewMode = true;
  currentPool = [...reviewQueue]; // 間違えた問題だけでプール作り直し
  i = 0;

  elFeedback.textContent = `復習スタート：${currentPool.length}問`;
  // 少しメッセージ見えるように、次のrenderはすぐ行う
  render();
}

elNext.onclick = next;

// --- リスタート ---
elRestart.onclick = () => {
  i = 0;
  score = 0;
  locked = false;

  reviewMode = false;
  reviewQueue = [];
  currentPool = QUIZ.map((_, idx) => idx);

  render();
};

render();
