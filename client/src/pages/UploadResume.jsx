import { useEffect, useState } from "react";
import axios from "axios";

function UploadResume() {

  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/resumes"
      );
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

      await axios.post(
        "http://127.0.0.1:8000/api/resumes/upload",
        formData
      );

      fetchResumes();

    } catch (err) {

      console.error(err);
      setError("Upload failed");

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

      <button onClick={handleUpload}>
        Upload
      </button>

      {error && <p>{error}</p>}

      <h3>Saved Resumes</h3>

      {resumes.map((resume) => (
        <div key={resume.id}>
          {resume.fileName}
        </div>
      ))}

    </div>
  );
}

export default UploadResume;