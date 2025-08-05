import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";

const WriteArticle = () => {
  const articleLength = [
    { legth: 800, text: "Short (500-800 words)" },
    { legth: 1200, text: "Medium (800-1200 words)" },
    { legth: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [inputValue, setInputValue] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission, e.g., sending the inputValue and selectedLength to an API
    console.log("Article Topic:", inputValue);
    console.log("Selected Length:", selectedLength);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6  text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Article Configration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="What is trending in the world"
          required
        ></input>
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="flex flex-wrap gap-3 mt-3 sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#3C81F6] to-[#3465ea] text-white px-4 py-2 mt-2 text-sm rounded-lg cursor-pointer">
          <Edit className="w-5" />
          Generate article
        </button>
      </form>
      {/* right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Generated article</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p>Enter the topic and click generate article button to create article</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
