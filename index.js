const express = require('express');
const mongoose = require('mongoose');
const userModel = require('./userModel');
const session = require('express-session')
const mongodbSession = require('connect-mongodb-session')(session)

const app = express();
const PORT= 9000;
const MONGO_URI = `mongodb+srv://Deepak:1234@cluster0.z2rzson.mongodb.net/myTestdb`
const store = new mongodbSession({
    uri : MONGO_URI,
    collection : "session"
})


mongoose.connect(MONGO_URI).then(()=>{
console.log("mongodb connected sucssfully")
})
.catch((error)=>{
 console.log(error)
});



// app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret : "This is the backend module",
    store : store,
    resave : false,
    saveUninitialized : false,
}));










app.get('/',(req, res)=>{
    console.log("just testing the server connection here");

    return res.send("server is running successfully");
}); 

app.get('/home',(req, res)=>{
    console.log(req);

    return res.send("Welcome to the home page");
});

app.get('/api',(req, res)=>{
    console.log(req.query);
    return res.send("Quering the API Received successfully");
});
app.get('/api1',(req, res)=>{
    console.log(req.query);
    const key1 = req.query.key1;
    const key2 = req.query.key2; 
    const key3 = req.query.key3;
    console.log(key1, key2, key3);

    return res.send("Quering received successfully from api1");
});
app.get('/api2',(req, res)=>{
    console.log(req.query);
    console.log(req.query.key.split(','));
    return res.send("Query received");
});

app.get('/auth/:name/:age',(req,res)=>{
    console.log(req.params);
    const name = req.params.name;
    const age = req.params.age;
    console.log(`Name: ${name}, Age:${age}`)

    return res.send(`Welcome to the auth page this is just for testing!`);
});



app.get('/ragister',(req,res)=>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>form</title>
</head>
<body>

    <h1>Hye! Please create Your Account to fill the below details</h1>
    <form action="/ragister-data" method="POST">
        <label for="name">Name :</label>
        <input type="text" name ="name" placeholder="Please enter your name" required>
        <br><br>
        <label for="email">Email :</label>
        <input type="text" name="email" placeholder="Please enter your Email" required>
        <br><br>
        <label for="password">Password :</label>
        <input type="text" name="password" placeholder="Please enter your password" required>
        <br><br>
        <button type="submit">Submit</button>
    `);
});

app.post('/ragister-data', async(req, res)=>{
    console.log(req.body)

    const nameC =  req.body. name
    const emailC = req.body.email
    const passwordC = req.body.password

    const userObj = new userModel({

        name : nameC,
        email : emailC,
        password : passwordC,
    });
     console.log(userObj)

     try{
        const userDb = await userObj.save();
        console.log(userDb);
        return res.status(201).json(userDb);
     }catch(error){
        console.log(error);
        return res.status(500).json(error);

     }

});

app.get('/login',(req, res)=>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>form</title>
</head>
<body>

    <h1>WelCome Back Please Login !</h1>
    <form action="/login-data" method="POST">
        <label for="email">Email :</label>
        <input type="text" name="email" placeholder="Please enter your Email" required>
        <br><br>
        <label for="password">Password :</label>
        <input type="text" name="password" placeholder="Please enter your password" required>
        <br><br>
        <button type="submit">Submit</button>`)
});

app.post('/login-data', async (req, res)=>{
    console.log(req.body)

    const { email, password } = req.body;

try{
    const userDb = await userModel.findOne({email : email})

    if(!userDb){
        return res.status(400).json("Oops This Email in not Ragister in our Detabse please Ragister First")
    }
    if(password !== userDb.password){
        return res.status(400).json("Incorrect Password!")
    }
    console.log(req.session)
    req.session.isAuth = true;

    return res.status(200).json("Login Successful !")

}catch(error){
    return res.status(500).json(error)
}    

});

app.get('/check', (req, res)=>{
    console.log(req.session)
    if(req.session.isAuth){
      return res.send("Private data send");
    }else{
        return res.send("Session expired Please Login Again")
    }
    
});





















// app.get('/add-api',(req, res)=>{    // this is for for when you use query params
//     console.log(req.query);
//     const num1 = parseInt(req.query.input1)
//     const num2 = parseInt(req.query.input2)
//     console.log('num1 :' + num1 + ' num2 : ' + num2);
//     const sum = num1 + num2;
//     console.log('Sum is : ' + sum);
//     return res.send('The sum of '+ num1+' and '+num2+' is : '+ sum);
// })

app.get('/api-add/:input1/:input2',(req,res)=>{    // this is for when you use path params
    console.log(req.params)
    const num1 = parseInt(req.params.input1)
    const num2 = parseInt(req.params.input2)
    const sum = num1 + num2
    console.log("the sum of this numbers is this : "+sum)
    return res.send("the sum of "+num1+" and "+num2+" is : "+sum);
    
});

app.get('/sub-api/:n1/:n2', (req, res) =>{
    console.log(req.params)
    const num1 = parseInt(req.params.n1)
    const num2 = parseInt(req.params.n2)
    const sub = Math.abs(num1 - num2)
    console.log("the sub of this numbers is this : "+sub)
    return res.send("the sub of "+num1+" and "+num2+" is : "+sub);
});

app.get('/mul-api', (req, res) =>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi form</title>
</head>
<body>

    <h1>Hey this form is Just for check the Api working fine or Not Please fill the Below feilds</h1>
    <form action="/multi-data" method="POST">

        <label for="firstnumber">FirstNumber :</label>
        <input type="text" id="firstnumber" name="firstnumber" required>
        <br><br>    
        <label for="secondnumber">SecondNumber :</label>
        <input type="text" id="secondnumber" name="secondnumber" required>
        <br><br> 
        <button type="submit">Submit</button> 
    </form>
    
</body>
</html>`)
});

app.post('/multi-data',(req, res) =>{
    console.log(req.body)
    const firstnumber = parseInt(req.body.firstnumber)
    const secondnumber = parseInt(req.body.secondnumber)
    if(firstnumber==0 || secondnumber==0){
        return res.send("Multiplication is not possible with 0");   
    }
    const num1 = parseInt(req.body.firstnumber)
    const num2 = parseInt(req.body.secondnumber);
    const mul = num1 * num2;
    console.log("The multiplication of this numbers is this : "+mul);
    return res.send("The multiplication of "+num1+" and "+num2+" is : "+mul);
});

app.get('/div-api',(req, res) =>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi form</title>
</head>
<body>

    <h1>Hey this form is Just for check the Api working fine or Not Please fill the Below feilds</h1>
    <form action="/div-data" method="POST">

        <label for="firstnumber">FirstNumber :</label>
        <input type="text" id="firstnumber" name="firstnumber" required>
        <br><br>    
        <label for="secondnumber">SecondNumber :</label>
        <input type="text" id="secondnumber" name="secondnumber" required>
        <br><br> 
        <button type="submit">Submit</button> 
    </form>
    
</body>
</html>`)
});

app.post('/div-data',(req, res) =>{
    console.log(req.body);
    const num1 = parseInt(req.body.firstnumber)
    const num2 = parseInt(req.body.secondnumber)
    if(num1==0 && num2==0){
        return res.send("Devide not possible with this number please use diffrent number's!")
    }
    const div = num1/num2;
    console.log("answer for devetion is this :"+div)
    return res.send("Devide for this number is :"+div)
   
});




app.listen(PORT, () => {
    console.log(`server is running on PORT:${ PORT }`);
});