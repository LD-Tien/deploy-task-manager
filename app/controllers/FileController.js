const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const config = require("../../config/firebase.config");
const Task = require("../models/Task");
const { default: mongoose } = require("mongoose");

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

class UploadFileController {
  // [POST] /uploadFile/:taskId
  async uploadFile(req, res) {
    try {
      const dateTime = giveCurrentDateTime();
      const firebaseName =
        req.file.originalname + "|" + dateTime + "|" + req.userId;

      const storageRef = ref(storage, `files/${firebaseName}`);

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);
      const fileData = {
        firebaseName: firebaseName,
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        downloadURL: downloadURL,
      };

      Task.findOne({ taskId: req.params.taskId }).then((task) => {
        task.files.push(fileData);
        Task.updateOne({ taskId: req.params.taskId }, task).catch(console.log);
      });

      return res.json({
        code: 200,
        data: fileData,
        message: "File successfully uploaded.",
      });
    } catch (error) {
      return res.json({
        code: 400,
        error: error.message,
        message: "Upload file failed",
      });
    }
  }

  // [PUT] deleteFile/:directory
  deleteFile(req, res, next) {
    const desertRef = ref(storage, `files/${req.params.directory}`);
    deleteObject(desertRef)
      .then(() => {
        next();
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Delete file failed",
        });
      });
  }

  // [delete] deleteTask/:id
  deleteFilesInTask(req, res, next) {
    if (req.body.files.length !== 0) {
      req.body.files.every((file) => {
        const desertRef = ref(storage, `files/${file.firebaseName}`);
        deleteObject(desertRef)
          .then(() => {
            next();
          })
          .catch(console.log);
        return true;
      });
    }
    return;
  }

  // [DELETE] /deleteList/:id
  deleteFilesInList(req, res, next) {
    if (req.tasksDelete.length !== 0) {
      req.tasksDelete.every((task) => {
        if (task.files.length !== 0) {
          task.files.every((file) => {
            const desertRef = ref(storage, `files/${file.firebaseName}`);
            deleteObject(desertRef)
              .then(() => {
                next();
              })
              .catch(console.log);
            return true;
          });
        }
        return true;
      });
    }
  }
}

module.exports = new UploadFileController();

// router.post("/", upload.single("filename"), async (req, res) => {});
