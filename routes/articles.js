const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new.ejs', {article: new Article()})
    // {article: new Article()} for empty input fields
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/') // if article is not found redirect back to home page(index.ejs)
    res.render('articles/show.ejs', {article: article})
})

// A unique id will be created for each blog through the article.id for editing and deleting an existing blog
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit.ejs', {article: article})
})

router.post('/', async (req, res, next) => {
    req.article = new Article() // req.<variable>
    next() // points to saveArticleAndRedirect()
}, saveArticleAndRedirect('new.ejs'))

// Inorder to call this route by clicking the delete btn a DELETE method is required but a form allows only GET/POST
// A lib called method-override is required for this it overrides the method that our form passes
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.put('/:id', async (req, res) => {
    req.article = await Article.findById(req.params.id)// req.<variable>
    next() // points to saveArticleAndRedirect()
}, saveArticleAndRedirect('edit.ejs'))


// Since our post for creating an article and put for editing an article is almost identical
// so we call a function(middleware) common for them
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
    
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`) // redirect to /:slug with the slug created
            // a unique slug with title passed will be created for each blog on saving
        } catch (e) {
            res.render(`articles/${path}`, {article: article})
            // in case of error redirect back to same page with pre-written values in the input fields
            // the <%= article.description %>(for pre-written values) in partial_view.ejs comes into picture only when error occurs while saving(title/markdown field left empty)
        }
    }
}

module.exports = router