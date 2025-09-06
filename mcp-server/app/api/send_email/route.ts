import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  recipient: string;
  subject: string;
  body: string;
}

export async function POST(request: Request) {
  try {
    const { recipient, subject, body } = (await request.json()) as EmailRequest;
    if (!recipient || !subject || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text: body,
    });

    return NextResponse.json({ status: 'Email sent' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}