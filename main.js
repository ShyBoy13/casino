const bancodb = require('./mariadb')
const express = require('express')
const path = require('path');
const app = express()
const port = 8080


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/clientes', (req, res) => {
  res.set({'Content-Type': 'application/json'})
  bancodb.sendQuery('SELECT * FROM clientes')
    .then(result => {
      console.log(result, 'resultado get clientes')
      res.send(JSON.stringify(result))
    })
})

app.post('/clientes', (req, res) => {
  console.log(req.body.nombre)
  bancodb.sendQuery('INSERT INTO clientes (nombre, cuenta) VALUES (?, ?)', [req.body.nombre, 0.000])
    .then(result => {
      console.log(result, 'resultado post clientes')
      res.send().status(200)
    })
})

app.put('/clientes/:id', (req, res) => {
  console.log(req.body.cuenta, 'nueva cuenta')
  bancodb.sendQuery('UPDATE clientes SET cuenta = ? WHERE cliente_id = ?', [req.body.cuenta, req.params.id])
    .then(result => {
      console.log(result)
      res.send().status(200)
    })
})

app.delete('/clientes/:id', (req, res) => {
  bancodb.sendQuery('DELETE FROM clientes WHERE cliente_id = ?', [req.params.id])
    .then(result => {
      console.log(result)
      res.send().status(200)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

