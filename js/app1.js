
const DOCTORS = [
  { id: 1, name: "Dr. Sarah Ahmed",    specialty: "Cardiologist",    fee: 1500, slots: ["09:00 AM","10:00 AM","11:00 AM","02:00 PM","03:00 PM"], bio: "15 years experience in heart disease." },
  { id: 2, name: "Dr. Usman Ali",      specialty: "Neurologist",     fee: 2000, slots: ["10:00 AM","11:30 AM","01:00 PM","04:00 PM"], bio: "Expert in brain and nervous system disorders." },
  { id: 3, name: "Dr. Ayesha Khan",    specialty: "Dermatologist",   fee: 1200, slots: ["09:30 AM","11:00 AM","02:30 PM","05:00 PM"], bio: "Specializes in skin conditions and treatments." },
  { id: 4, name: "Dr. Bilal Raza",     specialty: "Orthopedic",      fee: 1800, slots: ["08:00 AM","10:30 AM","12:00 PM","03:30 PM"], bio: "Bones, joints and sports injuries specialist." },
  { id: 5, name: "Dr. Nadia Iqbal",    specialty: "Pediatrician",    fee: 1000, slots: ["09:00 AM","10:30 AM","01:00 PM","04:30 PM"], bio: "Caring for children from birth to adolescence." },
  { id: 6, name: "Dr. Kamran Sheikh",  specialty: "General Physician",fee: 800,  slots: ["08:30 AM","11:00 AM","02:00 PM","05:00 PM"], bio: "General health checkups and common illnesses." },
];

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

if (!localStorage.getItem("users")) {
  setData("users", [
   { id: 1, name: "Admin User",      email: "admin@hospital.com",  password: "admin123",   role: "admin"   },
   { id: 2, name: "Dr. Sarah Ahmed", email: "sarah@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 1 },
   { id: 3, name: "Dr. Usman Ali",   email: "usman@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 2 },
   { id: 4, name: "Dr. Ayesha Khan", email: "ayesha@hospital.com", password: "doc123",     role: "doctor",  doctorId: 3 },
   { id: 5, name: "Dr. Bilal Raza",  email: "bilal@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 4 },
   { id: 6, name: "Dr. Nadia Iqbal", email: "nadia@hospital.com",  password: "doc123",     role: "doctor",  doctorId: 5 },
   { id: 7, name: "Dr. Kamran Sheikh", email: "kamran@hospital.com", password: "doc123",     role: "doctor",  doctorId: 6 },
   { id: 8, name: "Test Patient",    email: "patient@test.com",    password: "patient123", role: "patient" },
  ]);
}

if (!localStorage.getItem("appointments")) {
  setData("appointments", []);
}

function getSession() {
  const s = sessionStorage.getItem("currentUser");
  return s ? JSON.parse(s) : null;
}

function setSession(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("currentUser");
}

function requireLogin() {
  if (!getSession()) {
    window.location.href = "login.html";
  }
}

function requireRole(role) {
  const user = getSession();
  if (!user || user.role !== role) {
    window.location.href = "login.html";
  }
}

function redirectByRole(user) {
  if (user.role === "admin")        window.location.href = "admin.html";
  else if (user.role === "doctor")  window.location.href = "doctor.html";
  else                              window.location.href = "dashboard.html";
}

function showAlert(message, type = "success", targetId = "alertBox") {
  const box = document.getElementById(targetId);
  if (!box) return;
 const icons = { success: "Success:", error: "Error:", info: "Info:" };
  box.className = `alert alert-${type}`;
  box.innerHTML = `${icons[type] || ""} ${message}`;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 4000);
}

function validateNotEmpty(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !input.value.trim()) {
    if (input) input.classList.add("error");
    if (error) { error.textContent = message; error.classList.add("show"); }
    return false;
  }
  if (input) input.classList.remove("error");
  if (error) error.classList.remove("show");
  return true;
}

function validateEmail(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input || !emailPattern.test(input.value.trim())) {
    if (input) input.classList.add("error");
    if (error) { error.textContent = "Please enter a valid email address."; error.classList.add("show"); }
    return false;
  }
  if (input) input.classList.remove("error");
  if (error) error.classList.remove("show");
  return true;
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const roleBtns = document.querySelectorAll(".role-btn");
  roleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      roleBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let valid = true;
    valid = validateEmail("email", "emailError") && valid;
    valid = validateNotEmpty("password", "passError", "Password is required.") && valid;
    if (!valid) return;

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const users    = getData("users");
    const user     = users.find(u => u.email === email && u.password === password);

    if (!user) {
      showAlert("Invalid email or password. Please try again.", "error");
      return;
    }
    setSession(user);
    redirectByRole(user);
  });
}

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let valid = true;
    valid = validateNotEmpty("regName",  "nameError",  "Full name is required.") && valid;
    valid = validateEmail("regEmail", "regEmailError") && valid;
    valid = validateNotEmpty("regPass",  "regPassError","Password is required.") && valid;

    const pass    = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;
    if (pass !== confirm) {
      document.getElementById("regConfirm").classList.add("error");
      document.getElementById("confirmError").textContent = "Passwords do not match.";
      document.getElementById("confirmError").classList.add("show");
      valid = false;
    } else {
      document.getElementById("regConfirm").classList.remove("error");
      document.getElementById("confirmError").classList.remove("show");
    }
    if (!valid) return;

    const email = document.getElementById("regEmail").value.trim();
    const users = getData("users");
    if (users.find(u => u.email === email)) {
      showAlert("This email is already registered.", "error");
      return;
    }

    const newUser = {
      id:       Date.now(),
      name:     document.getElementById("regName").value.trim(),
      email:    email,
      password: pass,
      role:     "patient",
      phone:    document.getElementById("regPhone").value.trim() || ""
    };
    users.push(newUser);
    setData("users", users);
    showAlert("Account created! Redirecting to login...", "success");
    setTimeout(() => window.location.href = "login.html", 1800);
  });
}

function initDashboard() {
  requireRole("patient");
  const user = getSession();
  document.getElementById("patientName").textContent = user.name;

  const appointments = getData("appointments").filter(a => a.patientId === user.id);
  document.getElementById("totalAppts").textContent     = appointments.length;
  document.getElementById("upcomingAppts").textContent  = appointments.filter(a => a.status === "Confirmed").length;
  document.getElementById("cancelledAppts").textContent = appointments.filter(a => a.status === "Cancelled").length;

  renderMyAppointments(appointments);
}

function renderMyAppointments(list) {
  const container = document.getElementById("appointmentsList");
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="icon"><i class="fa-solid fa-calendar-xmark"></i></span><p>You have no appointments yet.</p><a href="doctors.html" class="btn btn-primary">Book an Appointment</a></div>`;
    return;
  }
  container.innerHTML = list.map(a => {
    const doc = DOCTORS.find(d => d.id === a.doctorId) || {};
    return `
    <div class="appointment-card">
      <div class="appt-left">
        <div class="appt-icon"><i class="fa-solid fa-stethoscope"></i></div>
        <div>
          <div class="appt-doctor">${doc.name || "Unknown"}</div>
          <div class="appt-detail">${a.date} &nbsp;|&nbsp; ${a.time}
          &nbsp;|&nbsp; ${doc.specialty || ""}</div>
        </div>
      </div>
      <div class="appt-actions">
        <span class="badge badge-${a.status === 'Confirmed' ? 'confirmed' : a.status === 'Cancelled' ? 'cancelled' : 'pending'}">${a.status}</span>
        ${a.status !== "Cancelled" ? `<button class="btn btn-danger btn-sm" onclick="cancelAppointment(${a.id})">Cancel</button>` : ""}
      </div>
    </div>`;
  }).join("");
}

function cancelAppointment(id) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;
  const appointments = getData("appointments");
  const idx = appointments.findIndex(a => a.id === id);
  if (idx !== -1) {
    appointments[idx].status = "Cancelled";
    setData("appointments", appointments);
    showAlert("Appointment cancelled successfully.", "success");
    setTimeout(() => location.reload(), 1200);
  }
}
function initDoctorsPage() {
  requireRole("patient");
  
  // Initial render
  renderDoctors(DOCTORS);

  // Set up event listeners for filtering
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

  grid.innerHTML = list.map(d => `
    <div class="doctor-card">
      <div class="doctor-info">
        <h3>${d.name}</h3>
        <p class="specialty">${d.specialty}</p>
        <p class="bio">${d.bio}</p>
        <div class="fee">Fee: <strong>Rs. ${d.fee}</strong></div>
      </div>
      <button class="btn btn-primary btn-block" onclick="openBooking(${d.id})">Book Appointment</button>
    </div>
  `).join("");
}
function initDoctorPage() {
  requireRole("doctor");

  const user = getSession();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  let doctorId = parseInt(user.doctorId);

  if (!doctorId) {
    const foundDoctor = DOCTORS.find(
      d => d.name.toLowerCase() === user.name.toLowerCase()
    );

    if (foundDoctor) {
      doctorId = foundDoctor.id;
    }
  }

  const doctor = DOCTORS.find(
    d => d.id === doctorId
  );

  const welcomeElement =
    document.getElementById("doctorWelcome");

  if (welcomeElement) {
    welcomeElement.textContent =
      doctor ? `Welcome, ${doctor.name}` : `Welcome, ${user.name}`;
  }

  const allAppointments =
    getData("appointments");

  const doctorAppointments =
    allAppointments.filter(
      a => Number(a.doctorId) === Number(doctorId)
    );

  const today =
    new Date().toISOString().split("T")[0];

  const todayCount =
    doctorAppointments.filter(
      a =>
        a.date === today &&
        a.status === "Confirmed"
    ).length;

  const totalConfirmed =
    doctorAppointments.filter(
      a => a.status === "Confirmed"
    ).length;

  document.getElementById("todayCount").textContent =
    todayCount;

  document.getElementById("totalCount").textContent =
    totalConfirmed;

  renderDoctorSchedule(doctorAppointments);

  console.log("Current Doctor:", user);
  console.log("Doctor ID:", doctorId);
  console.log("Doctor Appointments:", doctorAppointments);
}

function filterDoctors() {
  const search    = document.getElementById("searchInput").value.toLowerCase();
  const specialty = document.getElementById("specialtyFilter").value;
  const filtered  = DOCTORS.filter(d => {
    const matchSearch    = d.name.toLowerCase().includes(search) || d.specialty.toLowerCase().includes(search);
    const matchSpecialty = specialty === "" || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });
  renderDoctors(filtered);
}

function renderDoctorSchedule(list) {

  const tbody =
    document.getElementById("scheduleTableBody");

  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4"
            style="text-align:center;padding:30px;">
          No appointments scheduled.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(a => `
    <tr>
      <td>${a.patientName}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>
        <span class="badge badge-${
          a.status === "Confirmed"
            ? "confirmed"
            : "cancelled"
        }">
          ${a.status}
        </span>
      </td>
    </tr>
  `).join("");
}

function openBooking(doctorId) {
  const user = getSession();
  if (!user) { window.location.href = "login.html"; return; }

  const doc = DOCTORS.find(d => d.id === doctorId);
  if (!doc) return;

  document.getElementById("modalDoctorName").textContent = doc.name + " — " + doc.specialty;
  const slotSelect = document.getElementById("bookingTime");
  slotSelect.innerHTML = doc.slots.map(s => `<option value="${s}">${s}</option>`).join("");
  document.getElementById("currentDoctorId").value = doctorId;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("bookingDate").setAttribute("min", today);

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

  const user     = getSession();
  const doctorId = parseInt(document.getElementById("currentDoctorId").value);
  const appointments = getData("appointments");

  const conflict = appointments.find(a =>
    a.doctorId === doctorId && a.date === date && a.time === time && a.status !== "Cancelled"
  );
  if (conflict) {
    showAlert("This time slot is already booked. Please choose another.", "error", "bookingAlert");
    return;
  }

  const newAppt = {
    id:        Date.now(),
    patientId: user.id,
    patientName: user.name,
    doctorId:  doctorId,
    date:      date,
    time:      time,
    notes:     notes,
    status:    "Confirmed"
  };
  appointments.push(newAppt);
  setData("appointments", appointments);

  showAlert("Appointment booked successfully! ", "success", "bookingAlert");
  setTimeout(() => { closeModal(); window.location.href = "dashboard.html"; }, 1600);
}

function initAdminPage() {
  requireRole("admin");
  const appointments = getData("appointments");
  const users        = getData("users");

  document.getElementById("totalApptsStat").textContent    = appointments.length;
  document.getElementById("confirmedStat").textContent     = appointments.filter(a => a.status === "Confirmed").length;
  document.getElementById("cancelledStat").textContent     = appointments.filter(a => a.status === "Cancelled").length;
  document.getElementById("totalPatientsStat").textContent = users.filter(u => u.role === "patient").length;

  renderAdminTable(appointments);
}

function renderAdminTable(list) {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#64748b;">No appointments found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => {
    const doc = DOCTORS.find(d => d.id === a.doctorId);
    return `
    <tr>
      <td data-label="Patient">${a.patientName}</td>
      <td data-label="Doctor">${doc ? doc.name : "N/A"}</td>
      <td data-label="Specialty">${doc ? doc.specialty : "N/A"}</td>
      <td data-label="Date">${a.date}</td>
      <td data-label="Time">${a.time}</td>
      <td data-label="Status"><span class="badge badge-${a.status === 'Confirmed' ? 'confirmed' : 'cancelled'}">${a.status}</span></td>
    </tr>`;
  }).join("");
}

function filterAdminTable() {
  const search = document.getElementById("adminSearch").value.toLowerCase();
  const all    = getData("appointments");
  const filtered = all.filter(a => {
    const doc = DOCTORS.find(d => d.id === a.doctorId);
    return a.patientName.toLowerCase().includes(search) ||
           (doc && doc.name.toLowerCase().includes(search));
  });
  renderAdminTable(filtered);
}


function logout() {
  clearSession();
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
  const page = window.location.pathname.split("/").pop();
  if (page === "login.html" || page === "")          initLoginPage();
  else if (page === "register.html")                 initRegisterPage();
  else if (page === "dashboard.html")                initDashboard();
  else if (page === "doctors.html")                  initDoctorsPage();
  else if (page === "admin.html")                    initAdminPage();
  else if (page === "doctor.html")                   initDoctorPage();
});
