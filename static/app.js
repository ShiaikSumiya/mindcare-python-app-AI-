const STORAGE_KEY = "mindcare.student.accounts.v3";
const KNOWLEDGE_KEY = "mindcare.knowledge.base.v1";
const MIN_AGE = 13;
const MAX_AGE = 25;

const THERAPIST_ACCOUNT = {
  email: "therapist@mindcare.com",
  password: "Therapist@123",
  name: "Dr. Admin Therapist",
};

const DEFAULT_KNOWLEDGE = [
  {
    id: "k1",
    category: "Stress",
    question: "I am feeling stressed",
    answer: "Stress can feel overwhelming, especially for students. Start by slowing your breathing, picking one small task, and reminding yourself that you only need to take the next step, not solve everything right now.",
  },
  {
    id: "k2",
    category: "Anxiety",
    question: "I have anxiety",
    answer: "Anxiety often becomes smaller when you ground yourself in the present moment. Try noticing 5 things you can see, 4 you can feel, and 3 you can hear while breathing slowly.",
  },
  {
    id: "k3",
    category: "Depression",
    question: "I feel depressed",
    answer: "Low mood can make even simple things feel heavy. Be gentle with yourself, do one tiny caring action, and reach out to someone safe if you can.",
  },
  {
    id: "k4",
    category: "Sleep",
    question: "I cannot sleep",
    answer: "Sleep problems can make everything harder. Keep your room cool and dark, avoid your phone before bed, and try breathing slowly while lying down.",
  },
  {
    id: "k5",
    category: "Loneliness",
    question: "I feel lonely",
    answer: "Loneliness hurts, but it does not mean you are unwanted. One small social step like sending a message or joining a study group can help you feel less alone.",
  },
  {
    id: "k6",
    category: "Academic",
    question: "I am struggling with my studies",
    answer: "When studies feel heavy, break the work into one short task, one short break, and one realistic goal for today. Progress matters more than perfection.",
  },
  {
    id: "k7",
    category: "Coping",
    question: "How can I feel better",
    answer: "Focus on basics first: breathing, water, movement, rest, and one supportive conversation. Small actions can create real emotional change.",
  },
  {
    id: "k8",
    category: "Crisis",
    question: "I want to hurt myself",
    answer: "If you may hurt yourself or someone else, please contact a trusted person, local emergency services, or a crisis helpline immediately. Real human support is the safest next step right now.",
  },
];

const state = {
  mode: "register",
  currentAccountId: null,
  currentAccount: null,
  key: null,
  vault: null,
  therapistView: "dashboard",
};

const elements = {
  authScreen: document.getElementById("authScreen"),
  studentWorkspace: document.getElementById("studentWorkspace"),
  therapistWorkspace: document.getElementById("therapistWorkspace"),
  registerTab: document.getElementById("registerTab"),
  therapistLoginTab: document.getElementById("therapistLoginTab"),
  showStudentLoginLink: document.getElementById("showStudentLoginLink"),
  showRegisterLink: document.getElementById("showRegisterLink"),
  registerForm: document.getElementById("registerForm"),
  studentLoginForm: document.getElementById("studentLoginForm"),
  therapistLoginForm: document.getElementById("therapistLoginForm"),
  registerName: document.getElementById("registerName"),
  registerUsername: document.getElementById("registerUsername"),
  registerEmail: document.getElementById("registerEmail"),
  registerAge: document.getElementById("registerAge"),
  registerGender: document.getElementById("registerGender"),
  registerInstitution: document.getElementById("registerInstitution"),
  registerCourse: document.getElementById("registerCourse"),
  registerPassword: document.getElementById("registerPassword"),
  registerConfirm: document.getElementById("registerConfirm"),
  registerAnonymous: document.getElementById("registerAnonymous"),
  registerMessage: document.getElementById("registerMessage"),
  studentLoginIdentifier: document.getElementById("studentLoginIdentifier"),
  studentLoginPassword: document.getElementById("studentLoginPassword"),
  studentLoginMessage: document.getElementById("studentLoginMessage"),
  therapistLoginEmail: document.getElementById("therapistLoginEmail"),
  therapistLoginPassword: document.getElementById("therapistLoginPassword"),
  therapistLoginMessage: document.getElementById("therapistLoginMessage"),
  anonymousBadge: document.getElementById("anonymousBadge"),
  newChatButton: document.getElementById("newChatButton"),
  studentLogoutButton: document.getElementById("studentLogoutButton"),
  chatMessages: document.getElementById("chatMessages"),
  responseChips: document.getElementById("responseChips"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  analysisTime: document.getElementById("analysisTime"),
  statusCard: document.getElementById("statusCard"),
  statusEmoji: document.getElementById("statusEmoji"),
  statusText: document.getElementById("statusText"),
  confidenceText: document.getElementById("confidenceText"),
  wellnessRing: document.getElementById("wellnessRing"),
  wellnessScore: document.getElementById("wellnessScore"),
  wellnessLabel: document.getElementById("wellnessLabel"),
  stressBar: document.getElementById("stressBar"),
  anxietyBar: document.getElementById("anxietyBar"),
  depressionBar: document.getElementById("depressionBar"),
  lonelinessBar: document.getElementById("lonelinessBar"),
  angerBar: document.getElementById("angerBar"),
  stressValue: document.getElementById("stressValue"),
  anxietyValue: document.getElementById("anxietyValue"),
  depressionValue: document.getElementById("depressionValue"),
  lonelinessValue: document.getElementById("lonelinessValue"),
  angerValue: document.getElementById("angerValue"),
  suggestionTitle: document.getElementById("suggestionTitle"),
  summaryText: document.getElementById("summaryText"),
  suggestionList: document.getElementById("suggestionList"),
  alertBanner: document.getElementById("alertBanner"),
  dashboardNav: document.getElementById("dashboardNav"),
  trainNav: document.getElementById("trainNav"),
  reportsNav: document.getElementById("reportsNav"),
  therapistLogoutButton: document.getElementById("therapistLogoutButton"),
  dashboardView: document.getElementById("dashboardView"),
  trainView: document.getElementById("trainView"),
  reportsView: document.getElementById("reportsView"),
  addTemplateButton: document.getElementById("addTemplateButton"),
  registeredStudentsMetric: document.getElementById("registeredStudentsMetric"),
  chatSessionsMetric: document.getElementById("chatSessionsMetric"),
  crisisAlertsMetric: document.getElementById("crisisAlertsMetric"),
  trainedQaMetric: document.getElementById("trainedQaMetric"),
  crisisAlertList: document.getElementById("crisisAlertList"),
  riskDistribution: document.getElementById("riskDistribution"),
  recentSessionsTable: document.getElementById("recentSessionsTable"),
  knowledgeForm: document.getElementById("knowledgeForm"),
  knowledgeCategory: document.getElementById("knowledgeCategory"),
  knowledgeQuestion: document.getElementById("knowledgeQuestion"),
  knowledgeAnswer: document.getElementById("knowledgeAnswer"),
  knowledgeMessage: document.getElementById("knowledgeMessage"),
  knowledgeCountLabel: document.getElementById("knowledgeCountLabel"),
  knowledgeList: document.getElementById("knowledgeList"),
  reportSessions: document.getElementById("reportSessions"),
  reportUsers: document.getElementById("reportUsers"),
  reportMessages: document.getElementById("reportMessages"),
  reportMood: document.getElementById("reportMood"),
  reportCritical: document.getElementById("reportCritical"),
  reportAnonymous: document.getElementById("reportAnonymous"),
  issueCards: document.getElementById("issueCards"),
  dashboardSubtitle: document.getElementById("dashboardSubtitle"),
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

initialize();

function initialize() {
  ensureKnowledgeBase();
  bindEvents();
  setMode(getAccounts().length ? "studentLogin" : "register");
  showAuth();
}

function bindEvents() {
  elements.registerTab.addEventListener("click", () => setMode("register"));
  elements.therapistLoginTab.addEventListener("click", () => setMode("therapistLogin"));
  elements.showStudentLoginLink.addEventListener("click", () => setMode("studentLogin"));
  elements.showRegisterLink.addEventListener("click", () => setMode("register"));
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.studentLoginForm.addEventListener("submit", handleStudentLogin);
  elements.therapistLoginForm.addEventListener("submit", handleTherapistLogin);
  elements.chatForm.addEventListener("submit", handleChatSubmit);
  elements.newChatButton.addEventListener("click", startNewChat);
  elements.studentLogoutButton.addEventListener("click", logoutToAuth);
  elements.therapistLogoutButton.addEventListener("click", logoutToAuth);
  elements.dashboardNav.addEventListener("click", () => setTherapistView("dashboard"));
  elements.trainNav.addEventListener("click", () => setTherapistView("train"));
  elements.reportsNav.addEventListener("click", () => setTherapistView("reports"));
  elements.addTemplateButton.addEventListener("click", () => setTherapistView("train"));
  elements.knowledgeForm.addEventListener("submit", handleKnowledgeSubmit);

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      elements.chatInput.value = chip.dataset.prompt || "";
      elements.chatInput.focus();
    });
  });

  elements.responseChips.addEventListener("click", (event) => {
    const button = event.target.closest(".reply-chip");
    if (!button) {
      return;
    }
    elements.chatInput.value = button.dataset.prompt || "";
    elements.chatInput.focus();
  });
}

function setMode(mode) {
  state.mode = mode;
  elements.registerTab.classList.toggle("auth-tab--active", mode === "register");
  elements.therapistLoginTab.classList.toggle("auth-tab--active", mode === "therapistLogin");
  elements.registerForm.classList.toggle("hidden", mode !== "register");
  elements.studentLoginForm.classList.toggle("hidden", mode !== "studentLogin");
  elements.therapistLoginForm.classList.toggle("hidden", mode !== "therapistLogin");
}

async function handleRegister(event) {
  event.preventDefault();

  const name = elements.registerName.value.trim();
  const username = elements.registerUsername.value.trim();
  const email = normalize(elements.registerEmail.value);
  const age = Number(elements.registerAge.value);
  const gender = elements.registerGender.value;
  const institution = elements.registerInstitution.value.trim();
  const course = elements.registerCourse.value.trim();
  const password = elements.registerPassword.value;
  const confirm = elements.registerConfirm.value;
  const anonymousMode = elements.registerAnonymous.checked;

  if (!name || !email || !age || !institution || !course || !password || !confirm) {
    setMessage(elements.registerMessage, "Please complete all required registration fields.", "error");
    return;
  }

  if (age < MIN_AGE || age > MAX_AGE) {
    setMessage(elements.registerMessage, `Only students aged ${MIN_AGE} to ${MAX_AGE} can use this app.`, "error");
    return;
  }

  if (password.length < 8) {
    setMessage(elements.registerMessage, "Password must contain at least 8 characters.", "error");
    return;
  }

  if (password !== confirm) {
    setMessage(elements.registerMessage, "Password and confirm password do not match.", "error");
    return;
  }

  const usernameKey = normalize(username);
  const accounts = getAccounts();
  if (accounts.some((account) => account.email === email || (usernameKey && account.usernameKey === usernameKey))) {
    setMessage(elements.registerMessage, "This username or email is already registered.", "error");
    return;
  }

  try {
    const authSalt = crypto.getRandomValues(new Uint8Array(16));
    const vaultSalt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await deriveHash(password, authSalt);
    const key = await deriveKey(password, vaultSalt);
    const vault = createInitialVault({
      name,
      username,
      email,
      age,
      gender,
      institution,
      course,
    }, anonymousMode);
    const encryptedVault = await encryptJson(vault, key);

    const account = {
      id: crypto.randomUUID(),
      email,
      usernameKey,
      authSalt: bytesToBase64(authSalt),
      passwordHash,
      vaultSalt: bytesToBase64(vaultSalt),
      encryptedVault,
      analyticsPreview: createAnalyticsPreview(vault, anonymousMode),
      createdAt: new Date().toISOString(),
    };

    accounts.push(account);
    saveAccounts(accounts);

    state.currentAccountId = account.id;
    state.currentAccount = account;
    state.key = key;
    state.vault = vault;

    elements.registerForm.reset();
    renderStudentWorkspace();
  } catch (error) {
    console.error(error);
    setMessage(elements.registerMessage, "Registration failed. Please try again.", "error");
  }
}

async function handleStudentLogin(event) {
  event.preventDefault();

  const identifier = normalize(elements.studentLoginIdentifier.value);
  const password = elements.studentLoginPassword.value;

  if (!identifier || !password) {
    setMessage(elements.studentLoginMessage, "Enter your username or email and password.", "error");
    return;
  }

  const account = getAccounts().find((item) => item.email === identifier || item.usernameKey === identifier);
  if (!account) {
    setMessage(elements.studentLoginMessage, "Connection failed. Username or password does not match registration details.", "error");
    return;
  }

  try {
    const passwordHash = await deriveHash(password, base64ToBytes(account.authSalt));
    if (passwordHash !== account.passwordHash) {
      setMessage(elements.studentLoginMessage, "Connection failed. Username or password does not match registration details.", "error");
      return;
    }

    const key = await deriveKey(password, base64ToBytes(account.vaultSalt));
    const vault = await decryptJson(account.encryptedVault, key);

    state.currentAccountId = account.id;
    state.currentAccount = account;
    state.key = key;
    state.vault = vault;

    renderStudentWorkspace();
  } catch (error) {
    console.error(error);
    setMessage(elements.studentLoginMessage, "Connection failed. Username or password does not match registration details.", "error");
  }
}

function handleTherapistLogin(event) {
  event.preventDefault();

  const email = normalize(elements.therapistLoginEmail.value);
  const password = elements.therapistLoginPassword.value;

  if (email !== THERAPIST_ACCOUNT.email || password !== THERAPIST_ACCOUNT.password) {
    setMessage(elements.therapistLoginMessage, "Therapist connection failed. Invalid therapist credentials.", "error");
    return;
  }

  renderTherapistWorkspace();
}

async function handleChatSubmit(event) {
  event.preventDefault();

  if (!state.vault) {
    return;
  }

  const text = elements.chatInput.value.trim();
  if (!text) {
    return;
  }

  appendMessage("user", text);
  const analysis = analyzeConversation(state.vault.chatMessages);
  const reply = buildAssistantReply(analysis, text);
  appendMessage("assistant", reply);
  state.vault.analysis = analysis;

  elements.chatInput.value = "";
  await persistStudentVault();
  renderStudentWorkspace();
}

async function startNewChat() {
  if (!state.vault) {
    return;
  }

  state.vault.chatMessages = [createWelcomeMessage()];
  state.vault.analysis = createBaseAnalysis();
  await persistStudentVault();
  renderStudentWorkspace();
}

function logoutToAuth() {
  state.currentAccountId = null;
  state.currentAccount = null;
  state.key = null;
  state.vault = null;
  state.therapistView = "dashboard";
  elements.studentLoginPassword.value = "";
  elements.therapistLoginPassword.value = "";
  setMode("studentLogin");
  showAuth();
}

function showAuth() {
  elements.authScreen.classList.remove("hidden");
  elements.studentWorkspace.classList.add("hidden");
  elements.therapistWorkspace.classList.add("hidden");
}

function renderStudentWorkspace() {
  elements.authScreen.classList.add("hidden");
  elements.studentWorkspace.classList.remove("hidden");
  elements.therapistWorkspace.classList.add("hidden");

  const { profile, preferences, chatMessages, analysis } = state.vault;
  elements.anonymousBadge.textContent = preferences.anonymousMode ? "Anonymous" : (profile.username || profile.name);
  renderMessages(chatMessages);
  renderResponseChips(analysis.followUps);
  renderAnalysis(analysis, chatMessages.filter((message) => message.role === "user").length);
}

function renderTherapistWorkspace() {
  elements.authScreen.classList.add("hidden");
  elements.studentWorkspace.classList.add("hidden");
  elements.therapistWorkspace.classList.remove("hidden");
  setTherapistView(state.therapistView);
}

function setTherapistView(view) {
  state.therapistView = view;
  elements.dashboardNav.classList.toggle("nav-button--active", view === "dashboard");
  elements.trainNav.classList.toggle("nav-button--active", view === "train");
  elements.reportsNav.classList.toggle("nav-button--active", view === "reports");
  elements.dashboardView.classList.toggle("hidden", view !== "dashboard");
  elements.trainView.classList.toggle("hidden", view !== "train");
  elements.reportsView.classList.toggle("hidden", view !== "reports");

  if (view === "dashboard" || view === "reports") {
    renderTherapistAnalytics();
  }

  if (view === "train") {
    renderKnowledgeBase();
  }
}

function renderMessages(messages) {
  elements.chatMessages.innerHTML = messages.map((message) => `
    <article class="message message--${message.role}">
      <p class="message-time">${escapeHtml(formatTime(message.createdAt))}</p>
      <div class="bubble">${escapeHtml(message.text)}</div>
    </article>
  `).join("");

  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function renderResponseChips(chips) {
  elements.responseChips.innerHTML = chips.map((chip) => `
    <button class="reply-chip" type="button" data-prompt="${escapeHtmlAttribute(chip)}">${escapeHtml(chip)}</button>
  `).join("");
}

function renderAnalysis(analysis, userMessageCount) {
  elements.analysisTime.textContent = formatTime(new Date().toISOString());
  elements.statusEmoji.textContent = analysis.emoji;
  elements.statusText.textContent = analysis.status;
  elements.confidenceText.textContent = `Confidence: ${analysis.accuracy}% | ${userMessageCount} msgs`;
  elements.confidenceText.className = `status-subtext ${accuracyClass(analysis.accuracy)}`;
  elements.statusCard.className = `status-card ${statusCardClass(analysis.accuracy)}`;
  elements.wellnessScore.textContent = String(analysis.wellness);
  elements.wellnessLabel.textContent = analysis.wellnessLabel;
  elements.wellnessRing.className = `wellness-ring ${ringClass(analysis.wellness)}`;

  setBar(elements.stressBar, elements.stressValue, analysis.stress);
  setBar(elements.anxietyBar, elements.anxietyValue, analysis.anxiety);
  setBar(elements.depressionBar, elements.depressionValue, analysis.depression);
  setBar(elements.lonelinessBar, elements.lonelinessValue, analysis.loneliness);
  setBar(elements.angerBar, elements.angerValue, analysis.anger);

  elements.suggestionTitle.textContent = analysis.planTitle;
  elements.summaryText.textContent = analysis.summary;
  elements.suggestionList.innerHTML = analysis.suggestions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  elements.alertBanner.classList.toggle("hidden", !analysis.alert);
}

function renderTherapistAnalytics() {
  const accounts = getAccounts();
  const previews = accounts.map((account, index) => ({
    id: index + 1,
    name: account.analyticsPreview?.displayName || "Anonymous",
    messages: account.analyticsPreview?.messageCount || 0,
    riskLevel: account.analyticsPreview?.riskLevel || "Low",
    wellness: account.analyticsPreview?.wellness ?? 100,
    anonymous: account.analyticsPreview?.anonymousMode ?? false,
    alert: account.analyticsPreview?.alert ?? false,
    updatedAt: account.updatedAt || account.createdAt,
    issues: account.analyticsPreview?.issues || {},
    accuracy: account.analyticsPreview?.accuracy || 0,
  })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const activeAlerts = previews.filter((item) => item.alert);
  elements.dashboardSubtitle.textContent = `Welcome back, ${THERAPIST_ACCOUNT.name} | ${new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(new Date())}`;
  elements.registeredStudentsMetric.textContent = String(previews.length);
  elements.chatSessionsMetric.textContent = String(previews.filter((item) => item.messages > 0).length);
  elements.crisisAlertsMetric.textContent = String(activeAlerts.length);
  elements.trainedQaMetric.textContent = String(getKnowledgeBase().length);

  elements.crisisAlertList.innerHTML = activeAlerts.length
    ? activeAlerts.map((alert) => `<p><strong>${escapeHtml(alert.name)}</strong> requires review. Risk level: ${escapeHtml(alert.riskLevel)}.</p>`).join("")
    : "<p>No active crisis alerts. All clear.</p>";

  renderRiskDistribution(previews);
  renderRecentSessions(previews);
  renderReports(previews);
}

function renderRiskDistribution(previews) {
  const counts = {
    Low: previews.filter((item) => item.riskLevel === "Low").length,
    Medium: previews.filter((item) => item.riskLevel === "Medium").length,
    High: previews.filter((item) => item.riskLevel === "High").length,
    Critical: previews.filter((item) => item.riskLevel === "Critical").length,
  };
  const total = Math.max(previews.length, 1);

  elements.riskDistribution.innerHTML = Object.entries(counts).map(([label, count]) => `
    <div class="distribution-row">
      <span>${label}</span>
      <div class="distribution-bar"><div class="distribution-fill fill-${label.toLowerCase()}" style="width:${(count / total) * 100}%"></div></div>
      <strong>${count}</strong>
    </div>
  `).join("");
}

function renderRecentSessions(previews) {
  elements.recentSessionsTable.innerHTML = previews.length
    ? previews.slice(0, 10).map((item) => `
      <tr>
        <td>#${item.id}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${item.messages}</td>
        <td><span class="risk-pill ${item.riskLevel.toLowerCase()}">${item.riskLevel}</span></td>
        <td>${item.wellness}</td>
        <td>${item.anonymous ? "Anonymous" : "Registered"}</td>
        <td>${escapeHtml(formatDate(item.updatedAt))}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="7">No student sessions yet.</td></tr>';
}

function renderReports(previews) {
  const totalMessages = previews.reduce((sum, item) => sum + item.messages, 0);
  const avgMood = previews.length ? Math.round(previews.reduce((sum, item) => sum + item.wellness, 0) / previews.length) : 0;
  const anonymousCount = previews.filter((item) => item.anonymous).length;
  const criticalCount = previews.filter((item) => item.riskLevel === "Critical").length;

  const issues = { Stress: 0, Anxiety: 0, Depression: 0, Sleep: 0, Loneliness: 0, Academic: 0 };
  previews.forEach((item) => {
    Object.entries(item.issues).forEach(([key, value]) => {
      if (issues[key] !== undefined) {
        issues[key] += value;
      }
    });
  });

  elements.reportSessions.textContent = String(previews.filter((item) => item.messages > 0).length);
  elements.reportUsers.textContent = String(previews.length);
  elements.reportMessages.textContent = String(totalMessages);
  elements.reportMood.textContent = String(avgMood);
  elements.reportCritical.textContent = String(criticalCount);
  elements.reportAnonymous.textContent = String(anonymousCount);

  const maxIssue = Math.max(...Object.values(issues), 1);
  elements.issueCards.innerHTML = Object.entries(issues).map(([label, value]) => `
    <article class="issue-card">
      <strong>${value}</strong>
      <span>${label}</span>
      <div class="issue-meter"><div style="width:${(value / maxIssue) * 100}%"></div></div>
    </article>
  `).join("");
}

async function handleKnowledgeSubmit(event) {
  event.preventDefault();

  const category = elements.knowledgeCategory.value;
  const question = elements.knowledgeQuestion.value.trim();
  const answer = elements.knowledgeAnswer.value.trim();

  if (!question || !answer) {
    setMessage(elements.knowledgeMessage, "Enter both a user phrase and a bot response.", "error");
    return;
  }

  const knowledgeBase = getKnowledgeBase();
  knowledgeBase.unshift({
    id: crypto.randomUUID(),
    category,
    question,
    answer,
  });
  saveKnowledgeBase(knowledgeBase);

  elements.knowledgeForm.reset();
  setMessage(elements.knowledgeMessage, "Knowledge base updated successfully.", "success");
  renderKnowledgeBase();
  renderTherapistAnalytics();
}

function renderKnowledgeBase() {
  const knowledgeBase = getKnowledgeBase();
  elements.knowledgeCountLabel.textContent = `${knowledgeBase.length} entries`;
  elements.knowledgeList.innerHTML = knowledgeBase.map((item) => `
    <article class="knowledge-item">
      <span class="knowledge-tag">${escapeHtml(item.category)}</span>
      <strong>${escapeHtml(item.question)}</strong>
      <p>${escapeHtml(item.answer)}</p>
    </article>
  `).join("");
}

async function persistStudentVault() {
  if (!state.currentAccountId || !state.key || !state.vault) {
    return;
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.id === state.currentAccountId);
  if (index === -1) {
    return;
  }

  accounts[index] = {
    ...accounts[index],
    encryptedVault: await encryptJson(state.vault, state.key),
    analyticsPreview: createAnalyticsPreview(state.vault, state.vault.preferences.anonymousMode),
    updatedAt: new Date().toISOString(),
  };

  state.currentAccount = accounts[index];
  saveAccounts(accounts);
}

function createInitialVault(profile, anonymousMode) {
  return {
    profile,
    preferences: { anonymousMode },
    chatMessages: [createWelcomeMessage()],
    analysis: createBaseAnalysis(),
    version: 1,
  };
}

function createWelcomeMessage() {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    createdAt: new Date().toISOString(),
    text: "This is a safe and private space. I will listen and support you without judgment. The panel on the right will analyze your session live and suggest personalized positive solutions. How are you feeling today?",
  };
}

function createBaseAnalysis() {
  return {
    emoji: "🙂",
    status: "Ready",
    wellness: 100,
    wellnessLabel: "Mood Stable",
    accuracy: 0,
    stress: 0,
    anxiety: 0,
    depression: 0,
    loneliness: 0,
    anger: 0,
    alert: false,
    riskLevel: "Low",
    planTitle: "Support Plan",
    summary: "Chat with the bot and your personalized suggestions will appear here.",
    suggestions: [
      "Share a few sentences about your current situation.",
      "The app will calculate output and accuracy rate.",
    ],
    followUps: [
      "I feel stressed",
      "I feel anxious",
      "I feel depressed",
      "I feel lonely",
      "I cannot sleep",
      "I need coping tips",
    ],
    issueCounts: {
      Stress: 0,
      Anxiety: 0,
      Depression: 0,
      Sleep: 0,
      Loneliness: 0,
      Academic: 0,
    },
  };
}

function analyzeConversation(messages) {
  const userMessages = messages.filter((message) => message.role === "user");
  if (!userMessages.length) {
    return createBaseAnalysis();
  }

  const text = userMessages.map((message) => message.text.toLowerCase()).join(" ");
  const stressMatches = countMatches(text, /\bstress|stressed|pressure|exam|deadline|study|studies|assignment|workload|focus|overwhelmed\b/g);
  const anxietyMatches = countMatches(text, /\banxious|anxiety|panic|nervous|worried|fear|restless\b/g);
  const depressionMatches = countMatches(text, /\bdepressed|depression|sad|low|hopeless|empty|worthless|crying\b/g);
  const lonelinessMatches = countMatches(text, /\blonely|alone|isolated|rejected|no friends|homesick\b/g);
  const angerMatches = countMatches(text, /\bangry|anger|frustrated|irritated|furious\b/g);
  const sleepMatches = countMatches(text, /\bsleep|insomnia|awake|nightmares|tired|fatigue\b/g);
  const academicMatches = countMatches(text, /\bexam|study|studies|assignment|marks|grade|semester|class\b/g);
  const riskMatches = countMatches(text, /\bsuicide|kill myself|hurt myself|self harm|end my life|harm someone\b/g);
  const detailMatches = countMatches(text, /\b\d+\s*(hours|hour|days|day|weeks|week)|because|since|after|before|cannot|can't\b/g);

  const stress = clamp(stressMatches * 18 + sleepMatches * 6 + academicMatches * 4, 0, 100);
  const anxiety = clamp(anxietyMatches * 20 + stressMatches * 6, 0, 100);
  const depression = clamp(depressionMatches * 22 + lonelinessMatches * 8, 0, 100);
  const loneliness = clamp(lonelinessMatches * 22, 0, 100);
  const anger = clamp(angerMatches * 22, 0, 100);
  const accuracy = clamp(40 + Math.min(userMessages.length * 9, 24) + Math.min(detailMatches * 7, 30), 20, 96);
  const totalLoad = Math.round((stress + anxiety + depression + loneliness + anger) / 5);
  const wellness = clamp(100 - totalLoad - Math.min(sleepMatches * 5, 14) - (riskMatches ? 24 : 0), 5, 98);
  const alert = riskMatches > 0;

  let riskLevel = "Low";
  if (alert) {
    riskLevel = "Critical";
  } else if (accuracy < 45 || totalLoad >= 65) {
    riskLevel = "High";
  } else if (accuracy < 70 || totalLoad >= 35) {
    riskLevel = "Medium";
  }

  const dominant = getDominantIndicator({ stress, anxiety, depression, loneliness, anger, sleep: sleepMatches * 16 });

  let status = "Mood Stable";
  let emoji = "🙂";
  let planTitle = "Positive Support Plan";

  if (alert) {
    status = "High Risk";
    emoji = "🚨";
    planTitle = "Immediate Safety Plan";
  } else if (dominant === "stress") {
    status = "Stress Present";
    emoji = "😟";
    planTitle = "Stress Relief Plan";
  } else if (dominant === "anxiety") {
    status = "Anxiety Present";
    emoji = "😰";
    planTitle = "Anxiety Support Plan";
  } else if (dominant === "depression") {
    status = "Low Mood Present";
    emoji = "😔";
    planTitle = "Mood Recovery Plan";
  } else if (dominant === "loneliness") {
    status = "Loneliness Present";
    emoji = "😶";
    planTitle = "Connection Plan";
  } else if (dominant === "anger") {
    status = "Anger Present";
    emoji = "😠";
    planTitle = "Calm Response Plan";
  }

  const wellnessLabel = wellness >= 85 ? "Mood Stable" : wellness >= 60 ? "Needs Support" : "Support Needed";

  return {
    emoji,
    status,
    wellness,
    wellnessLabel,
    accuracy,
    stress,
    anxiety,
    depression,
    loneliness,
    anger,
    alert,
    riskLevel,
    planTitle,
    summary: buildSummary(status, dominant, wellness, accuracy, riskLevel),
    suggestions: buildSuggestions({ dominant, alert, sleepMatches }),
    followUps: buildFollowUps(dominant, alert),
    issueCounts: {
      Stress: stressMatches,
      Anxiety: anxietyMatches,
      Depression: depressionMatches,
      Sleep: sleepMatches,
      Loneliness: lonelinessMatches,
      Academic: academicMatches,
    },
  };
}

function buildSummary(status, dominant, wellness, accuracy, riskLevel) {
  if (status === "High Risk") {
    return "Urgent support is recommended. The chatbot detected high-risk language and the safest next step is immediate human help.";
  }

  if (dominant === "stress") {
    return `Stress is present. Wellness score is ${wellness}, risk level is ${riskLevel}, and the current accuracy rate is ${accuracy}%. Small structured actions can help you feel more in control.`;
  }

  if (dominant === "anxiety") {
    return `Anxiety signals are present. Your output suggests mental overload, but the situation can improve with calming routines and supportive check-ins. Accuracy is ${accuracy}%.`;
  }

  if (dominant === "depression") {
    return `Low mood indicators were detected. Gentle support, rest, connection, and one manageable task can help you move toward a more positive state. Accuracy is ${accuracy}%.`;
  }

  if (dominant === "loneliness") {
    return `Loneliness indicators are showing up. Reaching out is a strong first step, and building one small social connection can help reduce this feeling. Accuracy is ${accuracy}%.`;
  }

  if (dominant === "anger") {
    return `Frustration or anger is present. Slowing down before reacting can help you regain emotional balance. Accuracy is ${accuracy}%.`;
  }

  return `Your overall mood looks relatively stable. Keep sharing details if you want more accurate emotional analysis and tailored suggestions. Current accuracy is ${accuracy}%.`;
}

function buildSuggestions({ dominant, alert, sleepMatches }) {
  if (alert) {
    return [
      "Contact a trusted person, counselor, guardian, or emergency support immediately.",
      "Do not stay alone if you feel unsafe.",
      "Move away from anything that could be used for self-harm.",
    ];
  }

  const suggestions = [];

  if (dominant === "stress") {
    suggestions.push("Take 5 deep slow breaths right now.");
    suggestions.push("Write down your top 3 worries and circle only 1 task to start.");
    suggestions.push("Work for 20 minutes, then take a 5-minute break.");
  } else if (dominant === "anxiety") {
    suggestions.push("Name 5 things you can see, 4 you can feel, and 3 you can hear.");
    suggestions.push("Slow your breathing by making the exhale longer than the inhale.");
    suggestions.push("Remind yourself that you can take one small step, not solve everything at once.");
  } else if (dominant === "depression") {
    suggestions.push("Start with one tiny positive action like washing your face or drinking water.");
    suggestions.push("Message one trusted friend or family member today.");
    suggestions.push("Choose one manageable task so the day feels less heavy.");
  } else if (dominant === "loneliness") {
    suggestions.push("Talk to one classmate, friend, or family member today, even briefly.");
    suggestions.push("Join one study group or campus activity when possible.");
    suggestions.push("Remind yourself that feeling lonely does not mean you are unwanted.");
  } else if (dominant === "anger") {
    suggestions.push("Pause before responding and take 10 slow breaths.");
    suggestions.push("Step away from the trigger for a few minutes if you can.");
    suggestions.push("Write your feelings first, then decide how to respond calmly.");
  } else {
    suggestions.push("Keep noticing what is helping you stay stable.");
    suggestions.push("Maintain sleep, hydration, and small daily routines.");
    suggestions.push("Reach out early if stress starts building up.");
  }

  if (sleepMatches > 0) {
    suggestions.push("Keep your phone away 1 hour before sleep and wake up at the same time each day.");
  }

  return suggestions.slice(0, 4);
}

function buildFollowUps(dominant, alert) {
  if (alert) {
    return [
      "Call for help now",
      "I need emergency support",
      "Please guide me to a trusted adult",
    ];
  }

  if (dominant === "stress") {
    return ["What causes your stress?", "My studies are overwhelming", "How to manage stress?", "I also feel anxious"];
  }

  if (dominant === "anxiety") {
    return ["How do I calm down?", "I panic before exams", "I feel nervous in class", "Help me breathe slowly"];
  }

  if (dominant === "depression") {
    return ["I have no motivation", "I feel empty", "How can I feel better?", "I cannot focus anymore"];
  }

  if (dominant === "loneliness") {
    return ["I have no friends", "How to make friends?", "I feel rejected", "I feel lonely in college"];
  }

  return ["I feel stressed", "I feel anxious", "I feel lonely", "I cannot sleep"];
}

function buildAssistantReply(analysis, latestText) {
  const kbReply = findKnowledgeBaseReply(latestText);
  if (kbReply) {
    return kbReply;
  }

  if (analysis.alert) {
    return "I am really concerned about your safety. Please contact a trusted person, counselor, guardian, or emergency support right now. You do not have to handle this alone.";
  }

  if (analysis.status === "Stress Present") {
    return "I understand you are feeling stressed. That is very common for students. You can overcome this step by step. Let us reduce the pressure by focusing on one small task, one calming breath cycle, and one positive thought: you do not have to do everything at once.";
  }

  if (analysis.status === "Anxiety Present") {
    return "It sounds like anxiety is showing up strongly right now. That does not mean you are weak. Your body may be on high alert, but it can settle. Let us slow things down, breathe gently, and take one manageable next step together.";
  }

  if (analysis.status === "Low Mood Present") {
    return "I am sorry this feels heavy. Even when your mood is low, small positive actions can still help. Be gentle with yourself, choose one tiny task, and remember that difficult feelings can change with support and time.";
  }

  if (analysis.status === "Loneliness Present") {
    return "Loneliness can feel very painful, especially as a student. Reaching out here already shows courage. You deserve connection, and one small conversation with a classmate, friend, or family member can be a good positive first step.";
  }

  if (analysis.status === "Anger Present") {
    return "It sounds like frustration is building up. That happens sometimes when stress piles up. Let us pause, breathe, and respond with care so this feeling does not control the next moment.";
  }

  return "Thank you for sharing. You are doing something positive by talking about your feelings. Keep going, and I will continue to support you with suggestions and live analysis.";
}

function findKnowledgeBaseReply(text) {
  const normalized = text.toLowerCase();
  const entries = getKnowledgeBase();
  for (const entry of entries) {
    const question = entry.question.toLowerCase();
    if (normalized.includes(question) || question.split(" ").some((word) => word.length > 4 && normalized.includes(word))) {
      return entry.answer;
    }
  }
  return null;
}

function createAnalyticsPreview(vault, anonymousMode) {
  const profile = vault.profile;
  const analysis = vault.analysis || createBaseAnalysis();
  const userMessages = vault.chatMessages.filter((message) => message.role === "user");
  return {
    displayName: anonymousMode ? "Anonymous" : (profile.username || profile.name),
    anonymousMode,
    messageCount: userMessages.length,
    riskLevel: analysis.riskLevel,
    wellness: analysis.wellness,
    accuracy: analysis.accuracy,
    alert: analysis.alert,
    issues: analysis.issueCounts || {},
  };
}

function setBar(fillElement, valueElement, value) {
  fillElement.style.width = `${value}%`;
  valueElement.textContent = String(value);
}

function accuracyClass(accuracy) {
  if (accuracy >= 70) return "accuracy-high";
  if (accuracy >= 45) return "accuracy-medium";
  return "accuracy-low";
}

function statusCardClass(accuracy) {
  if (accuracy >= 70) return "status-card--high";
  if (accuracy >= 45) return "status-card--medium";
  return "status-card--low";
}

function ringClass(wellness) {
  if (wellness >= 80) return "";
  if (wellness >= 55) return "ring-medium";
  return "ring-low";
}

function getDominantIndicator(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function appendMessage(role, text) {
  state.vault.chatMessages.push({
    id: crypto.randomUUID(),
    role,
    text,
    createdAt: new Date().toISOString(),
  });
}

function ensureKnowledgeBase() {
  if (!localStorage.getItem(KNOWLEDGE_KEY)) {
    saveKnowledgeBase(DEFAULT_KNOWLEDGE);
  }
}

function getAccounts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function getKnowledgeBase() {
  const raw = localStorage.getItem(KNOWLEDGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveKnowledgeBase(entries) {
  localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(entries));
}

function setMessage(element, message, type = "default") {
  element.textContent = message;
  element.className = `form-message${type === "error" ? " error-message" : ""}${type === "success" ? " success-message" : ""}`;
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

async function deriveHash(password, salt) {
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return bytesToBase64(new Uint8Array(bits));
}

async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 150000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptJson(value, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(value)),
  );

  return {
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
  };
}

async function decryptJson(payload, key) {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(payload.iv) },
    key,
    base64ToBytes(payload.ciphertext),
  );

  return JSON.parse(decoder.decode(plain));
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttribute(text) {
  return escapeHtml(text).replaceAll("`", "&#96;");
}
