const { useEffect, useState } = React;
const { HashRouter, NavLink, Route, Routes } = ReactRouterDOM;

const starterTasks = [
  { id: 1, title: "Make a little room to focus", priority: "High", done: false },
  { id: 2, title: "Take a proper lunch break", priority: "Low", done: false },
  { id: 3, title: "Send the project update", priority: "Medium", done: true },
];

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return getDateKey(date);
}

function formatDayTitle(dateKey) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" })
    .format(new Date(`${dateKey}T12:00:00`));
}

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAddTask(trimmedTitle, priority);
    setTitle("");
    setPriority("Medium");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="task-title">What needs doing?</label>
      <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs doing?" maxLength={100} required />
      <label className="sr-only" htmlFor="task-priority">Priority</label>
      <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <button className="add-task-button" type="submit"><span aria-hidden="true">+</span> Add task</button>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-row${task.done ? " is-done" : ""}`}>
      <label className="task-check-wrap">
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} aria-label={`${task.done ? "Mark incomplete" : "Complete"}: ${task.title}`} />
        <span className="task-check" aria-hidden="true">{task.done ? "✓" : ""}</span>
      </label>
      <span className="task-title">{task.title}</span>
      <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      <button className="delete-task" type="button" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete task">×</button>
    </li>
  );
}

function TaskList({ tasks, filter, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <div className="empty-state"><span className="empty-mark" aria-hidden="true">✳</span><p>{filter === "All" ? "No tasks just yet. Add one above when you’re ready." : `Nothing ${filter.toLowerCase()} here right now.`}</p></div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}
    </ul>
  );
}

function TasksPage({ selectedDate, setSelectedDate, today, dayTasks, completedCount, remainingCount, visibleTasks, filter, setFilter, query, setQuery, progress, onAddTask, onToggle, onDelete, onClearCompleted }) {
  return (
    <>
      <div className="section-heading">
        <div><p className="eyebrow">MAKE SPACE FOR TODAY</p><h1>{selectedDate === today ? "Today." : formatDayTitle(selectedDate)}</h1></div>
        <div className="day-picker" role="group" aria-label="Choose a day">
          <button className="day-step" type="button" aria-label="Previous day" title="Previous day" onClick={() => setSelectedDate((date) => shiftDate(date, -1))}>‹</button>
          <label className="sr-only" htmlFor="selected-day">Choose day</label>
          <input id="selected-day" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          <button className="day-step" type="button" aria-label="Next day" title="Next day" onClick={() => setSelectedDate((date) => shiftDate(date, 1))}>›</button>
          <button className="today-button" type="button" onClick={() => setSelectedDate(today)}>Today</button>
        </div>
      </div>
      <div className="dashboard">
        <section className="task-panel" aria-label="Task list">
          <div className="panel-topline"><span>YOUR TASKS</span><span className="live-label"><span aria-hidden="true"></span> SAVED LOCALLY</span></div>
          <TaskForm onAddTask={onAddTask} />
          <div className="list-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {["All", "Active", "Completed"].map((name) => <button key={name} type="button" className={`filter-tab${filter === name ? " is-selected" : ""}`} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name}</button>)}
            </div>
            <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search tasks</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label>
          </div>
          <TaskList tasks={visibleTasks} filter={filter} onToggle={onToggle} onDelete={onDelete} />
          <div className="list-footer">
            <span>{remainingCount} {remainingCount === 1 ? "task" : "tasks"} left</span>
            {completedCount > 0 && <button type="button" onClick={onClearCompleted}>Clear completed</button>}
          </div>
        </section>
        <aside className="progress-panel" aria-label="Daily progress">
          <div className="panel-topline"><span>DAY PROGRESS</span></div>
          <p className="progress-number">{progress}<span>%</span></p>
          <p className="progress-caption">of your list<br />is taken care of.</p>
          <div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }}></span></div>
          <div className="progress-details"><span><strong>{completedCount}</strong> done</span><span><strong>{remainingCount}</strong> to go</span></div>
          <p className="gentle-note">One thing at a time is still getting somewhere.</p>
        </aside>
      </div>
    </>
  );
}

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-heading">
      <p className="eyebrow">A CALMER WAY TO GET THINGS DONE</p>
      <h1 id="about-heading">A little more room<br />to think.</h1>
      <div className="about-copy">
        <p>Daymark is a small, thoughtful task manager built to make the day feel more manageable. Keep your next steps in one place, decide what matters, and take things one at a time.</p>
        <p>Your tasks are saved locally in this browser. Add a task, choose its priority, and check it off when it’s done. Daymark keeps the focus on your day, not the noise around it.</p>
      </div>
      <div className="about-details" aria-label="About Daymark">
        <div><span>01</span><strong>Keep it simple</strong><p>A clear list, without extra clutter.</p></div>
        <div><span>02</span><strong>Make it yours</strong><p>Organize tasks by day and priority.</p></div>
        <div><span>03</span><strong>Progress counts</strong><p>Every finished task moves you forward.</p></div>
      </div>
    </section>
  );
}

function App() {
  const today = getDateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("daymark-assignment-4-tasks");
      const storedTasks = savedTasks ? JSON.parse(savedTasks) : starterTasks;
      return storedTasks.map((task) => ({ ...task, date: task.date || today }));
    } catch {
      return starterTasks.map((task) => ({ ...task, date: today }));
    }
  });
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("daymark-assignment-4-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const dayTasks = tasks.filter((task) => task.date === selectedDate);
  const completedCount = dayTasks.filter((task) => task.done).length;
  const remainingCount = dayTasks.length - completedCount;
  const visibleTasks = dayTasks.filter((task) => {
    const matchesFilter = filter === "All" || (filter === "Active" ? !task.done : task.done);
    return matchesFilter && task.title.toLowerCase().includes(query.trim().toLowerCase());
  });
  const progress = dayTasks.length === 0 ? 0 : Math.round((completedCount / dayTasks.length) * 100);

  function addTask(title, priority) {
    setTasks((currentTasks) => [{ id: Date.now(), title, priority, done: false, date: selectedDate }, ...currentTasks]);
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task));
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => task.date !== selectedDate || !task.done));
  }

  return (
    <HashRouter>
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="wordmark" to="/" aria-label="Daymark home">daymark<span>.</span></NavLink>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`} to="/" end>About</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`} to="/tasks">Tasks</NavLink>
          </nav>
          <span className="header-note">A LITTLE MORE ROOM TO THINK</span>
        </div>
      </header>
      <main id="top"><section className="app-section"><Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tasks" element={<TasksPage selectedDate={selectedDate} setSelectedDate={setSelectedDate} today={today} dayTasks={dayTasks} completedCount={completedCount} remainingCount={remainingCount} visibleTasks={visibleTasks} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} progress={progress} onAddTask={addTask} onToggle={toggleTask} onDelete={deleteTask} onClearCompleted={clearCompleted} />} />
          <Route path="*" element={<AboutPage />} />
        </Routes></section></main>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);