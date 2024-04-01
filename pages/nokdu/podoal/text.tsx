import Head from "next/head";
import { useEffect, useRef, useState } from "react";

interface songs{
    id: string;
    title: string;
    artist: string;
    rankChange: string;
}

export default function text() {
    const [nowSongs, setNowSongs] = useState<songs[]>([]);
    const [loading, setLoading] = useState(true);
    const date = new Date();
    const divRef = useRef<HTMLDivElement | null>(null);
    const copyToClipboard = async () => {
        const el = divRef.current;
        if (el !== null) {
            try {
              await window.navigator.clipboard.writeText(el.innerText);
              console.log('Copying to clipboard was successful!');
            } catch (err) {
              console.error('Could not copy text: ', err);
            }
        }
      }
    useEffect(() => {
        fetch(`/api/chart/daily`)
        .then(response => response.json())
        .then(data => {
          setNowSongs(data);
          setLoading(false);
        })
    }, [])
    return(
        <>
            <Head>
                <title>WAKTUBE MUSIC</title>
                <meta name="description" content="왁튜브 뮤직" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <link rel="icon" href="../../logo.png"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <button onClick={copyToClipboard}>복사하기</button>
            <div ref={divRef} style={{marginBottom: "102px"}}>
                -{date.getFullYear()}년도 {date.getMonth()}월 {date.getDay()}일 왁튜브 뮤직 일간차트-
                <br />
                <br />
                차트 들으러가기
                <br />
                https://waktube-music.xyz
                <br />
                <br />
                TOP 1~50
                <br />
                {nowSongs.slice(0,50).map((i, j) => (
                    <div key={j}>
                        {j+1}. {i.artist} - {i.title} ({i.rankChange})
                    </div>
                ))}
                <br/>
                <br/>
                TOP 51~100
                <br />
                {nowSongs.slice(50,100).map((i, j) => (
                    <div key={j}>
                        {j+51}. {i.artist} - {i.title} ({i.rankChange})
                    </div>
                ))}
            </div>
        </>
    )
}