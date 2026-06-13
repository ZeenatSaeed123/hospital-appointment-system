// --- DOCTORS DATA ---
const DOCTORS = [
  { id: 1, name: "Dr. Sarah Ahmed",    specialty: "Cardiologist",    fee: 1500, slots: ["09:00 AM","10:00 AM","11:00 AM","02:00 PM","03:00 PM"], bio: "15 years experience in heart disease." },
  { id: 2, name: "Dr. Usman Ali",      specialty: "Neurologist",     fee: 2000, slots: ["10:00 AM","11:30 AM","01:00 PM","04:00 PM"], bio: "Expert in brain and nervous system disorders." },
  { id: 3, name: "Dr. Ayesha Khan",    specialty: "Dermatologist",   fee: 1200, slots: ["09:30 AM","11:00 AM","02:30 PM","05:00 PM"], bio: "Specializes in skin conditions and treatments." },
  { id: 4, name: "Dr. Bilal Raza",     specialty: "Orthopedic",      fee: 1800, slots: ["08:00 AM","10:30 AM","12:00 PM","03:30 PM"], bio: "Bones, joints and sports injuries specialist." },
  { id: 5, name: "Dr. Nadia Iqbal",    specialty: "Pediatrician",    fee: 1000, slots: ["09:00 AM","10:30 AM","01:00 PM","04:30 PM"], bio: "Caring for children from birth to adolescence." },
  { id: 6, name: "Dr. Kamran Sheikh",  specialty: "General Physician",fee: 800,  slots: ["08:30 AM","11:00 AM","02:00 PM","05:00 PM"], bio: "General health checkups and common illnesses." },
];

// --- STORAGE HELPER FUNCTIONS ---
function getData(key) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSession() {
  const s = sessionStorage.getItem("currentUser");
  if (s) {
    return JSON.parse(s);
  } else {
    return null;
  }
}

function setSession(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("currentUser");
}

// --- INITIALIZE DEFAULT STORAGE USERS ---
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { id: 1, name: "Admin User",      email: "admin@hospital.com",  password: "admin123",   role: "admin"   },
    { id: 2, name: "Dr. Sarah Ahmed", email: "sarah@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 1 },
    { id: 3, name: "Dr. Usman Ali",   email: "usman@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 2 },
    { id: 4, name: "Dr. Ayesha Khan", email: "ayesha@hospital.com", password: "doc123",     role: "doctor",  doctorId: 3 },
    { id: 5, name: "Dr. Bilal Raza",  email: "bilal@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 4 },
    { id: 6, name: "Dr. Nadia Iqbal", email: "nadia@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 5 },
    { id: 7, name: "Dr. Kamran Sheikh", email: "kamran@hospital.com", password: "doc123",     role: "doctor",  doctorId: 6 },
    { id: 8, name: "Test Patient",    email: "patient@test.com",    password: "patient123", role: "patient" },
  ];
  setData("users", defaultUsers);
}

if (!localStorage.getItem("appointments")) {
  setData("appointments", []);
}

// --- SECURITY & ROUTING FUNCTIONS ---
function requireLogin() {
  if (getSession() === null) {
    window.location.href = "login.html";
  }
}

function requireRole(role) {
  const user = getSession();
  if (user === null || user.role !== role) {
    window.location.href = "login.html";
  }
}

function redirectByRole(user) {
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else if (user.role === "doctor") {
    window.location.href = "doctor.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

// --- ALERTS AND VALIDATIONS ---
function showAlert(message, type, targetId) {
  if (!type) { type = "success"; }
  if (!targetId) { targetId = "alertBox"; }
  
  const box = document.getElementById(targetId);
  if (!box) return;

  let label = "Info:";
  if (type === "success") { label = "Success:"; }
  if (type === "error") { label = "Error:"; }

  box.className = "alert alert-" + type;
  box.innerHTML = label + " " + message;
  box.classList.remove("hidden");

  setTimeout(function() {
    box.classList.add("hidden");
  }, 4000);
}

function validateNotEmpty(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  if (!input || input.value.trim() === "") {
    if (input) { input.classList.add("error"); }
    if (error) { error.textContent = message; error.classList.add("show"); }
    return false;
  }
  
  if (input) { input.classList.remove("error"); }
  if (error) { error.classList.remove("show"); }
  return true;
}

function validateEmail(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!input || !emailPattern.test(input.value.trim())) {
    if (input) { input.classList.add("error"); }
    if (error) { error.textContent = "Please enter a valid email address."; error.classList.add("show"); }
    return false;
  }
  
  if (input) { input.classList.remove("error"); }
  if (error) { error.classList.remove("show"); }
  return true;
}

// --- LOGIN PAGE LOGIC ---
function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const roleBtns = document.querySelectorAll(".role-btn");
  roleBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      roleBtns.forEach(function(b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
    });
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let isEmailValid = validateEmail("email", "emailError");
    let isPassValid = validateNotEmpty("password", "passError", "Password is required.");
    if (!isEmailValid || !isPassValid) return;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const users = getData("users");
    
    let matchedUser = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        matchedUser = users[i];
        break;
      }
    }

    if (matchedUser === null) {
      showAlert("Invalid email or password. Please try again.", "error");
      return;
    }
    
    setSession(matchedUser);
    redirectByRole(matchedUser);
  });
}

// --- REGISTER PAGE LOGIC ---
function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let v1 = validateNotEmpty("regName", "nameError", "Full name is required.");
    let v2 = validateEmail("regEmail", "regEmailError");
    let v3 = validateNotEmpty("regPass", "regPassError", "Password is required.");
    if (!v1 || !v2 || !v3) return;

    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;
    
    if (pass !== confirm) {
      document.getElementById("regConfirm").classList.add("error");
      document.getElementById("confirmError").textContent = "Passwords do not match.";
      document.getElementById("confirmError").classList.add("show");
      return;
    } else {
      document.getElementById("regConfirm").classList.remove("error");
      document.getElementById("confirmError").classList.remove("show");
    }

    const email = document.getElementById("regEmail").value.trim();
    const users = getData("users");
    
    let emailExists = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        emailExists = true;
        break;
      }
    }

    if (emailExists) {
      showAlert("This email is already registered.", "error");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: document.getElementById("regName").value.trim(),
      email: email,
      password: pass,
      role: "patient",
      phone: document.getElementById("regPhone").value.trim() || ""
    };
    
    users.push(newUser);
    setData("users", users);
    showAlert("Account created! Redirecting to login...", "success");
    setTimeout(function() { window.location.href = "login.html"; }, 1800);
  });
}

// --- PATIENT DASHBOARD LOGIC ---
function initDashboard() {
  requireRole("patient");
  const user = getSession();
  document.getElementById("patientName").textContent = user.name;

  const allAppts = getData("appointments");
  let myAppts = [];
  let confirmedCount = 0;
  let cancelledCount = 0;

  for (let i = 0; i < allAppts.length; i++) {
    if (allAppts[i].patientId === user.id) {
      myAppts.push(allAppts[i]);
      if (allAppts[i].status === "Confirmed") {
        confirmedCount++;
      } else if (allAppts[i].status === "Cancelled") {
        cancelledCount++;
      }
    }
  }

  document.getElementById("totalAppts").textContent = myAppts.length;
  document.getElementById("upcomingAppts").textContent = confirmedCount;
  document.getElementById("cancelledAppts").textContent = cancelledCount;

  renderMyAppointments(myAppts);
}

function renderMyAppointments(list) {
  const container = document.getElementById("appointmentsList");
  if (!container) return;
  
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="icon"><i class="fa-solid fa-calendar-xmark"></i></span><p>You have no appointments yet.</p><a href="doctors.html" class="btn btn-primary">Book an Appointment</a></div>`;
    return;
  }

  let htmlContent = "";
  for (let i = 0; i < list.length; i++) {
    const appt = list[i];
    
    let doc = { name: "Unknown", specialty: "" };
    for (let j = 0; j < DOCTORS.length; j++) {
      if (DOCTORS[j].id === appt.doctorId) {
        doc = DOCTORS[j];
        break;
      }
    }

    let badgeClass = "pending";
    if (appt.status === "Confirmed") { badgeClass = "confirmed"; }
    if (appt.status === "Cancelled") { badgeClass = "cancelled"; }

    let actionButton = "";
    if (appt.status !== "Cancelled") {
      actionButton = `<button class="btn btn-danger btn-sm" onclick="cancelAppointment(${appt.id})">Cancel</button>`;
    }

    htmlContent += `
    <div class="appointment-card">
      <div class="appt-left">
        <div class="appt-icon"><i class="fa-solid fa-stethoscope"></i></div>
        <div>
          <div class="appt-doctor">${doc.name}</div>
          <div class="appt-detail">${appt.date} &nbsp;|&nbsp; ${appt.time} &nbsp;|&nbsp; ${doc.specialty}</div>
        </div>
      </div>
      <div class="appt-actions">
        <span class="badge badge-${badgeClass}">${appt.status}</span>
        ${actionButton}
      </div>
    </div>`;
  }
  container.innerHTML = htmlContent;
}

function cancelAppointment(id) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;
  
  const appointments = getData("appointments");
  for (let i = 0; i < appointments.length; i++) {
    if (appointments[i].id === id) {
      appointments[i].status = "Cancelled";
      break;
    }
  }
  
  setData("appointments", appointments);
  showAlert("Appointment cancelled successfully.", "success");
  setTimeout(function() { location.reload(); }, 1200);
}

// --- PATIENT FIND DOCTORS LOGIC ---
function initDoctorsPage() {
  requireRole("patient");
  renderDoctors(DOCTORS);

  document.getElementById("searchInput").addEventListener("input", filterDoctors);
  document.getElementById("specialtyFilter").addEventListener("change", filterDoctors);
}

function renderDoctors(list) {
  const grid = document.getElementById("doctorsGrid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No doctors found matching your criteria.</p>`;
    return;
  }

  let htmlContent = "";
  for (let i = 0; i < list.length; i++) {
    const d = list[i];
    htmlContent += `
    <div class="doctor-card">
      <div class="doctor-info">
        <h3>${d.name}</h3>
        <p class="specialty">${d.specialty}</p>
        <p class="bio">${d.bio}</p>
        <div class="fee">Fee: <strong>Rs. ${d.fee}</strong></div>
      </div>
      <button class="btn btn-primary btn-block" onclick="openBooking(${d.id})">Book Appointment</button>
    </div>`;
  }
  grid.innerHTML = htmlContent;
}

function filterDoctors() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const specialty = document.getElementById("specialtyFilter").value;
  
  let filtered = [];
  for (let i = 0; i < DOCTORS.length; i++) {
    const d = DOCTORS[i];
    const matchSearch = d.name.toLowerCase().includes(search) || d.specialty.toLowerCase().includes(search);
    const matchSpecialty = (specialty === "" || d.specialty === specialty);

    if (matchSearch && matchSpecialty) {
      filtered.push(d);
    }
  }
  renderDoctors(filtered);
}

// --- BOOKING MODAL LOGIC ---
function openBooking(doctorId) {
  const user = getSession();
  if (!user) { window.location.href = "login.html"; return; }

  let doc = null;
  for (let i = 0; i < DOCTORS.length; i++) {
    if (DOCTORS[i].id === doctorId) {
      doc = DOCTORS[i];
      break;
    }
  }
  if (!doc) return;

  document.getElementById("modalDoctorName").textContent = doc.name + " — " + doc.specialty;
  
  let slotOptions = "";
  for (let j = 0; j < doc.slots.length; j++) {
    slotOptions += `<option value="${doc.slots[j]}">${doc.slots[j]}</option>`;
  }
  
  document.getElementById("bookingTime").innerHTML = slotOptions;
  document.getElementById("currentDoctorId").value = doctorId;

  // Simple local date calculation (Format: YYYY-MM-DD)
  const d = new Date();
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  if (month.length < 2) { month = "0" + month; }
  if (day.length < 2) { day = "0" + day; }
  const todayString = d.getFullYear() + "-" + month + "-" + day;
  
  document.getElementById("bookingDate").setAttribute("min", todayString);
  document.getElementById("bookingModal").classList.add("active");
}

function closeModal() {
  document.getElementById("bookingModal").classList.remove("active");
}

function confirmBooking() {
  const date = document.getElementById("bookingDate").value;
  const time = document.getElementById("bookingTime").value;
  const notes = document.getElementById("bookingNotes").value;

  if (!date) {
    showAlert("Please select a date.", "error", "bookingAlert");
    return;
  }

  const user = getSession();
  const doctorId = parseInt(document.getElementById("currentDoctorId").value);
  const appointments = getData("appointments");

  let conflict = false;
  for (let i = 0; i < appointments.length; i++) {
    const a = appointments[i];
    if (a.doctorId === doctorId && a.date === date && a.time === time && a.status !== "Cancelled") {
      conflict = true;
      break;
    }
  }

  if (conflict) {
    showAlert("This time slot is already booked. Please choose another.", "error", "bookingAlert");
    return;
  }

  const newAppt = {
    id: Date.now(),
    patientId: user.id,
    patientName: user.name,
    doctorId: doctorId,
    date: date,
    time: time,
    notes: notes,
    status: "Confirmed"
  };
  
  appointments.push(newAppt);
  setData("appointments", appointments);

  showAlert("Appointment booked successfully! ", "success", "bookingAlert");
  setTimeout(function() { closeModal(); window.location.href = "dashboard.html"; }, 1600);
}

// --- DOCTOR PORTAL LOGIC ---
function initDoctorPage() {
  requireRole("doctor");
  const user = getSession();
  if (!user) { window.location.href = "login.html"; return; }

  let doctorId = parseInt(user.doctorId);
  if (!doctorId) {
    for (let i = 0; i < DOCTORS.length; i++) {
      if (DOCTORS[i].name.toLowerCase() === user.name.toLowerCase()) {
        doctorId = DOCTORS[i].id;
        break;
      }
    }
  }

  let doctor = null;
  for (let i = 0; i < DOCTORS.length; i++) {
    if (DOCTORS[i].id === doctorId) {
      doctor = DOCTORS[i];
      break;
    }
  }

  const welcomeElement = document.getElementById("doctorWelcome");
  if (welcomeElement) {
    if (doctor) {
      welcomeElement.textContent = "Welcome, " + doctor.name;
    } else {
      welcomeElement.textContent = "Welcome, " + user.name;
    }
  }

  const allAppointments = getData("appointments");
  let doctorAppointments = [];
  
  for (let i = 0; i < allAppointments.length; i++) {
    if (Number(allAppointments[i].doctorId) === Number(doctorId)) {
      doctorAppointments.push(allAppointments[i]);
    }
  }

  // Get safe local today string
  const d = new Date();
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  if (month.length < 2) { month = "0" + month; }
  if (day.length < 2) { day = "0" + day; }
  const today = d.getFullYear() + "-" + month + "-" + day;

  let todayCount = 0;
  let totalConfirmed = 0;

  for (let i = 0; i < doctorAppointments.length; i++) {
    const a = doctorAppointments[i];
    if (a.status === "Confirmed") {
      totalConfirmed++;
      if (a.date === today) {
        todayCount++;
      }
    }
  }

  const todayCountEl = document.getElementById("todayCount");
  const totalCountEl = document.getElementById("totalCount");
  if (todayCountEl) todayCountEl.textContent = todayCount;
  if (totalCountEl) totalCountEl.textContent = totalConfirmed;

  renderDoctorSchedule(doctorAppointments);
}

function renderDoctorSchedule(list) {
  const tbody = document.getElementById("scheduleTableBody");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;">No appointments scheduled.</td></tr>`;
    return;
  }

  let htmlContent = "";
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    let badgeClass = "cancelled";
    if (a.status === "Confirmed") { badgeClass = "confirmed"; }

    htmlContent += `
    <tr>
      <td>${a.patientName}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td><span class="badge badge-${badgeClass}">${a.status}</span></td>
    </tr>`;
  }
  tbody.innerHTML = htmlContent;
}

// --- ADMIN PORTAL LOGIC ---
function initAdminPage() {
  requireRole("admin");
  const appointments = getData("appointments");
  const users = getData("users");

  let confirmedCount = 0;
  let cancelledCount = 0;
  for (let i = 0; i < appointments.length; i++) {
    if (appointments[i].status === "Confirmed") { confirmedCount++; }
    if (appointments[i].status === "Cancelled") { cancelledCount++; }
  }

  let patientCount = 0;
  for (let j = 0; j < users.length; j++) {
    if (users[j].role === "patient") { patientCount++; }
  }

  document.getElementById("totalApptsStat").textContent = appointments.length;
  document.getElementById("confirmedStat").textContent = confirmedCount;
  document.getElementById("cancelledStat").textContent = cancelledCount;
  document.getElementById("totalPatientsStat").textContent = patientCount;

  renderAdminTable(appointments);
}

function renderAdminTable(list) {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;
  
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#64748b;">No appointments found.</td></tr>`;
    return;
  }

  let htmlContent = "";
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    
    let doc = null;
    for (let j = 0; j < DOCTORS.length; j++) {
      if (DOCTORS[j].id === a.doctorId) {
        doc = DOCTORS[j];
        break;
      }
    }

    let docName = "N/A";
    let docSpecialty = "N/A";
    if (doc) {
      docName = doc.name;
      docSpecialty = doc.specialty;
    }

    let badgeClass = "cancelled";
    if (a.status === "Confirmed") { badgeClass = "confirmed"; }

    htmlContent += `
    <tr>
      <td data-label="Patient">${a.patientName}</td>
      <td data-label="Doctor">${docName}</td>
      <td data-label="Specialty">${docSpecialty}</td>
      <td data-label="Date">${a.date}</td>
      <td data-label="Time">${a.time}</td>
      <td data-label="Status"><span class="badge badge-${badgeClass}">${a.status}</span></td>
    </tr>`;
  }
  tbody.innerHTML = htmlContent;
}

function filterAdminTable() {
  const search = document.getElementById("adminSearch").value.toLowerCase();
  const all = getData("appointments");
  let filtered = [];

  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    
    let doc = null;
    for (let j = 0; j < DOCTORS.length; j++) {
      if (DOCTORS[j].id === a.doctorId) {
        doc = DOCTORS[j];
        break;
      }
    }

    let matchesDocName = false;
    if (doc && doc.name.toLowerCase().includes(search)) {
      matchesDocName = true;
    }

    if (a.patientName.toLowerCase().includes(search) || matchesDocName) {
      filtered.push(a);
    }
  }
  renderAdminTable(filtered);
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}

// --- GLOBAL PAGE ROUTER ---
document.addEventListener("DOMContentLoaded", function() {
  const page = window.location.pathname.split("/").pop();
  if (page === "login.html" || page === "") {
    initLoginPage();
  } else if (page === "register.html") {
    initRegisterPage();
  } else if (page === "dashboard.html") {
    initDashboard();
  } else if (page === "doctors.html") {
    initDoctorsPage();
  } else if (page === "admin.html") {
    initAdminPage();
  } else if (page === "doctor.html") {
    initDoctorPage();
  }
});