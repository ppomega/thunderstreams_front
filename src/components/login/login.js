function Login() {
  return (
    <>
      <video
        src={require("./bg.mp4")}
        loop
        autoPlay
        muted
        className="min-w-full h-full object-cover"
      ></video>
      <h1 className="text-white text-2xl absolute top-32  right-2px   font-c">
        THUNDER STREAMS
      </h1>
      <div className="absolute top-1/4 right-3px w-1/4 h-1/2 bg-pink-600 bg-opacity-30 backdrop-blur-md  rounded-2xl ">
        <h1 className="font-h text-4xl text-white font-extrabold px-36 py-6">
          Login
        </h1>
        <input
          className=" bg-opacity-50 font-g bg-black text-white rounded-md px-3 mx-10 py-3 w-3/4 "
          type="text"
          placeholder="Username"
        ></input>
        <input
          className=" bg-opacity-50 font-g bg-black text-white rounded-md px-3 mx-10 py-3 my-6 w-3/4 "
          type="text"
          placeholder="Password"
        ></input>
        <button className="bg-bubb rounded-lg w-1/4 h-10 text-xl font-extrabold font-g text-white mx-32">
          Log in
        </button>
      </div>
    </>
  );
}
export default Login;
