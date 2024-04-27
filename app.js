import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { addJSONToIPFS, addFileToIPFS } from "./ipfs-uploader.js";
import { mint } from "./nft-minter,js";


//后端web框架
const app = express();
//将后端的模板引擎设置为 ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());




app.get("/", (req, res) => {
    res.render("home");
})
app.post('/upload', function (req, res) {

    const title = req.body.title;
    const description = req.body.description;
    const file = req.files.file;
    const fileName = file.name;
    const filePath = process.env.FILE_PATH + fileName;

    const ipfsGateway = process.env.IPFS_GATEWAY_URL;

    const address = req.body.address

    // console.log(title, description, address)

    file.mv(filePath, async (err) => {
        if (err) {
            console.log('error: failed to download the file.')
            return res.status(500).send(err)
        }

        const fileResult = await addFileToIPFS(filePath)
        console.log('File added to IPFS:', fileResult.cid.toString());

        const metadata = {
            title,
            description,
            image: ipfsGateway + fileResult.cid.toString() + '/' + fileName
        }
        const jsonResult = await addJSONToIPFS(metadata)
        console.log('Metadata added to IPFS:', jsonResult.cid.toString());

        const userAddress = address || process.env.ADDRESS;
        await mint(userAddress, ipfsGateway + jsonResult.cid.toString())

        res.json({
            message: 'File uploaded successfully.',
            metadata
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})