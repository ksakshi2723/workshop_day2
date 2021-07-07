const express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
// const bycrypt =require("bycryptjs");


require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;
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


app.post("/register", async (req, res) => {
    try {
        

        const password = req.body.pass;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const registeremp = new Register({
                name: req.body.name,
                password: password
              
            })
         const token = await registeremp.generateAuthToken();
         const registered = await registeremp.save();

         res.send("register successfully !");
            res.status(201).render(register)
        }
        else {
            res.send("password mis match");
        }


    }

    catch (error) {
        res.status(400).send(error);
    }
})







app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})
