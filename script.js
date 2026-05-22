const STORAGE_KEYS = {
  displayName: "gradeconnect_display_name_v1",
  posts: "gradeconnect_posts_v1",
  notes: "gradeconnect_notes_v2",
  seenPosts: "brescia_seen_posts_v1",
  typingSignal: "brescia_yap_typing_signal_v1",
  chatZoom: "brescia_chat_zoom_v1",
  selectedUser: "brescia_selected_user_v1",
  claimedUsers: "brescia_claimed_users_v1",
  subjects: "brescia_profile_subjects_v1",
  subjectsConfirmed: "brescia_subjects_confirmed_v1",
  subjectColors: "brescia_subject_colors_v1",
  calendarEvents: "brescia_calendar_events_v1"
};
const LEGACY_NOTES_KEY = "gradeconnect_notes_v1";

const SUPABASE_URL = "https://ljulsglcvvzrfieqswvw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdWxzZ2xjdnZ6cmZpZXFzd3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjU5MzksImV4cCI6MjA5NDk0MTkzOX0.J9jpl78DOO4cgkINdv3o3BBRHTinF3qW3II64my90C8";
const SUPABASE_BUCKET = "resource-pdfs";
const supabaseClient = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY) || null;
const USE_SUPABASE = Boolean(supabaseClient);


const SUBJECTS = [
  "English", "Afrikaans", "LO", "Maths Core", "Maths Lit", "AP Maths", "Physics", "Biology",
  "French", "Music", "Consumers", "IT", "CAT", "Business", "Accounting", "Religious Education",
  "AP English", "History", "Geography", "Drama", "Art"
];

const SUBJECT_COLORS = {
  English: "#4f9dff",
  Afrikaans: "#ff9f43",
  LO: "#82dcb0",
  "Maths Core": "#28c76f",
  "Maths Lit": "#00cfe8",
  "AP Maths": "#9b7bff",
  Physics: "#38d9ff",
  Biology: "#a3e635",
  French: "#5c7cfa",
  Music: "#ff6b9a",
  Consumers: "#ffd166",
  IT: "#2dd4bf",
  CAT: "#60a5fa",
  Business: "#f59f00",
  Accounting: "#7bd88f",
  "Religious Education": "#c084fc",
  "AP English": "#74c0fc",
  History: "#ff6b6b",
  Geography: "#69db7c",
  Drama: "#f783ac",
  Art: "#ffa8a8"
};

const USER_NAMES = Object.freeze([...new Set([
  "Nsovo Mahlangu",
  "Lily Bacela",
  "Catherine Zhang",
  "Shankari Jayakody",
  "Atlegang Nchabeleng",
  "Thando Shabalala",
  "Bridget Carlisle",
  "Catherine Limpitlaw",
  "Ariel Mugauri",
  "Ruby Benn",
  "Sebone Phalafala",
  "Oluwakemi Ayodele",
  "Mia Wellsted",
  "Alexia Chadhina",
  "Reletile Dikgale",
  "Cristina Rusconi",
  "Misuthando Ngubane",
  "Moshidi Motshegoa",
  "Simosihle Mgcokoca",
  "Sesethu Pheza",
  "Gina Di Terlizzi",
  "Nomhle-Kacey Mulumba",
  "Nosizwe-Kate Mulumba",
  "Sienna Martins",
  "Isabella Dreier",
  "Akheela Madau",
  "Luthando Nongogo",
  "Hailie Chilenga",
  "Jabulile Ncube",
  "Oluhle Nxumalo",
  "Thirusha Padayachee",
  "Philasande Nkosi",
  "Tinyiko Robertson",
  "Anele Magwede",
  "Imani Karera",
  "Hayden Ford",
  "Stephanie Froneman",
  "Lehlononolo Khumalo",
  "Isabella Band",
  "Emily Bishop",
  "Sarah Jupp",
  "Sphesihle Khoza",
  "Zina Matenjie",
  "Thatohatsi Molefe",
  "Thandolwethu Molefe",
  "Minenhle Vilakazi",
  "Solam Ndzuta",
  "Keeziah Peter",
  "Nicole Kamhunu",
  "Jaydon Toulassi",
  "Tsakani Shipalana",
  "Natasha Soko",
  "Gabriella Farkas",
  "Grace Seymour",
  "Grace Prince",
  "Wami Mumba",
  "Rolivhuwa Mapeta",
  "Khanya Mchunu",
  "Reece Etsebeth",
  "Shankari Jayakody"
])].sort((a, b) => a.localeCompare(b)));

const TYPE_LABELS = {
  text: "Text",
  file: "File",
  link: "Link",
  image: "Image",
  pdf: "PDF"
};
const CALENDAR_EVENT_TYPES = {
  test: { label: "Test", color: "#ef4444" },
  homework: { label: "Homework", color: "#f59e0b" },
  event: { label: "Event", color: "#22c55e" },
  holiday: { label: "Holiday", color: "#3b82f6" }
};
const MAX_YAP_MESSAGES = 200;
const MAX_CHAT_ATTACHMENT_SIZE = 1.8 * 1024 * 1024;
const CHAT_PAYLOAD_KIND = "brescia-chat-message";
const TYPING_STALE_MS = 3600;
const TYPING_IDLE_MS = 1200;
const MAX_RESOURCE_FILE_SIZE = 10 * 1024 * 1024;
const PDF_DB_NAME = "brescia_pdf_resources_v1";
const PDF_DB_VERSION = 1;
const PDF_STORE_NAME = "pdfFiles";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  selectedUser: normalizeUserName(localStorage.getItem(STORAGE_KEYS.selectedUser) || ""),
  displayName: normalizeUserName(localStorage.getItem(STORAGE_KEYS.selectedUser) || "") || "",
  subjectsConfirmed: localStorage.getItem(STORAGE_KEYS.subjectsConfirmed) === "true",
  claimedUsers: loadClaimedUsers(),
  posts: limitPostList(normalizePosts(removePreviewPosts(load(STORAGE_KEYS.posts, [])))),
  notes: normalizeNotes(removePreviewNotes(load(STORAGE_KEYS.notes, load(LEGACY_NOTES_KEY, [])))),
  activeTab: "feedSection",
  chatZoom: Number(localStorage.getItem(STORAGE_KEYS.chatZoom)) || 100,
  tabDirection: "right",
  calendarEvents: normalizeCalendarEvents(load(STORAGE_KEYS.calendarEvents, [])),
  calendarCursor: startOfMonth(new Date()),
  selectedCalendarDate: dateKey(new Date()),
  selectedSubject: SUBJECTS[0],
  selectedNoteId: "",
  mySubjects: normalizeSubjectChoices(load(STORAGE_KEYS.subjects, [])),
  subjectColors: normalizeSubjectColors(load(STORAGE_KEYS.subjectColors, {})),
  users: [...USER_NAMES],
  syncReady: false
};

const elements = {
  headerGreeting: $("#headerGreeting"),
  loginModal: $("#loginModal"),
  loginUserList: $("#loginUserList"),
  loginChoiceView: $("#loginChoiceView"),
  loginConfirmStep: $("#loginConfirmStep"),
  loginChoiceName: $("#loginChoiceName"),
  loginConfirmTitle: $("#loginConfirmTitle"),
  loginConfirmText: $("#loginConfirmText"),
  loginConfirmPrimary: $("#loginConfirmPrimary"),
  loginConfirmBack: $("#loginConfirmBack"),
  loginSubjectStep: $("#loginSubjectStep"),
  loginSubjectName: $("#loginSubjectName"),
  loginSubjectList: $("#loginSubjectList"),
  loginSubjectError: $("#loginSubjectError"),
  loginSubjectBack: $("#loginSubjectBack"),
  loginSubjectReview: $("#loginSubjectReview"),
  loginSubjectConfirm: $("#loginSubjectConfirm"),
  loginSubjectConfirmName: $("#loginSubjectConfirmName"),
  loginSubjectSummary: $("#loginSubjectSummary"),
  loginSubjectConfirmBack: $("#loginSubjectConfirmBack"),
  loginSubjectConfirmPrimary: $("#loginSubjectConfirmPrimary"),
  feedList: $("#feedList"),
  notesList: $("#notesList"),
  postBody: $("#postBody"),
  postAttachment: $("#postAttachment"),
  postAttachmentMeta: $("#postAttachmentMeta"),
  clearPostAttachment: $("#clearPostAttachment"),
  postForm: $("#postForm"),
  notesForm: $("#notesForm"),
  notesSearch: $("#notesSearch"),
  subjectRail: $("#subjectRail"),
  resourcePreview: $("#resourcePreview"),
  openResourceDrawer: $("#openResourceDrawer"),
  chatZoom: $("#chatZoom"),
  noteFormError: $("#noteFormError"),
  selectedFileMeta: $("#selectedFileMeta"),
  clearSelectedFile: $("#clearSelectedFile"),
  pdfViewerModal: $("#pdfViewerModal"),
  pdfViewerTitle: $("#pdfViewerTitle"),
  pdfViewerFrame: $("#pdfViewerFrame"),
  noteModalTitle: $("#noteModalTitle"),
  noteModalMeta: $("#noteModalMeta"),
  noteModalContent: $("#noteModalContent"),
  calendarTodayLabel: $("#calendarTodayLabel"),
  calendarTodayButton: $("#calendarTodayButton"),
  calendarMonthLabel: $("#calendarMonthLabel"),
  calendarPrevMonth: $("#calendarPrevMonth"),
  calendarNextMonth: $("#calendarNextMonth"),
  calendarGrid: $("#calendarGrid"),
  calendarSelectedDate: $("#calendarSelectedDate"),
  calendarEventForm: $("#calendarEventForm"),
  calendarEventDate: $("#calendarEventDate"),
  calendarEventTitle: $("#calendarEventTitle"),
  calendarEventType: $("#calendarEventType"),
  calendarSelectedEvents: $("#calendarSelectedEvents")
};

let activePdfObjectUrl = "";
let pdfDbPromise = null;
let pendingLoginUser = "";
let pendingSubjectChoices = [];
let pendingSubjectColors = {};
let loginConfirmStage = 0;
let yapsRefreshTimer = null;
let lastFeedRenderSignature = "";
let yapScrollAnimation = 0;
let yapScrollTarget = 0;
let typingChannel = null;
let typingStopTimer = null;
let typingCleanupTimer = null;
let lastTypingSentAt = 0;
const typingUsers = new Map();

function updateViewportMetrics() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
  const topbarHeight = document.querySelector(".topbar")?.offsetHeight || 0;
  document.documentElement.style.setProperty("--app-height", `${Math.round(viewportHeight)}px`);
  document.documentElement.style.setProperty("--topbar-height", `${Math.round(topbarHeight)}px`);
}

updateViewportMetrics();
renderHeaderGreeting();
renderLoginUsers();
ensureSelectedSubject();
populateSubjectControls();
save(STORAGE_KEYS.posts, state.posts);
applyChatZoom(state.chatZoom, false);

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not load ${key}`, error);
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save ${key}`, error);
    return false;
  }
}

function serializedNotes() {
  return state.notes.map((note) => ({
    ...note,
    fileData: note.fileId ? "" : (note.fileData || "")
  }));
}

function saveNotes() {
  return save(STORAGE_KEYS.notes, serializedNotes());
}

function removePreviewPosts(posts) {
  const previewTitles = new Set(["Welcome to our grade hub!", "Exam prep idea"]);
  return Array.isArray(posts) ? posts.filter((post) => !previewTitles.has(post.title)) : [];
}

function removePreviewNotes(notes) {
  const previewTitles = new Set(["Maths: Quadratic Equations Summary"]);
  return Array.isArray(notes) ? notes.filter((note) => !previewTitles.has(note.title)) : [];
}

function normalizePosts(posts) {
  return Array.isArray(posts) ? posts.map((post) => {
    const decoded = decodeYapBody(post.body || "");
    return {
      ...post,
      body: decoded.body,
      attachment: normalizeChatAttachment(post.attachment || decoded.attachment),
      likedBy: normalizeList(post.likedBy),
      comments: normalizeList(post.comments)
    };
  }) : [];
}

function limitPostList(posts, max = MAX_YAP_MESSAGES) {
  if (!Array.isArray(posts)) return [];
  return posts
    .filter(Boolean)
    .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0))
    .slice(-max);
}

function normalizeNotes(notes) {
  return Array.isArray(notes) ? notes.map((note) => {
    const subject = SUBJECTS.includes(note.subject) ? note.subject : SUBJECTS[0];
    const fileName = note.fileName || "";
    const fileType = note.fileType || "";
    const link = note.link || "";
    const type = normalizeType(note.type, fileName, fileType, link);

    return {
      id: note.id || crypto.randomUUID(),
      title: note.title || "Untitled resource",
      subject,
      type,
      link,
      content: note.content || "",
      description: note.description || "",
      fileName,
      fileType,
      fileSize: Number(note.fileSize) || 0,
      fileId: note.fileId || "",
      filePath: note.filePath || "",
      fileData: note.fileData || "",
      tags: normalizeTags(note.tags),
      author: note.author || "Someone",
      createdAt: note.createdAt || Date.now(),
      important: Boolean(note.important),
      needHelp: Boolean(note.needHelp),
      verified: Boolean(note.verified),
      examDate: note.examDate || "",
      summary: note.summary || "",
      keyTerms: normalizeTags(note.keyTerms),
      questions: note.questions || "",
      checklist: normalizeTags(note.checklist),
      savedBy: normalizeList(note.savedBy),
      doneBy: normalizeList(note.doneBy),
      thanksBy: normalizeList(note.thanksBy),
      reports: normalizeList(note.reports),
      comments: normalizeList(note.comments)
    };
  }) : [];
}

function normalizeCalendarEvents(events) {
  return Array.isArray(events) ? events.map((event) => {
    const date = String(event?.date || "");
    const type = CALENDAR_EVENT_TYPES[event?.type] ? event.type : "event";
    if (!isDateKey(date)) return null;

    return {
      id: event.id || crypto.randomUUID(),
      date,
      type,
      title: String(event.title || CALENDAR_EVENT_TYPES[type].label).trim().slice(0, 80) || CALENDAR_EVENT_TYPES[type].label,
      author: event.author || "Someone",
      createdAt: Number(event.createdAt) || Date.now()
    };
  }).filter(Boolean) : [];
}

function normalizeType(type, fileName, fileType, link) {
  if (["text", "file", "link", "image", "pdf"].includes(type)) return type;
  if (fileType.startsWith("image/")) return "image";
  if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) return "pdf";
  if (link) return "link";
  if (fileName) return "file";
  return "text";
}

function normalizeList(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function dateKey(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function isDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const date = parseDateKey(value);
  return Boolean(date) && dateKey(date) === value;
}

function parseDateKey(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function normalizeUserName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  return USER_NAMES.includes(name) ? name : "";
}

function loadClaimedUsers() {
  const loaded = load(STORAGE_KEYS.claimedUsers, []);
  return Array.isArray(loaded)
    ? [...new Set(loaded.map(normalizeUserName).filter(Boolean))]
    : [];
}

function saveClaimedUsers() {
  state.claimedUsers = [...new Set(state.claimedUsers.map(normalizeUserName).filter(Boolean))];
  save(STORAGE_KEYS.claimedUsers, state.claimedUsers);
}

function firstNameFromDisplayName(name = state.displayName) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function renderHeaderGreeting() {
  if (!elements.headerGreeting) return;
  const firstName = firstNameFromDisplayName();
  elements.headerGreeting.textContent = firstName ? `Hi, ${firstName}` : "";
  elements.headerGreeting.classList.toggle("hidden", !firstName);
}

function updateProfileNameField() {
  if (!elements.displayNameInput) return;
  elements.displayNameInput.value = state.displayName || "";
  elements.displayNameInput.disabled = true;
}

function isUserClaimed(name) {
  return state.claimedUsers.includes(name) && name !== state.selectedUser;
}

function availableLoginUsers() {
  return (Array.isArray(state.users) && state.users.length ? state.users : USER_NAMES)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function renderLoginUsers() {
  if (!elements.loginUserList) return;
  elements.loginUserList.innerHTML = availableLoginUsers().map((name) => {
    const unavailable = isUserClaimed(name);
    const selected = name === state.selectedUser;
    return `
      <button class="login-user-option ${unavailable ? "unavailable" : ""} ${selected ? "selected" : ""}" data-login-user="${escapeHTML(name)}" type="button" ${unavailable ? "disabled" : ""}>
        <span>${escapeHTML(name)}</span>
        <small>${selected ? "Your account" : unavailable ? "Already chosen" : "Available"}</small>
      </button>
    `;
  }).join("");
}

function setLoginView(view) {
  elements.loginChoiceView?.classList.toggle("hidden", view !== "choice");
  elements.loginConfirmStep?.classList.toggle("hidden", view !== "confirm");
  elements.loginSubjectStep?.classList.toggle("hidden", view !== "subjects");
  elements.loginSubjectConfirm?.classList.toggle("hidden", view !== "subjectConfirm");
}

function isLoginComplete() {
  return Boolean(state.selectedUser && state.displayName && state.subjectsConfirmed && state.mySubjects.length);
}

function resetLoginConfirm() {
  pendingLoginUser = "";
  pendingSubjectChoices = [];
  pendingSubjectColors = {};
  loginConfirmStage = 0;
  setLoginView("choice");
}

function showLoginConfirm(name) {
  state.claimedUsers = loadClaimedUsers();
  pendingLoginUser = normalizeUserName(name);
  if (!pendingLoginUser || isUserClaimed(pendingLoginUser)) {
    renderLoginUsers();
    return;
  }
  loginConfirmStage = 1;
  elements.loginChoiceName.textContent = pendingLoginUser;
  elements.loginConfirmTitle.textContent = "Are you sure this is you?";
  elements.loginConfirmText.textContent = "Are you sure this is you?";
  elements.loginConfirmPrimary.textContent = "Yes, this is me";
  setLoginView("confirm");
}

function advanceLoginConfirm() {
  if (!pendingLoginUser) return;

  if (loginConfirmStage === 1) {
    loginConfirmStage = 2;
    elements.loginConfirmTitle.textContent = "Please confirm again";
    elements.loginConfirmText.textContent = "If not then please do not pick somebody else's account as this is a fair environment";
    elements.loginConfirmPrimary.textContent = "I understand, choose this account";
    return;
  }

  showLoginSubjectStep(pendingLoginUser);
}

function defaultLoginSubjectChoices() {
  return normalizeSubjectChoices(state.mySubjects, []);
}

function showLoginSubjectStep(name = state.selectedUser || pendingLoginUser) {
  pendingLoginUser = normalizeUserName(name);
  if (!pendingLoginUser) {
    resetLoginConfirm();
    return;
  }
  pendingSubjectChoices = defaultLoginSubjectChoices();
  pendingSubjectColors = { ...state.subjectColors };
  if (elements.loginSubjectName) elements.loginSubjectName.textContent = pendingLoginUser;
  if (elements.loginSubjectError) elements.loginSubjectError.textContent = "";
  renderLoginSubjectChoices();
  setLoginView("subjects");
}

function renderLoginSubjectChoices() {
  if (!elements.loginSubjectList) return;
  elements.loginSubjectList.innerHTML = SUBJECTS.map((subject) => {
    const selected = pendingSubjectChoices.includes(subject);
    const color = pendingSubjectColors[subject] || subjectColor(subject);
    return `
      <label class="login-subject-row ${selected ? "selected" : ""}" style="--subject-color: ${color}">
        <span class="login-subject-check">
          <input type="checkbox" data-login-subject="${escapeHTML(subject)}" ${selected ? "checked" : ""} />
          <span>${escapeHTML(subject)}</span>
        </span>
        ${selected ? `<input class="subject-color-input" type="color" data-login-subject-color="${escapeHTML(subject)}" value="${color}" aria-label="Choose ${escapeHTML(subject)} colour" />` : ""}
      </label>
    `;
  }).join("");
}

function readPendingSubjectChoicesFromLogin() {
  if (!elements.loginSubjectList) return [];
  return Array.from(elements.loginSubjectList.querySelectorAll("[data-login-subject]:checked"))
    .map((input) => input.dataset.loginSubject)
    .filter((subject) => SUBJECTS.includes(subject));
}

function reviewSubjectChoices() {
  pendingSubjectChoices = SUBJECTS.filter((subject) => readPendingSubjectChoicesFromLogin().includes(subject));
  if (!pendingSubjectChoices.length) {
    if (elements.loginSubjectError) elements.loginSubjectError.textContent = "Choose at least one subject.";
    return;
  }
  if (elements.loginSubjectConfirmName) elements.loginSubjectConfirmName.textContent = pendingLoginUser;
  if (elements.loginSubjectSummary) {
    elements.loginSubjectSummary.innerHTML = pendingSubjectChoices.map((subject) => `
      <span class="login-subject-summary-chip" style="--subject-color: ${pendingSubjectColors[subject] || subjectColor(subject)}">${escapeHTML(subject)}</span>
    `).join("");
  }
  setLoginView("subjectConfirm");
}

async function finishLoginWithSubjects() {
  state.claimedUsers = USE_SUPABASE ? state.claimedUsers : loadClaimedUsers();
  const user = normalizeUserName(pendingLoginUser || state.selectedUser);
  const subjects = normalizeSubjectChoices(pendingSubjectChoices, []);
  if (!user || isUserClaimed(user) || !subjects.length) {
    renderLoginUsers();
    showLoginSubjectStep(user || state.selectedUser);
    return;
  }

  const cleanColors = normalizeSubjectColors(pendingSubjectColors);
  elements.loginSubjectConfirmPrimary.disabled = true;
  elements.loginSubjectConfirmPrimary.textContent = "Saving...";

  try {
    if (USE_SUPABASE) {
      const claimed = await claimSupabaseUser(user, subjects, cleanColors);
      if (!claimed) {
        if (elements.loginSubjectError) elements.loginSubjectError.textContent = "That account has already been chosen. Pick your own available account.";
        await loadSupabaseUsers();
        renderLoginUsers();
        setLoginView("choice");
        return;
      }
    } else if (!state.claimedUsers.includes(user)) {
      state.claimedUsers.push(user);
    }

    state.selectedUser = user;
    state.displayName = user;
    state.mySubjects = SUBJECTS.filter((subject) => subjects.includes(subject));
    state.subjectColors = cleanColors;
    state.subjectsConfirmed = true;
    if (!state.claimedUsers.includes(user)) state.claimedUsers.push(user);

    localStorage.setItem(STORAGE_KEYS.selectedUser, user);
    localStorage.setItem(STORAGE_KEYS.displayName, user);
    localStorage.setItem(STORAGE_KEYS.subjectsConfirmed, "true");
    save(STORAGE_KEYS.subjects, state.mySubjects);
    save(STORAGE_KEYS.subjectColors, state.subjectColors);
    if (!USE_SUPABASE) saveClaimedUsers();

    ensureSelectedSubject();
    populateSubjectControls();
    renderHeaderGreeting();
    renderLoginUsers();
    pendingLoginUser = "";
    pendingSubjectChoices = [];
    pendingSubjectColors = {};
    closeModal("loginModal");
    renderAll();
    await syncFromSupabase({ silent: true });
  } catch (error) {
    console.warn("Could not complete login", error);
    if (elements.loginSubjectError) elements.loginSubjectError.textContent = "Could not save your login. Check your internet and try again.";
  } finally {
    elements.loginSubjectConfirmPrimary.disabled = false;
    elements.loginSubjectConfirmPrimary.textContent = "Confirm subjects";
  }
}

async function loadSupabaseUsers() {
  if (!USE_SUPABASE) return false;
  try {
    const { data, error } = await supabaseClient
      .from("app_users")
      .select("full_name, claimed, subjects, subject_colors")
      .order("full_name", { ascending: true });

    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const names = rows.map((row) => normalizeUserName(row.full_name)).filter(Boolean);
    state.users = names.length ? [...new Set(names)].sort((a, b) => a.localeCompare(b)) : [...USER_NAMES];
    state.claimedUsers = rows
      .filter((row) => row.claimed)
      .map((row) => normalizeUserName(row.full_name))
      .filter(Boolean);

    const currentRow = rows.find((row) => normalizeUserName(row.full_name) === state.selectedUser);
    if (currentRow?.claimed && state.selectedUser) {
      const subjects = normalizeSubjectChoices(currentRow.subjects || [], state.mySubjects);
      if (subjects.length) {
        state.mySubjects = SUBJECTS.filter((subject) => subjects.includes(subject));
        state.subjectsConfirmed = true;
        save(STORAGE_KEYS.subjects, state.mySubjects);
        localStorage.setItem(STORAGE_KEYS.subjectsConfirmed, "true");
      }
      state.subjectColors = normalizeSubjectColors(currentRow.subject_colors || state.subjectColors);
      save(STORAGE_KEYS.subjectColors, state.subjectColors);
    }

    renderLoginUsers();
    ensureSelectedSubject();
    populateSubjectControls();
    return true;
  } catch (error) {
    console.warn("Could not load Supabase users", error);
    return false;
  }
}

async function claimSupabaseUser(user, subjects, colors) {
  if (!USE_SUPABASE) return false;
  const payload = {
    claimed: true,
    claimed_at: new Date().toISOString(),
    subjects,
    subject_colors: colors
  };

  const { data, error } = await supabaseClient
    .from("app_users")
    .update(payload)
    .eq("full_name", user)
    .eq("claimed", false)
    .select("full_name")
    .maybeSingle();

  if (error) throw error;
  return Boolean(data?.full_name);
}

function fromSupabaseTime(value) {
  const timestamp = new Date(value || Date.now()).getTime();
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function mapSupabaseYap(row, repliesByYap) {
  const decoded = decodeYapBody(row.body || "");
  return {
    id: row.id,
    body: decoded.body,
    attachment: decoded.attachment,
    author: row.user_name || "Someone",
    likedBy: [],
    comments: repliesByYap[row.id] || [],
    createdAt: fromSupabaseTime(row.created_at)
  };
}

function mapSupabaseResource(row) {
  return {
    id: row.id,
    title: row.title || "Untitled resource",
    subject: SUBJECTS.includes(row.subject) ? row.subject : SUBJECTS[0],
    type: "pdf",
    link: "",
    content: "",
    description: "",
    fileName: row.file_name || "resource.pdf",
    fileType: "application/pdf",
    fileSize: Number(row.file_size) || 0,
    fileId: row.file_path || "",
    filePath: row.file_path || "",
    fileData: "",
    tags: [],
    author: row.uploaded_by || "Someone",
    createdAt: fromSupabaseTime(row.created_at),
    important: false,
    needHelp: false,
    verified: false,
    examDate: "",
    summary: "",
    keyTerms: [],
    questions: "",
    checklist: [],
    savedBy: [],
    doneBy: [],
    thanksBy: [],
    reports: [],
    comments: []
  };
}

async function loadSupabaseYaps() {
  if (!USE_SUPABASE) return false;
  const shouldStickToBottom = isYapScrolledNearBottom();
  try {
    const { data: yaps, error: yapsError } = await supabaseClient
      .from("yaps")
      .select("id, user_name, body, created_at")
      .order("created_at", { ascending: false })
      .limit(MAX_YAP_MESSAGES);

    if (yapsError) throw yapsError;

    const newestYaps = (Array.isArray(yaps) ? yaps : []).slice().reverse();
    const yapIds = newestYaps.map((row) => row.id).filter(Boolean);
    let replies = [];

    if (yapIds.length) {
      const { data: replyRows, error: repliesError } = await supabaseClient
        .from("yap_replies")
        .select("id, yap_id, user_name, body, created_at")
        .in("yap_id", yapIds)
        .order("created_at", { ascending: true });

      if (repliesError) throw repliesError;
      replies = Array.isArray(replyRows) ? replyRows : [];
    }

    const repliesByYap = {};
    replies.forEach((reply) => {
      const item = {
        id: reply.id,
        author: reply.user_name || "Someone",
        text: reply.body || "",
        createdAt: fromSupabaseTime(reply.created_at)
      };
      if (!repliesByYap[reply.yap_id]) repliesByYap[reply.yap_id] = [];
      repliesByYap[reply.yap_id].push(item);
    });

    state.posts = limitPostList(newestYaps.map((row) => mapSupabaseYap(row, repliesByYap)));
    renderFeed();
    renderTabBadges();
    if (state.activeTab === "feedSection" && shouldStickToBottom) {
      window.requestAnimationFrame(() => scrollYapToBottom("auto"));
    }
    return true;
  } catch (error) {
    console.warn("Could not load Supabase yaps", error);
    return false;
  }
}

async function trimSupabaseYapsToLimit(limit = MAX_YAP_MESSAGES) {
  if (!USE_SUPABASE) return false;

  try {
    let removedAny = false;

    for (let pass = 0; pass < 8; pass += 1) {
      const { data, error } = await supabaseClient
        .from("yaps")
        .select("id")
        .order("created_at", { ascending: false })
        .range(limit, limit + 199);

      if (error) throw error;

      const oldIds = (Array.isArray(data) ? data : [])
        .map((row) => row.id)
        .filter(Boolean);

      if (!oldIds.length) break;

      const { error: deleteError } = await supabaseClient
        .from("yaps")
        .delete()
        .in("id", oldIds);

      if (deleteError) throw deleteError;
      removedAny = true;

      if (oldIds.length < 200) break;
    }

    return removedAny;
  } catch (error) {
    console.warn("Could not trim old yaps", error);
    return false;
  }
}

async function loadSupabaseResources() {
  if (!USE_SUPABASE) return false;
  try {
    const { data, error } = await supabaseClient
      .from("resources")
      .select("id, title, subject, file_path, file_name, file_size, uploaded_by, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    state.notes = normalizeNotes((data || []).map(mapSupabaseResource));
    ensureSelectedSubject();
    renderNotes();
    return true;
  } catch (error) {
    console.warn("Could not load Supabase resources", error);
    return false;
  }
}

async function syncFromSupabase(options = {}) {
  if (!USE_SUPABASE) return false;
  await loadSupabaseUsers();
  await Promise.all([loadSupabaseYaps(), loadSupabaseResources()]);
  state.syncReady = true;
  if (!options.silent) renderAll();
  return true;
}

async function sendSupabaseYap(body, author, attachment = null) {
  const { error } = await supabaseClient.from("yaps").insert({ body: encodeYapBody(body, attachment), user_name: author });
  if (error) throw error;
  await trimSupabaseYapsToLimit();
}

async function sendSupabaseReply(yapId, body, author) {
  const { error } = await supabaseClient.from("yap_replies").insert({ yap_id: yapId, body, user_name: author });
  if (error) throw error;
}

async function deleteSupabaseYap(yapId) {
  const { error } = await supabaseClient.from("yaps").delete().eq("id", yapId);
  if (error) throw error;
}

async function deleteSupabaseReply(replyId) {
  const { error } = await supabaseClient.from("yap_replies").delete().eq("id", replyId);
  if (error) throw error;
}

async function uploadSupabaseResource({ id, title, subject, file, author }) {
  const safeFileName = (file.name || "resource.pdf").replace(/[^a-z0-9_.-]/gi, "_");
  const filePath = `${subjectSlug(subject)}/${id}-${safeFileName}`;
  const { error: uploadError } = await supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, file, { contentType: "application/pdf", upsert: false });

  if (uploadError) throw uploadError;

  const { error: insertError } = await supabaseClient.from("resources").insert({
    id,
    title,
    subject,
    file_path: filePath,
    file_name: file.name || "resource.pdf",
    file_size: file.size || 0,
    uploaded_by: author
  });

  if (insertError) {
    await supabaseClient.storage.from(SUPABASE_BUCKET).remove([filePath]);
    throw insertError;
  }

  return filePath;
}

async function deleteSupabaseResource(note) {
  const { error } = await supabaseClient.from("resources").delete().eq("id", note.id);
  if (error) throw error;
  if (note.filePath || note.fileId) {
    await supabaseClient.storage.from(SUPABASE_BUCKET).remove([note.filePath || note.fileId]);
  }
}

async function signedSupabasePdfUrl(filePath) {
  const { data, error } = await supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(filePath, 60 * 60);
  if (error) throw error;
  return data?.signedUrl || "";
}


function scheduleSupabaseYapsRefresh(delay = 120) {
  if (!USE_SUPABASE) return;
  window.clearTimeout(yapsRefreshTimer);
  yapsRefreshTimer = window.setTimeout(() => loadSupabaseYaps(), delay);
}

function startSupabaseRealtime() {
  if (!USE_SUPABASE) return;
  try {
    supabaseClient.channel("brescia-together-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_users" }, () => loadSupabaseUsers())
      .on("postgres_changes", { event: "*", schema: "public", table: "yaps" }, () => scheduleSupabaseYapsRefresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "yap_replies" }, () => scheduleSupabaseYapsRefresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "resources" }, () => loadSupabaseResources())
      .subscribe();
  } catch (error) {
    console.warn("Could not start Supabase realtime", error);
  }

  window.setInterval(() => syncFromSupabase({ silent: true }), 15000);
}

function requireLogin() {
  if (isLoginComplete()) return false;
  renderLoginUsers();
  openModal("loginModal");
  if (state.selectedUser && !state.subjectsConfirmed) {
    showLoginSubjectStep(state.selectedUser);
  } else {
    setLoginView("choice");
  }
  return true;
}


function normalizeSubjectChoices(value, fallback = []) {
  const values = Array.isArray(value) ? value : fallback;
  const selected = values.filter((subject) => SUBJECTS.includes(subject));
  if (selected.length) return [...new Set(selected)];
  return Array.isArray(fallback) ? fallback.filter((subject) => SUBJECTS.includes(subject)) : [];
}

function normalizeSubjectColors(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value).filter(([subject, color]) => (
    SUBJECTS.includes(subject) && /^#[0-9a-f]{6}$/i.test(String(color))
  )));
}

function activeSubjects() {
  return SUBJECTS.filter((subject) => state.mySubjects.includes(subject));
}

function ensureSelectedSubject() {
  const subjects = activeSubjects();
  if (!subjects.includes(state.selectedSubject)) {
    state.selectedSubject = subjects[0] || "";
  }
}

function setProfileNotice(message = "") {
  if (!elements.profileNotice) return;
  elements.profileNotice.textContent = message;
  elements.profileNotice.classList.toggle("visible", Boolean(message));
}

function renderProfileSubjects() {
  if (!elements.profileSubjectList) return;

  elements.profileSubjectList.innerHTML = SUBJECTS.map((subject) => {
    const selected = state.mySubjects.includes(subject);
    const color = subjectColor(subject);
    return `
      <label class="profile-subject-row ${selected ? "selected" : ""}" style="--subject-color: ${color}">
        <span class="profile-subject-check">
          <input type="checkbox" data-profile-subject="${escapeHTML(subject)}" ${selected ? "checked" : ""} />
          <span>${escapeHTML(subject)}</span>
        </span>
        ${selected ? `<input class="subject-color-input" type="color" data-subject-color="${escapeHTML(subject)}" value="${color}" aria-label="Choose ${escapeHTML(subject)} colour" />` : ""}
      </label>
    `;
  }).join("");
}

function currentName() {
  return state.displayName.trim();
}

function requireDisplayName() {
  if (!isLoginComplete()) {
    requireLogin();
    return "";
  }
  const name = currentName();
  if (name) return name;
  requireLogin();
  return "";
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const sameDay = date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
  const time = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);

  return sameDay ? `today ${time}` : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeChatAttachment(attachment) {
  if (!attachment || typeof attachment !== "object") return null;
  const name = String(attachment.name || "Attachment").trim().slice(0, 120) || "Attachment";
  const type = String(attachment.type || "application/octet-stream").trim();
  const dataUrl = String(attachment.dataUrl || "");
  if (!dataUrl.startsWith("data:")) return null;
  return {
    name,
    type,
    size: Number(attachment.size) || 0,
    dataUrl
  };
}

function decodeYapBody(rawBody = "") {
  const text = String(rawBody || "");
  if (!text.trim().startsWith("{")) return { body: text, attachment: null };

  try {
    const payload = JSON.parse(text);
    if (payload?.kind !== CHAT_PAYLOAD_KIND) return { body: text, attachment: null };
    return {
      body: String(payload.body || ""),
      attachment: normalizeChatAttachment(payload.attachment)
    };
  } catch (error) {
    return { body: text, attachment: null };
  }
}

function encodeYapBody(body, attachment) {
  const normalizedAttachment = normalizeChatAttachment(attachment);
  if (!normalizedAttachment) return body;
  return JSON.stringify({
    kind: CHAT_PAYLOAD_KIND,
    version: 1,
    body,
    attachment: normalizedAttachment
  });
}

function isImageAttachment(attachment) {
  return String(attachment?.type || "").startsWith("image/");
}

function renderChatAttachment(attachment) {
  const item = normalizeChatAttachment(attachment);
  if (!item) return "";
  const meta = [item.name, item.size ? formatBytes(item.size) : ""].filter(Boolean).join(" - ");

  if (isImageAttachment(item)) {
    return `
      <a class="chat-attachment image-attachment" href="${item.dataUrl}" download="${escapeHTML(item.name)}" title="Open ${escapeHTML(item.name)}">
        <img src="${item.dataUrl}" alt="${escapeHTML(item.name)}" />
        <span>${escapeHTML(meta)}</span>
      </a>
    `;
  }

  return `
    <a class="chat-attachment file-attachment" href="${item.dataUrl}" download="${escapeHTML(item.name)}" title="Download ${escapeHTML(item.name)}">
      <span class="attachment-icon" aria-hidden="true"></span>
      <span>${escapeHTML(meta)}</span>
    </a>
  `;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Could not read file")));
    reader.readAsDataURL(file);
  });
}

async function selectedChatAttachment() {
  const file = elements.postAttachment?.files?.[0];
  if (!file) return null;
  if (file.size > MAX_CHAT_ATTACHMENT_SIZE) {
    throw new Error(`Attachments must be smaller than ${formatBytes(MAX_CHAT_ATTACHMENT_SIZE)}.`);
  }
  return {
    name: file.name || "Attachment",
    type: file.type || "application/octet-stream",
    size: file.size || 0,
    dataUrl: await readFileAsDataUrl(file)
  };
}

function updatePostAttachmentMeta() {
  if (!elements.postAttachmentMeta || !elements.postAttachment) return;
  const file = elements.postAttachment.files?.[0];
  const hasFile = Boolean(file);
  elements.postAttachmentMeta.textContent = hasFile
    ? `${file.name} ${file.size ? `- ${formatBytes(file.size)}` : ""}`
    : "No file selected";
  elements.clearPostAttachment?.classList.toggle("hidden", !hasFile);
}

function clearPostAttachment() {
  if (elements.postAttachment) elements.postAttachment.value = "";
  updatePostAttachmentMeta();
}

function ownsItem(item) {
  return currentName() && item.author === currentName();
}

function hasPerson(list, name = currentName()) {
  return Boolean(name) && normalizeList(list).includes(name);
}

function togglePerson(list, name = currentName()) {
  const values = normalizeList(list);
  return hasPerson(values, name) ? values.filter((item) => item !== name) : [...values, name];
}

function clampChatZoom(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 100;
  return Math.min(130, Math.max(60, number));
}

function applyChatZoom(value, shouldSave = true) {
  state.chatZoom = clampChatZoom(value);
  document.documentElement.style.setProperty("--chat-zoom", (state.chatZoom / 100).toFixed(2));
  if (elements.chatZoom) elements.chatZoom.value = String(state.chatZoom);
  if (shouldSave) localStorage.setItem(STORAGE_KEYS.chatZoom, String(state.chatZoom));
}

function subjectColor(subject) {
  return state.subjectColors[subject] || SUBJECT_COLORS[subject] || "#82dcb0";
}

function subjectSlug(subject) {
  return subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function typeLabel(type) {
  return TYPE_LABELS[type] || "File";
}

function likeCount(post) {
  post.likedBy = normalizeList(post.likedBy);
  return post.likedBy.length;
}

function hasLiked(post) {
  return normalizeList(post.likedBy).includes(currentName());
}

function renderTabBadges() {
  if (state.activeTab === "feedSection") markTabSeen("feedSection");

  const feedUnread = Math.max(0, state.posts.length - Number(localStorage.getItem(STORAGE_KEYS.seenPosts) || 0));

  $$("[data-badge-for]").forEach((badge) => {
    badge.textContent = feedUnread > 99 ? "99+" : String(feedUnread);
    badge.classList.toggle("hidden", feedUnread === 0);
  });
}

function markTabSeen(tabId) {
  if (tabId === "feedSection") localStorage.setItem(STORAGE_KEYS.seenPosts, String(state.posts.length));
}

function renderLikeButton(button, post, animate = false) {
  const liked = hasLiked(post);
  button.classList.toggle("liked", liked);
  if (animate) {
    button.classList.remove("like-animate");
    void button.offsetWidth;
    button.classList.add("like-animate");
  } else {
    button.classList.remove("like-animate");
  }
  button.innerHTML = `
    <span class="like-burst"></span>
    <span class="like-heart">${liked ? "&hearts;" : "&#9825;"}</span>
    <span>${likeCount(post)}</span>
  `;
}

function populateSubjectControls() {
  ensureSelectedSubject();
  const subjects = activeSubjects();
  const options = subjects.map((subject) => `<option>${escapeHTML(subject)}</option>`).join("");
  $("#noteSubject").innerHTML = options;
  if (state.selectedSubject) $("#noteSubject").value = state.selectedSubject;
}

function renderSubjectNavigation() {
  ensureSelectedSubject();
  const subjects = activeSubjects();

  const buttonMarkup = (subject) => `
    <button class="subject-link ${state.selectedSubject === subject ? "active" : ""}" data-subject="${escapeHTML(subject)}" type="button" style="--subject-color: ${subjectColor(subject)}">
      <span>${escapeHTML(subject)}</span>
    </button>
  `;

  elements.subjectRail.innerHTML = subjects.map((subject) => buttonMarkup(subject)).join("");
}


function postRenderSignature(post) {
  const comments = normalizeList(post.comments)
    .map((comment) => `${comment.id}:${comment.author}:${comment.text}:${comment.createdAt}`)
    .join(",");
  const attachment = post.attachment ? `${post.attachment.name}:${post.attachment.size}:${post.attachment.type}` : "";
  return `${post.id}:${post.author}:${post.body}:${attachment}:${post.createdAt}:${likeCount(post)}:${comments}`;
}

function feedRenderSignature(posts) {
  return posts.map(postRenderSignature).join("|") || "__empty__";
}

function isYapScrolledNearBottom(threshold = 120) {
  const scroller = elements.feedList;
  if (!scroller) return true;
  return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= threshold;
}

function activeTypingNames() {
  const now = Date.now();
  return Array.from(typingUsers.entries())
    .filter(([, expiresAt]) => expiresAt > now)
    .map(([name]) => name)
    .filter((name) => name && name !== currentName())
    .sort((a, b) => a.localeCompare(b));
}

function typingLabel(names) {
  if (names.length === 1) return `${firstNameFromDisplayName(names[0]) || names[0]} is typing`;
  if (names.length === 2) {
    return `${firstNameFromDisplayName(names[0]) || names[0]} and ${firstNameFromDisplayName(names[1]) || names[1]} are typing`;
  }
  return "Several people are typing";
}

function renderTypingIndicator() {
  if (!elements.feedList) return;
  elements.feedList.querySelector(".typing-indicator")?.remove();
  const names = activeTypingNames();
  if (!names.length) return;

  elements.feedList.insertAdjacentHTML("beforeend", `
    <div class="typing-indicator" aria-live="polite">
      <span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>${escapeHTML(typingLabel(names))}</span>
    </div>
  `);
}

function cleanupTypingUsers() {
  const now = Date.now();
  let changed = false;
  typingUsers.forEach((expiresAt, name) => {
    if (expiresAt <= now) {
      typingUsers.delete(name);
      changed = true;
    }
  });
  if (changed) renderTypingIndicator();
  window.clearTimeout(typingCleanupTimer);
  typingCleanupTimer = window.setTimeout(cleanupTypingUsers, TYPING_STALE_MS);
}

function setTypingUser(name, isTyping) {
  const normalizedName = normalizeUserName(name);
  if (!normalizedName || normalizedName === currentName()) return;
  if (isTyping) {
    typingUsers.set(normalizedName, Date.now() + TYPING_STALE_MS);
  } else {
    typingUsers.delete(normalizedName);
  }
  renderTypingIndicator();
}

function broadcastTyping(isTyping) {
  const name = currentName();
  if (!name) return;
  const now = Date.now();
  if (isTyping && now - lastTypingSentAt < 700) return;
  lastTypingSentAt = now;
  const payload = { user: name, isTyping, sentAt: now };

  try {
    typingChannel?.send?.({ type: "broadcast", event: "typing", payload })?.catch?.((error) => {
      console.warn("Could not broadcast typing status", error);
    });
  } catch (error) {
    console.warn("Could not broadcast typing status", error);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.typingSignal, JSON.stringify({ ...payload, id: crypto.randomUUID() }));
  } catch (error) {
    console.warn("Could not save typing signal", error);
  }
}

function handleComposerTyping() {
  if (!isLoginComplete()) return;
  const hasDraft = Boolean(elements.postBody?.value.trim() || elements.postAttachment?.files?.length);
  broadcastTyping(hasDraft);
  window.clearTimeout(typingStopTimer);
  typingStopTimer = window.setTimeout(() => broadcastTyping(false), TYPING_IDLE_MS);
}

function initTypingChannel() {
  if (!USE_SUPABASE || !supabaseClient?.channel) return;
  typingChannel = supabaseClient
    .channel("brescia-yap-typing")
    .on("broadcast", { event: "typing" }, ({ payload }) => {
      setTypingUser(payload?.user, Boolean(payload?.isTyping));
    })
    .subscribe();
}

function renderFeed() {
  const filtered = [...state.posts]
    .sort((a, b) => a.createdAt - b.createdAt);
  const signature = feedRenderSignature(filtered);

  if (signature === lastFeedRenderSignature && elements.feedList.innerHTML.trim()) {
    return;
  }

  const existingCards = Array.from(elements.feedList.querySelectorAll(".post-card"));
  const existingIds = existingCards.map((card) => card.dataset.postId).filter(Boolean);
  const incomingIds = filtered.map((post) => post.id);
  const canAppendOnly = existingCards.length > 0
    && existingIds.length > 0
    && incomingIds.length >= existingIds.length
    && existingIds.every((id, index) => id === incomingIds[index])
    && filtered.slice(0, existingIds.length).every((post, index) => (
      existingCards[index]?.dataset.renderSignature === encodeURIComponent(postRenderSignature(post))
    ));

  lastFeedRenderSignature = signature;

  if (!filtered.length) {
    elements.feedList.innerHTML = `
      <div class="empty-state">
        <strong>Say hi first!</strong>
      </div>
    `;
    renderTypingIndicator();
    return;
  }

  if (canAppendOnly) {
    const newPosts = filtered.slice(existingIds.length);
    if (newPosts.length) {
      elements.feedList.querySelector(".typing-indicator")?.remove();
      elements.feedList.insertAdjacentHTML("beforeend", newPosts.map((post) => renderPostCard(post, true)).join(""));
      window.setTimeout(() => {
        elements.feedList.querySelectorAll(".post-card.is-new").forEach((card) => card.classList.remove("is-new"));
      }, 520);
    }
    renderTypingIndicator();
    return;
  }

  elements.feedList.innerHTML = filtered.map(renderPostCard).join("");
  renderTypingIndicator();
}

function renderPostCard(post, isNew = false) {
  const liked = hasLiked(post);
  const own = ownsItem(post);

  return `
      <article class="post-card ${own ? "own-message" : "other-message"} ${isNew ? "is-new" : ""}" data-post-id="${post.id}" data-render-signature="${encodeURIComponent(postRenderSignature(post))}">
        <div class="post-message">
          <div class="post-header">
            <p class="chat-author">${escapeHTML(post.author)}</p>
            <p class="message-time">${formatDate(post.createdAt)}</p>
          </div>
          ${post.body ? `<p class="post-body">${escapeHTML(post.body)}</p>` : ""}
          ${renderChatAttachment(post.attachment)}
        </div>
        <div class="post-actions">
          ${own ? "" : `
            <button class="tiny-btn like-btn ${liked ? "liked" : ""}" data-action="like-post" type="button">
              <span class="like-burst"></span>
              <span class="like-heart">${liked ? "&hearts;" : "&#9825;"}</span>
              <span>${likeCount(post)}</span>
            </button>
          `}
          <button class="tiny-btn replies-btn" data-action="toggle-replies" type="button" aria-expanded="false">Replies (${post.comments.length})</button>
          ${ownsItem(post) ? `<button class="danger-btn" data-action="delete-post" type="button">Delete Post</button>` : ""}
        </div>
        <div class="reply-panel">
          ${own ? "" : `
            <form class="comment-form" data-action="add-comment">
              <input placeholder="Write a reply..." maxlength="280" required />
              <button class="tiny-btn reply-submit" type="submit">Reply</button>
            </form>
          `}
          <div class="comments">
            ${post.comments.map((comment) => `
              <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-top">
                  <div class="comment-meta">${escapeHTML(comment.author)} &bull; ${formatDate(comment.createdAt)}</div>
                  ${ownsItem(comment) ? `<button class="danger-btn" data-action="delete-comment" type="button">Delete</button>` : ""}
                </div>
                <p>${escapeHTML(comment.text)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </article>
    `;
}

function filteredNotes() {
  const query = elements.notesSearch.value.trim().toLowerCase();
  const subject = state.selectedSubject;

  return state.notes
    .filter((note) => note.subject === subject)
    .filter((note) => note.type === "pdf" && hasPdfData(note))
    .filter((note) => searchableNoteText(note).includes(query))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function searchableNoteText(note) {
  return [
    note.title, note.subject, note.author, note.description, note.content, note.fileName, note.link,
    note.summary
  ].join(" ").toLowerCase();
}

function renderNotes() {
  ensureSelectedSubject();
  populateSubjectControls();
  renderSubjectNavigation();

  const notes = filteredNotes();
  if (!notes.some((note) => note.id === state.selectedNoteId)) {
    state.selectedNoteId = notes[0]?.id || "";
  }

  elements.notesList.className = "resource-grid list-view";

  if (!notes.length) {
    elements.notesList.innerHTML = `
      <div class="empty-state">
        <strong>No ${escapeHTML(state.selectedSubject)} resources yet</strong>
        <p>Add the first PDF resource.</p>
      </div>
    `;
    renderResourcePreview(null);
    return;
  }

  elements.notesList.innerHTML = notes.map(renderResourceCard).join("");
  renderResourcePreview(state.notes.find((note) => note.id === state.selectedNoteId) || notes[0]);
}

function renderResourceCard(note) {
  const selected = note.id === state.selectedNoteId;

  return `
    <article class="resource-card resource-card-compact ${selected ? "selected" : ""}" data-note-id="${note.id}" style="--subject-color: ${subjectColor(note.subject)}">
      <div class="subject-strip"></div>
      <h4>${escapeHTML(note.title)}</h4>
    </article>
  `;
}

function renderResourcePreview(note) {
  if (!note) {
    elements.resourcePreview.classList.remove("has-selection");
    elements.resourcePreview.innerHTML = `
      <div class="empty-preview">
        <strong>Select a resource</strong>
      </div>
    `;
    return;
  }

  elements.resourcePreview.classList.add("has-selection");
  const details = [
    note.author ? `<span>Added by ${escapeHTML(note.author)}</span>` : "",
    note.createdAt ? `<span>${formatDate(note.createdAt)}</span>` : "",
    note.fileName ? `<span>${escapeHTML(note.fileName)}</span>` : "",
    note.fileSize ? `<span>${formatBytes(note.fileSize)}</span>` : ""
  ].filter(Boolean).join("");

  elements.resourcePreview.innerHTML = `
    <div class="preview-head" style="--subject-color: ${subjectColor(note.subject)}">
      <span class="type-badge">${escapeHTML(note.subject)}</span>
      <h3>${escapeHTML(note.title)}</h3>
      ${details ? `<div class="preview-details">${details}</div>` : ""}
    </div>
    ${hasPdfData(note) ? `<div class="preview-actions"><button class="tiny-btn" data-note-action="download-pdf" type="button">Download</button></div>` : ""}
    ${renderFilePreview(note)}
    ${ownsItem(note) ? `<div class="preview-delete-row"><button class="danger-btn" data-note-action="delete-note" type="button">Delete</button></div>` : ""}
  `;
}

function renderFilePreview(note) {
  if (note.type === "image" && note.fileData) {
    return `<div class="file-preview"><img src="${note.fileData}" alt="${escapeHTML(note.title)}" /></div>`;
  }
  if (note.type === "pdf" && hasPdfData(note)) {
    return `
      <div class="file-preview pdf-inline-preview pdf-stored-preview">
        <div class="empty-state">
          <button class="tiny-btn open-pdf-btn" data-note-action="open-pdf" type="button">Open PDF</button>
        </div>
      </div>
    `;
  }
  if (note.link) {
    return `<a class="resource-link" href="${escapeHTML(note.link)}" target="_blank" rel="noopener">${escapeHTML(note.link)}</a>`;
  }
  if (note.fileName) {
    return `<div class="file-chip">${escapeHTML(note.fileName)} ${note.fileSize ? `&bull; ${formatBytes(note.fileSize)}` : ""}</div>`;
  }
  return "";
}

function calendarLongDateLabel(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function calendarMonthLabel(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(date);
}

function calendarEventType(type) {
  return CALENDAR_EVENT_TYPES[type] || CALENDAR_EVENT_TYPES.event;
}

function calendarEventsForDate(date) {
  return state.calendarEvents
    .filter((event) => event.date === date)
    .sort((a, b) => a.createdAt - b.createdAt);
}

function saveCalendarEvents() {
  state.calendarEvents = normalizeCalendarEvents(state.calendarEvents);
  return save(STORAGE_KEYS.calendarEvents, state.calendarEvents);
}

function renderCalendarEventChip(event) {
  const eventType = calendarEventType(event.type);
  return `
    <span class="calendar-event-chip" style="--event-color: ${eventType.color}">
      ${escapeHTML(event.title)}
    </span>
  `;
}

function renderCalendarDayCell(date) {
  const key = dateKey(date);
  const todayKey = dateKey(new Date());
  const events = calendarEventsForDate(key);
  const isOutside = date.getMonth() !== state.calendarCursor.getMonth();
  const selected = key === state.selectedCalendarDate;
  const visibleEvents = events.slice(0, 2).map(renderCalendarEventChip).join("");
  const extraEvents = events.length > 2
    ? `<span class="calendar-more">+${events.length - 2}</span>`
    : "";

  return `
    <button
      class="calendar-day ${isOutside ? "is-outside" : ""} ${key === todayKey ? "is-today" : ""} ${selected ? "is-selected" : ""}"
      data-calendar-date="${key}"
      type="button"
      aria-label="${escapeHTML(calendarLongDateLabel(date))}"
    >
      <span class="calendar-day-number">${date.getDate()}</span>
      <span class="calendar-day-events">${visibleEvents}${extraEvents}</span>
    </button>
  `;
}

function renderSelectedCalendarEvents() {
  if (!elements.calendarSelectedEvents) return;
  const events = calendarEventsForDate(state.selectedCalendarDate);

  if (!events.length) {
    elements.calendarSelectedEvents.innerHTML = `
      <div class="calendar-empty-day">No events set</div>
    `;
    return;
  }

  elements.calendarSelectedEvents.innerHTML = events.map((event) => {
    const eventType = calendarEventType(event.type);
    return `
      <article class="calendar-event-row" style="--event-color: ${eventType.color}">
        <span class="calendar-event-dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHTML(event.title)}</strong>
          <small>${escapeHTML(eventType.label)}</small>
        </div>
        <button class="tiny-btn" data-calendar-delete="${escapeHTML(event.id)}" type="button">Delete</button>
      </article>
    `;
  }).join("");
}

function renderCalendar() {
  if (!elements.calendarGrid) return;
  const today = new Date();
  const selectedDate = parseDateKey(state.selectedCalendarDate) || today;
  const monthStart = startOfMonth(state.calendarCursor);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - ((monthStart.getDay() + 6) % 7));

  elements.calendarTodayLabel.textContent = calendarLongDateLabel(today);
  elements.calendarMonthLabel.textContent = calendarMonthLabel(state.calendarCursor);
  elements.calendarSelectedDate.textContent = calendarLongDateLabel(selectedDate);
  elements.calendarEventDate.value = state.selectedCalendarDate;

  elements.calendarGrid.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return renderCalendarDayCell(date);
  }).join("");

  renderSelectedCalendarEvents();
}

function selectCalendarDate(date) {
  if (!isDateKey(date)) return;
  const parsedDate = parseDateKey(date);
  state.selectedCalendarDate = date;
  state.calendarCursor = startOfMonth(parsedDate);
  renderCalendar();
  elements.calendarEventTitle?.focus({ preventScroll: true });
}

function updateSelectedResourceView(note) {
  state.selectedNoteId = note?.id || "";
  elements.notesList.querySelectorAll(".resource-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.noteId === state.selectedNoteId);
  });
  renderResourcePreview(note || null);
}

function pdfViewerSrc(fileData) {
  return `${fileData}#toolbar=1&navpanes=0&view=FitH`;
}

async function openPdfViewer(note) {
  if (!hasPdfData(note)) return;
  elements.pdfViewerTitle.textContent = note.title || "Resource PDF";
  elements.pdfViewerFrame.removeAttribute("srcdoc");
  elements.pdfViewerFrame.src = "";
  openModal("pdfViewerModal");

  try {
    const src = await pdfUrlForNote(note);
    elements.pdfViewerFrame.src = pdfViewerSrc(src);
  } catch (error) {
    console.warn("Could not open PDF", error);
    elements.pdfViewerFrame.srcdoc = `
      <main style="font-family: system-ui, sans-serif; padding: 32px; color: #062018;">
        <h1>PDF not available</h1>
        <p>This PDF could not be opened. Check your internet connection and try again.</p>
      </main>
    `;
  }
}

function renderAll() {
  renderFeed();
  renderNotes();
  renderCalendar();
  renderTabBadges();
  window.requestAnimationFrame(updateViewportMetrics);
}

function scrollYapToBottom(behavior = "smooth") {
  if (state.activeTab !== "feedSection") return;
  const scroller = elements.feedList;

  if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
    stopSmoothYapScroll(scroller.scrollHeight);
    const scrollOptions = { top: scroller.scrollHeight, behavior };
    scroller.scrollTo(scrollOptions);
    window.setTimeout(() => scroller.scrollTo(scrollOptions), 80);
    return;
  }

  const scrollOptions = { top: document.documentElement.scrollHeight, behavior };
  window.scrollTo(scrollOptions);
  window.setTimeout(() => window.scrollTo(scrollOptions), 80);
}

function stopSmoothYapScroll(target = elements.feedList?.scrollTop || 0) {
  if (yapScrollAnimation) {
    window.cancelAnimationFrame(yapScrollAnimation);
    yapScrollAnimation = 0;
  }
  yapScrollTarget = target;
}

function smoothScrollYapBy(delta) {
  const scroller = elements.feedList;
  if (!scroller) return;

  const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  const currentTarget = yapScrollAnimation ? yapScrollTarget : scroller.scrollTop;
  yapScrollTarget = Math.min(maxScroll, Math.max(0, currentTarget + delta));

  if (yapScrollAnimation) return;

  const step = () => {
    const distance = yapScrollTarget - scroller.scrollTop;
    if (Math.abs(distance) < 0.75) {
      scroller.scrollTop = yapScrollTarget;
      yapScrollAnimation = 0;
      return;
    }

    scroller.scrollTop += distance * 0.18;
    yapScrollAnimation = window.requestAnimationFrame(step);
  };

  yapScrollAnimation = window.requestAnimationFrame(step);
}

function handleYapWheelScroll(event) {
  if (event.defaultPrevented) return;
  if (state.activeTab !== "feedSection") return;
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest(".modal-backdrop.open, input, textarea, select")) return;

  const scroller = elements.feedList;
  if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return;

  event.preventDefault();
  const deltaScale = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? scroller.clientHeight : 1;
  smoothScrollYapBy(event.deltaY * deltaScale);
}

function handleYapKeyboardScroll(event) {
  if (state.activeTab !== "feedSection") return;
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

  const scroller = elements.feedList;
  if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return;

  const keyScroll = {
    ArrowUp: -56,
    ArrowDown: 56,
    PageUp: -scroller.clientHeight * 0.85,
    PageDown: scroller.clientHeight * 0.85,
    Home: -Infinity,
    End: Infinity
  };

  if (!(event.key in keyScroll)) return;
  event.preventDefault();

  if (event.key === "Home") {
    stopSmoothYapScroll(0);
    scroller.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  if (event.key === "End") {
    stopSmoothYapScroll(scroller.scrollHeight);
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "auto" });
    return;
  }

  smoothScrollYapBy(keyScroll[event.key]);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("closing");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  if (id === "loginModal") renderLoginUsers();
}

function closeModal(id) {
  if (id === "loginModal" && !isLoginComplete()) return;
  const modal = document.getElementById(id);
  if (!modal) return;

  if (id === "pdfViewerModal") {
    modal.classList.remove("open", "closing");
    modal.setAttribute("aria-hidden", "true");
    if (elements.pdfViewerFrame) {
      elements.pdfViewerFrame.src = "";
      elements.pdfViewerFrame.removeAttribute("srcdoc");
    }
    if (activePdfObjectUrl) {
      URL.revokeObjectURL(activePdfObjectUrl);
      activePdfObjectUrl = "";
    }
    return;
  }

  if (id === "profileModal" && modal.classList.contains("open")) {
    modal.classList.add("closing");
    modal.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      modal.classList.remove("open", "closing");
    }, 280);
    return;
  }

  modal.classList.remove("open", "closing");
  modal.setAttribute("aria-hidden", "true");
}

function setTab(tabId) {
  if (state.activeTab === tabId) return;

  const tabs = $$(".tabs .tab-btn");
  const currentIndex = tabs.findIndex((button) => button.dataset.tab === state.activeTab);
  const nextIndex = tabs.findIndex((button) => button.dataset.tab === tabId);
  state.tabDirection = nextIndex > currentIndex ? "right" : "left";

  const currentSection = document.getElementById(state.activeTab);
  const nextSection = document.getElementById(tabId);
  state.activeTab = tabId;
  document.body.dataset.activeTab = tabId;
  updateViewportMetrics();
  markTabSeen(tabId);
  if (tabId === "calendarSection") renderCalendar();

  tabs.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabId));
  renderTabBadges();
  currentSection.classList.add(state.tabDirection === "right" ? "slide-out-left" : "slide-out-right");
  currentSection.classList.remove("active");

  nextSection.classList.remove("hidden", "slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");
  nextSection.classList.add("active", state.tabDirection === "right" ? "slide-in-right" : "slide-in-left");

  window.setTimeout(() => {
    currentSection.classList.add("hidden");
    currentSection.classList.remove("slide-out-left", "slide-out-right");
    nextSection.classList.remove("slide-in-left", "slide-in-right");
    if (tabId === "feedSection") scrollYapToBottom("auto");
  }, 450);
}

function removeWithAnimation(element, afterAnimation) {
  element.classList.add("deleting");
  window.setTimeout(afterAnimation, 260);
}

function clearNoteFormError() {
  elements.noteFormError.textContent = "";
}

function setNoteFormError(message) {
  elements.noteFormError.textContent = message;
}

function resetNoteForm() {
  elements.notesForm.reset();
  ensureSelectedSubject();
  populateSubjectControls();
  $("#noteSubject").value = state.selectedSubject;
  elements.selectedFileMeta.textContent = "No PDF selected";
  elements.clearSelectedFile.classList.add("hidden");
  clearNoteFormError();
}

function selectedFile() {
  return $("#noteFile").files[0] || null;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function openPdfDatabase() {
  if (!window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available in this browser."));
  }

  if (!pdfDbPromise) {
    pdfDbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(PDF_DB_NAME, PDF_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
          db.createObjectStore(PDF_STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open PDF storage."));
      request.onblocked = () => reject(new Error("PDF storage is blocked by another tab."));
    });
  }

  return pdfDbPromise;
}

async function withPdfStore(mode, callback) {
  const db = await openPdfDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PDF_STORE_NAME, mode);
    const store = transaction.objectStore(PDF_STORE_NAME);
    let request;

    try {
      request = callback(store);
    } catch (error) {
      reject(error);
      return;
    }

    transaction.oncomplete = () => resolve(request?.result);
    transaction.onerror = () => reject(transaction.error || request?.error || new Error("PDF storage failed."));
    transaction.onabort = () => reject(transaction.error || new Error("PDF storage was cancelled."));
  });
}

function savePdfBlob(id, blob, metadata = {}) {
  return withPdfStore("readwrite", (store) => store.put({
    id,
    blob,
    name: metadata.name || "resource.pdf",
    type: metadata.type || blob.type || "application/pdf",
    size: metadata.size || blob.size || 0,
    updatedAt: Date.now()
  }));
}

function savePdfFile(id, file) {
  return savePdfBlob(id, file, {
    name: file.name,
    type: file.type || "application/pdf",
    size: file.size
  });
}

function getPdfRecord(id) {
  return withPdfStore("readonly", (store) => store.get(id));
}

function deletePdfFile(id) {
  if (!id) return Promise.resolve();
  return withPdfStore("readwrite", (store) => store.delete(id)).catch((error) => {
    console.warn("Could not delete saved PDF", error);
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = String(dataUrl).split(",");
  const contentType = header.match(/data:([^;]+)/)?.[1] || "application/pdf";
  const binary = atob(base64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: contentType });
}

function hasPdfData(note) {
  return Boolean(note?.fileData || note?.fileId || note?.filePath);
}

async function pdfUrlForNote(note) {
  if (note.filePath && USE_SUPABASE) return signedSupabasePdfUrl(note.filePath);
  if (note.fileData) return note.fileData;
  if (!note.fileId) return "";

  const record = await getPdfRecord(note.fileId);
  if (!record?.blob) throw new Error("The saved PDF could not be found in this browser.");

  if (activePdfObjectUrl) URL.revokeObjectURL(activePdfObjectUrl);
  activePdfObjectUrl = URL.createObjectURL(record.blob);
  return activePdfObjectUrl;
}

async function migrateLegacyPdfData() {
  let changed = false;

  for (const note of state.notes) {
    if (note.type !== "pdf" || !note.fileData || note.fileId) continue;

    try {
      const blob = dataUrlToBlob(note.fileData);
      const fileId = note.id || crypto.randomUUID();
      await savePdfBlob(fileId, blob, {
        name: note.fileName || `${note.title || "resource"}.pdf`,
        type: note.fileType || blob.type || "application/pdf",
        size: note.fileSize || blob.size || 0
      });
      note.fileId = fileId;
      note.fileData = "";
      changed = true;
    } catch (error) {
      console.warn("Could not move old PDF into browser database", error);
    }
  }

  if (changed) {
    saveNotes();
    renderAll();
  }
}

async function downloadPdf(note) {
  const src = await pdfUrlForNote(note);
  if (!src) return;

  const link = document.createElement("a");
  link.href = src;
  link.download = note.fileName || `${note.title || "resource"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function inferTypeFromInput(type, file, link, content) {
  if (file?.type === "application/pdf" || file?.name?.toLowerCase().endsWith(".pdf")) return "pdf";
  if (file?.type?.startsWith("image/")) return "image";
  if (link) return "link";
  if (file) return type === "text" ? "file" : type;
  if (content) return "text";
  return type;
}

async function handlePostClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = event.target.closest(".post-card");
  const post = state.posts.find((item) => item.id === card?.dataset.postId);
  if (!post) return;

  if (button.dataset.action === "like-post") {
    const name = requireDisplayName();
    if (!name) return;
    if (ownsItem(post)) return;
    const liked = hasLiked(post);
    post.likedBy = liked ? post.likedBy.filter((id) => id !== name) : [...normalizeList(post.likedBy), name];
    if (!USE_SUPABASE) save(STORAGE_KEYS.posts, state.posts);
    renderLikeButton(button, post, !liked);
    return;
  }

  if (button.dataset.action === "toggle-replies") {
    const panel = card.querySelector(".reply-panel");
    const isOpen = panel.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) panel.querySelector("input")?.focus();
    return;
  }


  if (button.dataset.action === "delete-post" && ownsItem(post)) {
    removeWithAnimation(card, async () => {
      try {
        if (USE_SUPABASE) {
          await deleteSupabaseYap(post.id);
          await loadSupabaseYaps();
        } else {
          state.posts = state.posts.filter((item) => item.id !== post.id);
          save(STORAGE_KEYS.posts, state.posts);
          renderAll();
        }
      } catch (error) {
        console.warn("Could not delete yap", error);
        await loadSupabaseYaps();
      }
    });
    return;
  }

  if (button.dataset.action === "delete-comment") {
    const commentEl = event.target.closest(".comment");
    const comment = post.comments.find((item) => item.id === commentEl?.dataset.commentId);
    if (comment && ownsItem(comment)) {
      removeWithAnimation(commentEl, async () => {
        try {
          if (USE_SUPABASE) {
            await deleteSupabaseReply(comment.id);
            await loadSupabaseYaps();
          } else {
            post.comments = post.comments.filter((item) => item.id !== comment.id);
            save(STORAGE_KEYS.posts, state.posts);
            renderAll();
          }
        } catch (error) {
          console.warn("Could not delete reply", error);
          await loadSupabaseYaps();
        }
      });
    }
  }
}

async function handlePostSubmit(event) {
  const form = event.target.closest("form[data-action='add-comment']");
  if (!form) return;
  event.preventDefault();

  const author = requireDisplayName();
  if (!author) return;

  const card = form.closest(".post-card");
  const post = state.posts.find((item) => item.id === card?.dataset.postId);
  const input = form.querySelector("input");
  const text = input.value.trim();
  if (!post || !text) return;
  if (ownsItem(post)) return;

  input.value = "";
  try {
    if (USE_SUPABASE) {
      await sendSupabaseReply(post.id, text, author);
      await loadSupabaseYaps();
    } else {
      post.comments.push({ id: crypto.randomUUID(), author, text, createdAt: Date.now() });
      save(STORAGE_KEYS.posts, state.posts);
      renderAll();
    }
  } catch (error) {
    console.warn("Could not send reply", error);
    input.value = text;
  }
}

async function handleNoteAction(action, note) {
  if (action === "select-note") {
    updateSelectedResourceView(note);
    return;
  }

  if (action === "open-pdf") {
    updateSelectedResourceView(note);
    await openPdfViewer(note);
    return;
  }

  if (action === "download-pdf") {
    try {
      await downloadPdf(note);
    } catch (error) {
      console.warn("Could not download PDF", error);
    }
    return;
  }

  if (action === "delete-note" && ownsItem(note)) {
    const name = requireDisplayName();
    if (!name) return;
    try {
      if (USE_SUPABASE) {
        await deleteSupabaseResource(note);
        if (state.selectedNoteId === note.id) state.selectedNoteId = "";
        await loadSupabaseResources();
      } else {
        state.notes = state.notes.filter((item) => item.id !== note.id);
        if (state.selectedNoteId === note.id) state.selectedNoteId = "";
        await deletePdfFile(note.fileId);
        saveNotes();
        renderNotes();
      }
    } catch (error) {
      console.warn("Could not delete resource", error);
    }
  }
}

elements.loginUserList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-login-user]");
  if (!button || button.disabled) return;
  showLoginConfirm(button.dataset.loginUser);
});

elements.loginConfirmBack?.addEventListener("click", resetLoginConfirm);

elements.loginConfirmPrimary?.addEventListener("click", advanceLoginConfirm);

elements.loginSubjectBack?.addEventListener("click", () => {
  if (state.selectedUser && !state.subjectsConfirmed) {
    showLoginSubjectStep(state.selectedUser);
    return;
  }
  showLoginConfirm(pendingLoginUser);
  loginConfirmStage = 2;
  elements.loginConfirmTitle.textContent = "Please confirm again";
  elements.loginConfirmText.textContent = "If not then please do not pick somebody else's account as this is a fair environment";
  elements.loginConfirmPrimary.textContent = "I understand, choose this account";
});

elements.loginSubjectReview?.addEventListener("click", reviewSubjectChoices);

elements.loginSubjectConfirmBack?.addEventListener("click", () => {
  renderLoginSubjectChoices();
  setLoginView("subjects");
});

elements.loginSubjectConfirmPrimary?.addEventListener("click", finishLoginWithSubjects);

elements.loginSubjectList?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-login-subject]");
  if (!checkbox) return;
  pendingSubjectChoices = SUBJECTS.filter((subject) => readPendingSubjectChoicesFromLogin().includes(subject));
  if (elements.loginSubjectError) elements.loginSubjectError.textContent = "";
  renderLoginSubjectChoices();
});

elements.loginSubjectList?.addEventListener("input", (event) => {
  const colorInput = event.target.closest("[data-login-subject-color]");
  if (!colorInput) return;
  const subject = colorInput.dataset.loginSubjectColor;
  if (!SUBJECTS.includes(subject)) return;
  pendingSubjectColors[subject] = colorInput.value;
  colorInput.closest(".login-subject-row")?.style.setProperty("--subject-color", colorInput.value);
});

elements.postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const author = requireDisplayName();
  if (!author) return;

  const body = elements.postBody.value.trim();
  let attachment = null;
  try {
    attachment = await selectedChatAttachment();
  } catch (error) {
    alert(error.message || "That attachment could not be added.");
    return;
  }
  if (!body && !attachment) return;

  const submitButton = elements.postForm.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  broadcastTyping(false);

  try {
    if (USE_SUPABASE) {
      await sendSupabaseYap(body, author, attachment);
      elements.postForm.reset();
      updatePostAttachmentMeta();
      await loadSupabaseYaps();
    } else {
      state.posts.push({
        id: crypto.randomUUID(),
        body,
        attachment,
        author,
        likedBy: [],
        comments: [],
        createdAt: Date.now()
      });
      state.posts = limitPostList(state.posts);
      save(STORAGE_KEYS.posts, state.posts);
      elements.postForm.reset();
      updatePostAttachmentMeta();
      renderAll();
    }
    window.requestAnimationFrame(() => scrollYapToBottom());
  } catch (error) {
    console.warn("Could not send yap", error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

elements.notesForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNoteFormError();

  const author = requireDisplayName();
  if (!author) return;

  const title = $("#noteTitle").value.trim();
  const subject = $("#noteSubject").value;
  if (!activeSubjects().includes(subject)) {
    setNoteFormError("Choose one of your selected subjects first.");
    return;
  }
  const file = selectedFile();

  if (!title) {
    setNoteFormError("Add a title first.");
    return;
  }

  if (!file) {
    setNoteFormError("Choose a PDF file to send.");
    return;
  }

  if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
    setNoteFormError("Only PDF files can be added as resources.");
    return;
  }

  if (file.size > MAX_RESOURCE_FILE_SIZE) {
    setNoteFormError("Choose a PDF under 10 MB.");
    return;
  }

  const submitButton = elements.notesForm.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  const noteId = crypto.randomUUID();
  const fileId = noteId;

  submitButton.disabled = true;
  submitButton.textContent = "Adding...";

  try {
    if (USE_SUPABASE) {
      await uploadSupabaseResource({ id: noteId, title, subject, file, author });
      state.selectedSubject = subject;
      await loadSupabaseResources();
    } else {
      await savePdfFile(fileId, file);

      state.notes.push({
        id: noteId,
        title,
        subject,
        type: "pdf",
        link: "",
        content: "",
        description: "",
        fileName: file.name || "",
        fileType: file.type || "application/pdf",
        fileSize: file.size || 0,
        fileId,
        filePath: "",
        fileData: "",
        tags: [],
        author,
        createdAt: Date.now(),
        important: false,
        needHelp: false,
        verified: false,
        examDate: "",
        summary: "",
        keyTerms: [],
        questions: "",
        checklist: [],
        savedBy: [],
        doneBy: [],
        thanksBy: [],
        reports: [],
        comments: []
      });

      state.selectedSubject = subject;
      if (!saveNotes()) {
        throw new Error("Could not save resource details.");
      }
      renderNotes();
    }

    closeModal("resourceDrawer");
    resetNoteForm();
  } catch (error) {
    console.warn("Could not add PDF resource", error);
    if (!USE_SUPABASE) await deletePdfFile(fileId);
    state.notes = state.notes.filter((note) => note.id !== noteId);
    if (!USE_SUPABASE) saveNotes();
    setNoteFormError(USE_SUPABASE ? "That PDF could not be uploaded. Check your internet and Supabase setup." : "That PDF could not be saved. Try again, or clear some browser storage first.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

[elements.feedList].filter(Boolean).forEach((list) => {
  list.addEventListener("click", handlePostClick);
  list.addEventListener("submit", handlePostSubmit);
});

elements.notesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-note-action]");
  const card = event.target.closest(".resource-card");
  const note = state.notes.find((item) => item.id === card?.dataset.noteId);
  if (!note) return;
  if (!button) {
    handleNoteAction("select-note", note);
    return;
  }
  handleNoteAction(button.dataset.noteAction, note);
});

elements.resourcePreview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-note-action]");
  const note = state.notes.find((item) => item.id === state.selectedNoteId);
  if (!button || !note) return;
  handleNoteAction(button.dataset.noteAction, note);
});

elements.openResourceDrawer.addEventListener("click", () => {
  resetNoteForm();
  openModal("resourceDrawer");
});

$("#noteFile").addEventListener("change", () => {
  const file = selectedFile();
  if (!file) {
    elements.selectedFileMeta.textContent = "No PDF selected";
    elements.clearSelectedFile.classList.add("hidden");
    return;
  }

  const warning = file.size > MAX_RESOURCE_FILE_SIZE ? " - too large (max 10 MB)" : "";
  elements.selectedFileMeta.textContent = `${file.name} (${formatBytes(file.size)})${warning}`;
  elements.clearSelectedFile.classList.remove("hidden");
});

elements.clearSelectedFile.addEventListener("click", () => {
  $("#noteFile").value = "";
  elements.selectedFileMeta.textContent = "No PDF selected";
  elements.clearSelectedFile.classList.add("hidden");
});

elements.postBody?.addEventListener("input", handleComposerTyping);

elements.postBody?.addEventListener("blur", () => {
  window.clearTimeout(typingStopTimer);
  broadcastTyping(false);
});

elements.postAttachment?.addEventListener("change", () => {
  updatePostAttachmentMeta();
  handleComposerTyping();
});

elements.clearPostAttachment?.addEventListener("click", () => {
  clearPostAttachment();
  handleComposerTyping();
});

if (elements.chatZoom) {
  elements.chatZoom.addEventListener("input", () => {
    applyChatZoom(elements.chatZoom.value);
    window.requestAnimationFrame(() => scrollYapToBottom("auto"));
  });
}

elements.notesSearch.addEventListener("input", renderNotes);

elements.subjectRail.addEventListener("click", (event) => {
  const button = event.target.closest("[data-subject]");
  if (!button) return;
  state.selectedSubject = button.dataset.subject;
  renderNotes();
});

elements.calendarPrevMonth?.addEventListener("click", () => {
  state.calendarCursor = addMonths(state.calendarCursor, -1);
  renderCalendar();
});

elements.calendarNextMonth?.addEventListener("click", () => {
  state.calendarCursor = addMonths(state.calendarCursor, 1);
  renderCalendar();
});

elements.calendarTodayButton?.addEventListener("click", () => {
  const today = new Date();
  state.calendarCursor = startOfMonth(today);
  state.selectedCalendarDate = dateKey(today);
  renderCalendar();
});

elements.calendarGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-calendar-date]");
  if (!button) return;
  selectCalendarDate(button.dataset.calendarDate);
});

elements.calendarEventForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const author = requireDisplayName();
  if (!author) return;

  const date = elements.calendarEventDate.value || state.selectedCalendarDate;
  const type = CALENDAR_EVENT_TYPES[elements.calendarEventType.value] ? elements.calendarEventType.value : "event";
  if (!isDateKey(date)) return;

  const eventType = calendarEventType(type);
  const title = elements.calendarEventTitle.value.trim() || eventType.label;
  state.calendarEvents.push({
    id: crypto.randomUUID(),
    date,
    type,
    title,
    author,
    createdAt: Date.now()
  });

  saveCalendarEvents();
  elements.calendarEventTitle.value = "";
  renderCalendar();
});

elements.calendarSelectedEvents?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-calendar-delete]");
  if (!button) return;
  state.calendarEvents = state.calendarEvents.filter((calendarEvent) => calendarEvent.id !== button.dataset.calendarDelete);
  saveCalendarEvents();
  renderCalendar();
});

$$(".tabs .tab-btn").forEach((button) => button.addEventListener("click", () => {
  setTab(button.dataset.tab);
}));

$$("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.closeModal)));

$$(".modal-backdrop").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (modal.id === "loginModal" && !isLoginComplete()) return;
    if (event.target === modal) closeModal(modal.id);
  });
});

function createAmbientShape() {
  const shape = document.createElement("span");
  shape.className = "ambient-shape";
  document.body.appendChild(shape);
  return shape;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function placeAmbientShape(shape) {
  const size = randomBetween(14, 54);
  const green = Math.random() > 0.35;
  shape.style.width = `${size}px`;
  shape.style.height = `${size}px`;
  shape.style.left = `${randomBetween(2, 96)}vw`;
  shape.style.top = `${randomBetween(4, 94)}vh`;
  shape.style.background = green ? "rgba(130, 220, 176, 0.176)" : "rgba(255, 255, 255, 0.128)";
  shape.style.setProperty("--shape-opacity", randomBetween(0.08, 0.192).toFixed(2));
  shape.style.setProperty("--shape-drift-x", `${randomBetween(-70, 70).toFixed(0)}px`);
  shape.style.setProperty("--shape-drift-y", `${randomBetween(-70, 70).toFixed(0)}px`);
}

function cycleAmbientShape(shape) {
  shape.classList.remove("visible");
  window.setTimeout(() => {
    placeAmbientShape(shape);
    shape.classList.add("visible");
    window.setTimeout(() => cycleAmbientShape(shape), randomBetween(3200, 7600));
  }, randomBetween(800, 2400));
}

function initAmbientShapes() {
  const shapes = Array.from({ length: 17 }, createAmbientShape);
  shapes.forEach((shape, index) => {
    placeAmbientShape(shape);
    window.setTimeout(() => {
      shape.classList.add("visible");
      window.setTimeout(() => cycleAmbientShape(shape), randomBetween(2600, 7200));
    }, index * 140);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal("noteModal");
    closeModal("resourceDrawer");
    closeModal("pdfViewerModal");
  }
});

window.addEventListener("load", updateViewportMetrics);
window.addEventListener("resize", updateViewportMetrics);
window.addEventListener("orientationchange", () => window.setTimeout(updateViewportMetrics, 250));
document.addEventListener("wheel", handleYapWheelScroll, { passive: false, capture: true });
window.addEventListener("wheel", handleYapWheelScroll, { passive: false });
document.addEventListener("keydown", handleYapKeyboardScroll);
window.visualViewport?.addEventListener("resize", updateViewportMetrics);
window.visualViewport?.addEventListener("scroll", updateViewportMetrics);

initAmbientShapes();
initTypingChannel();
cleanupTypingUsers();
document.body.dataset.activeTab = state.activeTab;
if (!USE_SUPABASE && state.selectedUser && !state.claimedUsers.includes(state.selectedUser)) {
  state.claimedUsers.push(state.selectedUser);
  saveClaimedUsers();
}
renderHeaderGreeting();
renderAll();

async function initialiseApp() {
  if (USE_SUPABASE) {
    await syncFromSupabase({ silent: true });
    startSupabaseRealtime();
  }

  renderHeaderGreeting();
  renderAll();
  if (!isLoginComplete()) {
    window.setTimeout(() => requireLogin(), 0);
  }

  if (!USE_SUPABASE) migrateLegacyPdfData();
}

initialiseApp();

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEYS.typingSignal && event.newValue) {
    try {
      const payload = JSON.parse(event.newValue);
      setTypingUser(payload.user, Boolean(payload.isTyping));
    } catch (error) {
      console.warn("Could not read typing signal", error);
    }
    return;
  }

  if (event.key === STORAGE_KEYS.calendarEvents) {
    state.calendarEvents = normalizeCalendarEvents(load(STORAGE_KEYS.calendarEvents, []));
    renderCalendar();
    return;
  }

  if (USE_SUPABASE) return;

  if (event.key === STORAGE_KEYS.claimedUsers) {
    state.claimedUsers = loadClaimedUsers();
    renderLoginUsers();
    return;
  }

  if (event.key === STORAGE_KEYS.notes) {
    state.notes = normalizeNotes(load(STORAGE_KEYS.notes, load(LEGACY_NOTES_KEY, [])));
    ensureSelectedSubject();
    renderNotes();
  }
});
