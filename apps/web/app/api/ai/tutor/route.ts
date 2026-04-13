import { NextResponse } from "next/server";

const model = process.env.OPENROUTER_MODEL ?? "mistralai/mistral-7b-instruct:free";

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message) {
    return NextResponse.json({ answer: "Pertanyaan kosong." }, { status: 400 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({
      answer:
        "OpenRouter API key belum dikonfigurasi. Tambahkan OPENROUTER_API_KEY agar AI Tutor bisa menjawab dengan model produksi."
    });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert TJKT (Teknik Jaringan Komputer dan Telekomunikasi) teacher at SMK Negeri 1 Liwa. Your primary goal is to prepare students for UKK (Uji Kompetensi Keahlian). Focus on practical networking using MikroTik/Cisco, Linux server administration, and cybersecurity fundamentals. Answer concisely, provide configuration steps when asked, and use an encouraging academic tone. If students ask about UKK, give them tips on Paket 1, 2, 3 or 4 based on the latest BSNP standards."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { answer: "AI Tutor sedang tidak tersedia. Coba lagi beberapa saat." },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return NextResponse.json({
    answer:
      data.choices?.[0]?.message?.content ??
      "AI Tutor belum memberikan jawaban. Coba perjelas pertanyaan."
  });
}
