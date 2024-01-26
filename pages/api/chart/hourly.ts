import type { NextApiRequest, NextApiResponse } from "next";
const mysql = require("mysql")
require("dotenv").config();

interface VideoData {
  id: string;
  views: number;
  increase: number;
  last: number;
  rank?: number;
}
interface SongData {
  id: string;
  title: string;
  artist: string;
}
const pool = mysql.createPool({
    host : process.env.mysql_URL,
    user : process.env.mysql_ID,
    password : process.env.mysql_PASSWORD,
    database : "waktaverse_chart"
})

export default function handler(req: NextApiRequest,res: NextApiResponse,) {
  pool.getConnection(function(err:any, connection: any) {
  if (err) {
    // 'connection' 객체를 얻는 데 실패하면 오류 메시지를 반환하고 함수를 종료합니다.
    console.error('Error connecting: ' + err.stack);
    return res.status(500).send("");
  }
  connection.query('SELECT * from hourly', (error:any, rows:any, fields:any) => {
    if (error){ 
      res.status(500).send("")
      throw error;
    }
    var last = rows.slice().sort((a: VideoData, b: VideoData) => b.last - a.last);
    rows.sort((a: VideoData, b: VideoData) => b.increase - a.increase);

    const lasttop100Ids: string[] = last.slice(0, 100).map((item: VideoData) => item.id);
    const top100Ids: string[] = rows.slice(0, 100).map((item: VideoData) => item.id);
    connection.query('SELECT * from songs', (error:any, rows:any, fields:any) => {
      if (err) {
        // 'connection' 객체를 얻는 데 실패하면 오류 메시지를 반환하고 함수를 종료합니다.
        console.error('Error connecting: ' + err.stack);
        return res.status(500).send("");
    }
      const top100Songs = top100Ids.map((id, index) => {
        const song = rows.find((song: SongData) => song.id === id);
        const lastRank = lasttop100Ids.indexOf(id);
        const currentRank = index + 1;
        let rankChange;
        if (lastRank === -1) {
          rankChange = "NEW"; // 새로 차트에 진입한 곡의 경우 "rankChange"를 "NEW"로 설정
        }
         else {
          rankChange = (lastRank + 1 - currentRank) // 숫자를 문자열로 변환
          if (rankChange == 0) rankChange = "-"
          rankChange = rankChange.toString()
        }
        if (song) {
          return { id: song.id, title: song.title, artist: song.artist, rankChange };
        } else {
          return null;
        }
      }).filter((song: SongData | null) => song !== null);
      connection.release()
      
      res.json(top100Songs)
    })
  });
})
}

  