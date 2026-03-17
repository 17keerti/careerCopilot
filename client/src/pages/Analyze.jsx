import { useEffect, useState } from "react";
import axios from "axios";

function Analyze() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/resumes");
      setResumes(response.data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/jobs");
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/analyze");
      setAnalyses(response.data.analyses || []);
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchJobs();
    fetchAnalyses();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJob) {
      setError("Please select both a resume and a job");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const resume = resumes.find((item) => item.id === selectedResume);
      const job = jobs.find((item) => item.id === selectedJob);

      const response = await axios.post("http://127.0.0.1:8000/api/analyze", {
        resumeText: resume.extractedText,
        jobDescription: job.description,
      });

      setResult(response.data.analysis.result);
      fetchAnalyses();
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Analyze Resume vs Job</h2>

      <label>Select Resume</label>
      <select
        value={selectedResume}
        onChange={(e) => setSelectedResume(e.target.value)}
      >
        <option value="">Select Resume</option>
        {resumes.map((resume) => (
          <option key={resume.id} value={resume.id}>
            {resume.fileName}
          </option>
        ))}
      </select>

      <label>Select Job</label>
      <select
        value={selectedJob}
        onChange={(e) => setSelectedJob(e.target.value)}
      >
        <option value="">Select Job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.companyName} - {job.roleTitle}
          </option>
        ))}
      </select>

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Analysis Result</h3>
          <div className="result-box">{result}</div>
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>Analysis History</h3>

      {analyses.length === 0 ? (
        <p>No past analyses</p>
      ) : (
        analyses.map((item) => (
          <div key={item.id} className="list-item">
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {new Date(item.createdAt).toLocaleString()}
            </div>
            <div style={{ marginTop: "6px", whiteSpace: "pre-wrap" }}>
              {item.result.slice(0, 200)}...
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Analyze;