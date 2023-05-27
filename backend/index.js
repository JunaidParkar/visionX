const express = require('express');
const { addURL, deleteURL, userUrls, toggleUrlVisibility, getOriginalUrl, filterURL, deleteUserDataAll } = require('./src/firebase/realTime');
const cors = require('cors');
const { getProjectsData } = require('./src/firebase/fireStore');


const app = express();
const port = 3000;
const corsOptions = {
  origin: ["https://vision-x25.web.app", "https://vision-x25.firebaseapp.com", "http://localhost:5173"],
};


app.use(express.json())
app.use(cors(corsOptions));


app.post("/addURL", async (req, res) => {
  if (req.body.uid && req.body.url && req.body.urlId && req.body.urlName) {
    addURL(req.body.uid, req.body.url, req.body.urlId, req.body.urlName).then(data => {
      if (data.status == "success") {
        res.json({status: 200})
      } else {
        res.json({status: 12})
      }
    })
  } else {
    res.json({status: 500})
  }
})

app.post("/deleteURL", async (req, res) => {
  if (req.body.uid && req.body.urlname) {
    await deleteURL(req.body.uid, req.body.urlname).then(data => {
      if (data.status == "success") {
        res.json({status: 200})
      } else {
        res.json({status: 12})
      }
    })
  } else {
    res.json({status: 500})
  }
})

app.post("/getUserUrls", async (req, res) => {
  if (req.body.uid) {
    await userUrls(req.body.uid.trim()).then(resp => {
      if (resp.status == "success") {
        res.json({status: 200, data: resp.data})
      } else if (resp.status == "no data") {
        res.json({status: 16})
      } else {
        res.json({status: 12})
      }
    })
  } else {
    res.json({status: 500})
  }
})

app.post("/toggleUrlStatus", async (req, res) => {
  if (req.body.uid && req.body.urlName && req.body.status) {
    await toggleUrlVisibility(req.body.uid, req.body.urlName, req.body.status).then(e => {
      e.status == "success" ? res.json({status: 200}) : res.json({status: 500})
    })
  } else {
    console.log("error")
  }
})

app.post("/getProjects", async (req, res) => {
  await getProjectsData().then(data => {
    data.status == "success" ? res.json({status: 200, proj: data.data}) : res.json({status: 12, proj: data.err})
  })
})

app.post("/getOriginalUrl", async (req, res) => {
  console.log("h")
  let response = await getOriginalUrl()
  let url = await filterURL(req.body.URLID, response)
  res.json({data: url})
})

app.post("/deleteUserData", async (req, res) => {
  await deleteUserDataAll(req.body.uid)
  res.json({status: 200})
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
