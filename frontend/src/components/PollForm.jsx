import { useEffect, useMemo, useState } from "react";

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const defaultForm = {
  title: "",
  description: "",
  options: ["", ""],
  startTime: "",
  endTime: "",
  status: "inactive"
};

export const PollForm = ({ initialData, onSubmit, submitLabel = "Save" }) => {
  const initialState = useMemo(() => {
    if (!initialData) return defaultForm;
    return {
      title: initialData.title,
      description: initialData.description,
      options: initialData.options?.map((option) => option.text) || ["", ""],
      startTime: toDateTimeLocalValue(initialData.startTime),
      endTime: toDateTimeLocalValue(initialData.endTime),
      status: initialData.status || "inactive"
    };
  }, [initialData]);

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const updateOption = (index, value) => {
    const next = [...form.options];
    next[index] = value;
    setForm({ ...form, options: next });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanedOptions = form.options.map((x) => x.trim()).filter(Boolean);
    if (cleanedOptions.length < 2) {
      setError("Please provide at least two options.");
      return;
    }
    if (!form.startTime || !form.endTime || new Date(form.endTime) <= new Date(form.startTime)) {
      setError("End time must be after start time.");
      return;
    }

    onSubmit({
      ...form,
      options: cleanedOptions,
      // Send local wall-clock time to preserve exact hour selected in datetime-local input.
      startTime: `${form.startTime}:00`,
      endTime: `${form.endTime}:00`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-5">
      <input
        className="w-full rounded border p-2"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="w-full rounded border p-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      {form.options.map((option, index) => (
        <input
          key={index}
          className="w-full rounded border p-2"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
          required
        />
      ))}
      <button
        type="button"
        className="rounded border px-3 py-1"
        onClick={() => setForm({ ...form, options: [...form.options, ""] })}
      >
        Add Option
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="datetime-local"
          className="rounded border p-2"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          className="rounded border p-2"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
        />
      </div>
      <select
        className="rounded border p-2"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
        {submitLabel}
      </button>
    </form>
  );
};
