import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";


export default (req: NextApiRequest, res: NextApiResponse) => {
  // if (req.method === 'GET')
  // {
  //   res.status(200).json({ name: 'John Doe' })
  // }
  // else if (req.method === 'POST')
  // {
  //   const button = req.body.button
  //   const newButton = {
  //     id: Date.now(),
  //     text: button,
  //   }
  //   button.push(newButton),
  //   res.status(200).json({newButton})
  // }
  axios.get('http://localhost:3001/buttons/new').then((res) => {
    res.data.map((button) => {
      console.log(button.name);
    });
  }).catch(() => console.log('ERRRO'));
}
