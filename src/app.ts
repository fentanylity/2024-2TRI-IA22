import express from 'express'
import cors from 'cors'
import { connect } from './database'

const port = 3333
const app = express()


app.use(cors())
app.use(express.json())

//descomente isso depois
app.use(express.static(__dirname + '/../public'))

//comente isso depois
//app.get('/', (req, res) => res.send('<img src="https://pbs.twimg.com/profile_images/1609293042107695107/JFfDnTRp_400x400.jpg"> > funfo :3'))

app.get('/users', async (req, res) => {
  const db = await connect();
  const users = await db.all('SELECT * FROM users');
  res.json(users);
});

app.post('/users', async (req, res) => {
  const db = await connect()
  const { name, email } = req.body
  const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID])
  res.json(user)
})

app.put('/users/:id', async (req, res) => {
  const db = await connect();
  const { name, email } = req.body;
  const { id } = req.params;
  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  res.json(user);
});

app.delete('/users/:id', async (req, res) => {
  const db = await connect();
  const { id } = req.params;
  await db.run('DELETE FROM users WHERE id = ?', [id]);
  res.json({ message: 'User deleted' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})