import { useEffect, useState } from "react";
import axios from "axios";

function Analyze() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const [result, setResult] = useState(null);
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
      setResult(null);
      setSelectedAnalysis(null);

      const resume = resumes.find((r) => r.id === selectedResume);
      const job = jobs.find((j) => j.id === selectedJob);

      const response = await axios.post("http://127.0.0.1:8000/api/analyze", {
        resumeText: resume.extractedText,
        jobDescription: job.description,
      });

      setResult(response.data.parsedResult);
      fetchAnalyses();
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/analyze/${id}`);

      if (selectedAnalysis && selectedAnalysis.id === id) {
        setSelectedAnalysis(null);
      }

      fetchAnalyses();
    } catch (err) {
      console.error("Failed to delete analysis:", err);
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

          <div className="list-item">
            <strong>Match Score:</strong> {result.matchScore} / 100
          </div>

          <div className="list-item">
            <strong>Summary:</strong>
            <p>{result.summary}</p>
          </div>

          <div className="list-item">
            <strong>Missing Skills:</strong>
            <ul>
              {result.missingSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="list-item">
            <strong>Suggestions:</strong>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>Analysis History</h3>

      {analyses.length === 0 ? (
        <p>No past analyses</p>
      ) : (
        analyses.map((item) => {
          let parsed;
          try {
            parsed = JSON.parse(item.result);
          } catch {
            parsed = null;
          }

          return (
            <div key={item.id} className="list-item">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedAnalysis(item)}
              >
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </div>

                <div style={{ marginTop: "6px" }}>
                  {parsed ? parsed.summary : "Invalid data"}
                </div>
              </div>

              <button
                style={{
                  marginTop: "10px",
                  background: "#dc2626",
                }}
                onClick={() => handleDeleteAnalysis(item.id)}
              >
                Delete
              </button>
            </div>
          );
        })
      )}

      {selectedAnalysis && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Analysis</h3>

          {(() => {
            let parsed;
            try {
              parsed = JSON.parse(selectedAnalysis.result);
            } catch {
              return <div className="result-box">Invalid data</div>;
            }

            return (
              <div className="result-box">
                Match Score: {parsed.matchScore}
                {"\n\n"}
                Summary:
                {"\n"}
                {parsed.summary}
                {"\n\n"}
                Missing Skills:
                {"\n"}
                {parsed.missingSkills.join(", ")}
                {"\n\n"}
                Suggestions:
                {"\n"}
                {parsed.suggestions.join(", ")}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default Analyze;