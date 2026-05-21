const STORAGE_KEYS = {
  displayName: "gradeconnect_display_name_v1",
  posts: "gradeconnect_posts_v1",
  notes: "gradeconnect_notes_v2",
  seenPosts: "brescia_seen_posts_v1",
  chatZoom: "brescia_chat_zoom_v1",
  selectedUser: "brescia_selected_user_v1",
  claimedUsers: "brescia_claimed_users_v1",
  subjects: "brescia_profile_subjects_v1",
  subjectColors: "brescia_subject_colors_v1"
};
const LEGACY_NOTES_KEY = "gradeconnect_notes_v1";

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
const MAX_RESOURCE_FILE_SIZE = 10 * 1024 * 1024;
const PDF_DB_NAME = "brescia_pdf_resources_v1";
const PDF_DB_VERSION = 1;
const PDF_STORE_NAME = "pdfFiles";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  selectedUser: normalizeUserName(localStorage.getItem(STORAGE_KEYS.selectedUser) || ""),
  displayName: normalizeUserName(localStorage.getItem(STORAGE_KEYS.selectedUser) || "") || "",
  claimedUsers: loadClaimedUsers(),
  posts: normalizePosts(removePreviewPosts(load(STORAGE_KEYS.posts, []))),
  notes: normalizeNotes(removePreviewNotes(load(STORAGE_KEYS.notes, load(LEGACY_NOTES_KEY, [])))),
  activeTab: "feedSection",
  chatZoom: Number(localStorage.getItem(STORAGE_KEYS.chatZoom)) || 100,
  tabDirection: "right",
  selectedSubject: SUBJECTS[0],
  selectedNoteId: "",
  mySubjects: normalizeSubjectChoices(load(STORAGE_KEYS.subjects, SUBJECTS)),
  subjectColors: normalizeSubjectColors(load(STORAGE_KEYS.subjectColors, {}))
};

const elements = {
  displayNameInput: $("#displayNameInput"),
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
  feedList: $("#feedList"),
  notesList: $("#notesList"),
  postForm: $("#postForm"),
  notesForm: $("#notesForm"),
  notesSearch: $("#notesSearch"),
  subjectRail: $("#subjectRail"),
  resourcePreview: $("#resourcePreview"),
  openResourceDrawer: $("#openResourceDrawer"),
  openProfile: $("#openProfile"),
  profileSubjectList: $("#profileSubjectList"),
  profileNotice: $("#profileNotice"),
  chatZoom: $("#chatZoom"),
  noteFormError: $("#noteFormError"),
  selectedFileMeta: $("#selectedFileMeta"),
  clearSelectedFile: $("#clearSelectedFile"),
  pdfViewerModal: $("#pdfViewerModal"),
  pdfViewerTitle: $("#pdfViewerTitle"),
  pdfViewerFrame: $("#pdfViewerFrame"),
  noteModalTitle: $("#noteModalTitle"),
  noteModalMeta: $("#noteModalMeta"),
  noteModalContent: $("#noteModalContent")
};

let activePdfObjectUrl = "";
let pdfDbPromise = null;
let pendingLoginUser = "";
let loginConfirmStage = 0;

updateProfileNameField();
renderHeaderGreeting();
renderLoginUsers();
ensureSelectedSubject();
populateSubjectControls();
renderProfileSubjects();
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
  return Array.isArray(posts) ? posts.map((post) => ({
    ...post,
    likedBy: normalizeList(post.likedBy),
    comments: normalizeList(post.comments)
  })) : [];
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

function renderLoginUsers() {
  if (!elements.loginUserList) return;
  elements.loginUserList.innerHTML = USER_NAMES.map((name) => {
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

function resetLoginConfirm() {
  pendingLoginUser = "";
  loginConfirmStage = 0;
  elements.loginChoiceView?.classList.remove("hidden");
  elements.loginConfirmStep?.classList.add("hidden");
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
  elements.loginChoiceView.classList.add("hidden");
  elements.loginConfirmStep.classList.remove("hidden");
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

  chooseLoginUser(pendingLoginUser);
}

function chooseLoginUser(name) {
  state.claimedUsers = loadClaimedUsers();
  const user = normalizeUserName(name);
  if (!user || isUserClaimed(user)) {
    renderLoginUsers();
    resetLoginConfirm();
    return;
  }
  state.selectedUser = user;
  state.displayName = user;
  if (!state.claimedUsers.includes(user)) state.claimedUsers.push(user);
  localStorage.setItem(STORAGE_KEYS.selectedUser, user);
  localStorage.setItem(STORAGE_KEYS.displayName, user);
  saveClaimedUsers();
  updateProfileNameField();
  renderHeaderGreeting();
  renderLoginUsers();
  resetLoginConfirm();
  closeModal("loginModal");
  renderAll();
}

function requireLogin() {
  if (state.selectedUser && state.displayName) return false;
  renderLoginUsers();
  openModal("loginModal");
  return true;
}


function normalizeSubjectChoices(value) {
  const values = Array.isArray(value) ? value : SUBJECTS;
  const selected = values.filter((subject) => SUBJECTS.includes(subject));
  return selected.length ? selected : [...SUBJECTS];
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
  return Math.min(130, Math.max(80, number));
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

function renderFeed() {
  const filtered = state.posts
    .sort((a, b) => a.createdAt - b.createdAt);

  if (!filtered.length) {
    elements.feedList.innerHTML = `
      <div class="empty-state">
        <strong>Say hi first!</strong>
      </div>
    `;
    return;
  }

  elements.feedList.innerHTML = filtered.map(renderPostCard).join("");
}

function renderPostCard(post) {
  const liked = hasLiked(post);
  const own = ownsItem(post);

  return `
      <article class="post-card ${own ? "own-message" : "other-message"}" data-post-id="${post.id}">
        <div class="post-message">
          <div class="post-header">
            <div class="identity">
              <div>
                <p class="chat-author">${escapeHTML(post.author)}</p>
                <p class="meta">${formatDate(post.createdAt)}</p>
              </div>
            </div>
          </div>
          <p class="post-body">${escapeHTML(post.body)}</p>
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
        <p>This PDF could not be found in this browser. Try adding it again.</p>
      </main>
    `;
  }
}

function renderAll() {
  renderFeed();
  renderNotes();
  renderTabBadges();
}

function scrollYapToBottom(behavior = "smooth") {
  if (state.activeTab !== "feedSection") return;
  const scrollOptions = { top: document.documentElement.scrollHeight, behavior };
  window.scrollTo(scrollOptions);
  window.setTimeout(() => window.scrollTo(scrollOptions), 80);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("closing");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  if (id === "profileModal") {
    updateProfileNameField();
    renderProfileSubjects();
  }
  if (id === "loginModal") renderLoginUsers();
}

function closeModal(id) {
  if (id === "loginModal" && !state.selectedUser) return;
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
  markTabSeen(tabId);

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
  return Boolean(note?.fileData || note?.fileId);
}

async function pdfUrlForNote(note) {
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
    save(STORAGE_KEYS.posts, state.posts);
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
    removeWithAnimation(card, () => {
      state.posts = state.posts.filter((item) => item.id !== post.id);
      save(STORAGE_KEYS.posts, state.posts);
      renderAll();
    });
    return;
  }

  if (button.dataset.action === "delete-comment") {
    const commentEl = event.target.closest(".comment");
    const comment = post.comments.find((item) => item.id === commentEl?.dataset.commentId);
    if (comment && ownsItem(comment)) {
      removeWithAnimation(commentEl, () => {
        post.comments = post.comments.filter((item) => item.id !== comment.id);
        save(STORAGE_KEYS.posts, state.posts);
        renderAll();
      });
    }
  }
}

function handlePostSubmit(event) {
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

  post.comments.push({ id: crypto.randomUUID(), author, text, createdAt: Date.now() });
  save(STORAGE_KEYS.posts, state.posts);
  input.value = "";
  renderAll();
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
    state.notes = state.notes.filter((item) => item.id !== note.id);
    if (state.selectedNoteId === note.id) state.selectedNoteId = "";
    await deletePdfFile(note.fileId);
    saveNotes();
    renderNotes();
  }
}

elements.loginUserList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-login-user]");
  if (!button || button.disabled) return;
  showLoginConfirm(button.dataset.loginUser);
});

elements.loginConfirmBack?.addEventListener("click", resetLoginConfirm);

elements.loginConfirmPrimary?.addEventListener("click", advanceLoginConfirm);

elements.openProfile.addEventListener("click", () => {
  setProfileNotice("");
  openModal("profileModal");
});

elements.profileSubjectList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-profile-subject]");
  if (!checkbox) return;

  const checkedSubjects = Array.from(elements.profileSubjectList.querySelectorAll("[data-profile-subject]:checked"))
    .map((input) => input.dataset.profileSubject)
    .filter((subject) => SUBJECTS.includes(subject));

  if (!checkedSubjects.length) {
    checkbox.checked = true;
    setProfileNotice("Choose at least one subject.");
    return;
  }

  state.mySubjects = SUBJECTS.filter((subject) => checkedSubjects.includes(subject));
  save(STORAGE_KEYS.subjects, state.mySubjects);
  setProfileNotice("");
  ensureSelectedSubject();
  populateSubjectControls();
  renderProfileSubjects();
  renderAll();
});

elements.profileSubjectList.addEventListener("input", (event) => {
  const colorInput = event.target.closest("[data-subject-color]");
  if (!colorInput) return;

  const subject = colorInput.dataset.subjectColor;
  if (!SUBJECTS.includes(subject)) return;

  state.subjectColors[subject] = colorInput.value;
  save(STORAGE_KEYS.subjectColors, state.subjectColors);
  colorInput.closest(".profile-subject-row")?.style.setProperty("--subject-color", colorInput.value);
  setProfileNotice("Subject colour saved.");
  renderNotes();
});

elements.postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const author = requireDisplayName();
  if (!author) return;

  const body = $("#postBody").value.trim();
  if (!body) return;

  state.posts.push({
    id: crypto.randomUUID(),
    body,
    author,
    likedBy: [],
    comments: [],
    createdAt: Date.now()
  });

  save(STORAGE_KEYS.posts, state.posts);
  elements.postForm.reset();
  renderAll();
  window.requestAnimationFrame(() => scrollYapToBottom());
});

elements.notesForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNoteFormError();

  const author = requireDisplayName();
  if (!author) return;

  const title = $("#noteTitle").value.trim();
  const subject = $("#noteSubject").value;
  if (!activeSubjects().includes(subject)) {
    setNoteFormError("Choose one of your profile subjects first.");
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
    setNoteFormError("Choose a PDF under 10 MB so it can save in this browser.");
    return;
  }

  const submitButton = elements.notesForm.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  const noteId = crypto.randomUUID();
  const fileId = noteId;

  submitButton.disabled = true;
  submitButton.textContent = "Adding...";

  try {
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

    closeModal("resourceDrawer");
    resetNoteForm();
    renderNotes();
  } catch (error) {
    console.warn("Could not add PDF resource", error);
    await deletePdfFile(fileId);
    state.notes = state.notes.filter((note) => note.id !== noteId);
    saveNotes();
    setNoteFormError("That PDF could not be saved. Try again, or clear some browser storage first.");
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


$$(".tabs .tab-btn").forEach((button) => button.addEventListener("click", () => {
  setTab(button.dataset.tab);
}));

$$("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.closeModal)));

$$(".modal-backdrop").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (modal.id === "loginModal" && !state.selectedUser) return;
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
    closeModal("profileModal");
    closeModal("pdfViewerModal");
  }
});

initAmbientShapes();
document.body.dataset.activeTab = state.activeTab;
if (state.selectedUser && !state.claimedUsers.includes(state.selectedUser)) {
  state.claimedUsers.push(state.selectedUser);
  saveClaimedUsers();
}
renderHeaderGreeting();
updateProfileNameField();
renderAll();
if (!state.selectedUser) {
  window.setTimeout(() => requireLogin(), 0);
}
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEYS.claimedUsers) return;
  state.claimedUsers = loadClaimedUsers();
  renderLoginUsers();
});
migrateLegacyPdfData();
