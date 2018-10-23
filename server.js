const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const sgMail        = require('@sendgrid/mail');

require('dotenv').config();
const app           = express();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Here we're setting the views directory to be ./views
// thereby letting the app know where to find the template files
app.set('views', './views');

// Here we're setting the default engine to be ejs
// note we don't need to require it, express will do that for us
app.set('view engine', 'ejs');

// Now instead of using res.send we can use
// res.render to send the output of the template by filename
app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Devin',
            lastName: 'Wiltbank',
        }
    }
    res.render('index', data);
});

app.get('/about', (req, res) => {
    res.send('About me page');
})

app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
app.post('/thanks', (req, res) => {
// email or text me here
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "devin.wiltbank@gmail.com", 
  from: req.body.email,
  subject: "Thank you for contacting me",
  text: "I'll get in touch with you soon.",
  html: "<strong>Have a great day!</strong>",
};
sgMail.send(msg)
      .catch(error => {
          console.error(error.toString());
      })
    res.render('thanks', { contact: req.body })
  });

app.listen(8080, () => {
    console.log('Listening at http://localhost:8080');
});

module.exports = app;
