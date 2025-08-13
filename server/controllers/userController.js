import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`Select * from creations where user_id=${userId} order by created_at desc`;
    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishCreations = async (req, res) => {
  try {
    const creations = await sql`Select * from creations 
      where publish=true order by created_at desc`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { creationId } = req.body;

    //fetching the creation
    const [creation] =
      await sql`Select * from creations where id=${creationId}`;

    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found.",
      });
    }

    const currentLikes = creation.likes;
    const userIdString = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdString)) {
      //if user already liked the creation
      updatedLikes = currentLikes.filter((user) => user !== userIdString);
      message = "Creation Unliked.";
    } else {
      //if user not liked the creation
      updatedLikes = [...currentLikes, userIdString];
      message = "Creation liked.";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;
    //updating the likes in database
    await sql`UPDATE creations SET likes=${formattedArray}::text[] WHERE id=${creationId}`;
    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
