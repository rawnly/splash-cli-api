import { VercelRequest, VercelResponse } from '@vercel/node'
import { JSDOM } from 'jsdom'
import { fetch } from 'undici'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const topic = Array.isArray(req.query.topic) ? req.query.topic[0] : req.query.topic
  const url = `https://unsplash.com/t/${topic}`
  console.log(url)

  try {
    const response = await fetch(url)

    if ( response.status !== 200 ) {
      console.log(`${response.status} ${response.statusText} - redirecting`)
      return res.redirect('https://lambda.splash-cli.app/api')
    }

    const body = await response.text()

    const { window: { document } } = new JSDOM(body);

    const el = document.querySelector('[itemProp=contentUrl]')

    const href = el?.getAttribute('href')
    const id = href?.split("/")?.[2]

    res.status(200).send({ id })
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
