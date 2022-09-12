var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var axios = require('axios')
const app = express()
var ejs = require('ejs')


app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact:Number,
    location:String,
    language:String,
    availability:String

})

mongoose.connect('mongodb://localhost:27017/MyDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.get("/login", (req, res)=> {
    let adminPass = req.body.passwordAdmin;
    var user = req.body.UsernameAdmin;
    console.log(res);
    console.log(adminPass);
    return res.redirect('login.html');
}) 



app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var location = req.body.location;
    var language = req.body.language;
    var availability = req.body.availability;
   
    var data = {
        "name": name,
        "email" : email,
        "contact": contact,
        "location": location,
        "language":language,
        "availability":availability

    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully.Open Data Base  to See");
    });
    return res.redirect('signup_success.html')
})

app.get("/admin",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('admin.html');
});

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000,() => {
    console.log("App started at port 3000. visit localhost:3000")
})

var detailsModel = mongoose.model("users", userSchema);

app.get("/", function (req, res) {
    res.render("sahu",{ details: null })
})

app.get("/getdetails", function (req, res) {   
    detailsModel.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            // console.log(allDetails);
            res.render("admin", { details: allDetails })
        }
    })
})




