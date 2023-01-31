import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {loginValidation, registerValidation} from './validators.js'
import {postValidation} from "./validators.js";

import {checkAuth, validationErrors} from './utils/index.js'
import {UserController, PostController} from './controllers/index.js'

const mongoURI = 'mongodb+srv://Solo:Solo.329@cluster0.yqqj3tt.mongodb.net/blog?retryWrites=true&w=majority'
mongoose
    .connect(mongoURI)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage })

//позволяет читать json в запросах
app.use(express.json());
//позволяет делать get запросы для статичных файлов, которые уже загружены
app.use('/upload', express.static('uploads'))


app.post('/auth/login', loginValidation, validationErrors, UserController.login);
app.post('/auth/register', registerValidation, validationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: './uploads/' + req.file.originalname
    })
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postValidation, validationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postValidation, validationErrors, PostController.update);
app.delete('/posts/:id',checkAuth, PostController.remove);

app.listen(process.env.PORT || 8888, (err) => {
    if (err) return console.log(err)
    console.log('Server OK')
})