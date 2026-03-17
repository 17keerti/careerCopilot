import { useState } from "react";
import UploadResume from "./pages/UploadResume";
import Jobs from "./pages/Jobs";
import Analyze from "./pages/Analyze";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="app-container">

      <h1 className="app-title">CareerCopilot AI</h1>
      <p className="app-subtitle">
        Upload your resume, save jobs, and analyze your fit
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("upload")}>
          Upload Resume
        </button>

        <button onClick={() => setActiveTab("jobs")}>
          Jobs
        </button>

        <button onClick={() => setActiveTab("analyze")}>
          Analyze
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "upload" && <UploadResume />}
      {activeTab === "jobs" && <Jobs />}
      {activeTab === "analyze" && <Analyze />}

    </div>
  );
}

export default App;