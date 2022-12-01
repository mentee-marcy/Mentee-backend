const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const getAllUsers = async(req, res)=>{
    const users = await userModel.getUsersFromDB();
    console.log(users)
    res.status(200).json(users)
}

 const getUser = async(req, res) =>{
    const id = +req.params.id;
    //console.log(typeof id)
    const user = await userModel.getSingleUserFromDB(id)
    if(user.length >= 1)
        res.status(200).json({"authenticated":"you are authenticated", user})
    else 
        res.status(400).send("user does not exist")
 }

const addUser = async(req,res)=>{
    //console.log(req.body)
    const {first_name,last_name, username, email, password,tech_stack,mentor,mentor_obj} = req.body.user
    const checkUserExist = await userModel.findUserFromDB(username)
    
    if(checkUserExist.length>0) res.json({message:"user already exists"})
    else{
         
        let data = {}
        try{
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password,salt)
             data = await userModel.addUserToDB(first_name,last_name,username,email,hashedPassword,tech_stack,mentor)
            res.status(201).json(data)
        }
        catch (err){
            console.log(err)
            return res.status(500).send('server error')
        }
        if(mentor){
            const id = data.id
            const {company_name, bio, title, location} = mentor_obj
            const response = await userModel.addMentorDataToDB(id,company_name,bio,title,location)
            console.log(response.rows[0])
        }
    }
}

const findUser = async (req,res) => {
    //console.log(req)
    //console.log(req.body)
    const{username,password} = req.body
    const users = await userModel.findUserFromDB(username)
    try{
        if(users.length===0){
            res.status(404).json({message:'user not found'})
        }else{
            const user = users[0]
            if(await bcrypt.compare(password, user.password)){
                const id = user.id;
                console.log(id)
                const token = jwt.sign({id},"jwtSecret");


                res.status(200).json({authorized:true,token:token, user:user})
            }
            else{
                res.status(404).json({message:"wrong password"})
            }

        }
    }
    catch {
    }
}


module.exports ={
    getAllUsers,
    getUser,
    addUser,
    findUser
}