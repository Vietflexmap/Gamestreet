# GameStreet 🌍

**GameStreet** là game trắc nghiệm địa lý mã nguồn mở MIT: xem panorama 360°, quan sát dấu hiệu đô thị và đoán đúng thành phố.

## 🎮 Chơi trực tiếp

**https://vietflexmap.github.io/Gamestreet/**

## GameStreet v3 — World City Challenge

- **10 lượt** mỗi ván.
- Mỗi lượt lấy ngẫu nhiên một panorama từ kho địa điểm chơi.
- **4 đáp án / lượt**, với 4 thành phố thuộc **4 châu lục khác nhau**.
- Mỗi ván bảo đảm có **ít nhất một lượt Hà Nội, Việt Nam 🇻🇳**.
- Người chơi bắt đầu với **2.000 điểm**.
- Đúng: **+1.000 điểm**.
- Sai: **−500 điểm**, hiện thông báo rất tiếc và đáp án đúng.
- Giao diện responsive cho desktop và mobile; panorama kéo ngang để quan sát.

## 🌐 Kho thành phố

Bản hiện tại có các panorama chơi được gồm Hà Nội, London, Berlin, Paris, Rome, New York, Toronto, Cairo và Sydney. Pool đáp án còn mở rộng thêm Tokyo, Singapore, Seoul, Mexico City, Rio de Janeiro, Buenos Aires, Lima, Cape Town, Nairobi, Auckland, Suva… để mỗi câu có lựa chọn đa châu lục.

## 🏆 Bảng xếp hạng

Cuối ván hiển thị top 10 theo mô hình game:

1. Top 5 là 5 username cố định đại diện **5 châu lục**, có **5 cờ khác nhau**.
2. Người chơi hiện tại luôn được làm nổi bật ở **hạng #6**.
3. Hạng #7–#10 là **4 người chơi ngẫu nhiên** từ pool challenger.

> Đây là leaderboard mô phỏng phía client cho bản GitHub Pages static. Có thể thay bằng leaderboard thật qua Supabase/PostgreSQL trong bản online nhiều người chơi.

## 🧱 Kiến trúc

- HTML5
- CSS responsive / glass UI
- JavaScript thuần
- Wikimedia Commons panorama
- GitHub Actions → `gh-pages` → GitHub Pages

Không cần backend, API key hay đăng nhập để chơi bản hiện tại.

## 📄 Giấy phép

Mã nguồn GameStreet: **MIT License**.

Panorama và tài sản bên thứ ba giữ giấy phép riêng của nguồn; xem [`THIRD_PARTY_ASSETS.md`](THIRD_PARTY_ASSETS.md).

## 🚀 Phát hành

Mỗi thay đổi trên nhánh `main` được workflow GitHub Actions đồng bộ sang `gh-pages`; GitHub Pages sau đó build và xuất bản site trực tiếp.