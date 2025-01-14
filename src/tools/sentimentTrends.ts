// src/tools/sentimentTrends.ts
import { z } from 'zod'
import type { ToolFn } from '../../types'

export const sentimentTrendsToolDefinition = {
  name: 'sentiment_trends',
  parameters: z.object({
    text: z
      .string()
      .describe('A large body of text to analyze for sentiment trends.'),
  }),
}

type Args = z.infer<typeof sentimentTrendsToolDefinition.parameters>

// Basic word dictionaries for sentiment
const positiveWords = ['happy', 'great', 'wonderful', 'awesome', 'good', 'love']
const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'awful', 'worse']

export const sentimentTrends: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { text } = toolArgs

  // 1. Split text into sentences (simple split by punctuation).
  //    This is not a perfect approach, but it's straightforward.
  const sentences = text
    .split(/[.!?]/) // split by period, exclamation, question mark
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  // 2. Analyze each sentence’s sentiment
  let trendsResult: {
    sentence: string
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number // in percentage (0-100)
  }[] = []

  for (const sentence of sentences) {
    // Split sentence into words
    const words = sentence.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0

    // Count how many positive/negative words
    for (const word of words) {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    }

    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral'
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
    } else {
      sentiment = 'neutral'
    }

    // Confidence calculation:
    //  - Simple method: difference / total * 100
    //    e.g., if 5 positive, 2 negative, confidence = (|5-2| / 7)*100 ~ 42.86%
    const total = positiveCount + negativeCount
    const diff = Math.abs(positiveCount - negativeCount)
    const confidence = total === 0 ? 0 : (diff / total) * 100

    trendsResult.push({
      sentence,
      sentiment,
      confidence: Math.round(confidence),
    })
  }

  // 3. Overall trend
  //    Let's see how many sentences were positive, negative, neutral
  //    Then we can guess an overall direction (e.g. "Mostly negative" or "Trend was from negative to positive")
  let positiveSentences = 0
  let negativeSentences = 0
  let neutralSentences = 0

  trendsResult.forEach((res) => {
    if (res.sentiment === 'positive') positiveSentences++
    else if (res.sentiment === 'negative') negativeSentences++
    else neutralSentences++
  })

  const totalSentences = trendsResult.length
  let overallSentiment: 'positive' | 'negative' | 'neutral'
  if (positiveSentences > negativeSentences) {
    overallSentiment = 'positive'
  } else if (negativeSentences > positiveSentences) {
    overallSentiment = 'negative'
  } else {
    overallSentiment = 'neutral'
  }

  // 4. Calculate overall confidence
  //    For an overall measure, we can average the confidence from each sentence
  //    or weight them by the total number of words, etc.
  //    Let's do a simple average of all sentence confidences
  const overallConfidence =
    trendsResult.reduce((sum, r) => sum + r.confidence, 0) / totalSentences || 0

  // 5. Prepare a result object (or string)
  const resultObj = {
    overallSentiment,
    overallConfidence: Math.round(overallConfidence),
    breakdown: trendsResult, // each sentence analysis
  }

  // Return as JSON string so it's easy to read
  return JSON.stringify(resultObj, null, 2)
}
