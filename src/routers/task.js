const express = require('express')
// to uploaded a file to multer, body of request must use form-data
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  try {
    // no if statement required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found
    const match = {}
    const sort = {}
    // if query exists, assign completed property otherwise provide an empty object
    if (req.query.completed) {
      // if completed is false or anything else, the expression will evaluate to false
      // setup this way because the value in the query is a string and match requires a boolean
      match.completed = req.query.completed === 'true'
    }

    // if query exists, assign sorted field with appropriate value. otherwise provide an empty object
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':')
      console.log(parts)
      sort[parts[0]] = parts[1] === 'desc' ? - 1 : 1
    }

    // populate all data from a relationship (virtual property in user model), in this case we want to populate our reference to tasks
    // will populate all tasks with owner field (contains _id) that matches user _id field
    // await req.user.populate('tasks').execPopulate()

    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        // if limit / skip query isnt provided, the property is ignored by mongoose
        limit: parseInt(req.query.limit),
        // skip is the number of items to skip (eg., limit 2 and skip 2 would show page 2, because each page is limited to 2 items and 2 items are skipped)
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    // auth provides req.user; search by task ID and by user ID. so users can only view their own tasks
    const task = await Task.findOne ({ _id, owner: req.user._id})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id/picture', auth, async (req, res) => {
  try {
    // auth provides req.user; search by task ID and by user ID. so users can only view their own tasks
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

    if (!task || !task.picture){
      // error will be caught by catch block
      throw new Error
    }

    res.set('Content-Type', 'image/png')
    res.send(task.picture)
  } catch (error) {
    res.status(500).send()
  }
})

// multer middleware saves uploads in req.file
const upload = multer({
  limits: 1000000,
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error("File must be a picture"))
    }

    // when the file matches conditions
    cb(undefined, true)
  }
})

router.post('/tasks', auth, upload.single('picture'), async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })
  try {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    task.picture = buffer
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isUpdateAllowed = updates.every(update => allowedUpdates.includes(update))

  if (!isUpdateAllowed){
    return res.status(400).send({ error: "Invalid Updates"})
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task){
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    res.send(task)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task){
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router