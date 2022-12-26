const express = require('express')
const router = express.Router();
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');



//Route 1:  Create a user using: PORT "/api/auth/createuser"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
})




// Route 2: Add the note in database
router.post('/addnote', fetchuser, [
    body('title', 'min 3 charactor atleast').isLength({ min: 3 }),
    body('description', 'min 5 charator atleast').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.send(savedNote)
    } catch (error) {
        return res.status(400).json({ 'error': "internal server error" });
    }
})


//Route 3:  update the note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    
    const {title,description,tag} = req.body
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    // Find the note to be updated and update it
    let note =await Notes.findById(req.params.id)
    if(!note){ return res.status(404).send("Not Found")}

    // allow updation only if user owns this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json(note)

})


//Route 4:  update the note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // Find the note to be deleted and delete it
    let note =await Notes.findById(req.params.id)
    if(!note){ return res.status(404).send("Not Found")}

    // allow deletion only if user owns this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({status:'deleted successfully'})
    } catch (error) {
        return res.status(400).json({ 'error': "internal server error" });
    }
    

})
module.exports = router