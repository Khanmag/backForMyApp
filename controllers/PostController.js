import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            author: req.userId,
        })

        const post = await doc.save()

        res.json(post)

    } catch (err) {
        console.log(err)
        res.status(501).json({
            message: 'Не удалось запостить'
        })
    }
}


export const getAll = async (req, res) => {
    try {
        //.populate('author').exec() нужно чтобы возвращать не id автора, а его данные
        const posts = await PostModel.find().populate('author').exec();
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить посты'
        })
    }
}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1} },
            {returnDocument: 'after'},
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось получить пост'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Такого поста не существует"
                    })
                }
                res.status(200).json(doc)
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить пост. Что то пошло не так..'
        })
    }
}


export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete(
            {_id: postId},
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(501).json({
                        message: 'Не удалось удалить пост'
                    })
                }
                if (!doc) {
                    return res.status(501).json({
                        message: 'Пост не найден'
                    })
                }

                res.status(200).json({
                    success: true
                })
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так при удалении поста'
        })
    }
}


export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                author: req.userId,
            }
        )

        res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так при обновлении поста'
        })
    }
}
