const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('./models/user');
const Post = require('./models/post');

const users = []

require('dotenv').config();
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

async function populateDBParent() {
    console.log('Debug: starting connection');
    await mongoose
        .connect(mongoDB)
        .catch((error) => {
            console.log(error);
            process.exit(0);
        });
    console.log('Debug: no errors means we are connected');
    await createUsers();
    await createPosts();
    console.log('Debug: closing connection');
    mongoose.connection.close();
}

populateDBParent();

async function userCreate(index, first, last, userName, password) {
    const inOrOut = Math.random() < 0.5 ? "uninitiated" : "initiated";
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                console.log("couldnt hash pw for db population")
                return;
            }
            try {
                const user = new User({
                    username: userName,
                    hashedPassword: hashedPassword,
                    start: Date.now(), // ms
                    firstName: first,
                    lastName: last,
                    status: inOrOut
                });
                const result = await user.save();
                users[index] = user;
                console.log(`successful account creation for ${users[index]}`)
                resolve();
            } catch (error) {
                console.log(`nah, couldnt make the account for ${userName}`);
                reject(error)
            };
        })
    })
}

async function postCreate(title, message, user) {
    try {
        const post = new Post({
            title: title,
            ts: Date.now(), // ms
            message: message,
            user: user.id
        });
        const result = await post.save();
    } catch (error) {
        console.log(`nah, couldnt post: ${message} for ${user}`);
        throw error
    };
}

async function createUsers() {
    console.log('Creating and adding users');
    await Promise.all([
        userCreate(0, "tobi", "okafor", "generalTobi", "tobi"),
        userCreate(1, "meti", "yihune", "princessMama", "meti"),
        userCreate(2, "ankit", "lee", "superAsia", "ankit"),
        userCreate(3, "joseph", "lindvall", "arynahh", "dorsel")
    ])
}

async function createPosts() {
    console.log('Creating posts from our new users');
    await Promise.all([
        postCreate("gm", "gm", users[1]),
        postCreate("good mornin", "blessings", users[0]),
        postCreate("question", "if a woodchuck could chuck wood, would they?", users[2]),
        postCreate("wood chucking", "they wood naturally", users[3]),
        postCreate("comm", "what is the vibe around here", users[2]),
        postCreate("vibey", "good vibes only", users[1]),
        postCreate("joke", "biden or trump", users[3]),
        postCreate("gn", "god bless", users[0])
    ])
}