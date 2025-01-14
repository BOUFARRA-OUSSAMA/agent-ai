// src/tools/sentimentAnalysis.ts
import { z } from 'zod'
import type { ToolFn } from '../../types'
import sentimentWords from './sentimentWords.json' // IMPORT the JSON

export const sentimentAnalysisToolDefinition = {
  name: 'sentiment_analysis',
  parameters: z.object({
    text: z.string().describe('The text to analyze.'),
  }),
}

type Args = z.infer<typeof sentimentAnalysisToolDefinition.parameters>

export const sentimentAnalysis: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { text } = toolArgs

  const { positive, negative } = sentimentWords

  // Convert text to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/)

  let positiveCount = 0
  let negativeCount = 0

  for (const word of words) {
    if (positive.includes(word)) {
      positiveCount++
    }
    if (negative.includes(word)) {
      negativeCount++
    }
  }

  if (positiveCount > negativeCount) {
    return 'positive'
  } else if (negativeCount > positiveCount) {
    return 'negative'
  } else {
    return 'neutral'
  }
}
