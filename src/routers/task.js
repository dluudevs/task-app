const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')

router.get('/tasks', auth, async (req, res) => {
  try {
    // no error handling required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found
    // const task = await Task.find({ owner: req.user._id })

    // populate all data from a relationship (virtual property in user model), in this case we want to populate our reference to tasks
    // will populate all tasks with owner field (contains _id) that matches user _id field
    await req.user.populate('tasks').execPopulate()
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