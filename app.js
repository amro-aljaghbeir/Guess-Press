const screenRoot = document.getElementById("screenRoot");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modeIndicator = document.getElementById("modeIndicator");
const roundIndicator = document.getElementById("roundIndicator");
const difficultyIndicator = document.getElementById("difficultyIndicator");
const teamANameEl = document.getElementById("teamAName");
const teamBNameEl = document.getElementById("teamBName");
const teamAScoreEl = document.getElementById("teamAScore");
const teamBScoreEl = document.getElementById("teamBScore");
const teamAActiveEl = document.getElementById("teamAActive");
const teamBActiveEl = document.getElementById("teamBActive");

const SCORE_STEP = 50;

const state = {
  screen: "start",
  teams: ["Team A", "Team B"],
  scores: [0, 0],
  activeTeam: 0,
  mode: null,
  topics: [],
  data: null,
  questionIndex: null,
  usedQuestions: new Set(),
  classic: null,
  super: null,
  risk: null,
  auction: null,
  suddenReveal: false,
};

const EMBEDDED_QUESTIONS = {
  easy: [
    { id: "easy-history-1", topic: "History", question: "Who was the first President of the United States?", answer: "George Washington" },
    { id: "easy-history-2", topic: "History", question: "What wall fell in 1989?", answer: "The Berlin Wall" },
    { id: "easy-history-3", topic: "History", question: "Which ancient civilization built the pyramids of Giza?", answer: "The Egyptians" },
    { id: "easy-science-1", topic: "Science", question: "What planet is known as the Red Planet?", answer: "Mars" },
    { id: "easy-science-2", topic: "Science", question: "What gas do plants breathe in?", answer: "Carbon dioxide" },
    { id: "easy-science-3", topic: "Science", question: "What is H2O commonly called?", answer: "Water" },
    { id: "easy-pop-1", topic: "Pop Culture", question: "Which movie features a flying car called the DeLorean?", answer: "Back to the Future" },
    { id: "easy-pop-2", topic: "Pop Culture", question: "What is the name of Mario's brother?", answer: "Luigi" },
    { id: "easy-pop-3", topic: "Pop Culture", question: "What is the name of the wizard school in Harry Potter?", answer: "Hogwarts" },
    { id: "easy-sports-1", topic: "Sports", question: "How many points is a touchdown worth in American football?", answer: "6" },
    { id: "easy-sports-2", topic: "Sports", question: "In which sport is the Wimbledon championship?", answer: "Tennis" },
    { id: "easy-sports-3", topic: "Sports", question: "How many bases are there on a baseball field?", answer: "4" },
    { id: "easy-geo-1", topic: "Geography", question: "What is the largest ocean?", answer: "The Pacific Ocean" },
    { id: "easy-geo-2", topic: "Geography", question: "Which continent is the Sahara Desert on?", answer: "Africa" },
    { id: "easy-geo-3", topic: "Geography", question: "What is the capital of Japan?", answer: "Tokyo" },
    { id: "easy-tech-1", topic: "Technology", question: "What does Wi-Fi stand for?", answer: "It is not an acronym; it is a brand name." },
    { id: "easy-tech-2", topic: "Technology", question: "What company makes the iPhone?", answer: "Apple" },
    { id: "easy-tech-3", topic: "Technology", question: "What device do you use to move the cursor on a desktop?", answer: "A mouse" },
  ],
  medium: [
    { id: "med-history-1", topic: "History", question: "Which empire built Machu Picchu?", answer: "The Inca Empire" },
    { id: "med-history-2", topic: "History", question: "Who was the British Prime Minister during most of WWII?", answer: "Winston Churchill" },
    { id: "med-history-3", topic: "History", question: "The Renaissance began in which European country?", answer: "Italy" },
    { id: "med-science-1", topic: "Science", question: "What is the chemical symbol for gold?", answer: "Au" },
    { id: "med-science-2", topic: "Science", question: "Which part of the cell contains genetic material?", answer: "The nucleus" },
    { id: "med-science-3", topic: "Science", question: "What is the hardest natural substance on Earth?", answer: "Diamond" },
    { id: "med-pop-1", topic: "Pop Culture", question: "Which singer is known as the Queen of Pop?", answer: "Madonna" },
    { id: "med-pop-2", topic: "Pop Culture", question: "What fictional city is Batman associated with?", answer: "Gotham City" },
    { id: "med-pop-3", topic: "Pop Culture", question: "Which TV show features the character Walter White?", answer: "Breaking Bad" },
    { id: "med-sports-1", topic: "Sports", question: "How many players are on the field for one soccer team?", answer: "11" },
    { id: "med-sports-2", topic: "Sports", question: "Which country won the FIFA World Cup in 2018?", answer: "France" },
    { id: "med-sports-3", topic: "Sports", question: "Which sport uses the term \"grand slam\"?", answer: "Tennis" },
    { id: "med-geo-1", topic: "Geography", question: "What is the capital of Canada?", answer: "Ottawa" },
    { id: "med-geo-2", topic: "Geography", question: "Mount Kilimanjaro is in which country?", answer: "Tanzania" },
    { id: "med-geo-3", topic: "Geography", question: "Which U.S. state is known as the Sunshine State?", answer: "Florida" },
    { id: "med-tech-1", topic: "Technology", question: "Who is credited with inventing the World Wide Web?", answer: "Tim Berners-Lee" },
    { id: "med-tech-2", topic: "Technology", question: "What does GPU stand for?", answer: "Graphics Processing Unit" },
    { id: "med-tech-3", topic: "Technology", question: "What year did the first Android phone launch?", answer: "2008" },
  ],
  hard: [
    { id: "hard-history-1", topic: "History", question: "Which treaty ended World War I?", answer: "The Treaty of Versailles" },
    { id: "hard-history-2", topic: "History", question: "Who was the last emperor of Russia?", answer: "Nicholas II" },
    { id: "hard-history-3", topic: "History", question: "What year did the Spanish Armada sail against England?", answer: "1588" },
    { id: "hard-science-1", topic: "Science", question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
    { id: "hard-science-2", topic: "Science", question: "Which element has the atomic number 92?", answer: "Uranium" },
    { id: "hard-science-3", topic: "Science", question: "What is the second law of thermodynamics about?", answer: "Entropy in an isolated system tends to increase" },
    { id: "hard-pop-1", topic: "Pop Culture", question: "Who directed the film 'Spirited Away'?", answer: "Hayao Miyazaki" },
    { id: "hard-pop-2", topic: "Pop Culture", question: "What year did the first iPhone release?", answer: "2007" },
    { id: "hard-pop-3", topic: "Pop Culture", question: "Which album features the song \"Billie Jean\"?", answer: "Thriller" },
    { id: "hard-sports-1", topic: "Sports", question: "Which boxer was known as \"The Greatest\"?", answer: "Muhammad Ali" },
    { id: "hard-sports-2", topic: "Sports", question: "Which country hosted the 2008 Summer Olympics?", answer: "China" },
    { id: "hard-sports-3", topic: "Sports", question: "In what year did Roger Federer win his first Wimbledon title?", answer: "2003" },
    { id: "hard-geo-1", topic: "Geography", question: "What is the capital of New Zealand?", answer: "Wellington" },
    { id: "hard-geo-2", topic: "Geography", question: "Which river runs through Baghdad?", answer: "The Tigris River" },
    { id: "hard-geo-3", topic: "Geography", question: "What is the tallest mountain in Africa?", answer: "Mount Kilimanjaro" },
    { id: "hard-tech-1", topic: "Technology", question: "What does \"HTTP\" stand for?", answer: "Hypertext Transfer Protocol" },
    { id: "hard-tech-2", topic: "Technology", question: "Which programming language was created by Bjarne Stroustrup?", answer: "C++" },
    { id: "hard-tech-3", topic: "Technology", question: "What does \"GPU\" stand for?", answer: "Graphics Processing Unit" },
  ],
};

const MODE_LABELS = {
  classic: "Classic Mode",
  super: "Super Mode",
  risk: "Risk Mode",
  auction: "Auction Mode",
};

const CLASSIC_POINTS = { easy: 200, medium: 400, hard: 600 };
const CLASSIC_TIMERS = { easy: 20, medium: 40, hard: 60 };

const SUPER_BASE_POINTS = [100, 150, 200, 250, 300, 350, 400, 500, 500];

const AUCTION_REVEAL = [
  "topic+difficulty",
  "topic+difficulty",
  "topic+difficulty",
  "topic+difficulty",
  "topic",
  "topic",
  "topic",
  "topic",
  "difficulty",
  "difficulty",
  "difficulty",
  "difficulty",
  "none",
  "none",
  "none",
  "none",
];

const ELEMENTS = {
  rulesBtn: document.getElementById("rulesBtn"),
  backToStartBtn: document.getElementById("backToStartBtn"),
};

const activeTimers = {
  intervalId: null,
};

function updateScoreboard() {
  teamANameEl.textContent = state.teams[0];
  teamBNameEl.textContent = state.teams[1];
  teamAScoreEl.textContent = state.scores[0];
  teamBScoreEl.textContent = state.scores[1];

  const teamEls = document.querySelectorAll(".scoreboard__team");
  teamEls.forEach((teamEl) => teamEl.classList.remove("active"));
  teamEls[state.activeTeam].classList.add("active");

  teamAActiveEl.textContent = state.activeTeam === 0 ? "ACTIVE" : "";
  teamBActiveEl.textContent = state.activeTeam === 1 ? "ACTIVE" : "";
}

function updateIndicators({ mode = "--", round = "--", difficulty = "--" } = {}) {
  modeIndicator.textContent = `Mode: ${mode}`;
  roundIndicator.textContent = `Round: ${round}`;
  difficultyIndicator.textContent = `Difficulty: ${difficulty}`;
}

function clearTimers() {
  if (activeTimers.intervalId) {
    clearInterval(activeTimers.intervalId);
    activeTimers.intervalId = null;
  }
}

function showModal(content) {
  modalContent.innerHTML = "";
  modalContent.appendChild(content);
  modal.classList.remove("hidden");
}

function closeModal() {
  clearTimers();
  modal.classList.add("hidden");
  modalContent.innerHTML = "";
}

function renderStartScreen() {
  state.screen = "start";
  updateIndicators();
  screenRoot.innerHTML = `
    <section class="panel">
      <h1>Guess Press</h1>
      <p style="text-align:center; color: var(--muted); font-size: 1.1rem;">A neon trivia showdown for two teams.</p>
      <div class="button-row">
        <button class="primary-btn" id="startGameBtn">Start Game</button>
      </div>
    </section>
  `;

  document.getElementById("startGameBtn").addEventListener("click", renderTeamSetupScreen);
}

function renderTeamSetupScreen() {
  state.screen = "teams";
  updateIndicators();
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Team Setup</h2>
      <div class="form-row">
        <label>Team A Name
          <input type="text" id="teamAInput" value="${state.teams[0]}" />
        </label>
        <label>Team B Name
          <input type="text" id="teamBInput" value="${state.teams[1]}" />
        </label>
      </div>
      <div class="button-row">
        <button class="secondary-btn" id="backToStart">Back</button>
        <button class="primary-btn" id="toModeSelect">Next</button>
      </div>
    </section>
  `;

  document.getElementById("backToStart").addEventListener("click", renderStartScreen);
  document.getElementById("toModeSelect").addEventListener("click", () => {
    const teamAValue = document.getElementById("teamAInput").value.trim() || "Team A";
    const teamBValue = document.getElementById("teamBInput").value.trim() || "Team B";
    state.teams = [teamAValue, teamBValue];
    updateScoreboard();
    renderModeSelectScreen();
  });
}

function renderModeSelectScreen() {
  state.screen = "mode";
  updateIndicators();
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Select Game Mode</h2>
      <div class="mode-grid">
        <div class="mode-card" data-mode="classic">
          <h3>Classic Mode</h3>
          <p>Turn-based board play. Closest answer wins.</p>
        </div>
        <div class="mode-card" data-mode="super">
          <h3>Super Mode</h3>
          <p>Fast rounds, bonus stacking, chain momentum.</p>
        </div>
        <div class="mode-card" data-mode="risk">
          <h3>Risk Mode</h3>
          <p>Gambling, steals, and high variance swings.</p>
        </div>
        <div class="mode-card" data-mode="auction">
          <h3>Auction Mode</h3>
          <p>Bid for questions and outplay opponents.</p>
        </div>
      </div>
      <div class="button-row">
        <button class="secondary-btn" id="backToTeams">Back</button>
      </div>
    </section>
  `;

  document.querySelectorAll(".mode-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.mode = card.dataset.mode;
      renderTopicSelectScreen();
    });
  });

  document.getElementById("backToTeams").addEventListener("click", renderTeamSetupScreen);
}

function renderTopicSelectScreen() {
  state.screen = "topics";
  updateIndicators({ mode: MODE_LABELS[state.mode] });
  const topics = getAvailableTopics();
  const selectedSet = new Set(state.topics);

  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Select 4 to 6 Topics</h2>
      <p style="text-align:center; color: var(--muted);">Selected: <span id="topicCount">${selectedSet.size}</span></p>
      <div class="topic-grid" id="topicGrid"></div>
      <div class="button-row">
        <button class="secondary-btn" id="backToModes">Back</button>
        <button class="primary-btn" id="startMode" disabled>Start ${MODE_LABELS[state.mode]}</button>
      </div>
    </section>
  `;

  const grid = document.getElementById("topicGrid");
  topics.forEach((topic) => {
    const pill = document.createElement("div");
    pill.className = "topic-pill";
    pill.textContent = topic;
    if (selectedSet.has(topic)) {
      pill.classList.add("selected");
    }
    pill.addEventListener("click", () => {
      if (selectedSet.has(topic)) {
        selectedSet.delete(topic);
        pill.classList.remove("selected");
      } else if (selectedSet.size < 6) {
        selectedSet.add(topic);
        pill.classList.add("selected");
      }
      const countEl = document.getElementById("topicCount");
      countEl.textContent = selectedSet.size;
      document.getElementById("startMode").disabled = selectedSet.size < 4 || selectedSet.size > 6;
    });
    grid.appendChild(pill);
  });

  document.getElementById("backToModes").addEventListener("click", renderModeSelectScreen);
  const startBtn = document.getElementById("startMode");
  startBtn.disabled = selectedSet.size < 4 || selectedSet.size > 6;
  startBtn.addEventListener("click", () => {
    state.topics = Array.from(selectedSet);
    startGameMode();
  });
}

function startGameMode() {
  state.scores = state.mode === "auction" ? [1500, 1500] : [0, 0];
  state.activeTeam = 0;
  state.usedQuestions = new Set();
  updateScoreboard();

  if (state.mode === "classic") {
    initClassicMode();
  } else if (state.mode === "super") {
    initSuperMode();
  } else if (state.mode === "risk") {
    initRiskMode();
  } else if (state.mode === "auction") {
    initAuctionMode();
  }
}

function initClassicMode() {
  state.classic = {
    board: buildBoard(state.topics, ["easy", "easy", "medium", "medium", "hard", "hard"]),
    activeTile: null,
    phase: "select",
    answeringTeam: null,
    timer: 0,
    reveal: false,
  };
  renderClassicBoard();
}

function renderClassicBoard() {
  const classic = state.classic;
  updateIndicators({ mode: MODE_LABELS.classic, round: "Board", difficulty: "Easy/Med/Hard" });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Classic Board</h2>
      <div class="board" id="classicBoard"></div>
    </section>
  `;

  const board = document.getElementById("classicBoard");
  board.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;

  const headerRow = document.createElement("div");
  headerRow.className = "board-row";
  headerRow.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;
  state.topics.forEach((topic) => {
    const header = document.createElement("div");
    header.className = "board-header";
    header.textContent = topic;
    headerRow.appendChild(header);
  });
  board.appendChild(headerRow);

  classic.board.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";
    rowEl.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;
    row.forEach((tile) => {
      const tileEl = document.createElement("div");
      tileEl.className = "board-tile";
      tileEl.textContent = tile.label;
      if (tile.used) tileEl.classList.add("used");
      if (tile.disabled) tileEl.classList.add("disabled");
      if (!tile.used && !tile.disabled) {
        tileEl.addEventListener("click", () => openClassicQuestion(tile));
      }
      rowEl.appendChild(tileEl);
    });
    board.appendChild(rowEl);
  });
}

function openClassicQuestion(tile) {
  const classic = state.classic;
  classic.activeTile = tile;
  classic.phase = "team1";
  classic.answeringTeam = state.activeTeam;
  classic.reveal = false;
  const timerSeconds = CLASSIC_TIMERS[tile.difficulty];
  startTimer(timerSeconds, (remaining) => updateClassicModal(remaining));
  updateClassicModal(timerSeconds);
}

function updateClassicModal(remaining) {
  const classic = state.classic;
  const tile = classic.activeTile;
  const question = getQuestionById(tile.questionId);
  if (remaining === 0 && !classic.reveal) {
    clearTimers();
    if (classic.phase === "team1") {
      classic.phase = "team2";
      classic.answeringTeam = state.activeTeam === 0 ? 1 : 0;
      const timerSeconds = CLASSIC_TIMERS[tile.difficulty];
      startTimer(timerSeconds, (seconds) => updateClassicModal(seconds));
      updateClassicModal(timerSeconds);
    } else {
      classic.reveal = true;
      updateClassicModal(0);
    }
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = classic.reveal ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  container.innerHTML = `
    <span class="tag">${tile.topic} • ${tile.difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    <div class="button-row" id="classicActions"></div>
  `;

  const actionRow = container.querySelector("#classicActions");
  if (!classic.reveal) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      if (classic.phase === "team1") {
        classic.phase = "team2";
        classic.answeringTeam = state.activeTeam === 0 ? 1 : 0;
        const timerSeconds = CLASSIC_TIMERS[tile.difficulty];
        startTimer(timerSeconds, (seconds) => updateClassicModal(seconds));
        updateClassicModal(timerSeconds);
      } else {
        classic.reveal = true;
        clearTimers();
        updateClassicModal(0);
      }
    });
    actionRow.appendChild(nextBtn);

  } else {
    const teamAWin = document.createElement("button");
    teamAWin.className = "primary-btn";
    teamAWin.textContent = `${state.teams[0]} Correct (+${CLASSIC_POINTS[tile.difficulty]})`;
    teamAWin.addEventListener("click", () => resolveClassic(0));

    const teamBWin = document.createElement("button");
    teamBWin.className = "primary-btn";
    teamBWin.textContent = `${state.teams[1]} Correct (+${CLASSIC_POINTS[tile.difficulty]})`;
    teamBWin.addEventListener("click", () => resolveClassic(1));

    const nobodyBtn = document.createElement("button");
    nobodyBtn.className = "secondary-btn";
    nobodyBtn.textContent = "Nobody Got It";
    nobodyBtn.addEventListener("click", () => resolveClassic(null));

    actionRow.append(teamAWin, teamBWin, nobodyBtn);
  }

  showModal(container);
}

function resolveClassic(winnerIndex) {
  const classic = state.classic;
  const tile = classic.activeTile;
  tile.used = true;
  if (winnerIndex !== null) {
    state.scores[winnerIndex] += CLASSIC_POINTS[tile.difficulty];
  }
  state.activeTeam = state.activeTeam === 0 ? 1 : 0;
  updateScoreboard();
  closeModal();
  classic.activeTile = null;
  renderClassicBoard();
  checkEndGameClassic();
}

function checkEndGameClassic() {
  const allUsed = state.classic.board.rows.flat().every((tile) => tile.used || tile.disabled);
  if (allUsed) {
    renderEndGame();
  }
}

function initSuperMode() {
  state.super = {
    round: 1,
    bonusStack: 0,
    chain: 0,
    roundTopics: [],
    roundQuestions: {},
    answered: new Set(),
    clutchUsed: false,
  };
  prepareSuperRound();
  renderSuperMode();
}

function prepareSuperRound() {
  const round = state.super.round;
  const difficulty = round <= 3 ? "easy" : round <= 6 ? "medium" : "hard";
  state.super.roundTopics = [...state.topics];
  state.super.roundQuestions = {};
  state.super.answered = new Set();
  state.super.roundTopics.forEach((topic) => {
    const question = getRandomQuestion(topic, difficulty);
    state.super.roundQuestions[topic] = question;
  });
}

function renderSuperMode() {
  const round = state.super.round;
  const difficulty = round <= 3 ? "easy" : round <= 6 ? "medium" : "hard";
  updateIndicators({ mode: MODE_LABELS.super, round: `Round ${round}/9`, difficulty });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Super Mode - Round ${round}</h2>
      <p style="text-align:center;">Base: ${SUPER_BASE_POINTS[round - 1]} | Bonus Stack: +${state.super.bonusStack} | Chain: +${state.super.chain}</p>
      <div class="topic-grid" id="superTopics"></div>
      <div class="button-row">
        <button class="secondary-btn" id="endSuper">End Game</button>
      </div>
    </section>
  `;

  const topicsGrid = document.getElementById("superTopics");
  state.super.roundTopics.forEach((topic) => {
    const pill = document.createElement("div");
    pill.className = "topic-pill";
    pill.textContent = topic;
    if (state.super.answered.has(topic)) {
      pill.classList.add("selected");
    } else {
      pill.addEventListener("click", () => openSuperQuestion(topic, difficulty));
    }
    topicsGrid.appendChild(pill);
  });

  document.getElementById("endSuper").addEventListener("click", renderEndGame);
}

function openSuperQuestion(topic, difficulty) {
  const question = state.super.roundQuestions[topic];
  if (!question) return;
  state.super.answerRevealed = false;
  startTimer(20, (remaining) => updateSuperModal(topic, question, difficulty, remaining));
  updateSuperModal(topic, question, difficulty, 20);
}

function updateSuperModal(topic, question, difficulty, remaining) {
  if (remaining === 0 && !state.super.answerRevealed) {
    clearTimers();
    state.super.answerRevealed = true;
    updateSuperModal(topic, question, difficulty, 0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.super.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  container.innerHTML = `
    <span class="tag">${topic} • ${difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    <div class="button-row" id="superActions"></div>
  `;

  const actionRow = container.querySelector("#superActions");
  if (!state.super.answerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.super.answerRevealed = true;
      updateSuperModal(topic, question, difficulty, 0);
    });
    actionRow.append(nextBtn);
  } else {
    const teamACorrect = document.createElement("button");
    teamACorrect.className = "primary-btn";
    teamACorrect.textContent = `${state.teams[0]} Correct`;
    teamACorrect.addEventListener("click", () => resolveSuperQuestion(topic, 0));

    const teamBCorrect = document.createElement("button");
    teamBCorrect.className = "primary-btn";
    teamBCorrect.textContent = `${state.teams[1]} Correct`;
    teamBCorrect.addEventListener("click", () => resolveSuperQuestion(topic, 1));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveSuperQuestion(topic, null));

    actionRow.append(teamACorrect, teamBCorrect, nobody);
  }
  showModal(container);
}

function resolveSuperQuestion(topic, winnerIndex) {
  const round = state.super.round;
  const base = SUPER_BASE_POINTS[round - 1];
  const bonus = round <= 4 ? 50 : 100;
  if (winnerIndex === null) {
    state.super.bonusStack += bonus;
    state.super.chain = 0;
  } else {
    const total = base + state.super.bonusStack + state.super.chain;
    state.scores[winnerIndex] += total;
    state.super.bonusStack = 0;
    state.super.chain += 50;
  }
  state.super.answered.add(topic);
  closeModal();
  updateScoreboard();
  if (state.super.answered.size === state.super.roundTopics.length) {
    if (state.super.round === 4 && !state.super.clutchUsed) {
      const gap = Math.abs(state.scores[0] - state.scores[1]);
      if (gap >= 1000) {
        renderClutchOffer();
        return;
      }
    }
    if (state.super.round === 9) {
      renderEndGame();
      return;
    }
    state.super.round += 1;
    prepareSuperRound();
  }
  renderSuperMode();
}

function renderClutchOffer() {
  updateIndicators({ mode: MODE_LABELS.super, round: "Clutch", difficulty: "Easy" });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Clutch Round Available</h2>
      <p style="text-align:center;">Score gap is 1000+. Play a single Easy question worth 700 points?</p>
      <div class="button-row">
        <button class="secondary-btn" id="skipClutch">Skip</button>
        <button class="primary-btn" id="playClutch">Play Clutch Round</button>
      </div>
    </section>
  `;

  document.getElementById("skipClutch").addEventListener("click", () => {
    state.super.clutchUsed = true;
    state.super.round += 1;
    prepareSuperRound();
    renderSuperMode();
  });

  document.getElementById("playClutch").addEventListener("click", () => {
    state.super.clutchUsed = true;
    openClutchQuestion();
  });
}

function openClutchQuestion() {
  const question = getRandomQuestion(randomItem(state.topics), "easy", true);
  state.super.clutchRevealed = false;
  startTimer(20, (remaining) => updateClutchModal(question, remaining));
  updateClutchModal(question, 20);
}

function updateClutchModal(question, remaining) {
  if (remaining === 0 && !state.super.clutchRevealed) {
    clearTimers();
    state.super.clutchRevealed = true;
    updateClutchModal(question, 0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.super.clutchRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  container.innerHTML = `
    <span class="tag">Clutch Round • EASY</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    <div class="button-row" id="clutchActions"></div>
  `;

  const actions = container.querySelector("#clutchActions");
  if (!state.super.clutchRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.super.clutchRevealed = true;
      updateClutchModal(question, 0);
    });
    actions.append(nextBtn);
  } else {
    const teamA = document.createElement("button");
    teamA.className = "primary-btn";
    teamA.textContent = `${state.teams[0]} Correct (+700)`;
    teamA.addEventListener("click", () => resolveClutch(0));

    const teamB = document.createElement("button");
    teamB.className = "primary-btn";
    teamB.textContent = `${state.teams[1]} Correct (+700)`;
    teamB.addEventListener("click", () => resolveClutch(1));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveClutch(null));

    actions.append(teamA, teamB, nobody);
  }
  showModal(container);
}

function resolveClutch(winnerIndex) {
  if (winnerIndex !== null) {
    state.scores[winnerIndex] += 700;
  }
  closeModal();
  updateScoreboard();
  state.super.round += 1;
  prepareSuperRound();
  renderSuperMode();
}

function initRiskMode() {
  state.risk = {
    board: buildBoard(state.topics, ["easy", "easy", "medium", "medium", "hard", "hard"]),
    activeTile: null,
    rerolled: false,
    randomBonus: false,
    doubleReady: false,
    lastWin: null,
  };
  renderRiskBoard();
}

function renderRiskBoard() {
  updateIndicators({ mode: MODE_LABELS.risk, round: "Board", difficulty: "Easy/Med/Hard" });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Risk Mode</h2>
      <div class="button-row">
        <button class="secondary-btn" id="randomPick">Random Pick (+50)</button>
      </div>
      <div class="board" id="riskBoard"></div>
    </section>
  `;

  document.getElementById("randomPick").addEventListener("click", () => {
    const tile = getRandomUnusedTile(state.risk.board);
    if (tile) {
      state.risk.randomBonus = true;
      openRiskQuestion(tile);
    }
  });

  const board = document.getElementById("riskBoard");
  board.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;

  const headerRow = document.createElement("div");
  headerRow.className = "board-row";
  headerRow.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;
  state.topics.forEach((topic) => {
    const header = document.createElement("div");
    header.className = "board-header";
    header.textContent = topic;
    headerRow.appendChild(header);
  });
  board.appendChild(headerRow);

  state.risk.board.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";
    rowEl.style.gridTemplateColumns = `repeat(${state.topics.length}, minmax(140px, 1fr))`;
    row.forEach((tile) => {
      const tileEl = document.createElement("div");
      tileEl.className = "board-tile";
      tileEl.textContent = tile.label;
      if (tile.used) tileEl.classList.add("used");
      if (tile.disabled) tileEl.classList.add("disabled");
      if (!tile.used && !tile.disabled) {
        tileEl.addEventListener("click", () => openRiskQuestion(tile));
      }
      rowEl.appendChild(tileEl);
    });
    board.appendChild(rowEl);
  });
}

function openRiskQuestion(tile) {
  const risk = state.risk;
  risk.activeTile = tile;
  risk.rerolled = false;
  risk.answerRevealed = false;
  startTimer(CLASSIC_TIMERS[tile.difficulty], (remaining) => updateRiskModal(remaining));
  updateRiskModal(CLASSIC_TIMERS[tile.difficulty]);
}

function updateRiskModal(remaining) {
  const risk = state.risk;
  const tile = risk.activeTile;
  const question = getQuestionById(tile.questionId);
  const points = CLASSIC_POINTS[tile.difficulty];
  if (remaining === 0 && !risk.answerRevealed) {
    clearTimers();
    risk.answerRevealed = true;
    updateRiskModal(0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = risk.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const metaMarkup = risk.answerRevealed
    ? ""
    : `<p style="text-align:center;">Active Team: <strong>${state.teams[state.activeTeam]}</strong></p>
    <p style="text-align:center;">Value: ${risk.rerolled ? points / 2 : points} ${risk.randomBonus ? "+50" : ""}</p>`;
  container.innerHTML = `
    <span class="tag">${tile.topic} • ${tile.difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    ${metaMarkup}
    <div class="button-row" id="riskActions"></div>
  `;

  const actions = container.querySelector("#riskActions");
  if (!risk.answerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      risk.answerRevealed = true;
      updateRiskModal(0);
    });
    actions.append(nextBtn);
  } else {
    const changeBtn = document.createElement("button");
    changeBtn.className = "secondary-btn";
    changeBtn.textContent = "Change Question (Half Points)";
    changeBtn.disabled = risk.rerolled;
    changeBtn.addEventListener("click", () => rerollRiskQuestion());

    const teamA = document.createElement("button");
    teamA.className = "primary-btn";
    teamA.textContent = `${state.teams[0]} Correct`;
    teamA.addEventListener("click", () => resolveRiskQuestion(0));

    const teamB = document.createElement("button");
    teamB.className = "primary-btn";
    teamB.textContent = `${state.teams[1]} Correct`;
    teamB.addEventListener("click", () => resolveRiskQuestion(1));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveRiskQuestion(null));

    actions.append(changeBtn, teamA, teamB, nobody);
  }
  showModal(container);
}

function rerollRiskQuestion() {
  const risk = state.risk;
  const tile = risk.activeTile;
  const newQuestion = getRandomQuestion(tile.topic, tile.difficulty);
  if (!newQuestion) return;
  tile.questionId = newQuestion.id;
  risk.rerolled = true;
  risk.answerRevealed = false;
  updateRiskModal(CLASSIC_TIMERS[tile.difficulty]);
}

function resolveRiskQuestion(winnerIndex) {
  const risk = state.risk;
  const tile = risk.activeTile;
  const points = CLASSIC_POINTS[tile.difficulty];
  tile.used = true;

  if (winnerIndex !== null) {
    let awarded = risk.rerolled ? points / 2 : points;
    if (risk.randomBonus) awarded += 50;
    if (winnerIndex !== state.activeTeam && risk.rerolled) {
      awarded = points;
    }
    state.scores[winnerIndex] += awarded;
    risk.lastWin = { team: winnerIndex, points: awarded };
    risk.doubleReady = true;
  } else {
    risk.lastWin = null;
    risk.doubleReady = false;
  }

  risk.randomBonus = false;
  closeModal();
  updateScoreboard();
  if (risk.doubleReady && risk.lastWin) {
    renderDoubleOrNothing();
  } else {
    state.activeTeam = state.activeTeam === 0 ? 1 : 0;
    renderRiskBoard();
    checkEndGameRisk();
  }
}

function renderDoubleOrNothing() {
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Double or Nothing</h2>
      <p style="text-align:center;">${state.teams[state.risk.lastWin.team]} can risk ${state.risk.lastWin.points} points.</p>
      <div class="button-row">
        <button class="secondary-btn" id="skipDouble">Skip</button>
        <button class="primary-btn" id="startDouble">Double or Nothing</button>
      </div>
    </section>
  `;

  document.getElementById("skipDouble").addEventListener("click", () => {
    state.risk.doubleReady = false;
    state.activeTeam = state.activeTeam === 0 ? 1 : 0;
    renderRiskBoard();
  });

  document.getElementById("startDouble").addEventListener("click", () => {
    const tile = getRandomUnusedTile(state.risk.board);
    if (!tile) {
      state.risk.doubleReady = false;
      state.activeTeam = state.activeTeam === 0 ? 1 : 0;
      renderRiskBoard();
      return;
    }
    state.risk.doubleTile = tile;
    openDoubleQuestion(tile);
  });
}

function openDoubleQuestion(tile) {
  state.risk.doubleAnswerRevealed = false;
  startTimer(CLASSIC_TIMERS[tile.difficulty], (remaining) => updateDoubleModal(remaining));
  updateDoubleModal(CLASSIC_TIMERS[tile.difficulty]);
}

function updateDoubleModal(remaining) {
  const tile = state.risk.doubleTile;
  const question = getQuestionById(tile.questionId);
  if (remaining === 0 && !state.risk.doubleAnswerRevealed) {
    clearTimers();
    state.risk.doubleAnswerRevealed = true;
    updateDoubleModal(0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.risk.doubleAnswerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  container.innerHTML = `
    <span class="tag">Double or Nothing • ${tile.topic} • ${tile.difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    <div class="button-row" id="doubleActions"></div>
  `;

  const actions = container.querySelector("#doubleActions");
  if (!state.risk.doubleAnswerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.risk.doubleAnswerRevealed = true;
      updateDoubleModal(0);
    });
    actions.append(nextBtn);
  } else {
    const teamA = document.createElement("button");
    teamA.className = "primary-btn";
    teamA.textContent = `${state.teams[0]} Correct`;
    teamA.addEventListener("click", () => resolveDouble(0));

    const teamB = document.createElement("button");
    teamB.className = "primary-btn";
    teamB.textContent = `${state.teams[1]} Correct`;
    teamB.addEventListener("click", () => resolveDouble(1));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveDouble(null));

    actions.append(teamA, teamB, nobody);
  }
  showModal(container);
}

function resolveDouble(winnerIndex) {
  const tile = state.risk.doubleTile;
  tile.used = true;
  const lastWin = state.risk.lastWin;
  if (winnerIndex === lastWin.team) {
    state.scores[winnerIndex] += lastWin.points;
  } else {
    state.scores[lastWin.team] -= lastWin.points;
    if (winnerIndex !== null) {
      state.scores[winnerIndex] += CLASSIC_POINTS[tile.difficulty];
    }
  }
  state.risk.doubleReady = false;
  state.risk.lastWin = null;
  closeModal();
  updateScoreboard();
  state.activeTeam = state.activeTeam === 0 ? 1 : 0;
  renderRiskBoard();
  checkEndGameRisk();
}

function checkEndGameRisk() {
  const allUsed = state.risk.board.rows.flat().every((tile) => tile.used || tile.disabled);
  if (allUsed) {
    renderEndGame();
  }
}

function initAuctionMode() {
  state.auction = {
    round: 1,
    activeTeam: 0,
    currentQuestion: null,
  };
  renderAuctionRound();
}

function renderAuctionRound() {
  const auction = state.auction;
  const reveal = AUCTION_REVEAL[auction.round - 1];
  const difficulty = pickAuctionDifficulty();
  const topic = randomItem(state.topics);
  const question = getRandomQuestion(topic, difficulty);
  auction.currentQuestion = { question, topic, difficulty };

  updateIndicators({ mode: MODE_LABELS.auction, round: `Round ${auction.round}/16`, difficulty: reveal.includes("difficulty") ? difficulty : "Hidden" });

  const revealText =
    reveal === "topic+difficulty"
      ? `${topic} • ${difficulty.toUpperCase()}`
      : reveal === "topic"
      ? `${topic} • ???`
      : reveal === "difficulty"
      ? `??? • ${difficulty.toUpperCase()}`
      : "??? • ???";

  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Auction Mode - Round ${auction.round}</h2>
      <p style="text-align:center;">Reveal: ${revealText}</p>
      <p style="text-align:center;">Active Bettor: <strong>${state.teams[auction.activeTeam]}</strong></p>
      <div class="form-row">
        <label>Bet Amount (100 - 1000)
          <input type="number" id="betAmount" min="100" max="1000" value="300" />
        </label>
      </div>
      <div class="button-row">
        <button class="primary-btn" id="lockBet">Lock Bet</button>
      </div>
    </section>
  `;

  document.getElementById("lockBet").addEventListener("click", () => {
    const betInput = document.getElementById("betAmount");
    const bet = clampNumber(Number(betInput.value), 100, 1000);
    betInput.value = bet;
    openAuctionQuestion(bet);
  });
}

function openAuctionQuestion(bet) {
  const auction = state.auction;
  const { question, topic, difficulty } = auction.currentQuestion;
  auction.answerRevealed = false;
  startTimer(30, (remaining) => updateAuctionModal(bet, question, topic, difficulty, remaining));
  updateAuctionModal(bet, question, topic, difficulty, 30);
}

function updateAuctionModal(bet, question, topic, difficulty, remaining) {
  if (remaining === 0 && !state.auction.answerRevealed) {
    clearTimers();
    state.auction.answerRevealed = true;
    updateAuctionModal(bet, question, topic, difficulty, 0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.auction.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const betMarkup = state.auction.answerRevealed ? "" : `<p style="text-align:center;">Bet: ${bet}</p>`;
  container.innerHTML = `
    <span class="tag">${topic} • ${difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    ${betMarkup}
    <div class="button-row" id="auctionActions"></div>
  `;

  const actions = container.querySelector("#auctionActions");
  if (!state.auction.answerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.auction.answerRevealed = true;
      updateAuctionModal(bet, question, topic, difficulty, 0);
    });
    actions.append(nextBtn);
  } else {
    const primaryCorrect = document.createElement("button");
    primaryCorrect.className = "primary-btn";
    primaryCorrect.textContent = `${state.teams[state.auction.activeTeam]} Correct`;
    primaryCorrect.addEventListener("click", () => resolveAuction(bet, true));

    const primaryWrong = document.createElement("button");
    primaryWrong.className = "secondary-btn";
    primaryWrong.textContent = `${state.teams[state.auction.activeTeam]} Wrong`;
    primaryWrong.addEventListener("click", () => resolveAuction(bet, false));

    actions.append(primaryCorrect, primaryWrong);
  }
  showModal(container);
}

function resolveAuction(bet, primaryCorrect) {
  const auction = state.auction;
  const primaryTeam = auction.activeTeam;
  if (primaryCorrect) {
    state.scores[primaryTeam] += bet;
    closeModal();
    updateScoreboard();
    advanceAuctionRound();
  } else {
    state.scores[primaryTeam] -= Math.floor(bet / 2);
    closeModal();
    openAuctionSecondary(bet);
  }
}

function openAuctionSecondary(bet) {
  const { question, topic, difficulty } = state.auction.currentQuestion;
  state.auction.secondaryRevealed = false;
  startTimer(30, (remaining) => updateAuctionSecondaryModal(bet, question, topic, difficulty, remaining));
  updateAuctionSecondaryModal(bet, question, topic, difficulty, 30);
}

function updateAuctionSecondaryModal(bet, question, topic, difficulty, remaining) {
  if (remaining === 0 && !state.auction.secondaryRevealed) {
    clearTimers();
    state.auction.secondaryRevealed = true;
    updateAuctionSecondaryModal(bet, question, topic, difficulty, 0);
    return;
  }
  const secondaryTeam = state.auction.activeTeam === 0 ? 1 : 0;
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.auction.secondaryRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const teamMarkup = state.auction.secondaryRevealed
    ? ""
    : `<p style="text-align:center;">Secondary Team: <strong>${state.teams[secondaryTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">${topic} • ${difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    ${teamMarkup}
    <div class="button-row" id="auctionSecondaryActions"></div>
  `;

  const actions = container.querySelector("#auctionSecondaryActions");
  if (!state.auction.secondaryRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.auction.secondaryRevealed = true;
      updateAuctionSecondaryModal(bet, question, topic, difficulty, 0);
    });
    actions.append(nextBtn);
  } else {
    const secondaryCorrect = document.createElement("button");
    secondaryCorrect.className = "primary-btn";
    secondaryCorrect.textContent = `${state.teams[secondaryTeam]} Correct`;
    secondaryCorrect.addEventListener("click", () => resolveAuctionSecondary(difficulty, true));

    const secondaryWrong = document.createElement("button");
    secondaryWrong.className = "secondary-btn";
    secondaryWrong.textContent = `${state.teams[secondaryTeam]} Wrong`;
    secondaryWrong.addEventListener("click", () => resolveAuctionSecondary(difficulty, false));

    actions.append(secondaryCorrect, secondaryWrong);
  }
  showModal(container);
}

function resolveAuctionSecondary(difficulty, secondaryCorrect) {
  const secondaryTeam = state.auction.activeTeam === 0 ? 1 : 0;
  if (secondaryCorrect) {
    const bonus = difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300;
    state.scores[secondaryTeam] += bonus;
  }
  closeModal();
  updateScoreboard();
  advanceAuctionRound();
}

function advanceAuctionRound() {
  if (state.auction.round === 16) {
    renderEndGame();
    return;
  }
  state.auction.round += 1;
  state.auction.activeTeam = state.auction.activeTeam === 0 ? 1 : 0;
  renderAuctionRound();
}

function renderEndGame() {
  clearTimers();
  state.screen = "end";
  updateIndicators({ mode: MODE_LABELS[state.mode] || "--", round: "Final", difficulty: "--" });
  const [scoreA, scoreB] = state.scores;
  let winnerText = "";
  if (scoreA === scoreB) {
    winnerText = "Tied! Sudden Finish required.";
  } else {
    const winner = scoreA > scoreB ? state.teams[0] : state.teams[1];
    winnerText = `${winner} wins!`;
  }
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Final Scores</h2>
      <p style="text-align:center; font-size: 1.4rem;">${state.teams[0]}: ${scoreA} | ${state.teams[1]}: ${scoreB}</p>
      <p style="text-align:center;">${winnerText}</p>
      <div class="button-row">
        <button class="primary-btn" id="playSudden">Sudden Finish</button>
        <button class="secondary-btn" id="restartGame">Start Over</button>
      </div>
    </section>
  `;

  document.getElementById("restartGame").addEventListener("click", renderStartScreen);
  document.getElementById("playSudden").addEventListener("click", () => {
    if (scoreA !== scoreB) {
      renderStartScreen();
      return;
    }
    openSuddenFinish();
  });
}

function openSuddenFinish() {
  const question = getRandomQuestion(randomItem(state.topics), "hard", true);
  state.suddenReveal = false;
  startTimer(20, (remaining) => updateSuddenModal(question, remaining));
  updateSuddenModal(question, 20);
}

function updateSuddenModal(question, remaining) {
  if (remaining === 0 && !state.suddenReveal) {
    clearTimers();
    state.suddenReveal = true;
    updateSuddenModal(question, 0);
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.suddenReveal ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  container.innerHTML = `
    <span class="tag">Sudden Finish • HARD</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${answerMarkup}
    <div class="button-row" id="suddenActions"></div>
  `;

  const actions = container.querySelector("#suddenActions");
  if (!state.suddenReveal) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      clearTimers();
      state.suddenReveal = true;
      updateSuddenModal(question, 0);
    });
    actions.append(nextBtn);
  } else {
    const teamA = document.createElement("button");
    teamA.className = "primary-btn";
    teamA.textContent = `${state.teams[0]} Correct`;
    teamA.addEventListener("click", () => resolveSudden(0));

    const teamB = document.createElement("button");
    teamB.className = "primary-btn";
    teamB.textContent = `${state.teams[1]} Correct`;
    teamB.addEventListener("click", () => resolveSudden(1));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveSudden(null));

    actions.append(teamA, teamB, nobody);
  }
  showModal(container);
}

function resolveSudden(winnerIndex) {
  if (winnerIndex === null) {
    closeModal();
    return;
  }
  state.scores[winnerIndex] += 1;
  closeModal();
  updateScoreboard();
  renderEndGame();
}

function renderRulesScreen() {
  state.screen = "rules";
  updateIndicators({ mode: "Rules", round: "--", difficulty: "--" });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Rules</h2>
      <div class="rules-list">
        <div class="rule-block">
          <h3>Universal</h3>
          <p>No draws. If tied at end, play one Hard question, random topic, 20 seconds. First correct wins. No bonuses or gambles.</p>
        </div>
        <div class="rule-block">
          <h3>Classic Mode</h3>
          <ul>
            <li>Turn-based board with 6 rows per topic (Easy x2, Medium x2, Hard x2).</li>
            <li>Easy 20s, Medium 40s, Hard 60s per team.</li>
            <li>Selecting team answers first, then other team.</li>
            <li>Host awards points by clicking team name.</li>
            <li>Nobody got it = no points, tile locks, turn switches.</li>
          </ul>
        </div>
        <div class="rule-block">
          <h3>Super Mode</h3>
          <ul>
            <li>9 rounds. Each round has one question per topic.</li>
            <li>Rounds 1-3 Easy, 4-6 Medium, 7-9 Hard.</li>
            <li>20 seconds per question, first correct wins.</li>
            <li>Bonus stacks if nobody scores. Chain gives +50 for next correct answer.</li>
            <li>Clutch round between rounds 4 and 5 if score gap &gt;= 1000.</li>
          </ul>
        </div>
        <div class="rule-block">
          <h3>Risk Mode</h3>
          <ul>
            <li>Random Pick chooses an unused tile with +50 bonus.</li>
            <li>Change Question rerolls same topic/difficulty for half points.</li>
            <li>If other team answers a rerolled question correctly, they get full points.</li>
            <li>Double or Nothing after a win risks previous points for a new question.</li>
          </ul>
        </div>
        <div class="rule-block">
          <h3>Auction Mode</h3>
          <ul>
            <li>16 rounds. Teams start at 1500 and can go negative.</li>
            <li>Rounds 1-4 reveal topic+difficulty, 5-8 topic only, 9-12 difficulty only, 13-16 nothing.</li>
            <li>Primary team bets 100-1000. Correct: +bet. Wrong: lose half bet.</li>
            <li>Secondary team can earn fixed bonuses based on difficulty.</li>
          </ul>
        </div>
      </div>
      <div class="button-row">
        <button class="secondary-btn" id="closeRules">Back</button>
      </div>
    </section>
  `;

  document.getElementById("closeRules").addEventListener("click", () => {
    if (state.screen === "rules") {
      renderStartScreen();
    }
  });
}

function startTimer(seconds, onTick) {
  clearTimers();
  let remaining = seconds;
  onTick(remaining);
  activeTimers.intervalId = setInterval(() => {
    remaining -= 1;
    if (remaining < 0) {
      clearTimers();
      return;
    }
    onTick(remaining);
  }, 1000);
}

function getAvailableTopics() {
  const topics = new Set();
  ["easy", "medium", "hard"].forEach((difficulty) => {
    state.data[difficulty].forEach((q) => topics.add(q.topic));
  });
  return Array.from(topics).sort();
}

function buildBoard(topics, rowDifficulties) {
  const rows = rowDifficulties.map((difficulty) => {
    return topics.map((topic) => {
      const question = getRandomQuestion(topic, difficulty);
      return {
        topic,
        difficulty,
        label: `${difficulty} ${CLASSIC_POINTS[difficulty]}`,
        questionId: question ? question.id : null,
        used: false,
        disabled: !question,
      };
    });
  });
  return { rows };
}

function getRandomQuestion(topic, difficulty, allowAnyTopic = false) {
  const pool = state.questionIndex[difficulty][topic];
  if (!pool || pool.length === 0) {
    if (allowAnyTopic) {
      return getRandomQuestion(randomItem(state.topics), difficulty, false);
    }
    return null;
  }
  const question = pool.pop();
  state.usedQuestions.add(question.id);
  return question;
}

function getQuestionById(id) {
  return state.data.easy.concat(state.data.medium, state.data.hard).find((q) => q.id === id);
}

function getRandomUnusedTile(board) {
  const tiles = board.rows.flat().filter((tile) => !tile.used && !tile.disabled);
  return tiles.length ? randomItem(tiles) : null;
}

function pickAuctionDifficulty() {
  const roll = Math.random();
  if (roll < 0.4) return "easy";
  if (roll < 0.75) return "medium";
  return "hard";
}

function buildQuestionIndex() {
  const index = { easy: {}, medium: {}, hard: {} };
  ["easy", "medium", "hard"].forEach((difficulty) => {
    state.data[difficulty].forEach((question) => {
      if (!index[difficulty][question.topic]) {
        index[difficulty][question.topic] = [];
      }
      index[difficulty][question.topic].push(question);
    });
    Object.values(index[difficulty]).forEach((list) => shuffle(list));
  });
  state.questionIndex = index;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function bindGlobalEvents() {
  document.querySelectorAll(".score-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const team = Number(btn.dataset.team);
      const action = btn.dataset.action;
      if (action === "add") {
        state.scores[team] += SCORE_STEP;
      } else {
        state.scores[team] -= SCORE_STEP;
      }
      updateScoreboard();
    });
  });

  ELEMENTS.rulesBtn.addEventListener("click", renderRulesScreen);
  ELEMENTS.backToStartBtn.addEventListener("click", renderStartScreen);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function loadQuestions() {
  return Promise.all([
    fetch("data/easy.json").then((res) => (res.ok ? res.json() : EMBEDDED_QUESTIONS.easy)).catch(() => EMBEDDED_QUESTIONS.easy),
    fetch("data/medium.json").then((res) => (res.ok ? res.json() : EMBEDDED_QUESTIONS.medium)).catch(() => EMBEDDED_QUESTIONS.medium),
    fetch("data/hard.json").then((res) => (res.ok ? res.json() : EMBEDDED_QUESTIONS.hard)).catch(() => EMBEDDED_QUESTIONS.hard),
  ]).then(([easy, medium, hard]) => {
    state.data = { easy, medium, hard };
    buildQuestionIndex();
  });
}

loadQuestions().then(() => {
  bindGlobalEvents();
  updateScoreboard();
  renderStartScreen();
});
