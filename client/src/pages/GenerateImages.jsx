import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageCategories = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon",
    "Abstract",
    "Nature",
    "Urban",
    "Fantasy style",
  ];

  const [selecteCategory, setSelectedCategory] = useState("Realistic");
  const [inputValue, setInputValue] = useState("");
  const [publish, setPublish] = useState(false); //used to track the publish in community
  const [loading, setLoadinng] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadinng(true);
      const prompt = `generate an image of ${inputValue} in the style  ${selecteCategory}`;

      const token = await getToken();

      const { data } = await axios.post(
        //destructuting the response { data, status, ... }
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoadinng(false);
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
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe your Image</p>
        <textarea
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          row={6}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe the image what you want too see..."
          required
        ></textarea>
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="flex flex-wrap gap-3 mt-3 sm:max-w-9/11">
          {imageCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selecteCategory === item
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 my-6">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#3C81F6] to-[#3465ea] text-white px-4 py-2 mt-2 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 mu-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate image
        </button>
      </form>
      {/* right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>
                Describe your image and click "Generate image" to get started.{" "}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full ">
            <img src={content} alt="image" className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
};
export default GenerateImages;
