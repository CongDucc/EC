import express, { Request, Response } from 'express'
import { PRODUCTS } from '../models/ProductModel'
import { ProductParams } from '../dto/product'; // Changed from Product to product

const path = 'http://localhost:8888/assets/'
export const createProduct = async (req: Request, res: Response) => {
    const { name, price, oldPrice, description, quantity, inStock, isFeatured,
        category } = <ProductParams>req.body;

    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => path + file.filename)

    const product = new PRODUCTS({
        name: name,
        images: images,
        price, oldPrice, description, quantity, inStock, isFeatured, category
    });

    try {
        console.log(product)
        await product.save();
        res.status(200).json(`Product create successfully :-) + ${path}!!!`)
    } catch (error) {
        res.status(500).json(`Failed to create Product ${error}:-(`)
    }

}
export const getProductByCatID = async (req: Request, res: Response) => {
    try {
        const products = await PRODUCTS.find({ category: req.params.CatID });
        console.log('Found products:', products);
        res.status(200).json(products);
    } catch (error: any) {
        console.error('Error in getProductByCatID:', error);
        res.status(500).json({ error: `Failed to fetch products: ${error.message}` });
    }
};

export const getProductByID = async (req: Request, res: Response) => {
    try {
        const result = await PRODUCTS.findById(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(`Product fetch failed ${error} :-( `)
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await PRODUCTS.find().sort({ createdAt: -1 }) // 
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(`Products not found ${error} :-( `)
    }
}
