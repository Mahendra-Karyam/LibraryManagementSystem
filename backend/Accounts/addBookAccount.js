const {Book} = require("../Databases/booksDatabase");
const addBook = async(req, res) => {
    try{
        const { Title, Author, Genre, imageURL, PDFLink} = req.body;
        const existingTitle = await Book.findOne({ Title });
        if (existingTitle) {
            return res.status(400).json({
                success: false,
                message: `Book already exists with the Title ${Title}. Please add another book!`
            });
        }
        else{
            const newBook = await Book.create({
                Title,
                Author,
                Genre,
                Availability : "Available", // Default value for Availability
                imageURL,
                PDFLink
            })
            res.status(201).json({
                success : true,
                message : `Book with the Title ${Title} added successfully!`,
                data : {
                    Title : newBook.Title,
                    Author : newBook.Author,
                    Genre : newBook.Genre,
                    Availability: newBook.Availability,
                    imageURL : newBook.imageURL
                }
            })
        }
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: 'Something went wrong during adding new Book, please try again later!'
        })
    }
    
}

module.exports = addBook;