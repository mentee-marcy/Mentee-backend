const pool = require('../dbconfig');

function getUsersFromDB(){
    return  pool.query('SELECT * FROM users').then(results => {return results.rows})
}

function getSingleUserFromDB(id){
    return pool.query('SELECT * FROM users WHERE id = $1',[id]).then(results => {return results.rows})
}

function findUserFromDB(username){
    //console.log("here")
    return pool.query('SELECT * FROM users WHERE username = $1',[username]).then(results => {
        return results.rows
    })
}

function addUserToDB(...args){
    return pool.query('INSERT INTO users (first_name,last_name,username,email,password,tech_stack,mentor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', args).then(results => {
        return results.rows[0]
    })
}

function addMentorDataToDB(...args){
    return pool.query('INSERT INTO mentor (mentor_id,company_name,bio,title,location) VALUES ($1,$2,$3,$4,$5) RETURNING *', args)
}


function addUserFriendToDB(userId,friendId){
    return pool.query ("INSERT INTO friend_requests (sender_id,reciever_id) VALUES ($1,$2) RETURNING *",[userId, friendId])
}

function getFriendsFromDB(id){
    return pool.query(
        "SELECT users.id, first_name, last_name FROM friend_requests JOIN users ON users.id = sender_id OR users.id = reciever_id WHERE sender_id = $1 AND is_accepted = true OR reciever_id = $1 AND is_accepted = true",
        [id]).then(results => results.rows) 
    
}

module.exports ={
    getUsersFromDB,
    findUserFromDB,
    addUserToDB,
    addMentorDataToDB,
    getSingleUserFromDB,
    addUserFriendToDB,
    getFriendsFromDB
}