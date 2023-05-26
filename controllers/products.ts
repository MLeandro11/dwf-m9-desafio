import { airtableBase } from 'lib/airtable';
import { productsIndex } from 'lib/algolia'

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
        //console.log(objects);
        try {
            const { objectIDs } = await productsIndex.saveObjects(objects)
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
    const data = await productsIndex.search(query, {
        hitsPerPage: limit,
        page: offset > 1 ? Math.floor(offset / limit) : 0,
        attributesToHighlight: []
    })
    return data
}
export async function getProductById(id: string) {
    try {
        return await productsIndex.getObject(id)
    } catch (e) {
        console.error(e)
        return null
    }
}
