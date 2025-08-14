import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Gem, Sparkle, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
    const [loading, setLoadinng] = useState(false);

  const { getToken } = useAuth();

  const getDashboardData = async () => {
   try {
         setLoadinng(true);
         const token = await getToken();
         const { data } = await axios.get("/api/user/get-user-creations", {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
   
         if (data.success) {
           setCreations(data.creations);
         } else {
           toast.error(data.message);
         }
       } catch (error) {
         toast.error(error.message);
       }
       setLoadinng(false);
     };

  useEffect(() => {
    getDashboardData();
  }, []);
  
  return (
    <div className="h-[100vh] overflow-y-scroll p-6">
      <div className="flex justify-star gap-4 flex-wrap">
        {/* total creation card */}
        <div className="flex justify-between items-center w-72 p-4 px-6      bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm"> Total Creations</p>
            <h2 className="tecct-sl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* active paln card  */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active plan</p>
            <h2 className="tecct-sl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
              Plan
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* list of creation */}
      {loading?(<div className="flex justify-center items-center h-full">
           <span className="w-4 h-4 mu-1 rounded-full border-2 border-t-transparent animate-spin"></span>
              </div>):(<div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {creations.map((item) => (
          <CreationItem key={item.id} item={item} />
        ))}
      </div>)}
      
    </div>
  );
};

export default Dashboard;
