import { useState } from "react";
import ReactMarkdown from "react-markdown";

const InputForm = () => {
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    setLoading(true);
    setShowSummary(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const res = await fetch(
        "https://meetingsummarizerbackend-4mh9.onrender.com/api/summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      setSummary("⚠️ Failed to generate summary. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !summary) {
      alert("Please generate summary and enter recipient email!");
      return;
    }

    try {
      setEmailStatus("Sending...");
      const res = await fetch(
        "https://meetingsummarizerbackend-4mh9.onrender.com/api/send_email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, summary }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setEmailStatus("✅ Email sent successfully!");
      } else {
        setEmailStatus(`⚠️ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("⚠️ Failed to send email.");
    }
  };

  return (
    <>
      <div className="rounded-lg mt-10 w-full max-w-3xl flex flex-col p-6 shadow-md">
        <label className="mb-2 font-semibold">Upload File (doc, pdf, txt)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="mb-6"
          onChange={handleFileChange}
        />

        <label className="mb-2 font-semibold">Custom Instructions/Prompt</label>
        <input
          type="text"
          placeholder="For example, summarize in bullet points"
          className="px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          onChange={(e) => setPrompt(e.target.value)}
        />

        {showSummary && (
          <>
            <label className="mb-2 font-semibold">Generated Summary</label>
            {loading ? (
              <div className="animate-pulse h-40 bg-gray-200 rounded-md mb-6"></div>
            ) : (
              <div className="mb-6">
                {editMode ? (
                  <textarea
                    rows="12"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  ></textarea>
                ) : (
                  <div className="prose bg-gray-50 p-4 rounded-md shadow-md max-h-96 overflow-y-auto">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  </div>
                )}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  {editMode ? "Preview" : "Edit"}
                </button>
              </div>
            )}
          </>
        )}

        <label className="mb-2 font-semibold">Recipient Email</label>
        <input
          type="email"
          className="px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailStatus && <p className="text-sm text-gray-600">{emailStatus}</p>}
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
        >
          Share via Email
        </button>
      </div>
    </>
  );
};

export default InputForm;
