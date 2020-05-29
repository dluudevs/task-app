const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')

router.get('/tasks', async (req, res) => {
  try {
    // no error handling required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found
    const task = await Task.find({})
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isUpdateAllowed = updates.every(update => allowedUpdates.includes(update))

  if (!isUpdateAllowed){
    return res.status(400).send({ error: "Invalid Updates"})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if (!task){
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task){
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router