function Login() {
  return (
    <main className="login-page">
      <video
        src={require("./bg.mp4")}
        loop
        autoPlay
        muted
        className="login-background"
      ></video>
      <div className="login-card">
        <h1 className="login-brand">
          THUNDER STREAMS
        </h1>
        <h2 className="font-h text-4xl text-white font-extrabold">
          Login
        </h2>
        <input
          className="login-input font-g bg-black text-white rounded-md px-3 py-3"
          type="text"
          placeholder="Username"
        ></input>
        <input
          className="login-input font-g bg-black text-white rounded-md px-3 py-3"
          type="text"
          placeholder="Password"
        ></input>
        <button className="login-submit bg-bubb rounded-lg h-10 text-xl font-extrabold font-g text-white">
          Log in
        </button>
      </div>
    </main>
  );
}
export default Login;
