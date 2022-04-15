const mongoose = require('mongoose')
const marked = require('marked')
// allows us to create markdown and turn it into HTML
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
// allows our dompurify  to create HTML and purify it using the window object
const dompurify = createDomPurify(new JSDOM().window)
// we also need to sanitize it to prevent malicious actions
const slugify = require('slugify')
// allows us to convert something like title below into a url 

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true // unique for each blog
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

//slug: convert title into url instead of id's so that it can be readable 
// takes the title converts into a slug and adds it to the url
// Validates before save, delete, edit etc
articleSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true}) // strict: removes any special characters in title
    }
    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
        // converts our markdown to HTML abd then sanitize it to get rid of malicious acticities
    }
    next()
})



module.exports = mongoose.model('Article', articleSchema)