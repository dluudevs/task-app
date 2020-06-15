const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.send({
  to: 'derekluudevs@gmail.com',
  from: 'derekluudevs@gmail.com',
  subject: 'This is my first creation!',
  text: 'I hope this one actually gets to you.'
})

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'derekluudevs@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'derekluudevs@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Thanks for using the app ${name}, I'm sad to see you go. I hope to see you back sometime soon`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
}