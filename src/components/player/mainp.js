import Player from "./player";
import Footer from "./footer";
import SideView from "./sideview";
import { useLocation } from "react-router";
import { useState } from "react";
function MainP() {
  const c = useLocation();
  console.log(c);
  const [path, setPath] = useState(c.state.info1.path);
  return (
    <div className="w-full h-1/3 flex-row ">
      <div className="w-full h-2/3 flex">
        <Player path={path} info1={c.state.info1}></Player>
        <SideView
          k={c.state.k}
          info1={c.state.info1}
          data={c.state.info2}
          thumb={c.state.info3}
          setPath={setPath}
        ></SideView>
      </div>
      <Footer assets={c.state.assets}></Footer>
    </div>
  );
}

export default MainP;
