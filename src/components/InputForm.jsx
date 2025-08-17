import { useState } from "react";

const InputForm = () => {
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
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


        <label className="mb-2 font-semibold">Generated Summary (Editable)</label>
        <textarea
          rows="12"
          placeholder="Your AI-generated summary will appear here..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mb-2 px-4 py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        ></textarea>

        <label className="mb-2 font-semibold">Recipient Email</label>
        <input
          type="email"
          className="px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Generate Summary
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition">
          Share via Email
        </button>
      </div>
    </>
  );
};

export default InputForm;
