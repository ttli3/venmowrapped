import { Redis } from '@upstash/redis'

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('Redis environment variables are not defined')
}

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})

export async function setStoryData(id: string, data: any) {
  await redis.set(id, JSON.stringify(data), { ex: 86400 }) // 24 hours
}

export async function getStoryData(id: string) {
  const data = await redis.get(id)
  return data ? JSON.parse(data as string) : null
}
