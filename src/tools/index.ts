import { generateImageToolDefinition } from './generateImage'
import { redditToolDefinition } from './reddit'
import { dadJokeToolDefinition } from './dadJoke'
import { sentimentAnalysisToolDefinition } from './sentimentAnalysis'
import { sentimentTrendsToolDefinition } from './sentimentTrends' 

export const tools = [
  generateImageToolDefinition,
  redditToolDefinition,
  dadJokeToolDefinition,
  sentimentAnalysisToolDefinition,
  sentimentTrendsToolDefinition,
]
