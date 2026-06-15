import { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './PhotoBook.css';

interface PageProps {
  image?: string;
  text?: string;
  number: number;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <div className="page-content">
        {props.image && <img src={props.image} alt="page" />}
        {props.text && <h2>{props.text}</h2>}
        <div className="page-footer">{props.number}</div>
      </div>
    </div>
  );
});

export default function PhotoBook({ photos }: { photos: string[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FlipBook = HTMLFlipBook as any;
  
  return (
    <div className="book-container" data-aos="zoom-in">
      <FlipBook
        width={300}
        height={400}
        size="fixed"
        minWidth={300}
        maxWidth={300}
        minHeight={400}
        maxHeight={400}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="photo-book"
      >
        <Page number={1} text="Cuốn Sách Tình Yêu" />
        {photos.map((p, i) => (
          <Page key={i} number={i + 2} image={p} />
        ))}
        <Page number={photos.length + 2} text="Hành trình còn dài lắm ❤️" />
      </FlipBook>
      <p style={{marginTop: "20px", color: "#666", textAlign: "center"}}>(Vuốt hoặc kéo góc trang để lật cuốn sách)</p>
    </div>
  );
}
