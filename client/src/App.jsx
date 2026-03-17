import UploadResume from "./pages/UploadResume";
import Jobs from "./pages/Jobs";
import Analyze from "./pages/Analyze";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">CareerCopilot AI</h1>
      <p className="app-subtitle">
        Upload your resume, save job descriptions, and analyze your fit.
      </p>

      <UploadResume />
      <Jobs />
      <Analyze />
    </div>
  );
}

export default App;