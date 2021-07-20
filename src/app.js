const express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt=require('bcrypt');

var jwt = require('jsonwebtoken');
var cors = require('cors');

app.use(cors());

require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 5000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);



app.get("/register", (req, res) => {
    res.render("register");
})

app.post('/login', async (req,res,next)=>{
//    console.log(req.body);
   const { email,password } = req.body;
   console.log(req.body);
 

    try {
      let user = await Register.findOne({
        email:req.body.email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

    const isMatch=(password==user.password)
    //   console.log(password,user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          
          res.status(200).json({
            token:token,
            message:"login successfully"
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  
})



app.post("/register", async (req, res) => {
    try {
        console.log(req.body);

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registeremp = new Register(req.body);
         const token = await registeremp.generateAuthToken();
         
         const registered = await registeremp.save();
         console.log(token);
         res.send({message:"register successfully !"});
         res.status(201)
        }
        else {
            res.send({message:"password mis match"});
        }


    }

    catch (error) {
        res.status(400).send(error);
        console.log("error")
    }
})







app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})
