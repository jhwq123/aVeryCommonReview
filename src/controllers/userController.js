import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// join, login

export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const { name, username, password, password2, email, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match." });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", { pageTitle, errorMessage: "This username/email is already taken." }); 
    }
    try {
        await User.create({ name, username, password, email, location });
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", { pageTitle, errorMessage: error._message });
    }

}

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
}

export const postLogin = (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    if(!user){
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exist." });
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", { pageTitle, errorMessage: "Wrong password" });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}