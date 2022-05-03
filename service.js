const app = require('./app')

const client = require('./esclient')

client.ping().then(res => {
  console.log('es: connect success', res);
}).catch(err => {
  console.log('es: connext error', err);
})

app.listen(5005, ()=>{
  console.log(`listening on port: http://localhost:5005`)
})