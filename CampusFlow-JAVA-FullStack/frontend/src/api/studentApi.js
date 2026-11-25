const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:7070/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Some responses, such as a 204, do not contain JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const studentApi = {
  list: (search = "", sort = "name") =>
    request(`/students?search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}`),
  summary: () => request("/students/summary"),
  create: (student) => request("/students", { method: "POST", body: JSON.stringify(student) }),
  update: (id, student) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(student) }),
  remove: (id) => request(`/students/${id}`, { method: "DELETE" })
};
