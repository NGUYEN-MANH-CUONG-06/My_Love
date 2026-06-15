import "./SecretVault.css";

export default function SecretVault({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="secret-vault-overlay fade-in">
      <div className="secret-vault-content glass">
        <button className="close-vault-btn" onClick={onClose}>
          ✕
        </button>
        <h2
          style={{ color: "#ff4f81", fontFamily: "'Playfair Display', serif" }}
        >
          Kho Báu Bí Mật Đã Mở! 🔐
        </h2>
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: "#d81b60",
            fontWeight: "bold",
          }}
        >
          Gửi em, bảo bối của anh ❤️
        </p>
        <div className="vault-letter">
          <p>
            Cảm ơn em đã xuất hiện trong cuộc đời anh. Mỗi ngày trôi qua, anh
            đều cảm thấy mình là người may mắn nhất thế giới vì có em bên cạnh.
            Hãy cứ là em, lúc nào cũng cười thật tươi nhé! Anh sẽ luôn ở đây che
            chở và yêu thương em. Xin lỗi em vì những lúc anh chưa hoàn hảo,
            nhưng anh hứa sẽ luôn cố gắng trở thành người xứng đáng với tình yêu
            của em.
          </p>
          <p style={{ marginTop: "15px" }}>
            Anh yêu em rất nhiều, hơn cả những gì anh có thể diễn tả bằng lời.
            Cảm ơn em vì đã là người đặc biệt nhất trong cuộc đời anh. Anh sẽ
            luôn trân trọng và yêu thương em, mãi mãi.
          </p>
          <p style={{ marginTop: "15px" }}>
            Hãy cùng nhau tạo nên thật nhiều kỷ niệm đẹp và viết tiếp câu chuyện
            tình yêu của chúng ta nhé! ❤️
          </p>
          <p style={{ marginTop: "15px" }}>- Yêu em vô cùng -</p>
          <p
            style={{
              textAlign: "right",
              marginTop: "20px",
              fontStyle: "italic",
            }}
          >
            - Yêu em vô cùng -
          </p>
        </div>

        <div className="vault-video-placeholder">
          <p>
            (Anh có thể thay file `secret.mp4` vào code để phát video ẩn ở đây)
          </p>
        </div>
      </div>
    </div>
  );
}
