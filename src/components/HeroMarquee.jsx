const canvas1 = new URL("../assets/products/canvas1.jpg", import.meta.url).href;

const canvas2 = new URL("../assets/products/canvas2.jpg", import.meta.url).href;

const canvas3 = new URL("../assets/products/canvas3.jpg", import.meta.url).href;

const canvas4 = new URL("../assets/products/canvas4.jpg", import.meta.url).href;

const canvas5 = new URL("../assets/products/canvas5.jpg", import.meta.url).href;

const canvas6 = new URL("../assets/products/canvas6.jpg", import.meta.url).href;

const canvas7 = new URL("../assets/products/canvas7.jpg", import.meta.url).href;

const canvas8 = new URL("../assets/products/canvas8.jpg", import.meta.url).href;

const canvas9 = new URL("../assets/products/canvas9.jpg", import.meta.url).href;

const canvas10 = new URL("../assets/products/canvas10.jpg", import.meta.url)
  .href;

const canvas11 = new URL("../assets/products/canvas11.jpg", import.meta.url)
  .href;

const canvas12 = new URL("../assets/products/canvas12.jpeg", import.meta.url)
  .href;

const canvas13 = new URL("../assets/products/canvas13.jpeg", import.meta.url)
  .href;

const canvas14 = new URL("../assets/products/canvas14.jpeg", import.meta.url)
  .href;

const canvas15 = new URL("../assets/products/canvas15.jpeg", import.meta.url)
  .href;

const canvas16 = new URL("../assets/products/work1.jpeg", import.meta.url).href;

const canvas17 = new URL("../assets/products/work2.jpeg", import.meta.url).href;

const canvas18 = new URL("../assets/products/work3.jpeg", import.meta.url).href;

const canvas19 = new URL("../assets/products/work4.jpeg", import.meta.url).href;

const canvas20 = new URL("../assets/products/work5.jpeg", import.meta.url).href;

const canvas21 = new URL("../assets/products/work6.jpeg", import.meta.url).href;

const canvas22 = new URL("../assets/products/work7.jpg", import.meta.url).href;

const images = [
  canvas22,
  canvas18,
  canvas1,
  canvas12,
  canvas2,
  canvas17,
  canvas4,
  canvas3,
  canvas9,
  canvas6,
  canvas8,
  canvas10,
  canvas5,
  canvas13,
  canvas11,
  canvas21,
  canvas19,
  canvas15,
  canvas20,
];

export default function HeroMarquee() {
  return (
    <div className="heroMarquee">
      <div className="marqueeTrack marqueeSingle">
        {[...images, ...images].map((image, index) => (
          <img key={index} src={image} alt="" className="marqueeImage" />
        ))}
      </div>
    </div>
  );
}
