import { useEffect, useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchResumes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/resumes");
      setResumes(response.data.resumes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resumes");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/resumes/upload",
        formData
      );

      setResult(response.data);
      fetchResumes();
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Resume"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-box">
          {JSON.stringify(result, null, 2)}
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>Saved Resumes</h3>

      {resumes.length === 0 ? (
        <p>No resumes found</p>
      ) : (
        resumes.map((resume) => (
          <div key={resume.id} className="list-item">
            <strong>{resume.fileName}</strong>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              ID: {resume.id}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UploadResume;