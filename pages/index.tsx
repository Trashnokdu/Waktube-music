import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";

interface songs{
  id: string;
  title: string;
  artist: string;
  rankChange: string;
}

function playTop50(nowsongs: songs[]){
  if (nowsongs.length === 0){
    return
  }
  const ids = nowsongs.slice(0, 50).map(item => item.id);
  const videoIds = ids.join(',');
  const videoUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds}`;
  window.open(videoUrl);
}

function playTop100(nowsongs: songs[]){
  if (nowsongs.length === 0){
    return
  }
  const ids = nowsongs.slice(50, 100).map(item => item.id);
  const videoIds = ids.join(',');
  const videoUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds}`;
  window.open(videoUrl);
}

export default function Home() {
  const [content, setContent] = useState("hourly");
  const [nowSongs, setNowSongs] = useState<songs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/chart/${content}`)
    .then(response => response.json())
    .then(data => {
      setNowSongs(data);
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
    })
  }, [content])
  return (
    <>
      <Head>
        <title>WAKTUBE MUSIC</title>
        <meta name="description" content="왁튜브 뮤직" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="./logo.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ display: "flex", maxWidth: "100vw"}}>
        <nav className="side">
          <div className="side">
            <div className="top-buttons">
              <button onClick={() => setContent("hourly")} style={{boxShadow: content == "hourly" ? "inset 0 -2px 0 0 red" : "none", transition: "box-shadow 0.2s ease-in-out"}} className="sidebutton">시간</button>
              <button onClick={() => setContent("daily")} style={{boxShadow: content == "daily" ? "inset 0 -2px 0 0 red" : "none",transition: "box-shadow 0.2s ease-in-out"}} className="sidebutton">일간</button>
              <button onClick={() => setContent("alltime")} style={{boxShadow: content == "alltime" ? "inset 0 -2px 0 0 red" : "none", transition: "box-shadow 0.2s ease-in-out"}} className="sidebutton">누적</button>
            </div>
            <div className="bottom-buttons">
              <button onClick={() => playTop50(nowSongs)} style={{backgroundColor: "red", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}} className="playbutton">
                <span style={{marginLeft: "8px"}} className="material-symbols-rounded">play_circle</span>
                <span style={{marginRight: "8px", fontWeight: "500"}}>1~50</span>
              </button>
              <button onClick={() => playTop100(nowSongs)} style={{backgroundColor: "red", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px"}} className="playbutton">
                <span style={{marginLeft: "8px"}} className="material-symbols-rounded">play_circle</span>
                <span style={{marginRight: "8px", fontWeight: "500"}}>51~100</span>
              </button>
            </div>
          </div>
        </nav>
        <div className="marginpc">
        <div >
          <div className="play-buttons" style={{height: "86px"}}>
            <div style={{display: 'flex', justifyContent: 'center', width: "100%", borderRadius: "16px 16px 0px 0px"}} className="bottombar">
              <button onClick={() => playTop50(nowSongs)} style={{backgroundColor: "red", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "8px", marginTop: "8px"}} className="playbutton">
                <span style={{marginLeft: "8px"}} className="material-symbols-rounded">play_circle</span>
                <span style={{marginRight: "8px", fontWeight: "500"}}>1~50</span>
              </button>
              <button onClick={() => playTop100(nowSongs)} style={{backgroundColor: "red", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "6px", marginRight: "8px", marginTop: "8px"}} className="playbutton">
                <span style={{marginLeft: "8px"}} className="material-symbols-rounded">play_circle</span>
                <span style={{marginRight: "8px", fontWeight: "500"}}>51~100</span>
              </button>
            </div>
          </div>
        </div>
        <div style={{marginBottom: "102px"}}>
          {nowSongs.length != 0 ? Array.from({length: Math.ceil(nowSongs.length/2)}, (_, i) => i * 2).map(i => (
          <div key={i} className="flex">
            {loading ? <div></div> : [nowSongs[i], nowSongs[i+1]].map((item, j) => item && (
            <div key={j} className="main">
                  <div style={{ display: "flex", alignItems: "center", background: "none"}} >
                    <div style={{marginLeft:"17px", textAlign: "center"}}><p style={{minWidth: "3rem", maxWidth: "3rem"}}>{i+j+1}</p><p style={{color: "#B5B5B5", minWidth: "3rem", maxWidth: "3rem"}}>({item.rankChange})</p></div>
                    <img className="image-w" style={{marginLeft:"17px", textAlign: "center"}} src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}></img>
                    <div className="auto-max" style={{marginLeft:"17px", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                      <p style={{margin: 0, overflow: "hidden", textOverflow: "ellipsis"}}>{item.title}</p>
                      <p style={{color: "#B5B5B5", margin: 0, overflow: "hidden", textOverflow: "ellipsis"}}>{item.artist}</p>
                    </div>
                  </div>
                  <a href={`https://youtu.be/${item.id}`} target="_blank" style={{marginRight: "17px"}}><span className="material-symbols-rounded">play_circle</span></a>
                </div>
              ))}
            </div>
          )) : <div></div>}
          </div>
      </div>
      </div>
    </>

  );
}

