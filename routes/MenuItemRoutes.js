const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/MenuItem');



//Post route to add a MenuItem
router.post('/',async(req, res) =>{
    try{
       const data = req.body
       const newMenuItem = new MenuItem(data);
       

       const response = await newMenuItem.save();
       console.log('data saved');
       res.status(200).json(response);
   }
  catch(err){
       console.log(err);
       res.status(500).json({error: 'Internal Server Error'});
  }
})

//Get method to get the item
router.get('/', async(req,res) =>{
  try{
       const data = await MenuItem.find();
       console.log('data fetched');
       res.status(200).json(data);
  }catch(err){
      console.log(err);
       res.status(500).json({error: 'Internal Server Error'});
  }
})

router.get('/:tasteType', async(req,res)=>{
  try{
  const tasteType = req.params.tasteType;
  if(tasteType == 'sweet' || tasteType == 'spicy' || tasteType == 'sour'){

       const response = await MenuItem.find({taste: tasteType});
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
        const menuId = req.params.id;
        const updatedMenuItemData = req.body;
        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuItemData, {
            new: true,
            runValidators: true,

        })

        if (!response){
            return res.status(404).json({ error: 'Item not found'});
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
        const menuId = req.params.id;

        const response = await MenuItem.findByIdAndDelete(menuId);
        if (!response){
           return res.status(404).json({ error: 'Item not found'});
        }
        console.log('data deleted');
        res.status(200).json({message: 'Item Deleted successfully'});

    }catch(err){
        console.log(err);
         res.status(500).json({error: 'Internal Server Error'});

    }
})
module.exports = router;