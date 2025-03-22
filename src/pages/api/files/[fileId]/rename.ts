import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Non autorizzato' });
    }

    const fileId = req.query.fileId as string;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: 'Nome file richiesto' });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: { name: newName },
    });

    return res.status(200).json(updatedFile);
  } catch (error) {
    console.error('Errore durante il rename del file:', error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
} 