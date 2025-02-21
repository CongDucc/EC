import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { createCategory, getCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/CategoryControllers';

const router = express.Router();

const imagesStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, 'assets');
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, req.body.name + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: imagesStorage,
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('image');

router.post('/createCategory', (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        await createCategory(req, res);
    });
});

router.get('/:id', async (req: Request, res: Response) => {
    await getCategory(req, res);
});

router.get('/', async (req, res) => {
    try {
        await getAllCategories(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.put('/updateCategory/:id', (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            await updateCategory(req, res);
        } catch (error) {
            next(error);
        }
    });
});

router.delete('/deleteCategory/:id', async (req: Request, res: Response) => {
    await deleteCategory(req, res);
});

export { router as CategoryRoute };