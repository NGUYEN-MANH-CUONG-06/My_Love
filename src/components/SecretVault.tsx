import "./SecretVault.css";

const keepsakes = [
  {
    title: "Điều anh nhớ",
    text: "Nhớ những lúc em cười, rồi tự nhiên mọi chuyện trong ngày của anh nhẹ đi rất nhiều.",
  },
  {
    title: "Điều anh hứa",
    text: "Anh sẽ học cách lắng nghe em kỹ hơn, thương em dịu hơn và ở cạnh em chắc chắn hơn.",
  },
  {
    title: "Điều anh mong",
    text: "Mong tụi mình có thêm thật nhiều ngày bình yên, nhiều chuyến đi và nhiều kỷ niệm chỉ hai đứa biết.",
  },
];

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
        <button
          className="close-vault-btn"
          onClick={onClose}
          aria-label="Đóng kho báu bí mật"
        >
          ✕
        </button>
        <h2>Kho báu bí mật đã mở! 🔐</h2>
        <p className="vault-subtitle">Gửi em, bảo bối của anh ❤️</p>
        <div className="vault-letter">
          <p>
            Cảm ơn em đã xuất hiện trong cuộc đời anh. Mỗi ngày trôi qua, anh
            đều cảm thấy mình may mắn hơn vì có em bên cạnh.
          </p>
          <p>
            Anh biết mình không phải lúc nào cũng hoàn hảo, nhưng anh sẽ luôn
            cố gắng để yêu em bằng sự chân thành nhất, để em thấy được rằng em
            luôn là người đặc biệt trong lòng anh.
          </p>
          <p>
            Hãy cùng anh viết tiếp câu chuyện của tụi mình bằng thật nhiều ngày
            vui, thật nhiều cái ôm và thật nhiều kỷ niệm đẹp nha.
          </p>
          <p className="vault-signature">- Yêu em vô cùng -</p>
        </div>

        <div className="vault-keepsakes">
          {keepsakes.map((item) => (
            <div className="vault-keepsake" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
