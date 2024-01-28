import type { NextApiRequest, NextApiResponse } from "next";
require("dotenv").config();
var Redis = require('ioredis');
var redis = new Redis({host: process.env.mysql_URL,  port: 6379,  password: process.env.mysql_PASSWORD})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const value:string = await redis.get('chart_weekly');
  const songsArray: string[][] = JSON.parse(value);
  const result = songsArray.map(song => {
    return {
      id: song[0],
      title: song[1],
      artist: song[2],
      rankChange: song[3]
    };
  });
  res.send(result)
}
