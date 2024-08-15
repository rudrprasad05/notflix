import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import { Stats } from "fs";
import { GetAllMovies, UploadVideoMetaToSql } from "./db";
import getVideoDurationInSeconds from "get-video-duration";
var ffmpeg = require("fluent-ffmpeg");

const app = express();
const port = 3001;
const imagesDir = path.join(__dirname, "..", "images");

// config
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json({ limit: "5gb" }));
app.use(express.urlencoded({ limit: "50gb", extended: true }));
app.use("/images", express.static(imagesDir));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    let filePath =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, filePath);
  },
});

// Init upload
const upload = multer({ storage: storage });

app.get("/", (req: Request, res: Response) => {
  res.json("Hello");
});

// Upload video route
app.post(
  "/upload",
  upload.single("video"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.json({ file: `uploads/${req.file.filename}` });
    let duration = 0;
    let filePath = `./uploads/${req.file.filename}`;
    await getVideoDurationInSeconds(filePath).then((d) => {
      duration = Math.floor(d / 60);
    });
    ffmpeg(filePath)
      .on("end", function () {
        console.log("Screenshots taken");
      })
      .on("error", function (err: Error) {
        console.error(err);
      })
      .screenshots({
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 1,
        folder: "./images",
        filename: `${req.file.filename}.png`,
      });
    await UploadVideoMetaToSql(
      req.file.filename,
      `http://localhost:3001/images/${req.file.filename}.png`,
      req?.query?.name as unknown as string,
      duration
    );
  }
);

app.get("/api/movies", async (req: Request, res: Response) => {
  await GetAllMovies(0, 10).then((r) => {
    return res.status(200).send(r);
  });
});

// Stream video route
app.get("/video/:filename", (req: Request, res: Response) => {
  const videoPath = path.join(__dirname, "..", "uploads", req.params.filename);
  let stat: Stats;
  try {
    stat = fs.statSync(videoPath);
  } catch (err) {
    return res.status(404).send("File not found");
  }

  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
