import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateCareerAnalysis(answers: any): Promise<string> {
  try {
    const prompt = `
    Berdasarkan data berikut:
    - Jurusan: ${answers.major}
    - Status: ${answers.currentStatus}
    - Minat: ${answers.interests.join(", ")}
    - Hobi: ${answers.hobbies.join(", ")}
    - Keterampilan: ${answers.skills.join(", ")}
    - Kekuatan: ${answers.strengths.join(", ")}
    - Nilai Kerja: ${answers.workValues.join(", ")}
    - Lingkungan Kerja yang Diinginkan: ${answers.preferredWorkEnvironment}
    - Pekerjaan Impian: ${answers.dreamJob}

    Berikan analisis karir yang komprehensif dalam bahasa Indonesia mencakup:
    1. Rekomendasi jalur karir yang sesuai (minimal 3)
    2. Keterampilan yang perlu dikembangkan
    3. Potensi tantangan dan cara mengatasinya
    4. Langkah-langkah konkret untuk mencapai tujuan karir

    Format output dalam paragraf yang terstruktur dan mudah dibaca.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating career analysis:", error);
    return "Maaf, terjadi kesalahan dalam menganalisis data karir Anda. Silakan coba lagi nanti.";
  }
}