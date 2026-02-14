function generateQR(ticketData) {
  QRCode.toCanvas(
    document.getElementById("ticketQR"),
    ticketData,
    { width: 200 }
  );
}

function buyTicket() {
  const user = getCurrentUser();
  const ticket = "TICKET-" + Date.now();

  user.tickets.push(ticket);
  localStorage.setItem("currentUser", JSON.stringify(user));

  generateQR(ticket);
}

function loadAdminPanel() {
  const user = getCurrentUser();
  if (user.role !== "admin") return;

  const users = getUsers();
  const container = document.getElementById("admin-users");

  container.innerHTML = "<h3>All Users</h3>";

  users.forEach(u => {
    const div = document.createElement("div");
    div.textContent = u.username + " (" + u.role + ")";
    container.appendChild(div);
  });
}

function livePreview() {
  const email =
    document.getElementById("edit-email").value;

  document.getElementById("email-preview")
    .textContent = email;
}

const img = document.getElementById("avatar-img");

img.classList.add("updated");

setTimeout(() => {
  img.classList.remove("updated");
}, 300);

function addFriend() {
  const name =
    document.getElementById("friend-input").value;

  if (!name) return;

  const user = getCurrentUser();

  if (!user.friends) user.friends = [];

  user.friends.push(name);

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  );

  loadFriends();
  toast("Friend added!");
}

function loadFriends() {
  const user = getCurrentUser();
  const list =
    document.getElementById("friend-list");

  list.innerHTML = "";

  (user.friends || []).forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    list.appendChild(li);
  });
}

function loadDashboard() {

  const user = getCurrentUser();

  if (!user) {
    window.location.href = "Account.html";
    return;
  }

  // Username display
  document.getElementById("username")
    .textContent = user.username;

  // Email editor
  document.getElementById("edit-email")
    .value = user.email;

  // Avatar
  if (user.avatar) {
    document.getElementById("avatar-img")
      .src = user.avatar;
  }

  // Load systems
  loadTickets();
  loadFriends();
  loadChat();
  loadTheme();
  loadAdminPanel();

  // Welcome toast
  toast("Welcome back " + user.username + "!");
}

function sendMessage() {
  const msg =
    document.getElementById("chat-input").value;

  if (!msg) return;

  const log =
    JSON.parse(localStorage.getItem("chat"))
    || [];

  log.push(msg);

  localStorage.setItem(
    "chat",
    JSON.stringify(log)
  );

  loadChat();
}

function loadChat() {
  const log =
    JSON.parse(localStorage.getItem("chat"))
    || [];

  const ul =
    document.getElementById("chat-log");

  ul.innerHTML = "";

  log.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    ul.appendChild(li);
  });
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  document.body.dataset.theme =
    localStorage.getItem("theme")
    || "default";
}

function resetChat() {
  localStorage.removeItem("chat");
  loadChat();
  toast("Chat cleared");
}

function resetTickets() {
  const user = getCurrentUser();
  user.tickets = [];

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  );

  loadTickets();
  toast("Tickets reset");
}
