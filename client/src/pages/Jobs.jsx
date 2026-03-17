import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {

  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/jobs"
      );

      setJobs(response.data.jobs || []);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/jobs",
        {
          companyName,
          roleTitle,
          description
        }
      );

      setCompanyName("");
      setRoleTitle("");
      setDescription("");

      fetchJobs();

    } catch (err) {

      console.error(err);

    }
  };

  return (
    <div className="section-card">

      <h2 className="section-title">Add Job Description</h2>

      <input
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input
        placeholder="Role Title"
        value={roleTitle}
        onChange={(e) => setRoleTitle(e.target.value)}
      />

      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Save Job
      </button>

      <h3 style={{ marginTop: "20px" }}>Saved Jobs</h3>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="list-item">
            <strong>{job.companyName}</strong>
            <div>{job.roleTitle}</div>
          </div>
        ))
      )}

    </div>
  );
}

export default Jobs;