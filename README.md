# 🌐 Cộng đồng trao đổi học tiếng Anh - Frontend

Frontend của dự án **Cộng đồng trao đổi học tiếng Anh**, được xây dựng bằng **Vue 3**, sử dụng **Pinia** để quản lý state, kết nối API với backend (**NestJS**) thông qua JWT Authentication.  
Website hỗ trợ người dùng đăng ký, đăng nhập, đặt câu hỏi, trả lời, like/unlike câu trả lời và phân trang dữ liệu.

## 🚀 Công nghệ sử dụng
- [Vue 3](https://vuejs.org/) - Framework JavaScript hiện đại
- [Pinia](https://pinia.vuejs.org/) - State Management
- [Axios](https://axios-http.com/) - HTTP Client
- [Vue Router](https://router.vuejs.org/) - Routing
- [JWT Authentication](https://jwt.io/) - Xác thực người dùng
- [Vite](https://vitejs.dev/) - Build tool
- [Vercel](https://vercel.com/) - Triển khai
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference) - Đề xuất nội dung thông minh

## 📌 Chức năng chính
- Đăng ký tài khoản
- Đăng nhập / Đăng xuất
- Đăng câu hỏi
- Gợi ý câu hỏi thông minh bằng AI khi người dùng tạo câu hỏi
- Quản lý câu hỏi của bản thân
- Trả lời câu hỏi
- Quản lý câu trả lời của bản thân
- Like / Unlike câu trả lời
- Phân trang dữ liệu câu hỏi & câu trả lời

### OpenAI
Chứa hàm gọi API từ backend để gợi ý câu hỏi dựa trên từ khóa hoặc nội dung người dùng nhập.  
Backend sẽ sử dụng mô hình AI để tạo ra gợi ý phù hợp.

## 📂 Cấu trúc thư mục chính
```plaintext
src/
├── api/  
│   ├── ai.ts             # Chứa các file gọi API AI
│   ├── answers.ts        # API cho trả lời
│   ├── auth.ts           # API cho đăng ký, đăng nhập
│   ├── axios.ts          # Cấu hình Axios
│   ├── questions.ts      # API cho câu hỏi
│   └── users.ts          # API cho người dùng
│
├── components/           # Các component tái sử dụng
│   ├── AnswerCard.vue    # Hiển thị thông tin câu trả lời
│   ├── NavBar.vue        # Thanh điều hướng
│   └── QuestionCard.vue  # Hiển thị thông tin câu hỏi
│
├── pages/                # Các trang giao diện chính
│   ├── HomeView.vue          # Trang chủ
│   ├── LoginView.vue         # Trang đăng nhập
│   ├── QuestionCreate.vue    # Tạo câu hỏi
│   ├── QuestionDetail.vue    # Chi tiết câu hỏi + trả lời
│   ├── QuestionEdit.vue      # Chỉnh sửa câu hỏi
│   ├── RegisterView.vue      # Trang đăng ký
│   └── UserQuestion.vue      # Danh sách câu hỏi của người dùng
│
├── router/
│   └── index.ts           # Cấu hình Vue Router
│
├── stores/                # Pinia store
│   ├── auth.ts            # Store quản lý xác thực
│   └── question.ts        # Store quản lý câu hỏi
│
├── App.vue
└── main.ts

----------------------------------------------------------------------------------------------

⚙️ Cài đặt và chạy dự án
1️⃣ Clone repository
git clone https://github.com/QuocHuy0913/english-learning-frontend.git
cd <your-frontend-repo>

2️⃣ Cài đặt dependencies
npm install

3️⃣ Cấu hình biến môi trường
VITE_API_URL=http://localhost:3000   # URL backend NestJS

4️⃣ Chạy dự án local
npm run dev

Mở trình duyệt tại: http://localhost:5173

----------------------------------------------------------------------------------------------

🔗 Liên kết
Frontend (Vue3 + Pinia) - Repo hiện tại

Backend (NestJS + MySQL) - [Link Repository English Learning Backend](https://github.com/QuocHuy0913/english-learning-backend)

