import * as dotenv from "dotenv";
dotenv.config();

import store from './vector_stores/torm_supabase_store.js'


let res = await store.similaritySearch('Arjuna and Karna', 10)
console.log(res)