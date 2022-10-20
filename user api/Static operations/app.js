

require("./connectionDB");

const staticContent = require("./model/staticContent")

const express = require("express");

const app = express();

app.use(express.json());

app.post('/addcontent', async (req, res) => {
    const doc = new staticContent({
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,

    })
    doc.save();
    return res.status(200).send({ status: "Success", message: " Added static content successfully " },
    )
});

app.get('/getstaticcontent', async (req, res) => {
    const staticContentData=await staticContent.find();
    console.log(staticContentData)
    res.status(200).send(staticContentData )
});
app.get('/getstaticcontent/:type', async(req, res) => {
  const type=req.params.type
  const result=await staticContent.find({type:type})
  console.log(result);
  res.status(200).send(result);

});
app.put('/getstaticcontent/:id', async(req, res) => {
    staticContent.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
        }
    })
    .then(result=>{
        res.status(200).json({
            updated_staticContent:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
});




app.listen(3000, () => {
    console.log(" app is running");
})




