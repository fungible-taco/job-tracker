import { NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not found" },
      { status: 500 }
    )
  }

  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    const prompt = `Your task is to extract structured job information from the webpage at ${url}.
    Access the URL and analyze the content to identify key job details.

Return ONLY a valid JSON object with these fields:

{
  "company": "Company name (omit legal suffixes like Inc/LLC/Ltd unless part of brand identity)",
  "title": "Complete job title as displayed, preserving case and punctuation",
  "salary": "Compensation in standardized format: '$X-$Y/year' or '$X/hour' or null if not found",
  "source": "Domain name without 'www.' (e.g. 'linkedin.com', 'indeed.com')"
}

## Extraction Guidelines:

### Company
- Look in page headers, "About Company" sections, or next to company logos
- For job boards, distinguish between posting company and job board itself
- Prefer full name over abbreviations (e.g., "Microsoft" not "MS")

### Title
- Typically the largest text on page or first H1/H2 element or the ur metadata title.
- Include the entire title including level/seniority indicators
- Preserve special characters and formatting (e.g., "Sr. Software Engineer (Python/React)")

### Salary
- Search for terms: "salary", "compensation", "pay", "$", "€", "£"
- If multiple formats exist (hourly/annual), prioritize annual rate
- Convert ranges to "$X-$Y/year" format
- If salary shows as "Competitive" or similar vague terms, use null

### Source
- Extract domain from URL without subdomain or path
- For multi-platform jobs (posted on multiple sites), use the current URL's domain

If you cannot find specific information after thorough examination, 
use null for that field. Do not guess or invent information not present in the source.`

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: 'You are a specialized job listing parser. Extract structured data from job listings accurately.Focus only on factual information present in the content. Return valid JSON only'
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    console.log(content)
    console.log(data)

    try {
      // First try to parse the content as JSON
      const jobDetails = JSON.parse(content)
      
      // Map the response fields to match our expected format
      const mappedJobDetails = {
        company: jobDetails.company || null,
        role: jobDetails.title || null, // Map 'title' to 'role'
        salary: jobDetails.salary || null,
        source: jobDetails.source || null,
        link: url,
      }

      return NextResponse.json(mappedJobDetails)
    } catch (e) {
      console.error("Failed to parse job details:", content)
      return NextResponse.json(
        { error: "Failed to parse job details from API response" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error extracting job details:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract job details" },
      { status: 500 }
    )
  }
} 