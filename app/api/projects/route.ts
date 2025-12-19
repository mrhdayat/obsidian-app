import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate body if needed

    // Write full array
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
