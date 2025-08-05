import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveObject = () => {
 const [inputValue, setInputValue] = useState("");
 const [object, setObject] = useState("");
 
   const onSubmitHandler = async (e) => {
     e.preventDefault();
     // Here you would typically handle the form submission, e.g., sending the inputValue and selectedLength to an API
     console.log("Article Topic:", inputValue);
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
           <h1 className="text-xl font-semibold">Object Removal</h1>
         </div>
         <p className="mt-6 text-sm font-medium">Upload Image</p>
         <input
           onChange={(e) => setInputValue(e.target.files[0])}
           type="file"
           accept="image/*"
           className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
           required
         />
         <p className="text-xs text-gray-500 font-light mt-1">
           Supports JPG, PNG and other image formate
         </p>
         <p className="mt-6 text-sm font-medium">Describe object name to remove</p>
         <textarea
            onChange={(e) => setObject(e.target.value)}
            value={object}
            // type="text"
            row={6}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="eg: watch, spoon, etc."
            required
          ></textarea>
         <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#3C81F6] to-[#3465ea] text-white px-4 py-2 mt-2 text-sm rounded-lg cursor-pointer">
           <Scissors className="w-5" />
           Remove Object
         </button>
       </form>
       {/* right column */}
       <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
         <div className="flex items-center gap-3">
           <Scissors className="w-5 h-5 text-[#4a7aff]" />
           <h1 className="text-xl font-semibold">Processed Image</h1>
         </div>
         <div className="flex-1 flex justify-center items-center">
           <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
             <Scissors className="w-9 h-9" />
             <p>
               Upload an image and click "Remove Object " button to get started.
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 };

export default RemoveObject