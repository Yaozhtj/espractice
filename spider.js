const axios = require('axios');
const cheerio = require('cheerio');
const client = require('./esclient');

const http = axios.create({
  timeout: 60000,
  maxContentLength: 100000000,
  maxBodyLength: 1000000000
});

client.ping().then(res => {
  console.log('connect success', res);
}).catch(err => {
  console.log('connext error', err);
})

const getUrlsByPage = async (page) => {
  try {
    let urls = [];
    const res = await http.get(`https://blogs.sap.com/page/${page}/`);
    let $ = cheerio.load(res.data);
    $('.dm-contentListItem__title a').each((i, el) => {
      urls.push(el.attribs['href']);
    });
    return urls;
  } catch (error) {
    console.log(`get urls error page${page}`);
    console.log(error);
  }
}

const getBlogsByPage = async (page) => {
  try {
    const urls = await getUrlsByPage(page);
    let concurrent = []
    let blogs = [];
    for (let url of urls) {
      concurrent.push(http.get(url));
    }
    const blogsHtml = await axios.all(concurrent);
    for (let i = 0; i < blogsHtml.length; i++) {
      let $ = cheerio.load(blogsHtml[i].data);
      blogs.push({
        url: urls[i],
        auth: $('.ds-link, .ds-user__name').text().toString(),
        title: $('.ds-heading, .ds-heading--m, .ds-blog-post__title').text().toString(),
        content: $('.ds-blog-post__body, .ds-editor-content').text().toString(),
      })
    }
    return blogs;
  } catch (error) {
    console.log(`get page blogs error page${page}`)
    console.log(error);
  }
}

const bulkPageBlogs = async (page) => {
  try {
    const blogs = await getBlogsByPage(page);
    const bulkBlogs = [];
    blogs.forEach(v => {
      bulkBlogs.push({ index: { _index: 'blog' } }, { ...v });
    })
    const res = await client.bulk({
      refresh: true,
      operations: bulkBlogs
    })
    if (res.errors) {
      console.log(`bulk error page${page}`);
    } else {
      console.log(`bulk success page${page}`);
    }
  } catch (error) {
    console.log(`bulk error page${page}`);
  }
}

const bulkAllBlogs = async () => {
  for (let i = 1; i <= 300; i++) {
    try {
      await bulkPageBlogs(i);
    } catch (error) {
      console.log(error)
    }
  }
}

bulkAllBlogs();