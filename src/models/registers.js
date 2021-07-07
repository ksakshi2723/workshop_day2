const mongoose=require("mongoose");
//const bycrypt=require("bycryptjs");
const jwt=require("jsonwebtoken");

const empSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},

})
//generate token
empSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},"acvbghnjmkloiuytredfgbhnkmlpo");
        console.log(token);
    }
    catch (error){
        res.send("error part"+error);
        console.log("error part"+error);

    }

}

const Register = new mongoose.model("Register",empSchema)

module.exports=Register;