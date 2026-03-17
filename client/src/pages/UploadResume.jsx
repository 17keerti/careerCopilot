import { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/resumes/upload",
        formData
      );

      setResult(response.data);

    } catch (err) {

      console.error("Upload error:", err);

      setError(
        err.response?.data?.error ||
        err.message ||
        "Upload failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{color:"red"}}>{error}</p>}

      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  );
}

export default UploadResume;