import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoadinng] = useState(false);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreation = async () => {
    try {
      setLoadinng(true);
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-publish-creations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        console.log("relike")
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoadinng(false);
  };

  const toggleImageLike = async (creationId) => {
    console.log(creationId)
    try {
      const token = await getToken();
      
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { creationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data",data);
      if (data.success) {
        console.log("toggle like")
        toast.success(data.message);
        fetchCreation(); // refetching the creations after liking/unliking
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoadinng(false);
  };

  useEffect(() => {
    if (user) {
      fetchCreation();
    }
  }, [user]);

  return !loading? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      Creations
      <div className="bg-white h-full w-full rounded-xl overflow-y-scrpll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt={creation.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className="absolute bottom-0 top-0 right-0 left-3  flex items-end justify-end group-hover:justify-between 
            p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white gap-2 rounded-lg"
            >
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex items-center gap-1">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => toggleImageLike(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer 
                  ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ):(
     <div className="flex justify-center items-center h-full">
           <span className="w-4 h-4 mu-1 rounded-full border-2 border-t-transparent animate-spin"></span>
              </div>
  );
};

export default Community;
