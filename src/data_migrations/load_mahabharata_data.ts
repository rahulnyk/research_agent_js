import * as dotenv from "dotenv";
dotenv.config();

import { glob } from "glob";
import csvLoader from "../document_loaders/csv_loader.js";
import { store } from '../vector_stores/torm_store.js';

// This file is used to load the mahabharat data into the vector store database.
// Step 1: get a list of files to load
const dataDir = "/Users/rahulnayak/TechWork/AIProjects/mahabharata/data";
const files = await glob(`${dataDir}/*.csv`);
// Ignore these files because the are not the data files.
const ignoreFiles = ["summaries_combined.csv", "tiny_tales_glossary.csv"];
// const includeFiles = ["km_ganguli_translation_1.csv"]

const dataFiles = files.filter((file) => {
    let fileName = file.split("/").pop() || "";
    return !ignoreFiles.includes(fileName);
    // return includeFiles.includes(fileName);
});

// Step 2: load these files into Documents
const lcDocs = csvLoader(dataFiles);

const recreate = true;
if (recreate) {
    await store.addDocuments(lcDocs);
} else {
    console.log('Not recreating the store, if you want to force recreate set recreate = true')
}

