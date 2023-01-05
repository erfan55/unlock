import config from '../config/config'
import { generateKeyMetadata } from '../operations/metadataOperations'
import { generateQrCode } from './qrcode'
import satori from 'satori'
import { readFileSync } from 'fs'
const inter400 = readFileSync('src/fonts/inter-400.woff')
const inter700 = readFileSync('src/fonts/inter-700.woff')
import { Ticket } from '@unlock-protocol/ui'
import fetch from 'node-fetch'
import normalizer from './normalizer'

interface Options {
  network: number
  lockAddress: string
  tokenId: string
  owner: string
  name?: string
}

const imageURLToBase64 = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'image/png',
    },
  })
  const contentType = response.headers.get('content-type')
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const imageURL = `data:${contentType};base64,${buffer.toString('base64')}`
  return imageURL
}

/**
 * This generates a ticket using the satori library. We use the Ticket component from the UI library to generate the SVG from satori.
 * This is used by the ticket controller to generate a ticket for a given key and as well as for sending tickets via email.
 */
export const createTicket = async ({
  network,
  lockAddress: lock,
  tokenId,
  owner,
  name,
}: Options) => {
  const lockAddress = normalizer.ethereumAddress(lock)
  const [qrCode, metadata] = await Promise.all([
    generateQrCode({
      network,
      lockAddress,
      tokenId,
    }),
    generateKeyMetadata(
      lockAddress,
      tokenId,
      true,
      config.services.locksmith,
      network
    ),
  ])

  const attributes: Record<string, string>[] = metadata?.attributes || []

  const object = attributes.reduce<Record<string, string>>(
    (item, { trait_type, value }) => {
      item[trait_type] = value as string
      return item
    },
    {}
  )

  const email = metadata?.userMetadata?.protected?.email
  const iconURL = await imageURLToBase64(metadata?.image)
  const ticket = await satori(
    <Ticket
      iconURL={iconURL}
      title={metadata?.name || name}
      email={email}
      id={tokenId}
      time={object?.event_start_time}
      date={object?.event_start_date}
      location={object?.event_address}
      QRCodeURL={qrCode}
      recipient={owner}
      lockAddress={lockAddress}
      network={network}
    />,
    {
      width: 450,
      height: 780 + 30 * attributes.length,
      fonts: [
        {
          name: 'Inter',
          data: inter400,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: inter700,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
  return ticket
}