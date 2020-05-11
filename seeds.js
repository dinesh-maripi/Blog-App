const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const Comment = require('./models/Comment');

const data = [
  { title: 'The Hulk', image: 'https://i.picsum.photos/id/1003/400/400.jpg', body: 'it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.' },
  { title: 'Serpent Queen of Alaska', image: 'https://picsum.photos/400', body: 'A reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.' },
  { title: 'American Dragon Jakelong', image: 'https://i.picsum.photos/id/1011/400/400.jpg', body: 'the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.' }
]


function seedDB() {
  //Remove all blogs
  Blog.deleteMany({}, (err, blogs) => {
    if (err) {
      console.log('Failed to delete blogs');
    } else {
      console.log('Successfully deleted all blogs!');
      data.forEach(datum => {
        Blog.create(datum, (err, newlyCreatedBlog) => {
          if (err) {
            console.log(err);
          } else {
            Comment.create({ text: 'I thouroughly enjoyed reading this blog.', author: 'Surya' }, (err, newlyCreatedComment) => {
              if (err) {
                console.log('Failed to create a comment!');
              } else {
                newlyCreatedBlog.comments.push(newlyCreatedComment);
                newlyCreatedBlog.save((err, blog) => {
                  if (err) {
                    console.log('Failed to add comment to the blog');
                  } else {
                    console.log(newlyCreatedBlog);
                  }
                })
              }
            })
          }
        })
      })
    }
  })
}

module.exports = seedDB;

