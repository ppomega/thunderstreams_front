function Header(props) {
  return (
    <div className="series-header w-full">
      <h1 className="series-title font-a text-4xl font-extrabold absolute top-36 px-8">
        {props.name}
      </h1>
      <div className="series-genres text-lg font-g font-extrabold absolute top-64 px-8">
        {props.genre.map((genre) => <span key={genre}>{genre}　</span>)}
      </div>
      <h2 className="series-title font-g text-xl font-extrabold absolute top-72 px-8">
        Rating <span className="text-brand">★</span>: {props.rating.$numberDecimal}/10
      </h2>
      <h2 className="series-info font-g text-xl absolute top-52 px-8">
        {props.info}
      </h2>
    </div>
  );
}

export default Header;
