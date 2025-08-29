# 🌐 Cộng đồng trao đổi học tiếng Anh - Frontend

# 🌐 Cộng đồng trao đổi học tiếng Anh - Frontend

Dự án **Frontend** của nền tảng **Cộng đồng trao đổi học tiếng Anh**, nơi người dùng có thể đặt câu hỏi, trả lời, thảo luận và chia sẻ kiến thức tiếng Anh.  

Ứng dụng được phát triển bằng **Vue 3** kết hợp **Pinia** để quản lý state, giao tiếp với **Backend (NestJS)** thông qua **JWT Authentication**.  
Giao diện thân thiện, hỗ trợ đầy đủ các chức năng cho **người dùng**:  
- ✍️ Đăng ký, đăng nhập, quản lý tài khoản cá nhân  
- ❓ Đặt câu hỏi, quản lý câu hỏi của bản thân  
- 💬 Trả lời câu hỏi, chỉnh sửa/xóa câu trả lời  
- 👍 Like / Unlike câu trả lời  
- 📑 Phân trang dữ liệu câu hỏi & câu trả lời  
- 🤖 **Tích hợp AI gợi ý câu hỏi** thông minh khi người dùng tạo câu hỏi  

Ngoài ra, dự án cũng cung cấp **giao diện quản trị (Admin Dashboard)** cho phép quản lý toàn bộ hệ thống:  
- 👤 Quản lý người dùng (xem chi tiết, tìm kiếm, khóa/mở khóa tài khoản)  
- ❓ Quản lý câu hỏi & trả lời (duyệt, xóa, thống kê lượt trả lời & like)  
- 🚨 Quản lý báo cáo (review, cập nhật trạng thái, xử lý nội dung vi phạm)  
- 🔔 Quản lý thông báo (tạo, cập nhật, gửi đến toàn hệ thống hoặc cá nhân)  
- 📊 Theo dõi thống kê hệ thống và tăng trưởng hàng tháng  

---

## 🚀 Công nghệ sử dụng
- [Vue 3](https://vuejs.org/) - Framework JavaScript hiện đại
- [Pinia](https://pinia.vuejs.org/) - State Management
- [Axios](https://axios-http.com/) - HTTP Client
- [Vue Router](https://router.vuejs.org/) - Routing
- [JWT Authentication](https://jwt.io/) - Xác thực người dùng
- [Vite](https://vitejs.dev/) - Build tool
- [Vercel](https://vercel.com/) - Triển khai
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference) - Đề xuất nội dung thông minh

---

## 📌 Chức năng chính

### 👤 Người dùng (Client)
- Đăng ký / Đăng nhập / Đăng xuất  
- Quản lý thông tin cá nhân  
- Đặt câu hỏi  
- Gợi ý câu hỏi thông minh bằng AI khi tạo câu hỏi  
- Xem, chỉnh sửa, xóa câu hỏi của bản thân  
- Trả lời câu hỏi, trả lời lồng nhau (reply)  
- Quản lý câu trả lời của bản thân (sửa, xóa)  
- Like / Unlike câu trả lời  
- Nhận thông báo (notifications)  
- Gửi báo cáo (report) vi phạm  
- Phân trang dữ liệu câu hỏi & câu trả lời  

---

### 🛠️ Admin
- **Quản lý người dùng**: danh sách, tìm kiếm, xem chi tiết, ban/mở khóa  
- **Quản lý câu hỏi**: danh sách, chi tiết, xóa, thống kê số lượng  
- **Quản lý câu trả lời**: danh sách, xóa, thống kê số lượng & lượt like  
- **Quản lý tag**: xem, xóa  
- **Quản lý báo cáo**: danh sách, chi tiết, cập nhật trạng thái (pending/reviewed)  
- **Quản lý thông báo**: tạo, cập nhật, xóa, gửi toàn hệ thống hoặc cho 1 user  
- **Thống kê hệ thống**: theo dõi tăng trưởng hàng tháng  


### OpenAI
Chứa hàm gọi API từ backend để gợi ý câu hỏi dựa trên từ khóa hoặc nội dung người dùng nhập.  

Backend sẽ sử dụng mô hình AI để tạo ra gợi ý phù hợp.

---

## 📂 Cấu trúc thư mục chính
```plaintext
src/
├── api/                       # Các file gọi API
│   ├── adminApi.ts            # API cho admin (user, question, answer, report, tag, notif)
│   ├── ai.ts                  # API AI (gợi ý câu hỏi)
│   ├── answers.ts             # API cho trả lời
│   ├── auth.ts                # API cho đăng ký, đăng nhập
│   ├── axios.ts               # Cấu hình Axios
│   ├── notifications.ts       # API cho thông báo
│   ├── questions.ts           # API cho câu hỏi
│   ├── reports.ts             # API cho báo cáo
│   ├── tags.ts                # API cho tag
│   └── users.ts               # API cho người dùng
│
├── components/                # Các component tái sử dụng
│   ├── AnswerCard.vue         # Hiển thị câu trả lời
│   ├── NavBar.vue             # Thanh điều hướng
│   ├── NotificationCard.vue   # Hiển thị thông báo
│   ├── QuestionCard.vue       # Hiển thị câu hỏi
│   ├── ReportCard.vue         # Thẻ báo cáo
│   └── ReportDetail.vue       # Chi tiết báo cáo
│
├── pages/
│   ├── Admin/                 # Các trang dành cho Admin
│   │   ├── types/
│   │   │   └── admin.ts       # Định nghĩa type cho admin
│   │   ├── AdminAnswers.vue   # Quản lý câu trả lời
│   │   ├── AdminDashBoard.vue # Bảng điều khiển
│   │   ├── AdminNotifications.vue # Quản lý thông báo
│   │   ├── AdminQuestions.vue # Quản lý câu hỏi
│   │   ├── AdminReports.vue   # Quản lý báo cáo
│   │   ├── AdminUsers.vue     # Quản lý người dùng
│   │   └── GrowthTrend.vue    # Thống kê tăng trưởng
│   │
│   ├── Client/                # Các trang dành cho người dùng
│   │   ├── HomeView.vue       # Trang chủ
│   │   ├── LoginView.vue      # Đăng nhập
│   │   ├── NotificationView.vue # Danh sách thông báo
│   │   ├── QuestionCreate.vue # Tạo câu hỏi
│   │   ├── QuestionDetail.vue # Chi tiết câu hỏi + trả lời
│   │   ├── QuestionEdit.vue   # Chỉnh sửa câu hỏi
│   │   ├── RegisterView.vue   # Đăng ký
│   │   └── UserQuestion.vue   # Danh sách câu hỏi của user
│   │
│   └── Error/
│       └── ErrorView.vue      # Trang lỗi 404/500
│
├── router/
│   └── index.ts               # Cấu hình Vue Router
│
├── stores/                    # Pinia store
│   ├── auth.ts                # Store quản lý xác thực
│   └── notificationStore.ts   # Store quản lý thông báo
│
├── App.vue
└── main.ts

```
---

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

