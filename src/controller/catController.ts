import { Request, Response } from "express";
import prisma from "../model/prisma";

export const getAllCats = async (req: Request, res: Response) => {
  try {
    const cats = await prisma.cat.findMany();

    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addCat = async (req: Request, res: Response) => {
  const { name, image, description } = req.body;
  try {
    const user = await prisma.cat.create({
      data: {
        name,
        image,
        description,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
