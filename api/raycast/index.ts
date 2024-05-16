
import { VercelRequest, VercelResponse } from '@vercel/node'
import { JSDOM } from 'jsdom'
import { fetch } from 'undici'

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const url = `https://www.raycast.com/wallpapers`

  try {
    const response = await fetch(url)
    const body = await response.text()

    const { window: { document } } = new JSDOM(body);

    const data = Array.from(document.querySelectorAll('[class^="page_wallpaper"]'))
      .map(element => {
        const link = element.querySelector('a').getAttribute('href')
        const title = element.querySelector('p').innerText

        return { src: link, title }
      })


    res.status(200).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
