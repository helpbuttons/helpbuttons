import type { NextApiRequest, NextApiResponse } from 'next'


export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET')
  {
    res.status(200).json({ name: 'John Doe' })
  }
  else if (req.method === 'POST')
  {
    const button = req.body.button
    const newButton = {
      id: Date.now(),
      text: button,
    }
    button.push(newButton),
    res.status(200).json({newButton})
  }
}
