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

    const prompt = `You job is to help me extract job details from a job listing from ${url}.
    You will be given a URL and you will need to give me the job details from the listing.
    You will need to extract the following details:
    - Company name
    - Job title (e.g. "Software Engineer", "Product Manager", "Data Scientist", etc.)
    - Salary (e.g. "$100,000 - $120,000", "$120,000 - $140,000", etc.)
    - Source (e.g. "LinkedIn", "Indeed", "Glassdoor", etc.)

    The output should be a JSON object with the following fields:
    If you are not able to find the job details, return "cannot find job details".
{
  "company": "Company name, remove suffixes like Inc/LLC if possible",
  "title": "Full job title exactly as listed. Most likely the title is the first thing in the listing or a header.",
  "salary": "Look for a point which says compensation or salary. Should have a number and a currency. Standardized format: $X-$Y or 'Not disclosed'",
  "source": "Domain name of source (e.g., linkedin.com, indeed.com)"
}

Guidelines:
- Do not paraphrase the job title, company name, or salary.
- For missing information, use null instead of empty strings
- Keep text fields concise, under 100 characters when possible
- If salary data includes multiple formats, prioritize annual figures.`

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4",
        messages: [
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
      const jobDetails = JSON.parse(content)
      return NextResponse.json({
        ...jobDetails,
        link: url, // Always include the original URL
      })
    } catch (e) {
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