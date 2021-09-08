import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";


export default (req: NextApiRequest, res: NextApiResponse) => {

  axios.get('http://localhost:3001/networks/new').then((res) => {
    res.data.map((network) => {
      console.log(network.name);
    });
  }).catch(() => console.log('ERRRO'));
}
