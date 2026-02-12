const APP_VERSION = "2.5";
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
    { id: "easy-dc-151", topic: "DC", question: "What city is famously protected by Batman?", answer: "Gotham City" },
    { id: "easy-dc-152", topic: "DC", question: "What is Superman’s Kryptonian name?", answer: "Kal-El" },
    { id: "easy-dc-153", topic: "DC", question: "Which metal is lethal to Superman?", answer: "Kryptonite" },
    { id: "easy-general-knowledge-31", topic: "GENERAL KNOWLEDGE", question: "What country has the largest population in the world right now?", answer: "India" },
    { id: "easy-general-knowledge-32", topic: "GENERAL KNOWLEDGE", question: "Which planet is closest to the Sun?", answer: "Mercury" },
    { id: "easy-general-knowledge-33", topic: "GENERAL KNOWLEDGE", question: "What is the capital city of Australia?", answer: "Canberra" },
    { id: "easy-history-61", topic: "HISTORY", question: "In which year did World War II end?", answer: "1945" },
    { id: "easy-history-62", topic: "HISTORY", question: "What wall divided a European city during the Cold War?", answer: "Berlin Wall" },
    { id: "easy-history-63", topic: "HISTORY", question: "Which ancient civilization built the pyramids?", answer: "Ancient Egyptians" },
    { id: "easy-marvel-181", topic: "MARVEL", question: "What metal is bonded to Wolverine’s skeleton?", answer: "Adamantium" },
    { id: "easy-marvel-182", topic: "MARVEL", question: "What is Iron Man’s real name?", answer: "Tony Stark" },
    { id: "easy-marvel-183", topic: "MARVEL", question: "Which Infinity Stone controls time?", answer: "Time Stone" },
    { id: "easy-movies-91", topic: "MOVIES", question: "Which movie features a purple villain who snaps his fingers to erase half the universe?", answer: "Avengers Infinity War" },
    { id: "easy-movies-92", topic: "MOVIES", question: "In which movie does a shark terrorize a beach town?", answer: "Jaws" },
    { id: "easy-movies-93", topic: "MOVIES", question: "Which movie features a theme park where dinosaurs are brought back to life?", answer: "Jurassic Park" },
    { id: "easy-netflix-shows-121", topic: "NETFLIX SHOWS", question: "Which Netflix series follows a chemistry teacher who starts cooking meth?", answer: "Breaking Bad" },
    { id: "easy-netflix-shows-122", topic: "NETFLIX SHOWS", question: "Which show is about kids fighting supernatural creatures in the 1980s?", answer: "Stranger Things" },
    { id: "easy-netflix-shows-123", topic: "NETFLIX SHOWS", question: "Which series is set inside a deadly game with huge cash prizes?", answer: "Squid Game" },
    { id: "easy-uae-gcc-1", topic: "UAE & GCC", question: "What is the capital of the UAE?", answer: "Abu Dhabi" },
    { id: "easy-uae-gcc-2", topic: "UAE & GCC", question: "Which city is home to the Burj Khalifa?", answer: "Dubai" },
    { id: "easy-uae-gcc-3", topic: "UAE & GCC", question: "How many emirates are there in the UAE?", answer: "7" },
  ],
  medium: [
    { id: "medium-dc-151", topic: "DC", question: "What is the name of Batman’s secret base beneath Wayne Manor?", answer: "Batcave" },
    { id: "medium-dc-152", topic: "DC", question: "Which Robin was killed and later returned as Red Hood?", answer: "Jason Todd" },
    { id: "medium-dc-153", topic: "DC", question: "Which DC event rebooted the universe in 2011?", answer: "The New 52" },
    { id: "medium-general-knowledge-31", topic: "GENERAL KNOWLEDGE", question: "What is the capital of South Africa?", answer: "Pretoria" },
    { id: "medium-general-knowledge-32", topic: "GENERAL KNOWLEDGE", question: "Which element has the atomic number 1?", answer: "Hydrogen" },
    { id: "medium-general-knowledge-33", topic: "GENERAL KNOWLEDGE", question: "How many players are on a football team on the field?", answer: "11" },
    { id: "medium-history-61", topic: "HISTORY", question: "What event triggered World War I?", answer: "Assassination of Archduke Franz Ferdinand" },
    { id: "medium-history-62", topic: "HISTORY", question: "Which European leader was defeated at the Battle of Waterloo?", answer: "Napoleon Bonaparte" },
    { id: "medium-history-63", topic: "HISTORY", question: "What agreement divided parts of the Middle East after WWI?", answer: "Sykes-Picot Agreement" },
    { id: "medium-marvel-181", topic: "MARVEL", question: "Which Marvel movie first introduced the multiverse concept?", answer: "Doctor Strange" },
    { id: "medium-marvel-182", topic: "MARVEL", question: "What is the name of the organization opposing SHIELD from within?", answer: "HYDRA" },
    { id: "medium-marvel-183", topic: "MARVEL", question: "Which character lifts Mjolnir in Avengers Endgame?", answer: "Captain America" },
    { id: "medium-movies-91", topic: "MOVIES", question: "Which movie features a spinning top used to check reality?", answer: "Inception" },
    { id: "medium-movies-92", topic: "MOVIES", question: "In which movie does Batman retire at the end after faking his death?", answer: "The Dark Knight Rises" },
    { id: "medium-movies-93", topic: "MOVIES", question: "Which actor played the Joker in Joker (2019)?", answer: "Joaquin Phoenix" },
    { id: "medium-netflix-shows-121", topic: "NETFLIX SHOWS", question: "Which Netflix series is originally titled La Casa de Papel?", answer: "Money Heist" },
    { id: "medium-netflix-shows-122", topic: "NETFLIX SHOWS", question: "Which show features time travel caused by a nuclear plant?", answer: "Dark" },
    { id: "medium-netflix-shows-123", topic: "NETFLIX SHOWS", question: "Which Netflix series follows a vigilante hacker group?", answer: "Mr Robot" },
    { id: "medium-uae-gcc-1", topic: "UAE & GCC", question: "In what year was the UAE founded?", answer: "1971" },
    { id: "medium-uae-gcc-2", topic: "UAE & GCC", question: "Which emirate borders Oman on the east coast?", answer: "Fujairah" },
    { id: "medium-uae-gcc-3", topic: "UAE & GCC", question: "Which UAE city is home to the Sheikh Zayed Grand Mosque?", answer: "Abu Dhabi" },
  ],
  hard: [
    { id: "hard-dc-151", topic: "DC", question: "What is the name of Batman’s darkest multiverse counterpart?", answer: "The Batman Who Laughs" },
    { id: "hard-dc-152", topic: "DC", question: "Which DC event collapsed and rebuilt the multiverse multiple times?", answer: "Crisis events" },
    { id: "hard-dc-153", topic: "DC", question: "What equation allows control over all life in DC lore?", answer: "Anti-Life Equation" },
    { id: "hard-general-knowledge-31", topic: "GENERAL KNOWLEDGE", question: "What year did the Berlin Wall fall?", answer: "1989" },
    { id: "hard-general-knowledge-32", topic: "GENERAL KNOWLEDGE", question: "Which scientist developed the theory of relativity?", answer: "Albert Einstein" },
    { id: "hard-general-knowledge-33", topic: "GENERAL KNOWLEDGE", question: "What is the capital of Kazakhstan?", answer: "Astana" },
    { id: "hard-history-61", topic: "HISTORY", question: "What event officially started World War II in Europe?", answer: "Invasion of Poland" },
    { id: "hard-history-62", topic: "HISTORY", question: "Which famous wall symbolized the Cold War divide?", answer: "Berlin Wall" },
    { id: "hard-history-63", topic: "HISTORY", question: "Which empire ruled much of the Middle East before World War I?", answer: "Ottoman Empire" },
    { id: "hard-marvel-181", topic: "MARVEL", question: "What Marvel event split the Avengers over ideology?", answer: "Civil War" },
    { id: "hard-marvel-182", topic: "MARVEL", question: "Which Marvel character becomes worthy of Mjolnir after Thor?", answer: "Jane Foster" },
    { id: "hard-marvel-183", topic: "MARVEL", question: "What is the name of the multiversal war hinted in Loki?", answer: "Multiversal War" },
    { id: "hard-movies-91", topic: "MOVIES", question: "Which movie features the quote “Why so serious?”", answer: "The Dark Knight" },
    { id: "hard-movies-92", topic: "MOVIES", question: "Which movie franchise has exactly 9 main saga films?", answer: "Star Wars" },
    { id: "hard-movies-93", topic: "MOVIES", question: "Which movie features a rotating hallway fight scene filmed practically?", answer: "Inception" },
    { id: "hard-netflix-shows-121", topic: "NETFLIX SHOWS", question: "Which Netflix series is set in the fictional town of Winden?", answer: "Dark" },
    { id: "hard-netflix-shows-122", topic: "NETFLIX SHOWS", question: "Which show features a priest battling faith and miracles?", answer: "Midnight Mass" },
    { id: "hard-netflix-shows-123", topic: "NETFLIX SHOWS", question: "Which Netflix series follows a morally grey funeral home family?", answer: "Six Feet Under" },
    { id: "hard-uae-gcc-1", topic: "UAE & GCC", question: "Who was the first President of the UAE?", answer: "Sheikh Zayed bin Sultan Al Nahyan" },
    { id: "hard-uae-gcc-2", topic: "UAE & GCC", question: "Which emirate was the last to join the UAE federation?", answer: "Ras Al Khaimah" },
    { id: "hard-uae-gcc-3", topic: "UAE & GCC", question: "In what year did Ras Al Khaimah join the UAE?", answer: "1972" },
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
  newGameBtn: document.getElementById("newGameBtn"),
  versionLabel: document.getElementById("versionLabel"),
};

const activeTimers = {
  intervalId: null,
};

function renderAppVersion() {
  if (ELEMENTS.versionLabel) {
    ELEMENTS.versionLabel.textContent = `Version ${APP_VERSION}`;
  }
}

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
  buildQuestionIndex();
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
  classic.reveal = false;
  classic.responseStage = 0;
  classic.responseOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  const timerSeconds = CLASSIC_TIMERS[tile.difficulty];
  classic.timerSeconds = timerSeconds;
  startTimer(timerSeconds, (remaining) => updateClassicModal(remaining));
  updateClassicModal(timerSeconds);
}

function updateClassicModal(remaining) {
  const classic = state.classic;
  const tile = classic.activeTile;
  const question = getQuestionById(tile.questionId);
  const advanceOrReveal = () => {
    clearTimers();
    if (!classic.reveal && classic.responseStage === 0) {
      classic.responseStage = 1;
      startTimer(classic.timerSeconds, (nextRemaining) => updateClassicModal(nextRemaining));
      updateClassicModal(classic.timerSeconds);
      return;
    }
    classic.reveal = true;
    updateClassicModal(0);
  };

  if (remaining === 0 && !classic.reveal) {
    advanceOrReveal();
    return;
  }

  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = classic.reveal ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const answeringTeam = classic.responseOrder?.[classic.responseStage] ?? state.activeTeam;
  const phaseMarkup = classic.reveal
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;

  container.innerHTML = `
    <span class="tag">${tile.topic} • ${tile.difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    <div class="button-row" id="classicActions"></div>
  `;

  const actionRow = container.querySelector("#classicActions");
  if (!classic.reveal) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
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
    // Explicit, testable Super turn-order state:
    // - superRoundNumber: 1..9
    // - superPickIndexWithinRound: 0..3
    // Active picker is derived from these two fields.
    superRoundNumber: 1,
    superPickIndexWithinRound: 0,
    superStartingTeamForRound: 0,
    bonusStack: 0,
    chain: 0,
    chainOwner: null,
    roundTopics: [],
    roundQuestions: {},
    answered: new Set(),
    clutchUsed: false,
  };
  setSuperStartingTeam();
  prepareSuperRound();
  renderSuperMode();
}

function prepareSuperRound() {
  const round = state.super.superRoundNumber;
  const difficulty = round <= 3 ? "easy" : round <= 6 ? "medium" : "hard";
  state.super.roundTopics = shuffle([...state.topics]).slice(0, 4);
  state.super.roundQuestions = {};
  state.super.answered = new Set();
  state.super.superPickIndexWithinRound = 0;
  setSuperStartingTeam();
  updateSuperActiveTeam();
  state.super.roundTopics.forEach((topic) => {
    const question = getRandomQuestion(topic, difficulty);
    state.super.roundQuestions[topic] = question;
  });
}

function renderSuperMode() {
  const round = state.super.superRoundNumber;
  const difficulty = round <= 3 ? "easy" : round <= 6 ? "medium" : "hard";
  const streakOwnerName = state.super.chainOwner === null ? "None" : state.teams[state.super.chainOwner];
  updateSuperActiveTeam();
  updateIndicators({ mode: MODE_LABELS.super, round: `Round ${round}/9`, difficulty });
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Super Mode - Round ${round}</h2>
      <p style="text-align:center;">Base: ${SUPER_BASE_POINTS[round - 1]} | Bonus Stack: +${state.super.bonusStack} | Streak: ${streakOwnerName} (+${state.super.chain})</p>
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
  if (state.super.superPickIndexWithinRound >= 4 || state.super.answered.has(topic)) {
    return;
  }
  const question = state.super.roundQuestions[topic];
  if (!question) return;
  state.super.answerRevealed = false;
  state.super.responseStage = 0;
  state.super.responseOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  state.super.timerSeconds = 20;
  startTimer(20, (remaining) => updateSuperModal(topic, question, difficulty, remaining));
  updateSuperModal(topic, question, difficulty, 20);
}

function updateSuperModal(topic, question, difficulty, remaining) {
  const advanceOrReveal = () => {
    clearTimers();
    if (!state.super.answerRevealed && state.super.responseStage === 0) {
      state.super.responseStage = 1;
      startTimer(state.super.timerSeconds, (nextRemaining) => updateSuperModal(topic, question, difficulty, nextRemaining));
      updateSuperModal(topic, question, difficulty, state.super.timerSeconds);
      return;
    }
    state.super.answerRevealed = true;
    updateSuperModal(topic, question, difficulty, 0);
  };

  if (remaining === 0 && !state.super.answerRevealed) {
    advanceOrReveal();
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.super.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const answeringTeam = state.super.responseOrder?.[state.super.responseStage] ?? state.activeTeam;
  const phaseMarkup = state.super.answerRevealed
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">${topic} • ${difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    <div class="button-row" id="superActions"></div>
  `;

  const actionRow = container.querySelector("#superActions");
  if (!state.super.answerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
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
  const round = state.super.superRoundNumber;
  const base = SUPER_BASE_POINTS[round - 1];
  const bonus = round <= 4 ? 50 : 100;
  if (winnerIndex === null) {
    state.super.bonusStack += bonus;
    state.super.chain = 0;
    state.super.chainOwner = null;
  } else {
    const ownedChainBonus = state.super.chainOwner === winnerIndex ? state.super.chain : 0;
    const total = base + state.super.bonusStack + ownedChainBonus;
    state.scores[winnerIndex] += total;
    state.super.bonusStack = 0;

    if (state.super.chainOwner === winnerIndex) {
      state.super.chain += 50;
    } else {
      state.super.chainOwner = winnerIndex;
      state.super.chain = 50;
    }
  }
  state.super.answered.add(topic);
  state.super.superPickIndexWithinRound += 1;
  updateSuperActiveTeam();
  closeModal();
  if (state.super.superPickIndexWithinRound >= 4 || state.super.answered.size === state.super.roundTopics.length) {
    if (state.super.superRoundNumber === 4 && !state.super.clutchUsed) {
      const gap = Math.abs(state.scores[0] - state.scores[1]);
      if (gap >= 1000) {
        renderClutchOffer();
        return;
      }
    }
    if (state.super.superRoundNumber === 9) {
      renderEndGame();
      return;
    }
    state.super.superRoundNumber += 1;
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
    state.super.superRoundNumber += 1;
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
  state.super.clutchStage = 0;
  state.super.clutchOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  state.super.clutchTimerSeconds = 20;
  startTimer(20, (remaining) => updateClutchModal(question, remaining));
  updateClutchModal(question, 20);
}

function updateClutchModal(question, remaining) {
  const advanceOrReveal = () => {
    clearTimers();
    if (!state.super.clutchRevealed && state.super.clutchStage === 0) {
      state.super.clutchStage = 1;
      startTimer(state.super.clutchTimerSeconds, (nextRemaining) => updateClutchModal(question, nextRemaining));
      updateClutchModal(question, state.super.clutchTimerSeconds);
      return;
    }
    state.super.clutchRevealed = true;
    updateClutchModal(question, 0);
  };

  if (remaining === 0 && !state.super.clutchRevealed) {
    advanceOrReveal();
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.super.clutchRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const answeringTeam = state.super.clutchOrder?.[state.super.clutchStage] ?? state.activeTeam;
  const phaseMarkup = state.super.clutchRevealed
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">Clutch Round • EASY</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    <div class="button-row" id="clutchActions"></div>
  `;

  const actions = container.querySelector("#clutchActions");
  if (!state.super.clutchRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
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
  state.super.superRoundNumber += 1;
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
    changeUsed: false,
    answerRevealed: false,
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
  risk.changeUsed = false;
  risk.responseStage = 0;
  risk.responseOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  risk.timerSeconds = CLASSIC_TIMERS[tile.difficulty];
  startTimer(risk.timerSeconds, (remaining) => updateRiskModal(remaining));
  updateRiskModal(risk.timerSeconds);
}

function updateRiskModal(remaining) {
  const risk = state.risk;
  const tile = risk.activeTile;
  const question = getQuestionById(tile.questionId);
  const points = CLASSIC_POINTS[tile.difficulty];

  const advanceOrReveal = () => {
    clearTimers();
    if (!risk.answerRevealed && risk.responseStage === 0) {
      risk.responseStage = 1;
      startTimer(risk.timerSeconds, (nextRemaining) => updateRiskModal(nextRemaining));
      updateRiskModal(risk.timerSeconds);
      return;
    }
    risk.answerRevealed = true;
    updateRiskModal(0);
  };

  if (remaining === 0 && !risk.answerRevealed) {
    advanceOrReveal();
    return;
  }

  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = risk.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const activeTeamValue = risk.rerolled ? points / 2 : points;
  const answeringTeam = risk.responseOrder?.[risk.responseStage] ?? state.activeTeam;
  const metaMarkup = risk.answerRevealed
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>
    <p style="text-align:center;">Active-team value: ${activeTeamValue} ${risk.randomBonus ? "+50 random" : ""}</p>
    <p style="text-align:center;">Opponent value on reroll remains full: ${points}</p>`;
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
    nextBtn.addEventListener("click", advanceOrReveal);

    const changeBtn = document.createElement("button");
    changeBtn.className = `secondary-btn${risk.changeUsed ? " is-dimmed" : " highlight-btn"}`;
    changeBtn.textContent = risk.changeUsed ? "Change Question Used" : "Change Question (Half Points)";
    changeBtn.disabled = risk.changeUsed;
    changeBtn.addEventListener("click", () => rerollRiskQuestion());

    actions.append(nextBtn, changeBtn);
  } else {
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

    actions.append(teamA, teamB, nobody);
  }
  showModal(container);
}

function rerollRiskQuestion() {
  const risk = state.risk;
  const tile = risk.activeTile;
  if (risk.changeUsed || risk.answerRevealed) return;

  const previousQuestionId = tile.questionId;
  let newQuestion = null;

  for (let i = 0; i < 6; i += 1) {
    const candidate = getRandomQuestion(tile.topic, tile.difficulty);
    if (candidate && candidate.id !== previousQuestionId) {
      newQuestion = candidate;
      break;
    }
  }

  if (!newQuestion) {
    const candidates = state.topics.filter((topic) => state.questionIndex[tile.difficulty][topic]?.length);
    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = getRandomQuestion(candidates[i], tile.difficulty);
      if (candidate && candidate.id !== previousQuestionId) {
        newQuestion = candidate;
        break;
      }
    }
  }

  if (!newQuestion) return;

  tile.questionId = newQuestion.id;
  risk.rerolled = true;
  risk.changeUsed = true;
  risk.answerRevealed = false;
  clearTimers();
  startTimer(risk.timerSeconds, (remaining) => updateRiskModal(remaining));
  updateRiskModal(risk.timerSeconds);
}

function resolveRiskQuestion(winnerIndex) {
  const risk = state.risk;
  const tile = risk.activeTile;
  const points = CLASSIC_POINTS[tile.difficulty];
  tile.used = true;

  if (winnerIndex !== null) {
    let awarded = risk.rerolled && winnerIndex === state.activeTeam ? points / 2 : points;
    if (risk.randomBonus) awarded += 50;
    state.scores[winnerIndex] += awarded;
    // Double-or-Nothing can be offered after either team scores correctly.
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
    // Keep active team unchanged until Double-or-Nothing is addressed.
    renderDoubleOrNothing();
    return;
  }

  state.activeTeam = state.activeTeam === 0 ? 1 : 0;
  renderRiskBoard();
  checkEndGameRisk();
}

function renderDoubleOrNothing() {
  screenRoot.innerHTML = `
    <section class="panel">
      <h2>Double or Nothing</h2>
      <p style="text-align:center;">${state.teams[state.risk.lastWin.team]} can risk ${state.risk.lastWin.points} points.</p>
      <p style="text-align:center; color: var(--muted);">Active team changes after this decision.</p>
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
  state.risk.doubleStage = 0;
  state.risk.doubleOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  state.risk.doubleTimerSeconds = CLASSIC_TIMERS[tile.difficulty];
  startTimer(state.risk.doubleTimerSeconds, (remaining) => updateDoubleModal(remaining));
  updateDoubleModal(state.risk.doubleTimerSeconds);
}

function updateDoubleModal(remaining) {
  const tile = state.risk.doubleTile;
  const question = getQuestionById(tile.questionId);

  const advanceOrReveal = () => {
    clearTimers();
    if (!state.risk.doubleAnswerRevealed && state.risk.doubleStage === 0) {
      state.risk.doubleStage = 1;
      startTimer(state.risk.doubleTimerSeconds, (nextRemaining) => updateDoubleModal(nextRemaining));
      updateDoubleModal(state.risk.doubleTimerSeconds);
      return;
    }
    state.risk.doubleAnswerRevealed = true;
    updateDoubleModal(0);
  };

  if (remaining === 0 && !state.risk.doubleAnswerRevealed) {
    advanceOrReveal();
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.risk.doubleAnswerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const answeringTeam = state.risk.doubleOrder?.[state.risk.doubleStage] ?? state.activeTeam;
  const phaseMarkup = state.risk.doubleAnswerRevealed
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">Double or Nothing • ${tile.topic} • ${tile.difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    <div class="button-row" id="doubleActions"></div>
  `;

  const actions = container.querySelector("#doubleActions");
  if (!state.risk.doubleAnswerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
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
  const basePoints = CLASSIC_POINTS[tile.difficulty];

  if (winnerIndex === lastWin.team) {
    state.scores[winnerIndex] += basePoints * 2;
  } else {
    state.scores[lastWin.team] -= lastWin.points;
    if (winnerIndex !== null) {
      state.scores[winnerIndex] += basePoints;
    }
  }

  state.risk.doubleReady = false;
  state.risk.lastWin = null;
  closeModal();
  updateScoreboard();
  // Turn advances only after the Double-or-Nothing flow is fully resolved.
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
    phase: "bet",
    primaryResult: null,
    secondaryResult: null,
    currentBet: 0,
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
  auction.phase = "primary";
  auction.currentBet = bet;
  auction.primaryResult = null;
  auction.secondaryResult = null;
  auction.answerRevealed = false;
  auction.responseStage = 0;
  auction.responseOrder = [auction.activeTeam, auction.activeTeam === 0 ? 1 : 0];
  auction.timerSeconds = 30;
  startTimer(auction.timerSeconds, (remaining) => updateAuctionModal(bet, question, topic, difficulty, remaining));
  updateAuctionModal(bet, question, topic, difficulty, auction.timerSeconds);
}

function updateAuctionModal(bet, question, topic, difficulty, remaining) {
  const auction = state.auction;

  const advanceOrReveal = () => {
    clearTimers();
    if (!auction.answerRevealed && auction.responseStage === 0) {
      auction.responseStage = 1;
      startTimer(auction.timerSeconds, (nextRemaining) => updateAuctionModal(bet, question, topic, difficulty, nextRemaining));
      updateAuctionModal(bet, question, topic, difficulty, auction.timerSeconds);
      return;
    }
    auction.phase = "reveal";
    auction.answerRevealed = true;
    updateAuctionModal(bet, question, topic, difficulty, 0);
  };

  if (remaining === 0 && !auction.answerRevealed) {
    advanceOrReveal();
    return;
  }

  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = auction.answerRevealed ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const betMarkup = auction.answerRevealed ? "" : `<p style="text-align:center;">Bet: ${bet}</p>`;
  const answeringTeam = auction.responseOrder?.[auction.responseStage] ?? auction.activeTeam;
  const phaseMarkup = auction.answerRevealed
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">${topic} • ${difficulty.toUpperCase()}</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    ${betMarkup}
    <div class="button-row" id="auctionActions"></div>
  `;

  const actions = container.querySelector("#auctionActions");
  if (!auction.answerRevealed) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
    actions.append(nextBtn);
  } else {
    const primaryTeam = auction.activeTeam;
    const secondaryTeam = primaryTeam === 0 ? 1 : 0;

    const primaryCorrect = document.createElement("button");
    primaryCorrect.className = "primary-btn";
    primaryCorrect.textContent = `${state.teams[primaryTeam]} Correct`;
    primaryCorrect.addEventListener("click", () => resolveAuctionOutcome("primary", difficulty));

    const secondaryCorrect = document.createElement("button");
    secondaryCorrect.className = "primary-btn";
    secondaryCorrect.textContent = `${state.teams[secondaryTeam]} Correct`;
    secondaryCorrect.addEventListener("click", () => resolveAuctionOutcome("secondary", difficulty));

    const nobody = document.createElement("button");
    nobody.className = "secondary-btn";
    nobody.textContent = "Nobody Got It";
    nobody.addEventListener("click", () => resolveAuctionOutcome("nobody", difficulty));

    actions.append(primaryCorrect, secondaryCorrect, nobody);
  }
  showModal(container);
}

function resolveAuctionOutcome(outcome, difficulty) {
  const auction = state.auction;
  const primaryTeam = auction.activeTeam;
  const secondaryTeam = primaryTeam === 0 ? 1 : 0;
  const bet = auction.currentBet;

  if (outcome === "primary") {
    state.scores[primaryTeam] += bet;
  } else {
    state.scores[primaryTeam] -= Math.floor(bet / 2);
    if (outcome === "secondary") {
      const bonus = difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300;
      state.scores[secondaryTeam] += bonus;
    }
  }

  closeModal();
  updateScoreboard();
  advanceAuctionRound();
}

function resolveAuctionPrimary(primaryCorrect) {
  resolveAuctionOutcome(primaryCorrect ? "primary" : "nobody", state.auction.currentQuestion.difficulty);
}

function resolveAuctionSecondary(difficulty, secondaryCorrect) {
  resolveAuctionOutcome(secondaryCorrect ? "secondary" : "nobody", difficulty);
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

  document.getElementById("restartGame").addEventListener("click", () => {
    resetGameState();
    renderStartScreen();
  });
  document.getElementById("playSudden").addEventListener("click", () => {
    if (scoreA !== scoreB) {
      resetGameState();
      renderStartScreen();
      return;
    }
    openSuddenFinish();
  });
}

function openSuddenFinish() {
  const question = getRandomQuestion(randomItem(state.topics), "hard", true);
  state.suddenReveal = false;
  state.suddenStage = 0;
  state.suddenOrder = [state.activeTeam, state.activeTeam === 0 ? 1 : 0];
  state.suddenTimerSeconds = 20;
  startTimer(20, (remaining) => updateSuddenModal(question, remaining));
  updateSuddenModal(question, 20);
}

function updateSuddenModal(question, remaining) {
  const advanceOrReveal = () => {
    clearTimers();
    if (!state.suddenReveal && state.suddenStage === 0) {
      state.suddenStage = 1;
      startTimer(state.suddenTimerSeconds, (nextRemaining) => updateSuddenModal(question, nextRemaining));
      updateSuddenModal(question, state.suddenTimerSeconds);
      return;
    }
    state.suddenReveal = true;
    updateSuddenModal(question, 0);
  };

  if (remaining === 0 && !state.suddenReveal) {
    advanceOrReveal();
    return;
  }
  const container = document.createElement("div");
  container.className = "question-card";
  const answerMarkup = state.suddenReveal ? `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>` : "";
  const answeringTeam = state.suddenOrder?.[state.suddenStage] ?? state.activeTeam;
  const phaseMarkup = state.suddenReveal
    ? ""
    : `<p style="text-align:center;">Answering Team: <strong>${state.teams[answeringTeam]}</strong></p>`;
  container.innerHTML = `
    <span class="tag">Sudden Finish • HARD</span>
    <h2>${question.question}</h2>
    <div class="timer">${remaining}s</div>
    ${phaseMarkup}
    ${answerMarkup}
    <div class="button-row" id="suddenActions"></div>
  `;

  const actions = container.querySelector("#suddenActions");
  if (!state.suddenReveal) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "primary-btn";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", advanceOrReveal);
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
            <li>9 rounds. Each round has 4 picks.</li>
            <li>Rounds 1-3 Easy, 4-6 Medium, 7-9 Hard.</li>
            <li>20 seconds per question, first correct wins.</li>
            <li>Teams alternate picks, and the starting team alternates each round.</li>
            <li>Bonus stacks if nobody scores. Streak bonus (+50) belongs to one team and breaks if the other team scores.</li>
            <li>Clutch round between rounds 4 and 5 if score gap &gt;= 1000.</li>
          </ul>
        </div>
        <div class="rule-block">
          <h3>Risk Mode</h3>
          <ul>
            <li>Random Pick chooses an unused tile with +50 bonus.</li>
            <li>Change Question rerolls same topic/difficulty for half points.</li>
            <li>If other team answers a rerolled question correctly, they get full points.</li>
            <li>Double or Nothing appears after either team scores and must be addressed before turn switches.</li>
          </ul>
        </div>
        <div class="rule-block">
          <h3>Auction Mode</h3>
          <ul>
            <li>16 rounds. Teams start at 1500 and can go negative.</li>
            <li>Rounds 1-4 reveal topic+difficulty, 5-8 topic only, 9-12 difficulty only, 13-16 nothing.</li>
            <li>Primary team bets 100-1000. Correct: +bet. If the other team is marked correct they get bonus, otherwise Wrong/Nobody costs primary half bet.</li>
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
  ELEMENTS.newGameBtn.addEventListener("click", () => {
    resetGameState();
    renderStartScreen();
  });

  renderAppVersion();

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function loadQuestions() {
  const stamp = encodeURIComponent(APP_VERSION);
  const loadFile = (path, fallback) => fetch(`${path}?v=${stamp}`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : fallback))
    .catch(() => fallback);

  return Promise.all([
    loadFile("data/easy.json", EMBEDDED_QUESTIONS.easy),
    loadFile("data/medium.json", EMBEDDED_QUESTIONS.medium),
    loadFile("data/hard.json", EMBEDDED_QUESTIONS.hard),
  ]).then(([easy, medium, hard]) => {
    state.data = { easy, medium, hard };
    buildQuestionIndex();
  });
}

renderAppVersion();

loadQuestions().then(() => {
  bindGlobalEvents();
  updateScoreboard();
  renderStartScreen();
});

function resetGameState() {
  clearTimers();
  closeModal();
  state.scores = [0, 0];
  state.activeTeam = 0;
  state.mode = null;
  state.topics = [];
  state.usedQuestions = new Set();
  state.classic = null;
  state.super = null;
  state.risk = null;
  state.auction = null;
  state.suddenReveal = false;
  if (state.data) {
    buildQuestionIndex();
  }
  updateScoreboard();
  updateIndicators();
}

function setSuperStartingTeam() {
  if (!state.super) return;
  // Round 1 starts Team A, Round 2 starts Team B, then alternates every round.
  state.super.superStartingTeamForRound = state.super.superRoundNumber % 2 === 1 ? 0 : 1;
}

function updateSuperActiveTeam() {
  if (!state.super) return;
  // Within a round, picks alternate by parity:
  // pick 0 starter, pick 1 other team, pick 2 starter, pick 3 other team.
  state.activeTeam = (state.super.superStartingTeamForRound + state.super.superPickIndexWithinRound) % 2;
  updateScoreboard();
}
