import { VercelRequest, VercelResponse } from '@vercel/node'
import { JSDOM } from 'jsdom'
import { fetch } from 'undici'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const url = `https://unsplash.com/`

  try {
    const response = await fetch(url)
    const body = await response.text()

    const { window: { document } } = new JSDOM(body);

    const el = document.querySelector('[data-test="editorial-route"] [itemProp=contentUrl]')

    const href = el?.getAttribute('href')
    const id = href?.split("/")?.[2]

    res.status(200).send({ id })
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
