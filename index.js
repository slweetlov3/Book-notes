import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "171204",
  port: 5432,
});

db.connect();



const book = [
  { title: 'The Power of Habit', cover: 'https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg' },
  { title: 'Atomic Habits', cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' },
  { title: 'Deep Work', cover: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg' }
];



//Route to fetch the image and Add it to database if it exist.
app.post('/add', async (req, res) => {
  const isbn = req.body.isbn;
  const title = req.body.title; // Lấy title từ body
  const des = req.body.des;
  const rate = req.body.rate;

  try {
    // Open Library Covers API URL
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    
    // Kiểm tra xem ảnh có tồn tại hay không bằng axios.get
    const response = await axios.get(coverUrl, { responseType: 'arraybuffer' });
    
    // Kiểm tra loại MIME của phản hồi để xác định xem nó có phải là ảnh hợp lệ hay không
    const contentType = response.headers['content-type'];
    
    if (contentType && contentType.startsWith('image/')) {
        // Nếu phản hồi có kiểu MIME là ảnh, lưu thông tin bìa và tiêu đề vào database
        await db.query("INSERT INTO book (cover, title, description, rating, isbn) VALUES ($1, $2, $3, $4, $5)", [coverUrl, title, des, rate, isbn]);
        
        // Chuyển hướng về trang chính
        res.redirect('/');
    } else {
        // Nếu không phải là ảnh
        res.status(404).json({ message: 'URL exists but is not an image' });
    }
} catch (error) {
    // Nếu có lỗi xảy ra (ví dụ: lỗi kết nối hoặc ảnh không tồn tại)
    console.error("Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
}
});


//Main Route
app.get("/", async (req, res) => {
    const bookFetch = await db.query("SELECT * FROM book ORDER BY id asc");
    const book = bookFetch.rows;
    res.render("index.ejs", { books: book });
});



//Edit Form and render edit.ejs
app.get("/edit", async(req, res) => {
  const bookId = req.query.id;
  console.log(bookId);
  const bookFetch = await db.query("SELECT * FROM book WHERE id = $1", [bookId]);
  const book = bookFetch.rows[0];
  console.log(book)
  res.render("edit.ejs", { book: book });
})

app.post("/delete", async(req,res) => {
  const bookId = req.body.deleteId;
  console.log(bookId);
  await db.query("DELETE FROM book WHERE id = $1", [bookId]);
  res.redirect('/');
})


app.post("/bookEdit", async(req,res) => {
  const id = req.body.id;
  const title = req.body.title;
  const des = req.body.des;
  const rate = req.body.rate;
  const isbn = req.body.isbn;
  console.log(id);
  console.log(isbn);

  try {
    // Open Library Covers API URL
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    
    // Kiểm tra xem ảnh có tồn tại hay không bằng axios.get
    const response = await axios.get(coverUrl, { responseType: 'arraybuffer' });
    
    // Kiểm tra loại MIME của phản hồi để xác định xem nó có phải là ảnh hợp lệ hay không
    const contentType = response.headers['content-type'];
    
    if (contentType && contentType.startsWith('image/')) {
        // Nếu phản hồi có kiểu MIME là ảnh, lưu thông tin bìa và tiêu đề vào database
        await db.query("UPDATE book SET cover = ($1), title = ($2), description = ($3), rating = ($4), isbn = ($5) WHERE id = $6"
        , [coverUrl, title, des, rate, isbn, id]);
        
        // Chuyển hướng về trang chính
        res.redirect('/');
    } else {
        // Nếu không phải là ảnh
        res.status(404).json({ message: 'URL exists but is not an image' });
    }
} catch (error) {
    // Nếu có lỗi xảy ra (ví dụ: lỗi kết nối hoặc ảnh không tồn tại)
    console.error("Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
}
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
