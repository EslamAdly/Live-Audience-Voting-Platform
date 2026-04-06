import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PollForm } from "../components/PollForm";
import { pollService } from "../services/pollService";
import { getApiErrorMessage } from "../utils/apiError";

export const AdminPollFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    pollService
      .getPollById(id)
      .then(setInitialData)
      .catch((err) => setError(getApiErrorMessage(err, "Failed to load poll")));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setError("");
    try {
      if (isEdit) {
        await pollService.updatePoll(id, payload);
      } else {
        await pollService.createPoll(payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(getApiErrorMessage(err, "Save failed"));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{isEdit ? "Edit Poll" : "Create Poll"}</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <PollForm initialData={initialData} onSubmit={handleSubmit} submitLabel={isEdit ? "Update" : "Create"} />
    </div>
  );
};
