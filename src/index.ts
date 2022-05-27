import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import {PORT,IP,GITHUB_API} from '@/config'
const app = express();
interface Time {
    year: number;
    month: number;
    date: number;
    day: number;
    hour: number;
    minute: number;
    second:number
}
async function getGithubTime(req:any, res:any) {
    const {owner,repo}=req.query
    if (owner === undefined || repo === undefined) {
        throw new Error(`查询字符串中需要有owner和repo字段`)
    }
     const  data = await  axios.get(`${GITHUB_API}/${owner}/${repo}`)
     const rowPushTime: string=data.data.pushed_at
     const time= dayjs(rowPushTime)
     const timeBody:Time={
        year:time.year(),
        month:time.month()+1,
        date:time.date(),
        day:time.day(),
        hour:time.hour(),
        minute:time.minute(),
        second:time.second(),
    }
    return timeBody;

}
app.get("/github",express.json(), async(req, res) => {
   try {
    const result:Time = await getGithubTime(req,res)
    res.json(result)
   } catch (error:any) {
        res.json({
            status:error.response.status,
            statusText:error.response.statusText
        })
   }
})

app.get("/shields",async (req, res) => {
    try {
          const result = await getGithubTime(req,res)
          const shieldsImg=await axios.get(`https://img.shields.io/badge/last--updated-${result.year}--${result.month}--${result.date}-green`)
          res.header("Content-Type",'image/svg+xml;charset=utf-8')
          res.send(shieldsImg.data)
       } catch (error:any) {
           if (error.response.status===404) {
            res.send('<h1>404 NOT Found</h1>')
           }
           if (error.response.status===400) {
            res.send('<h1>400 Bad Request</h1>')
           }
       }
})

app.listen(PORT,IP,() => {
    console.log('server listening on port ' +PORT);
})

