import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { response } from "express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // The base URL for the Gemini API
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message:
          "You have reached your free usage limit. Upgrade to premium for more usage.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    //storing the content in database

    await sql`INSERT INTO creations (user_id, prompt,content, type) 
    VALUES (${userId}, ${prompt},${content},'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1, // inecrement
        },
      });
    }
    res.json({ sucess: true, content });
  } catch (error) {
    console.error("Error generating article:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 1) {
      return res.json({
        success: false,
        message:
          "You have reached your free usage limit. Upgrade to premium for more usage.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    //storing the content in database

    await sql`INSERT INTO creations (user_id, prompt,content, type) 
    VALUES (${userId}, ${prompt},${content},'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1, // inecrement
        },
      });
    }
    res.json({ sucess: true, content });
  } catch (error) {
    console.error("Error generating blog title:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    console.log("Plan:", plan);

    //it is only for premium users
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only applicable in premium plan.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDrop_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    //storing the image in cloudnairy
    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    //storing the url in database
    await sql`INSERT INTO creations (user_id, prompt,content, type,publish) 
    VALUES (${userId}, ${prompt},${secure_url},'image',${publish ?? false})`;

    res.json({ sucess: true, content: secure_url });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { image } = req.file; // the image will be added using multter midelware
    const plan = req.plan;

    //it is only for premium users
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only applicable in premium plan.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    //storing the url in database
    await sql`INSERT INTO creations (user_id, prompt,content, type,) 
    VALUES (${userId}, 'remove background from image' ,${secure_url},'image')`;

    res.json({ sucess: true, content: secure_url });
  } catch (error) {
    console.error("Error while removing background:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const { image } = req.file; // the image will be added using multter midelware
    const plan = req.plan;

    //it is only for premium users
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only applicable in premium plan.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      resource_type: "image",
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
    });

    //storing the url in database
    await sql`INSERT INTO creations (user_id, prompt,content, type,) 
    VALUES (${userId}, ${`Remove ${object} from the image`} ,${imageUrl},'image')`;

    res.json({ sucess: true, content: imageUrl });
  } catch (error) {
    console.error("Error while removing object:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { resume } = req.file;
    const plan = req.plan;

    //it is only for premium users
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only applicable in premium plan.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume size should be less than 5MB.",
      });
    }

    // converting resume in databuffer
    const dataBuffer = fs.readFileSync(resume.path);

    // parsing the resume using pdfparser
    const pdfdata = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths,weaknesses,and areas for improvement. 
    Resume Content:\n\n${pdfdata.text}`;

    // sending the pdf text to gemini
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    //storing the url in database
    await sql`INSERT INTO creations (user_id, prompt,content, type,) 
    VALUES (${userId}, 'Review the uploaded resume' ,${content},'resume-review')`;

    res.json({ sucess: true, content });
  } catch (error) {
    console.error("Error while removing object:", error.message);
    res.json({ success: false, message: error.message });
  }
};
