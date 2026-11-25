import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp, ArrowRight, BookOpen, Check, ChevronDown, CircleHelp,
  GraduationCap, LayoutDashboard, LoaderCircle, MoreHorizontal, Plus,
  Search, SlidersHorizontal, Sparkles, Trash2, Users, X, Pencil, CalendarDays,
  Phone, Hash, Layers3, ChartNoAxesColumnIncreasing
} from "lucide-react";
import { studentApi } from "./api/studentApi";

const emptyForm = {
  studentCode: "", firstName: "", lastName: "", major: "",
  phone: "", gpa: "", dateOfBirth: ""
};

const initials = (student) =>
  `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();

const palette = ["lavender", "peach", "mint", "blue", "rose"];

function App() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, distinctMajors: 0, averageGpa: 0 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [records, stats] = await Promise.all([
        studentApi.list(search, sort),
        studentApi.summary()
      ]);
      setStudents(records);
      setSummary(stats);
      setError("");
    } catch (err) {
      setError(err.message || "Could not connect to the CampusFlow API.");
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    const timer = setTimeout(loadData, 220);
    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const majors = useMemo(() => {
    const counts = new Map();
    students.forEach((student) => counts.set(student.major, (counts.get(student.major) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [students]);

  function openNewStudent() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditStudent(student) {
    setEditingId(student.id);
    setForm({
      studentCode: student.studentCode,
      firstName: student.firstName,
      lastName: student.lastName,
      major: student.major,
      phone: student.phone || "",
      gpa: String(student.gpa),
      dateOfBirth: student.dateOfBirth || ""
    });
    setError("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      ...form,
      gpa: Number(form.gpa),
      dateOfBirth: form.dateOfBirth || null,
      phone: form.phone.trim() || null
    };

    try {
      if (editingId) {
        await studentApi.update(editingId, payload);
        setNotice("Student details updated.");
      } else {
        await studentApi.create(payload);
        setNotice("Student added to the directory.");
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "The student could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(student) {
    const confirmed = window.confirm(`Remove ${student.firstName} ${student.lastName} from the directory?`);
    if (!confirmed) return;
    try {
      await studentApi.remove(student.id);
      setNotice(`${student.firstName} ${student.lastName} was removed.`);
      await loadData();
    } catch (err) {
      setNotice(err.message || "Could not delete this record.");
    }
  }

  const average = Number(summary.averageGpa || 0).toFixed(2);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="CampusFlow home">
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>campus<span className="brand-light">flow</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-link active" href="#overview"><LayoutDashboard size={17} /> Overview</a>
          <a className="nav-link" href="#directory"><Users size={17} /> Students <span className="nav-count">{summary.totalStudents}</span></a>
        </nav>

        <div className="sidebar-note">
          <div className="note-icon"><Sparkles size={16} /></div>
          <p className="note-title">A little more organized.</p>
          <p className="note-copy">Keep every student detail in one calm, searchable place.</p>
        </div>

        <div className="sidebar-bottom">
          <div className="avatar-small">AG</div>
          <div className="profile-copy"><strong>Administrator</strong><span>Campus workspace</span></div>
          <MoreHorizontal size={18} className="profile-more" />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-right"><span className="live-dot" /> All changes are saved to your database</div>
        </header>

        <div className="page-content" id="overview">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span /> YOUR CAMPUS, AT A GLANCE</div>
              <h1>Student overview<span className="title-period">.</span></h1>
              <p className="page-subtitle">A clear view of the people who make your campus.</p>
            </div>
            <button className="primary-button" onClick={openNewStudent}><Plus size={17} /> Add student</button>
          </section>

          {error && !modalOpen && (
            <div className="connection-alert">
              <CircleHelp size={18} />
              <div><strong>Couldn’t reach the backend.</strong><span>{error} Make sure MySQL and the Spring Boot API are running.</span></div>
              <button onClick={loadData}>Try again <ArrowRight size={14} /></button>
            </div>
          )}

          <section className="stats-grid" aria-label="Student statistics">
            <StatCard icon={<Users size={18} />} label="Students enrolled" value={summary.totalStudents} detail="Across the directory" tone="violet" />
            <StatCard icon={<Layers3 size={18} />} label="Study programmes" value={summary.distinctMajors} detail="Distinct majors" tone="orange" />
            <StatCard icon={<ChartNoAxesColumnIncreasing size={18} />} label="Average GPA" value={average} detail="Out of 10.00" tone="green" />
          </section>

          <section className="directory-section" id="directory">
            <div className="section-heading">
              <div><div className="eyebrow">THE RECORDS</div><h2>Student directory</h2><p>Find a student or make a quick change to their details.</p></div>
              <div className="directory-meta"><span className="status-dot" /> {students.length} {students.length === 1 ? "record" : "records"} shown</div>
            </div>

            <div className="table-toolbar">
              <label className="search-box">
                <Search size={17} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, ID, major..." />
                {search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={15} /></button>}
              </label>
              <label className="sort-control"><SlidersHorizontal size={15} /><span>Sort by</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="name">Student name</option><option value="major">Major</option><option value="gpa">Highest GPA</option><option value="newest">Recently added</option>
                </select><ChevronDown size={14} />
              </label>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>PROGRAMME</th><th>GPA</th><th>PHONE</th><th className="actions-heading">ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="table-state"><LoaderCircle className="spin" size={22} /> Loading student records...</td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan="6" className="table-state"><div className="empty-icon"><BookOpen size={22} /></div><strong>No students found</strong><span>{search ? "Try another search term." : "Add the first student to get the directory started."}</span></td></tr>
                  ) : students.map((student, index) => (
                    <tr key={student.id}>
                      <td><div className="student-cell"><div className={`student-avatar ${palette[index % palette.length]}`}>{initials(student)}</div><div><strong>{student.firstName} {student.lastName}</strong><span>{student.dateOfBirth ? `Born ${student.dateOfBirth}` : "Student profile"}</span></div></div></td>
                      <td><span className="student-code">{student.studentCode}</span></td>
                      <td><span className="major-pill">{student.major}</span></td>
                      <td><span className={`gpa-value ${Number(student.gpa) >= 8.5 ? "high" : ""}`}>{Number(student.gpa).toFixed(2)}</span></td>
                      <td className="phone-cell">{student.phone || "—"}</td>
                      <td><div className="row-actions"><button className="icon-button" title="Edit student" onClick={() => openEditStudent(student)}><Pencil size={15} /></button><button className="icon-button delete-action" title="Delete student" onClick={() => handleDelete(student)}><Trash2 size={15} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>CampusFlow student records</span><span><span className="footer-mark">✳</span> Thoughtfully kept, one record at a time.</span></div>
          </section>

          <section className="bottom-grid">
            <div className="programme-card">
              <div className="small-card-heading"><div><span className="eyebrow">ACADEMIC MIX</span><h3>Programmes</h3></div><BookOpen size={18} /></div>
              {majors.length === 0 ? <p className="muted-copy">Programme breakdown will appear when records are added.</p> :
                majors.slice(0, 4).map(([major, count], i) => (
                  <div className="major-row" key={major}><span>{major}</span><div className="bar-track"><div className={`bar-fill bar-${i}`} style={{ width: `${Math.max(8, (count / Math.max(...majors.map((m) => m[1]))) * 100)}%` }} /></div><strong>{count}</strong></div>
                ))}
            </div>
            <div className="tip-card"><div className="tip-spark"><Sparkles size={17} /></div><div><span className="eyebrow">QUICK TIP</span><h3>Keep records useful.</h3><p>Use a consistent student ID for every learner. It makes searching and updating records much easier.</p></div></div>
          </section>
          <footer className="page-footer"><span>© 2026 CampusFlow</span><span>Student records, made a little simpler.</span></footer>
        </div>
      </main>

      {notice && <div className="toast"><span><Check size={15} /></span>{notice}</div>}

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading"><div><span className="eyebrow">{editingId ? "EDIT RECORD" : "NEW RECORD"}</span><h2 id="modal-title">{editingId ? "Update student" : "Add a student"}</h2><p>Fill in the details below. Fields marked with * are required.</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <FormField label="Student ID *" icon={<Hash size={14} />}><input name="studentCode" value={form.studentCode} onChange={updateField} placeholder="e.g. STU-024" maxLength="20" required /></FormField>
                <FormField label="Major / programme *" icon={<BookOpen size={14} />}><input name="major" value={form.major} onChange={updateField} placeholder="e.g. Computer Science" maxLength="80" required /></FormField>
                <FormField label="First name *"><input name="firstName" value={form.firstName} onChange={updateField} placeholder="First name" maxLength="50" required /></FormField>
                <FormField label="Last name *"><input name="lastName" value={form.lastName} onChange={updateField} placeholder="Last name" maxLength="50" required /></FormField>
                <FormField label="Phone number" icon={<Phone size={14} />}><input name="phone" value={form.phone} onChange={updateField} placeholder="10-digit number" maxLength="15" /></FormField>
                <FormField label="GPA *"><input name="gpa" type="number" min="0" max="10" step="0.01" value={form.gpa} onChange={updateField} placeholder="e.g. 8.25" required /></FormField>
                <FormField label="Date of birth" icon={<CalendarDays size={14} />}><input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={updateField} /></FormField>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button" disabled={busy}>{busy ? <><LoaderCircle size={16} className="spin" /> Saving...</> : <><Check size={16} /> {editingId ? "Save changes" : "Add student"}</>}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, detail, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div><div className={`stat-decoration ${tone}`} /></article>;
}

function FormField({ label, icon, children }) {
  return <label className="form-field"><span>{label} {icon}</span>{children}</label>;
}

export default App;
