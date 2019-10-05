const PORT = 3000;
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/roomList', (req, res)=>{
    res.render('roomList')
})

app.get('/userReg', (req, res)=>{
    res.render('userReg')
})

app.post("/home", (req, res)=>
{
    const errors = [];
    if(req.body.searchCity == "Toronto"){
        res.redirect("/roomList");
    }
})

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} now listening`)
})
