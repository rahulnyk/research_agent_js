import { store } from "../vector_stores/torm_store.js";
let res = await store.similaritySearch("Why did Arjun slay Karna?", 10);
console.log(res);


// import { store } from "../vector_stores/pg_mahabharata_store.js"
// let res = await store.similaritySearch("Why did Arjun slay Karna?", 10);
// console.log(res);