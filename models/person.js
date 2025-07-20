const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Define the Person schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

personSchema.pre('save', async function(next) {
    const person = this;
    if(!person.isModified('password')) return next(); 

    try{
       // hash password generation
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(person.password, salt);
        person.password = hashedpassword; // Store the hashed password
        next();
    }catch(err){
    return next(err);
    }
})

personSchema.methods.comparepassword = async function(candidatepassword) {
    try{
        const isMatch = await bcrypt.compare(candidatepassword, this.password);
        return isMatch; // Return true if passwords match, false otherwise
    }catch(err){
        throw new Error('Error comparing password');
    }
}


// Create Person model
const Person = mongoose.model('Person', personSchema); // Capitalize the model name
module.exports = Person; // Export the model
