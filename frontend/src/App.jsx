import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminPollFormPage } from "./pages/AdminPollFormPage";
import { HomePage } from "./pages/HomePage";
import { LiveResultsPage } from "./pages/LiveResultsPage";
import { PollVotingPage } from "./pages/PollVotingPage";
import { ResultsOverviewPage } from "./pages/ResultsOverviewPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/polls/:id" element={<PollVotingPage />} />
        <Route path="/results" element={<ResultsOverviewPage />} />
        <Route path="/results/:id" element={<LiveResultsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/new" element={<AdminPollFormPage />} />
        <Route path="/admin/:id/edit" element={<AdminPollFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
