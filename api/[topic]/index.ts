import { VercelRequest, VercelResponse } from '@vercel/node'
import { Browser } from 'happy-dom'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const topic = Array.isArray(req.query.topic) ? req.query.topic[0] : req.query.topic
  const url = `https://unsplash.com/t/${topic}`
  console.log(url)

  try {
    const browser = new Browser()
    const page = browser.newPage();
    const response = await page.goto(url)

    if ( response.status !== 200 ) {
      return res.redirect('https://lambda.splash-cli.app/api')
    }

    const { mainFrame: { document } } = page

    const el = document.querySelector('[itemProp=contentUrl]')

    const href = el?.getAttribute('href')
    const id = href?.split("/")?.[2]

    res.status(200).send({ id })
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
