import Player from "./player.jsx";
import Footer from "./footer.jsx";
import SideView from "./sideview.jsx";
import { useLocation } from "react-router";
import { useState } from "react";
function MainP() {
  const c = useLocation();
  const [path, setPath] = useState(c.state.info1.path);
  const [info1, setInfo1] = useState(c.state.info1);
  return (
    <div className="w-full h-full flex-row ">
      <div className="w-full h-1/6 flex">
        <Player path={path} info1={info1}></Player>
        <SideView
          k={c.state.k}
          info1={info1}
          data={c.state.info2}
          thumb={c.state.info3}
          setPath={setPath}
          setInfo1={setInfo1}
        ></SideView>
      </div>
      <Footer assets={c.state.assets}></Footer>
    </div>
  );
}

export default MainP;
