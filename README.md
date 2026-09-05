# GameStreet 🌍

**GameStreet** là game đoán vị trí địa lý chạy trực tiếp trên trình duyệt: xem panorama 360°, đặt ghim lên bản đồ và kiếm điểm theo khoảng cách tới vị trí thật.

> Mục tiêu của bản static MVP: **không đăng nhập, không backend, mở trang là chơi ngay**.

## Chơi trực tiếp

Sau khi GitHub Pages được bật cho repository, game được phục vụ tại:

**https://vietflexmap.github.io/Gamestreet/**

## Tính năng

- 5 vòng mỗi ván, 60 giây mỗi vòng.
- Panorama 360° có thể kéo ngang để quan sát.
- Bản đồ đoán vị trí dùng Leaflet + OpenStreetMap.
- Tính khoảng cách bằng Haversine và điểm theo hàm suy giảm khoảng cách.
- Màn hình kết quả hiển thị ghim dự đoán, vị trí thật và đường nối.
- Tổng kết 5 vòng, khoảng cách trung bình, kỷ lục cá nhân.
- Bảng xếp hạng cục bộ bằng `localStorage` — không cần tài khoản.
- Responsive desktop / mobile.
- Có thể chia sẻ kết quả bằng Web Share API hoặc clipboard.
- GitHub Actions workflow sẵn sàng deploy lên GitHub Pages.

## Công nghệ

- HTML5
- CSS3
- Vanilla JavaScript
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- Panorama mở từ [Wikimedia Commons](https://commons.wikimedia.org/)

Không có bước build và không cần Node.js để chạy bản production.

## Chạy local

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Cấu trúc

```text
Gamestreet/
├── index.html
├── styles.css
├── app.js
├── LICENSE
├── THIRD_PARTY_ASSETS.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Thuật toán điểm

Mỗi vòng tối đa **5.000 điểm**.

```text
score = round(5000 * exp(-distance_m / 2000))
```

Nếu khoảng cách ≤ 50 m, người chơi nhận đủ 5.000 điểm.

## Dữ liệu panorama

Repository **không đóng gói lại** các ảnh panorama. Ảnh được tải trực tiếp từ Wikimedia Commons bằng URL công khai và hiển thị attribution trong giao diện. Giấy phép của từng ảnh được liệt kê trong [`THIRD_PARTY_ASSETS.md`](THIRD_PARTY_ASSETS.md) và **không bị thay thế bởi giấy phép MIT của mã nguồn**.

## Bảng xếp hạng thật / Google Street View

Bản GitHub Pages hiện tại cố ý không dùng backend để bảo đảm “clone là chạy”. Nếu muốn nâng cấp production:

1. Dùng Supabase/PostgreSQL cho global leaderboard.
2. Thêm API/serverless để rate-limit và chống sửa điểm.
3. Tích hợp Google Maps JavaScript Street View hoặc nguồn panorama khác qua server-side key/proxy phù hợp điều khoản dịch vụ.
4. Mở rộng bộ địa điểm theo thành phố / quốc gia / thử thách hàng ngày.

## Đóng góp

Issue và Pull Request đều được chào đón. Khi thêm panorama mới, hãy đảm bảo:

- Có tọa độ chính xác.
- Có giấy phép cho phép tái sử dụng.
- Ghi đầy đủ tác giả + giấy phép.
- Không commit API key hoặc secret vào repository.

## License

Mã nguồn GameStreet phát hành theo **MIT License**. Xem [`LICENSE`](LICENSE).

Dữ liệu/hình ảnh bên thứ ba giữ nguyên giấy phép của chủ sở hữu tương ứng.
