const express = require('express')
const path = require('path');
const app = express()
const port = 8080


app.use(express.static('public'))
app.use(express.json())

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/clientes', (req, res) => {
})

app.post('/clientes', (req, res) => {
  console.log(res.body)

  /*
  redis.then(redis => {
    redis.setValue('key', 'value')
    res.send()
  })
  */
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

