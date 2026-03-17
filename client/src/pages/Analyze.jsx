import { useEffect, useState } from "react";
import axios from "axios";

function Analyze() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetchResumes();
    fetchJobs();
  }, []);

  const fetchResumes = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/resumes");
    setResumes(response.data.resumes || []);
  };

  const fetchJobs = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/jobs");
    setJobs(response.data.jobs || []);
  };

  const handleAnalyze = async () => {
    const resume = resumes.find((r) => r.id === selectedResume);
    const job = jobs.find((j) => j.id === selectedJob);

    const response = await axios.post("http://127.0.0.1:8000/api/analyze", {
      resumeText: resume.extractedText,
      jobDescription: job.description,
    });

    setResult(response.data.result);
  };

  return (
    <div>
      <h2>Analyze Resume vs Job</h2>

      <select onChange={(e) => setSelectedResume(e.target.value)} value={selectedResume}>
        <option value="">Select Resume</option>
        {resumes.map((resume) => (
          <option key={resume.id} value={resume.id}>
            {resume.fileName}
          </option>
        ))}
      </select>

      <br />

      <select onChange={(e) => setSelectedJob(e.target.value)} value={selectedJob}>
        <option value="">Select Job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.companyName} - {job.roleTitle}
          </option>
        ))}
      </select>

      <br />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      {result && (
        <pre>{result}</pre>
      )}
    </div>
  );
}

export default Analyze;