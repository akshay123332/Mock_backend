const express = require('express')
var cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const UserModel = require("./Usermodel");
const BlogModel=require("./BlogModel")
const app = express()

app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
    res.send("Homepage")
})

app.post("/api/register", async (req, res) => {
    const payload = req.body
    console.log(payload)

    bcrypt.hash(req.body.Password, 3, async (err, hash) => {
        if (err) {
            res.send("Error Occured")
        } else {

            const Payload = {
                Username: req.body.Username,
                Avatar: req.body.Avatar,
                Email: req.body.Email,
                Password: hash
            }

            const user = new UserModel(Payload);
            await user.save()
            res.send("User Added")

        }
    });

})

app.post("/api/login", async (req, res) => {
    const { Email, Password } = req.body;
    const isValid = await UserModel.findOne({ Email });
    if (isValid) {

        const hashedpass =await  bcrypt.compare(Password, isValid.Password);
        if (hashedpass) {
            var token = jwt.sign({ id: isValid._id }, 'kunju');

            res.status(200).send({ "msg": "LoginSuccesful", token })
            return;

        } else {
            res.status(404).send("Invalid Credentials")
            return;
        }

    } else {

        res.status(404).send("User Not Registered")

    }

})

app.get("/api/blogs", async (req, res) => {
      try{
        const data = await BlogModel.find();
    
        res.status(200).send({"data":data});
      }catch(err){
        console.log("err")
        res.status(400).send({"msg":"Cannot Fetch Data"});
      }

})


app.post("/api/blogs", async (req, res) => {
    const payload = req.body
    console.log(payload)
      try{
        const blog = new BlogModel(payload);
        await blog.save()
        res.status(200).send({"msg":"Blog Added"});
      }catch(err){
        console.log(err)
        res.status(400).send({"msg":"Blog Not Added"});
      }

})


app.listen(3500, async () => {
    try {
        const connection = await mongoose.connect(`mongodb+srv://akshay:akshaykumar@cluster0.gas2xsb.mongodb.net/finalmocklast?retryWrites=true&w=majority`);
        console.log("server is running at port 3500");
    } catch (err) {
        console.log("err");
    }
})


