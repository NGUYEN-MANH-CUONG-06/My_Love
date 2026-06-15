import "./LoveMap.css";

const locations = [
  {
    id: 1,
    title: "Nơi ánh mắt ta chạm nhau",
    desc: "Sảnh S8.03 Vinhomes Grand Park",
    icon: "👀",
  },
  {
    id: 2,
    title: "Buổi hẹn hò đầu tiên",
    desc: "Hai đứa đi xem phim mà em đút bim bim cho anh mà anh không ăn hihi",
    icon: "🎬",
  },
  {
    id: 3,
    title: "Nụ hôn đầu lóng ngóng",
    desc: "Dưới bể bơi nơi em đã chủ động hôn anh và bị anh bắt lại hôn lại cho chừa",
    icon: "💋",
  },
  {
    id: 4,
    title: "Hành trình tương lai",
    desc: "Còn bao nhiêu nơi nữa đang chờ chúng mình...",
    icon: "✈️",
  },
];

export default function LoveMap() {
  return (
    <div className="love-map-container glass" data-aos="fade-up">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "28px",
          color: "#ff4f81",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Bản Đồ Tình Yêu 🗺️
      </h3>
      <div className="love-map-timeline">
        {locations.map((loc, index) => (
          <div
            key={loc.id}
            className="map-node"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div className="map-icon">{loc.icon}</div>
            <div className="map-content">
              <h4>{loc.title}</h4>
              <p>{loc.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
