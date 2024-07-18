const bancodb = require('./mariadb')
const express = require('express')
const path = require('path');
const app = express()
const port = 8080
const host = '0.0.0.0'
const os = require('os');
const admin = {user: 'roman', password: 'C4s1n0R10s13#'}

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.method) 
  console.log(req.hostname) 
  console.log(req.ip) 
  res.set({
    'Acces-Control-Allow-Origin': 'http://10.0.0.19',
    'Acces-Control-Allow-Methods': 'PUT, DELETE, POST'
  })
  if (req.get('Authorization')   ) {
    const [username, password] = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':');
    console.log(username, password)
    if (username === admin.user && admin.password === password) {
      next()
    } else {
      res.set('WWW-Authenticate', 'Basic realm="admin", charset="UTF-8"')
      res.status(401).send()
    }
  } else  {
    res.set('WWW-Authenticate', 'Basic realm="admin", charset="UTF-8"')
    res.status(401).send()
  }
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/fondos', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/casino-fondos.html'));
});


app.get('/calculadora', function(req, res) {
  console.log(req.header)
  res.sendFile(path.join(__dirname, 'templates/calculadora-fichas.html'));
});

app.get('/limite-pozo', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/limite-pozo-max.html'));
})

app.get('/clientes', (req, res) => {
  console.log('que chingados')
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
      res.send(String(result.insertId)).status(200)
    })
})

app.put('/clientes/:id', (req, res) => {
  console.log(req.body.cuenta, 'CUENTA', req.params, 'ID')
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

app.listen(port, host, () => {
  console.log(`Example app listening on ${host}:${port}`)
})

