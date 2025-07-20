const express = require('express');
const router = express.Router();
const person = require('./../models/person');
const {jwtMiddleware, generateToken} = require('./../jwt');

//Post route to add a person
router.post('/signup',async(req, res) =>{
    try{
       const data = req.body

       const newperson = new person(data);
       const response = await newperson.save();
       console.log('data saved');
        
       const payload = {
        id: response._id,
        username: response.username
       };
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token generated:', token);

       res.status(200).json({response: response, token: token});
   }
  catch(err){
       console.log(err);
       res.status(500).json({error: 'Internal Server Error'});
  }
})

//Login route to authenticate a person
router.post('/login', async(req, res) => {
    try{
        const {username, password} = req.body;
        //Find the person by username
        const user = await person.findOne({username: username});

        // If user not found or password does not match, return error
        if( !user || !(await user.comparepassword(password))) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // If authentication is successful, generate a token
        const payload = {
            id: user._id,
            username: user.username
        };
        const token = generateToken(payload);
        //return token as response
        res.json({token})
    }catch(err){
        console.error('Error during login:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//profile route to get the authenticated user's details
router.get('/profile', jwtMiddleware, async(req, res) => {
    try{
        const userData = req.user; 
        console.log('User Data:', userData);

        const userId = userData.id; 
        const user = await person.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error({error: 'Internal Server Error'});
    }
});

 //GET method to get the person
 router.get('/',jwtMiddleware, async(req,res) =>{
    try{
         const data = await person.find();
         console.log('data fetched');
         res.status(200).json(data);
    }catch(err){
        console.log(err);
         res.status(500).json({error: 'Internal Server Error'});
    }
 });



 router.get('/:workType', async(req,res)=>{
    try{
    const workType = req.params.workType;
    if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){

         const response = await person.find({work: workType});
         console.log('response fetched');
         res.status(200).json(response);

    }else{
         res.status(404).json({error: 'Invalid work type'});
    }
    }catch(err){
         console.log(err);
         res.status(500).json({error: 'Internal Server Error'});

    }
})


router.put('/:id',async (req,res)=>{
    try{
        const personId = req.params.id;
        const updatedPersonData = req.body;
        const response = await person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true,

        })

        if (!response){
            return res.status(404).json({ error: 'Person not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
         res.status(500).json({error: 'Internal Server Error'});
    }
})

router.delete('/:id',async(req,res) =>{
    try{
        const personId = req.params.id;

        const response = await person.findByIdAndDelete(personId);
        if (!response){
           return res.status(404).json({ error: 'Person not found'});
        }
        console.log('data delete');
        res.status(200).json({message: 'Person Deleted successfully'});

    }catch(err){
        console.log(err);
         res.status(500).json({error: 'Internal Server Error'});

    }
})
module.exports = router;

