
export default async function handler(req: any, res: any) {
  return res.status(200).json({ message: 'Gemini API is now handled on the frontend.' });
}
