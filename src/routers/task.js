const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async (req, res) => {
  try {
    // no if statement required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found

    const match = {}
    
    // if query exists, assign completed property otherwise provide an empty object
    if (req.query.completed) {
      // if completed is false or anything else, the expression will evaluate to false
      // setup this way because the value in the query is a string and match requires a boolean
      match.completed = req.query.completed === 'true'
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
        skip: parseInt(req.query.skip)
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

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })
  try {
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