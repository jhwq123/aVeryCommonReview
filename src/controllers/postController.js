import Post from "../models/Post";
import User from "../models/User";
import comment from "../models/Comment"

export const home = async (req, res) => {
    const posts = await VideoPlaybackQuality.find({}).sort({ createAt: "desc" }).populate("owner");
    return res.render("home", { pageTitle: "Home", posts });
};

export const post = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("owner").populate("comments");
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Post not found." });
    }
    return res.render("watch", { pageTitle: post.title, post });
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let posts = [];
    if (keyword) {
        videos = await Post.find({
            title: {
            $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search", posts });
};