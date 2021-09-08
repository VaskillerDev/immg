import fetch from 'node-fetch'

import { Json } from '../types/Json.js'
import ImportMap from '../types/ImportMap.js'
import NetStatArgs from '../types/NetStatArgs.js'

/**
 *  URL access checker. Send to module url request and expect code 200
 */
export default async function (args: NetStatArgs, importMap: ImportMap) {
  const { protocol, hostname, port, pathname } = args
  const baseUrl = `${protocol}//${hostname}:${port}${pathname}`
  const imports = importMap.imports
  const scopes = importMap.scopes

  for (let lib in imports) {
    let relPathToLib = imports[lib] as string
    relPathToLib = relPathToLib.substring(1)
    const url = `${baseUrl}${relPathToLib}`

    await checkStatus(url)
  }

  for (let scopePath in scopes) {
    let libs = scopes[scopePath] as Json

    for (let lib in libs) {
      let relPathToLib = libs[lib] as string
      relPathToLib = relPathToLib.substring(1)
      const url = `${baseUrl}${relPathToLib}`
      await checkStatus(url, {
        scopePath,
        lib,
      })
    }
  }
}

/**
 * Check status code for url
 * @param url
 * @param payload
 * @param expectStatusCode
 */
async function checkStatus(
  url: string,
  payload: Object = {},
  expectStatusCode: number = 200
) {
  // for example: http:localhost:666/blabla/ - is dir
  const lastChar = url.charAt(url.length - 1)
  const isDir = lastChar === '/'
  if (isDir) return

  const res = await fetch(url, { method: 'GET' })
  if (res.status !== expectStatusCode) {
    console.warn(
      `[netStat] unable code: in  ${url} return ${res.status} expect ${expectStatusCode}`
    )
    console.warn('[netStat] payload: ', payload)
  }
}
