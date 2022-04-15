const express = require('express')
const articleRouter = require('./routes/articles')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')

const app = express()

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false })) // this statement shd be above the below statement
app.use('/articles', articleRouter)
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {

    const articles = await Article.find().sort({
        date: 'desc'
    }) // Displays all articles stored in database based on latest created

    res.render('articles/index.ejs', { articles: articles })
})

app.listen(3000, () => console.log('Server running on port 3000'))