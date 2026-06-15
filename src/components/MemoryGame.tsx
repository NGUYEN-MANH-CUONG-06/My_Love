import { useState, useEffect } from "react";
import "./MemoryGame.css";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  photos: string[];
  onComplete: () => void;
}

export default function MemoryGame({ photos, onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    // Pick 3 photos
    const selectedPhotos = photos.slice(0, 3);
    const cardPairs = [...selectedPhotos, ...selectedPhotos];
    
    // Shuffle
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }));
    // eslint-disable-next-line
    setCards(shuffledCards);
  }, [photos]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].image === cards[secondIndex].image) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches((prev) => prev + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === 3) {
      setTimeout(() => {
        onComplete();
      }, 1000);
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
      {matches === 3 && (
        <p className="memory-success-text fade-in">Em giỏi quá! Đã mở khóa được phần tiếp theo ❤️</p>
      )}
    </div>
  );
}
