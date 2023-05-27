import { airtableBase } from 'lib/airtable';
import { Product, ProductData } from 'models/product';

export async function syncProductsInDatabase() {
    airtableBase('products').select({
        // Selecting the first 3 records in All furniture:
        pageSize: 10
    }).eachPage(async function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        const objects = records.map(r => {
            return {
                objectID: r.id,
                ...r.fields,
            }
        })
        try {
            const objectIDs = await Product.add(objects as Array<ProductData>)
            console.log(objectIDs);
        } catch (error) {
            console.log(error);
            throw 'Error al sincronizar en productos'

        }

        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); throw 'Error al obtener productos'; }
    });
}
export async function searchProducts(query: string, limit: number, offset: number) {
    const data = await Product.search(query, limit, offset)
    return data
}
export async function getProductById(id: string) {
    try {

        return (await Product.getById(id)).data
    } catch (e) {
        console.error(e)
        return null
    }
}
