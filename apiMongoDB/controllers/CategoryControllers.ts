import { Request, Response } from 'express';
import { CATEGORIES } from '../models/CategoryModel';
import { CategoryObj, UpdateCategory } from '../dto/Categories';
import fs from 'fs';
import path from 'path';



export const createCategory = async (req: Request, res: Response) => {
    const { name } = <CategoryObj>req.body;
    const file = req.file;
    const baseUrl = 'http://localhost:9000/assets/'; // Changed from 'path' to 'baseUrl'

    if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = baseUrl + file.filename;

    const categories = new CATEGORIES({
        name: name,
        images: [imageUrl]
    });

    try {
        await categories.save();
        res.status(201).json({
            message: 'Category created successfully',
            category: categories
        });
    } catch (error) {
        res.status(500).json({ error: `Failed to create category: ${error}` });
    }
};


export const getCategory = async (req: Request, res: Response) => {
    try {
        const category = await CATEGORIES.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: `Error fetching category: ${error}` });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CATEGORIES.find({});
        console.log('Found categories:', categories);
        res.status(200).json(categories);
    } catch (error: any) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({ error: `Failed to fetch categories: ${error.message}` });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const file = req.file;

        const category = await CATEGORIES.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const updateData: any = { name };

        if (file) {
            const imageUrl = 'http://localhost:9000/assets/' + file.filename;
            updateData.images = [imageUrl];

            // Delete old image
            const oldImageUrl = category.images?.length ? category.images[0] : undefined;
            if (oldImageUrl) {
                const oldFileName = oldImageUrl.split('/').pop();
                if (oldFileName) {
                    const oldFilePath = path.join(__dirname, '../../assets', oldFileName);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            }
        }

        const updatedCategory = await CATEGORIES.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        res.status(500).json({ error: `Error updating category: ${error}` });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await CATEGORIES.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete image file
        const imageUrl = category.images?.[0];
        if (imageUrl) {
            const fileName = imageUrl.split('/').pop();
            if (fileName) {
                const filePath = path.join(__dirname, '../../assets', fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: `Error deleting category: ${error}` });
    }
};



