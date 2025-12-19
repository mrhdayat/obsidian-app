import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const content = JSON.parse(fileContents);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate body if needed (simple merge)

    // Read existing to merge? Or just overwrite specific keys?
    // Let's expect the full object or partial merge.
    // For safety, let's read first.
    let currentContent = {};
    try {
      const fileContents = await fs.readFile(dataFilePath, 'utf8');
      currentContent = JSON.parse(fileContents);
    } catch (e) {
      // ignore if file doesn't exist
    }

    const newContent = { ...currentContent, ...body };

    await fs.writeFile(dataFilePath, JSON.stringify(newContent, null, 2), 'utf8');

    return NextResponse.json({ success: true, content: newContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
