import mongoose from "mongoose";
import config from "./config";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";
import {randomUUID} from "crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('products');
        await db.dropCollection('categories');
        await db.dropCollection('users');
    }catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [cpuCategory, ssdCategory] = await Category.create({
        title: 'CPUs',
        description: 'Central Processor Units'
    }, {
        title: 'SSDs',
        description: 'Solid State Drives'
    });
    await Product.create({
        title: 'Intel COre i7 12700k',
        price: 350,
        category: cpuCategory._id,
        image: 'fixtures/cpu.jpeg'
    }, {
        title: 'Samsung 990 PRO 1TB',
        price: 170,
        category: ssdCategory._id,
        image: 'fixtures/ssd.jpeg'
    });

    await User.create({
        username: 'user',
        password: '1111',
        token: randomUUID()
    });

    await db.close()
};

run().catch(console.error)

