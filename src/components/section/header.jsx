function Header(props) {
  return (
    <div className=" w-full ">
      <h1 className="font-a text-4xl text-white font-extrabold absolute top-36 px-8">
        {props.name}
      </h1>
      <div className="text-slate-400  text-lg font-g font-extrabold absolute top-64 px-8 ">
        {props.genre.map((i) => {
          return i + "       ";
        })}
      </div>
      <h2 className="font-g text-xl font-extrabold text-white absolute top-72 px-8">
        Rating<span className="text-yellow-300"> ★</span>:{" "}
        {props.rating.$numberDecimal}/10
      </h2>
      <h2 className="font-g text-xl text-white absolute top-52 px-8">
        {props.info}
      </h2>
    </div>
  );
}

export default Header;
