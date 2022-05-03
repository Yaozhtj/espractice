const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  node: 'http://1.15.121.202:9200/'
});

module.exports = client