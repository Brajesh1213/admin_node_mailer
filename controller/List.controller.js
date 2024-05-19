import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import nodemailer from 'nodemailer';

import List from '../model/List.model.js';

export const check = (req, res) => {
    res.status(200).send("connection from list controller");
};

export const createList = async (req, res) => {
    try {
        const newList = await List.create(req.body);
        res.status(201).json(newList);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const addDataFromCSV = async (req, res) => {
    try {
        const listId = req.params.listId;
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const csvFilePath = req.file.path;
        console.log('CSV File Path:', csvFilePath);

        const itemsToAdd = [];
        const errors = [];

        // Read CSV file and parse the data
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const { name, email, city } = row;
                itemsToAdd.push({ name, email, city });
            })
            .on('end', async () => {
                // Fetch existing emails from all lists
                const allLists = await List.find({}, 'data.email');
                const existingEmails = new Set(allLists.flatMap(list => list.data.map(item => item.email)));

                const validItemsToAdd = [];

                for (let item of itemsToAdd) {
                    if (existingEmails.has(item.email)) {
                        errors.push({ ...item, error: 'Duplicate email' });
                    } else {
                        validItemsToAdd.push(item);
                        existingEmails.add(item.email);  // Add email to the set to track new entries
                    }
                }
                    console.log(validItemsToAdd);
                // If there are errors, generate a CSV for errors and respond
                if (errors.length > 0) {
                    list.data.push(...validItemsToAdd);
                    await list.save();


                    const parser = new Parser();
                    const csvErrors = parser.parse(errors);
                    const errorFilePath = 'uploads/errors.csv';

                    fs.writeFileSync(errorFilePath, csvErrors);

                    res.status(400).json({ 
                        message: 'Some users were not added due to errors.',
                        errors: errors.length,
                        successful: validItemsToAdd.length,
                        currentTotal: list.data.length,
                        errorFile: errorFilePath

                    });
                } else {
                    list.data.push(...validItemsToAdd);
                    await list.save();

                    res.status(200).json({ 
                        message: 'CSV data added to list successfully',
                        successful: validItemsToAdd.length,
                        errors: errors.length,
                        currentTotal: list.data.length
                    });
                }
            });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

