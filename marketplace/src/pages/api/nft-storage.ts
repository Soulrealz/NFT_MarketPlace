import formidable from "formidable";
import { readFileSync, unlinkSync } from "fs";
import { NextApiHandler } from "next";
import { File, NFTStorage } from "nft.storage";

const client = new NFTStorage({ token: `${process.env.NFT_STORAGE_KEY}` });

const handler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    return res.status(403).json({ error: `Unsupported method ${req.method}` });
  }
  try {
    
    const data: any = await new Promise((res, rej) => {
      const uploadDir = `${process.cwd()}/tmp`;
      const form = formidable({ multiples: true, uploadDir });
      form.parse(req, (err, fields, files) => {
        if (err) rej(err);
        res({ ...fields, ...files });
      });
    });
    
    const {
      filepath,
      originalFilename = "image",
      mimetype = "image",
    } = data.image;
    const buffer = readFileSync(data.image.filepath);
    const arraybuffer = Uint8Array.from(buffer).buffer;
    const file = new File([arraybuffer], originalFilename, {
      type: mimetype,
    });
    
    const metadata = await client.store({
      name: data.name,
      description: data.description,
      image: file,
    });
    
    unlinkSync(filepath);
    
    res.status(201).json({ uri: metadata.url });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};


export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
