import { VercelRequest, VercelResponse } from '@vercel/node'
import { Browser } from 'happy-dom'

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const url = `https://unsplash.com/`

  try {
    const browser = new Browser();
    const page = browser.newPage()

    const response = await fetch(url)
    const html = await response.text()

    page.url = url 
    page.content = html

    const { mainFrame: { document } } = page

    const el = document.querySelector('[data-test="editorial-route"] [itemProp=contentUrl]')

    const href = el?.getAttribute('href')
    const id = href?.split("/")?.[2]

    res.status(200).send({ id })
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
