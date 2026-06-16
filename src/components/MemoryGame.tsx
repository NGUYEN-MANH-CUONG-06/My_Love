import { useEffect, useState, type KeyboardEvent } from "react";
import "./MemoryGame.css";

interface Card {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  photos: string[];
  onComplete: () => void;
}

const PAIR_COUNT = 3;

const shuffleCards = (photos: string[]): Card[] => {
  const cards = photos.slice(0, PAIR_COUNT).flatMap((image, pairIndex) => [
    {
      id: `${pairIndex}-a`,
      image,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: `${pairIndex}-b`,
      image,
      isFlipped: false,
      isMatched: false,
    },
  ]);

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  return cards;
};

export default function MemoryGame({ photos, onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>(() => shuffleCards(photos));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const handleCardClick = (index: number) => {
    const selectedCard = cards[index];

    if (
      !selectedCard ||
      flippedIndices.length === 2 ||
      selectedCard.isFlipped ||
      selectedCard.isMatched
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    setCards((prevCards) =>
      prevCards.map((card, cardIndex) =>
        cardIndex === index ? { ...card, isFlipped: true } : card,
      ),
    );

    if (newFlippedIndices.length !== 2) {
      return;
    }

    const [firstIndex, secondIndex] = newFlippedIndices;
    const isMatch = cards[firstIndex].image === cards[secondIndex].image;

    window.setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card, cardIndex) => {
          if (cardIndex !== firstIndex && cardIndex !== secondIndex) {
            return card;
          }

          return isMatch
            ? { ...card, isMatched: true }
            : { ...card, isFlipped: false };
        }),
      );
      setFlippedIndices([]);

      if (isMatch) {
        setMatches((prev) => prev + 1);
      }
    }, isMatch ? 500 : 900);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(index);
    }
  };

  useEffect(() => {
    if (matches === PAIR_COUNT) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 1000);

      return () => window.clearTimeout(timer);
    }
  }, [matches, onComplete]);

  return (
    <div className="memory-game-container">
      <div className="memory-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped ? "flipped" : ""}`}
            onClick={() => handleCardClick(index)}
            onKeyDown={(event) => handleCardKeyDown(event, index)}
            role="button"
            tabIndex={card.isMatched ? -1 : 0}
            aria-label={card.isMatched ? "Đã tìm đúng cặp" : "Lật thẻ kỷ niệm"}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front">
                <span>❤️</span>
              </div>
              <div className="memory-card-back">
                <img src={card.image} alt="Memory" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {matches === PAIR_COUNT && (
        <p className="memory-success-text fade-in">
          Em giỏi quá! Đã mở khóa được phần tiếp theo ❤️
        </p>
      )}
    </div>
  );
}
