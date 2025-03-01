require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// try{
//   mongoose.connect(process.env.DB_URI);
// }
// catch(err){
//   console.log(err);
// }

// Basic Configuration
const port = process.env.PORT || 3000;

// const schema = new mongoose.Schema(
//   {
//     original:{ type: String, required:true},
//     short:{ type: Number, required:true}
//   }
// );

// const Url = mongoose.model('Url',schema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// app.get('/api/shorturl/:input',(req,res)=>{
//   const input = parseInt(req.params.input);
//   Url.findOne({short:input} , (err,data) => {
//     if(err || data === null) return res.json("URL NOT FOUND")
//       return res.redirect(data.original);
//   })
// });

// app.post('/api/shorturl',(req,res) => {
//   const bodyUrl = req.body.url;
//   const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/);

//   if(!bodyUrl.match(urlRegex)){
//     return res.json({error:"Invalid URL"});
//   }
//   let index = 1;
//   Url.findOne({})
//     .sort('desc')
//     .exec((err,data)=>{
//       if(err) return res.json({error:"No url found"});
//       index = data !== null ? data.short+1 : index;

//       Url.findOneAndUpdate(
//         {original:bodyUrl},
//         {original:bodyUrl,short:index},
//         {new:true,upsert:true},
//         (err,newUrl) => {
//           if(!err){
//             res.json({orignal_url:bodyUrl,short_url:newUrl.short});
//           }
//         }
//       )
//     })
  
// });

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl',(req,res) => {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);

  if(!url.includes('https://' || !url.includes('http://'))){
    return res.json({error : "invalid url"});
  }

  if(foundIndex < 0){
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);

    return res.json(
      {
        original_url: url,
        short_url: shortUrls.length-1
      }
    )
  }

  return res.json({
    original_url:url,
    short_url:shortUrls[foundIndex]
  })
})

app.get('/api/shorturl/:shorturl',(req,res)=>{
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shortUrls.indexOf(shorturl);
  if(foundIndex < 0){
    return res.json({
      "error" : "No short URL found for the given input"
    })
  }
  res.redirect(originalUrls[foundIndex]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});



