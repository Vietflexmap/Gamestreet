# GameStreet 🌍

**GameStreet** là game trắc nghiệm địa lý chạy trực tiếp trên trình duyệt. Người chơi xem một panorama 360° ngẫu nhiên, quan sát dấu hiệu đường phố và chọn đúng thành phố trong **4 đáp án**.

> Mục tiêu của bản static MVP: **không đăng nhập, không backend, mở trang là chơi ngay**.

## 🎮 Chơi trực tiếp

**https://vietflexmap.github.io/Gamestreet/**

## Cách chơi

1. Nhập tên người chơi.
2. Mỗi ván có đúng **4 lượt**.
3. Mỗi lượt lấy ngẫu nhiên một panorama từ bộ địa điểm có sẵn.
4. Game sinh **4 lựa chọn thành phố** gồm 1 đáp án đúng + 3 đáp án nhiễu ngẫu nhiên.
5. Chọn thành phố và nhấn **Gửi đáp án**.
6. Nếu đúng: hiện **“Chúc mừng bạn!”** và cộng **+1.000 điểm**.
7. Nếu sai: hiện **“Bạn đã sai, rất tiếc!”**, cho biết **kết quả đúng** và trừ **−500 điểm**.
8. Sau lượt thứ 4, game hiển thị tổng điểm, số câu đúng và bảng kết quả từng lượt.

## Luật điểm

- Điểm khởi đầu: **2.000**.
- Đúng: **+1.000**.
- Sai: **−500**.
- Điểm không thấp hơn **0**.
- Điểm tối đa sau 4 lượt: **6.000**.

## Tính năng

- 4 lượt chơi/người.
- 4 đáp án thành phố/lượt.
- Ảnh panorama 360° được lấy ngẫu nhiên.
- Kéo ngang panorama để quan sát.
- Thứ tự đáp án được xáo ngẫu nhiên mỗi lượt.
- Phản hồi đúng/sai ngay sau khi gửi.
- Hiển thị tên thành phố và quốc gia đúng.
- Cộng/trừ điểm rõ ràng.
- Tổng kết số câu đúng trên 4 lượt.
- Local leaderboard lưu bằng `localStorage`.
- Responsive cho desktop và mobile.
- Không cần API key và không cần backend cho bản MVP.

## Công nghệ

- HTML5
- CSS3
- Vanilla JavaScript
- Wikimedia Commons cho panorama demo
- GitHub Pages để phát hành
- GitHub Actions để đồng bộ `main` → `gh-pages`

## Cấu trúc

```text
Gamestreet/
├── index.html
├── styles.css
├── app.js
├── README.md
├── LICENSE
├── THIRD_PARTY_ASSETS.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Thêm thành phố / panorama

Mỗi địa điểm được khai báo trong `LOCATIONS` ở `app.js`:

```js
{
  id: "dia-diem",
  city: "Tên thành phố",
  country: "Quốc gia",
  file: "Tên file panorama trên Wikimedia Commons",
  author: "Tác giả",
  license: "Giấy phép",
  hint: "Thông tin xuất hiện sau khi trả lời"
}
```

Nên bổ sung nhiều panorama cho mỗi thành phố để giảm khả năng người chơi ghi nhớ ảnh.

## License

Mã nguồn GameStreet được phát hành theo **MIT License**.

Ảnh panorama và nội dung bên thứ ba **không thuộc MIT License của mã nguồn**. Xem `THIRD_PARTY_ASSETS.md` để biết attribution và giấy phép tương ứng.
