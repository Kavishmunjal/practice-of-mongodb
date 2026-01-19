const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const user = new schema ({
    name : String,
    email : { type: String, unique: true },
    password : String
})

const todo = new schema ({
    
    title : String,
    done : String,
    userId: ObjectId,
})

const userModal = mongoose.model('users' , user);
const todoModal = mongoose.model('todos', todo);

module.exports = {
    userModal,
    todoModal
}