SETUP db:

CREATE table book (
  id SERIAL PRIMARY KEY,
  title text,
  cover text,
  rating float,
  description text,
  isbn text,
);

Đây là 1 capstone project trong khóa học của Angela Yu, giao diện đơn giản, thực hiện những công việc như:
-Thêm 1 quyển sách mới bằng cách:
Fetch Book covers từ https://openlibrary.org/dev/docs/api/covers bằng ISBN
và đưa URL của hình vào trong db, cùng những thông tin khác như Tên cuốn sách, Mô tả/Suy nghĩ của bản thân, rate của bản thân về cuốn sách,...
-Chỉnh sửa.
-Xóa.
-Hiển thị những cuồn sách ấy trong db.

