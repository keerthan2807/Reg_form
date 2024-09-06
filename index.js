const express= require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app= express ();
dotenv.config();

const port = process.env.port || 4000;

const username= process.env.MongoDB_user;
const password= process.env.MongoDB_pass;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.shhlu.mongodb.net/registrationFormDB`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Failed to connect to MongoDB", error));

//Registration schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded ({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            // Optionally, you can set an error message to show on the error page
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});


app.get("/success", (req, res)=>{
    res.sendFile (__dirname+"/pages/success.html");
})
app.get("/error", (req, res)=>{
    res.sendFile (__dirname+"/pages/error.html");
})
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})


