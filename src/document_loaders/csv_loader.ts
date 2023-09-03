// import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { Document } from "langchain/document";

export default function (
    documentList: string[],
    contentColumn?: string,
    delimiter?: string
): Document[] {
    /**
     * Takes a list of file csv names
     * and loads them into the a Document array
     * contentColumn is added as pageContent, 
     * everything else is added as metadata
     */
    let documents: Record<string, any>[] = [];
    for (const f in documentList) {
        let fileContent = fs.readFileSync(documentList[f]);
        try {
            let records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                delimiter: delimiter || "|",
            });
            documents = [...documents, ...records];
        } catch (e) {
            console.log(e);
        }
    }

    let pageContentCol = contentColumn || "text";

    const lcDocs = documents.map((doc) => {
        let text = doc[pageContentCol];
        delete doc[pageContentCol];
        return new Document({ pageContent: text, metadata: doc });
    });
    return lcDocs;
}

// const lcDocs = loadDocuments(dataFiles);

// console.log(lcDocs.length)
// console.log(lcDocs[1000])
