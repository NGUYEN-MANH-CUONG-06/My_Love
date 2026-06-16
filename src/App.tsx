import { useState, type MouseEvent, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import bg from "./assets/bg.png";
import { TypeAnimation } from "react-type-animation";
import Confetti from "react-confetti";

import {
  photos,
  timelineEvents,
  quotes,
  questions,
  bucketList,
  reasons,
  dailyLoveReasons,
  starWishes,
  endingLines,
} from "./data";
import Preloader from "./components/Preloader";
import MagicCursor from "./components/MagicCursor";
import LiveTimer from "./components/LiveTimer";
import ParticlesBackground from "./components/ParticlesBackground";

import Tilt from "react-parallax-tilt";
import MemoryGame from "./components/MemoryGame";
import { QRCodeSVG } from "qrcode.react";
import MessageForm from "./components/MessageForm";
import LoveMap from "./components/LoveMap";
import DailyChallenge from "./components/DailyChallenge";
import PhotoBook from "./components/PhotoBook";
import VoiceMessage from "./components/VoiceMessage";
import VoiceRecorder from "./components/VoiceRecorder";
import LoveTimer from "./components/LoveTimer";
import LoveRoulette from "./components/LoveRoulette";
import SecretVault from "./components/SecretVault";
import MoodCheckIn from "./components/MoodCheckIn";

const OFFICIAL_MUSIC_VIDEO_ID = "__kGJZ-kPno";
const officialMusicEmbedUrl = `https://www.youtube.com/embed/${OFFICIAL_MUSIC_VIDEO_ID}?autoplay=1&loop=1&playlist=${OFFICIAL_MUSIC_VIDEO_ID}&rel=0`;
const DAY_MS = 1000 * 60 * 60 * 24;
const wishStarPositions = [
  { top: "18%", left: "8%" },
  { top: "28%", left: "88%" },
  { top: "48%", left: "13%" },
  { top: "62%", left: "82%" },
  { top: "78%", left: "22%" },
];

const getNextBirthday = (date: Date) => {
  const nextBirthday = new Date(date.getFullYear(), 10, 7);
  nextBirthday.setHours(0, 0, 0, 0);

  if (nextBirthday.getTime() < date.getTime()) {
    nextBirthday.setFullYear(date.getFullYear() + 1);
  }

  return nextBirthday;
};

const playPopSound = () => {
  try {
    const AudioContext =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // ignore audio errors
  }
};

const playTadaSound = () => {
  try {
    const AudioContext =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc1.type = "square";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(400, ctx.currentTime);
    osc2.frequency.setValueAtTime(600, ctx.currentTime);
    osc1.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
    osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
    osc1.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
    osc2.frequency.setValueAtTime(1000, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch {
    // ignore audio errors
  }
};

function App() {
  const [, setTypedCode] = useState("");
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [, setHeaderClickCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setTypedCode((prev) => {
        const newCode = (prev + e.key).slice(-8);
        if (newCode === "15112004") {
          setIsVaultOpen(true);
          playTadaSound();
        }
        return newCode;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHeaderClick = () => {
    setHeaderClickCount((prev) => {
      if (prev + 1 === 5) {
        setIsVaultOpen(true);
        playTadaSound();
        return 0;
      }
      return prev + 1;
    });
  };

  const [currentScreen, setCurrentScreen] = useState<
    "PASSWORD" | "QA" | "MAIN"
  >("PASSWORD");
  const [password, setPassword] = useState("");
  const [qaIndex, setQaIndex] = useState(0);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const showAlert = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message });
  };
  const closeAlert = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: 0, left: 0 });

  // Story progression state
  const [storyStep, setStoryStep] = useState(1);

  // Ultimate Upgrades state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);

  // Confetti state
  const [isConfettiExploding, setIsConfettiExploding] = useState(false);
  const [novelStep, setNovelStep] = useState<number>(0);

  // Ultimate Upgrades states
  const [showVouchers, setShowVouchers] = useState(false);
  const [activeWishIndex, setActiveWishIndex] = useState<number | null>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(
    null,
  );
  const [clickHearts, setClickHearts] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [memoryGamePassed, setMemoryGamePassed] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Heart click effect
    const handleClick = (e: MouseEvent) => {
      playPopSound();
      const newHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setClickHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setClickHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("click", handleClick as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => window.removeEventListener("click", handleClick as any);
  }, []);

  const toggleAudio = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePasswordSubmit = () => {
    const pw = password.toLowerCase().trim();
    if (
      pw === "7-11-2022" ||
      pw === "07-11-2022" ||
      pw === "7/11/2022" ||
      pw === "07/11/2022" ||
      pw === "7112022" ||
      pw === "1402" ||
      pw === "chúi chúi" ||
      pw === "chui chui"
    ) {
      setCurrentScreen("QA");
      setIsPlaying(true);
    } else {
      showAlert("Oops!", "Sai mật khẩu rồi bé ơi 🥺");
    }
  };

  const nextQuestion = () => {
    if (qaIndex < questions.length - 1) {
      setQaIndex(qaIndex + 1);
    } else {
      setCurrentScreen("MAIN");
    }
  };

  const startDate: Date = new Date(2022, 10, 7);
  const today: Date = new Date();

  const birthday: Date = getNextBirthday(today);
  const diffBday: number = birthday.getTime() - today.getTime();
  const bdayDays: number = Math.ceil(diffBday / (1000 * 60 * 60 * 24));
  const dailyReason =
    dailyLoveReasons[Math.floor(today.getTime() / DAY_MS) % dailyLoveReasons.length];
  const activeWish =
    activeWishIndex !== null ? starWishes[activeWishIndex] : null;
  const activeTimelineEvent =
    activeTimelineIndex !== null ? timelineEvents[activeTimelineIndex] : null;

  const handleNoHover = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const maxX = window.innerWidth - btn.offsetWidth - 50;
    const maxY = window.innerHeight - btn.offsetHeight - 50;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    setNoButtonPos({ left: x, top: y });
  };

  const handleNovelClick = () => {
    setNovelStep(1);
    setTimeout(() => setNovelStep(2), 1500);
    setTimeout(() => setNovelStep(3), 3000);
  };

  const advanceStory = (step: number, targetId: string) => {
    if (storyStep < step) {
      setStoryStep(step);
    }
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      <MagicCursor />
      <ParticlesBackground isDarkMode={isDarkMode} />

      {currentScreen === "MAIN" && isDarkMode && (
        <div className="wish-sky" aria-label="Bầu trời điều ước">
          <div className="wish-sky-label">Bầu trời điều ước</div>
          {starWishes.map((wish, index) => (
            <button
              key={wish.title}
              className="wish-star"
              style={{
                ...wishStarPositions[index],
                animationDelay: `${index * 0.35}s`,
              }}
              onClick={() => setActiveWishIndex(index)}
              aria-label={wish.title}
              title={wish.title}
            >
              ✦
            </button>
          ))}
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle btn"
        onClick={() => setIsDarkMode(!isDarkMode)}
        data-aos="fade-left"
      >
        {isDarkMode ? "🌙 Tắt sao" : "✨ Tắt đèn ngắm sao"}
      </button>

      {/* Global Custom Modal */}
      {modalConfig.isOpen && (
        <div className="modal-overlay" onClick={closeAlert}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{modalConfig.title}</div>
            <div className="modal-message">{modalConfig.message}</div>
            <button className="btn" onClick={closeAlert}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {activeWish && (
        <div className="wish-modal-overlay" onClick={() => setActiveWishIndex(null)}>
          <div className="wish-modal glass" onClick={(e) => e.stopPropagation()}>
            <button
              className="wish-close"
              onClick={() => setActiveWishIndex(null)}
              aria-label="Đóng điều ước"
            >
              ✕
            </button>
            <div className="wish-modal-star">✦</div>
            <h3>{activeWish.title}</h3>
            <p>{activeWish.message}</p>
          </div>
        </div>
      )}

      {activeTimelineEvent && (
        <div
          className="timeline-letter-overlay"
          onClick={() => setActiveTimelineIndex(null)}
        >
          <div
            className="timeline-letter-modal glass"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="timeline-letter-close"
              onClick={() => setActiveTimelineIndex(null)}
              aria-label="Đóng lá thư kỷ niệm"
            >
              ✕
            </button>
            <img
              src={activeTimelineEvent.image}
              alt={activeTimelineEvent.title}
            />
            <span>{activeTimelineEvent.date}</span>
            <h3>{activeTimelineEvent.title}</h3>
            <p>{activeTimelineEvent.letter}</p>
          </div>
        </div>
      )}

      {currentScreen === "PASSWORD" && (
        <div
          className="screen"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="screen-overlay"></div>
          <Preloader />
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            glareColor="#ffffff"
            glarePosition="bottom"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
          >
            <div className="password-box glass framed" data-aos="zoom-in">
              <div className="avatar-container">
                <img src={photos[0]} alt="Our Love" className="auth-avatar" />
              </div>
              <h2>Nhập mật khẩu để vào xem bí mật 🔒</h2>

              <input
                type="text"
                placeholder="Mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              />
              <button
                className="btn btn-primary-pulse"
                onClick={handlePasswordSubmit}
              >
                Mở khóa
              </button>
            </div>
          </Tilt>
        </div>
      )}

      {currentScreen === "QA" && (
        <div
          className="screen"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="screen-overlay"></div>
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            glareColor="#ffffff"
            glarePosition="all"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
          >
            <div
              className="qa-box glass framed"
              key={qaIndex}
              data-aos="fade-up"
            >
              <div
                className="avatar-container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  src={photos[qaIndex % photos.length]}
                  alt="Memory"
                  className="auth-avatar"
                  style={{
                    borderRadius: "15px",
                    width: "160px",
                    height: "120px",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: isDarkMode ? "#f5d020" : "#ff4f81",
                  marginBottom: "20px",
                }}
              >
                {questions[qaIndex]}
              </p>
              <button
                className="btn btn-primary-pulse"
                style={{ marginTop: "20px" }}
                onClick={nextQuestion}
              >
                Tiếp ❤️
              </button>
            </div>
          </Tilt>
        </div>
      )}

      {currentScreen === "MAIN" && (
        <div className="main-content">
          <Confetti
            colors={
              isDarkMode
                ? ["#f5d020", "#ffffff", "#ff4f81"]
                : ["#ff0000", "#ff69b4", "#ff1493", "#ffc0cb", "#fff"]
            }
            numberOfPieces={isConfettiExploding ? 500 : 30}
            gravity={isConfettiExploding ? 0.3 : 0.05}
          />

          <div
            className={`vinyl-player ${isPlaying ? "playing" : ""}`}
            onClick={toggleAudio}
          >
            <span className="note-1">🎵</span>
            <span className="note-2">🎶</span>
            <span className="note-3">🎵</span>
          </div>

          {/* MÀN 1: HERO */}
          <section className="hero" style={{ backgroundImage: `url(${bg})` }}>
            <div
              className="overlay"
              style={isDarkMode ? { background: "rgba(0,0,0,0.6)" } : {}}
              onClick={handleHeaderClick}
            >
              <TypeAnimation
                sequence={[
                  "Gửi em ❤️",
                  2000,
                  "Gửi em, người anh thương nhất ❤️",
                  2000,
                ]}
                wrapper="h1"
                speed={40}
                repeat={Infinity}
              />
              <p>
                Có những điều anh không giỏi nói ra, nên anh làm trang web này
                để gửi em.
              </p>
              <button
                onClick={() => advanceStory(2, "letter-section")}
                className="btn"
              >
                Khám phá bí mật
              </button>
            </div>
          </section>

          {/* MÀN 2: LÁ THƯ */}
          {storyStep >= 2 && (
            <section
              id="letter-section"
              className="section"
              style={{
                position: "relative",
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                borderRadius: "25px",
                padding: "80px 20px",
                marginTop: "60px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="section-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isDarkMode
                    ? "rgba(0,0,0,0.75)"
                    : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "25px",
                  zIndex: 0,
                }}
              ></div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <LoveTimer />
                <h2
                  data-aos="fade-down"
                  style={{
                    textShadow: isDarkMode
                      ? "0 0 10px rgba(245,208,32,0.5)"
                      : "0 2px 5px rgba(255,79,129,0.3)",
                  }}
                >
                  Lá thư bí mật
                </h2>
                <div
                  className={`envelope-wrapper ${isLetterOpen ? "open" : ""}`}
                  onClick={() => setIsLetterOpen(true)}
                  data-aos="zoom-in"
                >
                  <div className="envelope-back"></div>
                  <div className="letter-paper">
                    <h3
                      style={{
                        marginBottom: "15px",
                        color: "#ff4f81",
                        textAlign: "center",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      Gửi bé ngoan,
                    </h3>
                    <p
                      style={{
                        color: "#444",
                        lineHeight: "1.8",
                        fontSize: "16px",
                      }}
                    >
                      Anh không biết phải nói sao cho thật hay, nhưng anh muốn
                      em biết rằng từ khi có em, cuộc sống của anh trở nên dịu
                      dàng và ý nghĩa hơn rất nhiều. Từ khi có em cuộc sống của
                      anh được mở mang ra rất nhiều điều mới. Cảm ơn em vì đã
                      xuất hiện, vì đã ở bên anh.
                    </p>
                    <p
                      style={{
                        marginTop: "25px",
                        textAlign: "right",
                        fontStyle: "italic",
                        color: "#666",
                        fontWeight: "bold",
                      }}
                    >
                      - Yêu em nhiều -
                    </p>
                  </div>
                  <div className="envelope-front"></div>
                  <div className="envelope-flap"></div>
                  <div className="wax-seal">❤️</div>
                </div>

                {isLetterOpen && (
                  <div
                    style={{
                      marginTop: "60px",
                      textAlign: "center",
                      position: "relative",
                    }}
                    data-aos="fade-up"
                  >
                    <div
                      className="floating-heart"
                      style={{ left: "20%", animationDelay: "0s" }}
                    >
                      ❤️
                    </div>
                    <div
                      className="floating-heart"
                      style={{ left: "50%", animationDelay: "0.5s" }}
                    >
                      💖
                    </div>
                    <div
                      className="floating-heart"
                      style={{ left: "80%", animationDelay: "1s" }}
                    >
                      💕
                    </div>
                    <button
                      className="btn btn-primary-pulse"
                      onClick={() => advanceStory(3, "timer-section")}
                      style={{ padding: "15px 40px", fontSize: "18px" }}
                    >
                      Đi tiếp hành trình ❤️
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* MÀN 3: ĐỒNG HỒ & LỜI YÊU */}
          {storyStep >= 3 && (
            <>
              <section
                id="timer-section"
                className="section"
                style={{
                  position: "relative",
                  margin: "40px auto",
                  padding: "60px 20px",
                  borderRadius: "30px",
                  textAlign: "center",
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(20,30,48,0.8), rgba(36,59,85,0.8))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,221,225,0.6))",
                  backdropFilter: "blur(20px)",
                  boxShadow: isDarkMode
                    ? "0 20px 50px rgba(0,0,0,0.5)"
                    : "0 20px 50px rgba(255,79,129,0.15)",
                  border: isDarkMode
                    ? "1px solid rgba(245,208,32,0.2)"
                    : "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <h2
                  data-aos="fade-down"
                  style={{
                    textShadow: isDarkMode
                      ? "0 0 10px rgba(245,208,32,0.4)"
                      : "none",
                  }}
                >
                  Chúng ta đã bên nhau
                </h2>
                <p
                  style={{
                    fontSize: "20px",
                    marginBottom: "30px",
                    color: isDarkMode ? "#ddd" : "#666",
                  }}
                  data-aos="fade-up"
                >
                  Từng giây từng phút trôi qua đều là một kỷ niệm đẹp với anh.
                </p>

                <LiveTimer startDate={startDate} />

                {bdayDays > 0 && (
                  <div
                    style={{
                      marginTop: "50px",
                      padding: "20px",
                      background: isDarkMode
                        ? "rgba(245,208,32,0.1)"
                        : "rgba(255,79,129,0.05)",
                      borderRadius: "15px",
                      display: "inline-block",
                      fontSize: "26px",
                      color: isDarkMode ? "#f5d020" : "#ff4f81",
                      fontWeight: "600",
                      boxShadow: isDarkMode
                        ? "inset 0 0 20px rgba(245,208,32,0.05)"
                        : "inset 0 0 20px rgba(255,79,129,0.1)",
                    }}
                    data-aos="zoom-in"
                  >
                    Còn{" "}
                    <span style={{ fontSize: "32px", fontWeight: "800" }}>
                      {bdayDays}
                    </span>{" "}
                    ngày nữa tới sinh nhật em 🎂
                  </div>
                )}

                <div className="daily-love-note glass" data-aos="fade-up">
                  <span>Hôm nay anh yêu em vì...</span>
                  <p>{dailyReason}</p>
                </div>

                <MoodCheckIn />
              </section>

              <section className="section" style={{ textAlign: "center" }}>
                <h2 data-aos="fade-down">Ngọt ngào dành cho em</h2>
                <div className="quote-box glass" data-aos="flip-up">
                  "{quotes[quoteIndex]}"
                </div>
                <button
                  className="btn"
                  onClick={() =>
                    setQuoteIndex(Math.floor(Math.random() * quotes.length))
                  }
                >
                  Một chút ngọt ngào anh dành cho em ❤️
                </button>

                <div style={{ marginTop: "50px", textAlign: "center" }}>
                  <button
                    className="btn"
                    onClick={() => advanceStory(4, "reasons-section")}
                  >
                    Xem anh thích gì ở em ⬇️
                  </button>
                </div>
              </section>
            </>
          )}

          {/* MÀN 4: NHỮNG ĐIỀU THÍCH & BUCKET LIST */}
          {storyStep >= 4 && !memoryGamePassed && (
            <section
              id="reasons-section"
              className="section"
              style={{ textAlign: "center" }}
            >
              <DailyChallenge />
              <LoveRoulette />
              <div style={{ marginTop: "60px" }}>
                <h2 data-aos="fade-down">Thử tài trí nhớ xíu nha 😋</h2>
                <p style={{ marginBottom: "30px" }}>
                  Lật đúng 3 cặp hình của tụi mình để mở khóa phần tiếp theo nè!
                </p>
                <MemoryGame
                  photos={photos}
                  onComplete={() => setMemoryGamePassed(true)}
                />
              </div>
            </section>
          )}

          {storyStep >= 4 && memoryGamePassed && (
            <>
              <section className="section">
                <h2 data-aos="fade-down">Những điều anh thích ở em</h2>
                <div className="cards">
                  {reasons.map((reason, index) => (
                    <Tilt
                      key={index}
                      tiltMaxAngleX={15}
                      tiltMaxAngleY={15}
                      glareEnable={true}
                      glareMaxOpacity={0.2}
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "100%",
                      }}
                    >
                      <div
                        className="card glass"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="card-image-wrapper">
                          <img
                            src={photos[index % photos.length]}
                            alt="reason"
                          />
                        </div>
                        {reason}
                      </div>
                    </Tilt>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2 data-aos="fade-down">10 điều anh muốn làm cùng em</h2>
                <ul className="bucket-list">
                  {bucketList.map((item, index) => (
                    <li
                      key={index}
                      className="glass"
                      data-aos="fade-right"
                      data-aos-delay={index * 50}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "50px", textAlign: "center" }}>
                  <button
                    className="btn"
                    onClick={() => advanceStory(5, "timeline-section")}
                  >
                    Nhìn lại hành trình ⬇️
                  </button>
                </div>
              </section>
            </>
          )}

          {/* MÀN 5: TIMELINE & KỶ NIỆM */}
          {storyStep >= 5 && (
            <>
              <section
                id="timeline-section"
                className="section"
                style={{ overflowX: "hidden" }}
              >
                <LoveMap />
              </section>

              <section className="section" style={{ overflowX: "hidden" }}>
                <h2 data-aos="fade-down">Hành trình của tụi mình</h2>
                <div className="timeline-container">
                  {timelineEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
                      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                    >
                      <div className="timeline-content glass">
                        <span className="timeline-date">{event.date}</span>
                        <h3
                          style={{
                            margin: "5px 0",
                            color: "#ff4f81",
                            fontSize: "22px",
                          }}
                        >
                          {event.title}
                        </h3>
                        <p>{event.desc}</p>
                        <img
                          src={event.image}
                          alt={event.title}
                          className="timeline-img"
                        />
                        <button
                          className="timeline-letter-btn"
                          onClick={() => setActiveTimelineIndex(index)}
                        >
                          Mở thư ngày này
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2 data-aos="fade-down">Kỷ niệm của tụi mình</h2>

                <PhotoBook photos={photos} />

                <div style={{ marginTop: "50px", textAlign: "center" }}>
                  <button
                    className="btn"
                    onClick={() => advanceStory(6, "ending-section")}
                  >
                    Đến câu hỏi quan trọng nhất ⬇️
                  </button>
                </div>
              </section>
            </>
          )}

          {/* MÀN 6: CÂU HỎI CUỐI */}
          {storyStep >= 6 && (
            <section
              id="ending-section"
              className="section ending"
              style={{ textAlign: "center" }}
            >
              <h2 data-aos="fade-up">Em có thương anh không?</h2>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: "30px",
                }}
              >
                <button
                  onClick={() => {
                    setIsConfettiExploding(true);
                    playTadaSound();
                  }}
                  className="btn btn-primary-pulse"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Có chứ ❤️
                </button>

                <button
                  className="btn btn-no glass"
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  style={
                    noButtonPos.top !== 0 && noButtonPos.left !== 0
                      ? {
                          position: "fixed",
                          top: noButtonPos.top,
                          left: noButtonPos.left,
                        }
                      : {}
                  }
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Không 😤
                </button>

                <button
                  className="btn"
                  onClick={() => setShowVouchers(true)}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Mở quà bí mật 🎁
                </button>
              </div>

              <div style={{ marginTop: "60px", minHeight: "150px" }}>
                {novelStep === 0 && (
                  <button
                    className="btn"
                    onClick={handleNovelClick}
                    data-aos="fade-up"
                  >
                    Anh còn điều muốn nói...
                  </button>
                )}
                {novelStep >= 1 && (
                  <p
                    className="fade-in"
                    style={{
                      fontSize: "24px",
                      marginTop: "15px",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    Anh yêu em ❤️
                  </p>
                )}
                {novelStep >= 2 && (
                  <p
                    className="fade-in"
                    style={{
                      fontSize: "24px",
                      marginTop: "15px",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    Rất yêu em ❤️
                  </p>
                )}
                {novelStep >= 3 && (
                  <div className="fade-in">
                    <p
                      style={{
                        fontSize: "32px",
                        marginTop: "15px",
                        fontWeight: "bold",
                        color: isDarkMode ? "#f5d020" : "#ff4f81",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      Cực kỳ yêu em ❤️
                    </p>
                    <div className="cinematic-ending" data-aos="fade-up">
                      <div className="film-strip" aria-hidden="true">
                        {photos.slice(0, 6).map((photo, index) => (
                          <img
                            key={`${photo}-${index}`}
                            src={photo}
                            alt=""
                            style={{ animationDelay: `${index * 0.18}s` }}
                          />
                        ))}
                      </div>
                      <div className="ending-lines">
                        {endingLines.map((line, index) => (
                          <p
                            key={line}
                            style={{ animationDelay: `${index * 0.75}s` }}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="ending-signature">
                        Hết phim rồi, nhưng chuyện mình còn dài.
                      </div>
                    </div>
                    <VoiceMessage />
                    <VoiceRecorder />
                    <div style={{ marginTop: "40px" }}>
                      <MessageForm />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Lightbox for Gallery */}
          {lightboxImage && (
            <div
              className="lightbox-overlay"
              onClick={() => setLightboxImage(null)}
            >
              <img
                src={lightboxImage}
                alt="Enlarged view"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="close-btn"
                onClick={() => setLightboxImage(null)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click Hearts */}
      {clickHearts.map((heart) => (
        <div
          key={heart.id}
          className="click-heart"
          style={{ left: heart.x - 10, top: heart.y - 10 }}
        >
          ❤️
        </div>
      ))}

      <SecretVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />

      {isPlaying && (
        <div className="youtube-music-panel glass">
          <iframe
            src={officialMusicEmbedUrl}
            title="Hơn Cả Yêu - Đức Phúc | Official Music Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Floating Music Player */}
      <div
        className={`music-player glass ${isPlaying ? "playing" : ""}`}
        onClick={toggleAudio}
      >
        <div className="vinyl-record">🎵</div>
      </div>

      {/* Love Vouchers Modal */}
      {showVouchers && (
        <div className="voucher-overlay" onClick={() => setShowVouchers(false)}>
          <div
            className="voucher-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#ff4f81",
              }}
            >
              Sổ Tay Tình Yêu 🎟️
            </h2>
            <div className="vouchers-list">
              <div className="voucher-card">
                <h3>Voucher Trà Sữa Đêm</h3>
                <p>
                  Anh bao em ăn gì cũng được (Hạn sử dụng: Bất cứ lúc nào em
                  dỗi)
                </p>
              </div>
              <div className="voucher-card">
                <h3>Voucher Ôm Sạc Pin</h3>
                <p>
                  Một cái ôm thật chặt để nạp năng lượng (Hạn sử dụng: Vô thời
                  hạn)
                </p>
              </div>
              <div className="voucher-card">
                <h3>Voucher Yêu Cầu Đặc Quyền</h3>
                <p>
                  Anh sẽ làm theo 1 yêu cầu của em không được cãi (Hạn sử dụng:
                  Cân nhắc trước khi dùng)
                </p>
              </div>
            </div>
            <button
              className="btn"
              style={{ display: "block", margin: "20px auto 0" }}
              onClick={() => setShowVouchers(false)}
            >
              Tuyệt vời! Cất đi thôi
            </button>
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <section
        className="section"
        style={{
          textAlign: "center",
          paddingBottom: "50px",
          marginTop: "100px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h2 style={{ fontSize: "28px" }}>Chia sẻ tình yêu 💌</h2>
        <p
          style={{ marginBottom: "30px", color: isDarkMode ? "#ddd" : "#666" }}
        >
          Quét mã QR bên dưới để lưu lại trang web này nhé!
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "20px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <QRCodeSVG
            value={window.location.href}
            size={200}
            fgColor="#ff4f81"
          />
        </div>
      </section>
    </div>
  );
}

export default App;
