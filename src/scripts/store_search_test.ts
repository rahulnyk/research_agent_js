import { store } from "../vector_stores/torm_store.js";

let res = await store.similaritySearch("Why did Arjun slay Karna?", 10);
console.log(res);
