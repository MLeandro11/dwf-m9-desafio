import { SearchIndex } from 'algoliasearch';
import { clientAlgolia } from 'lib/algolia'

const productsIndex = clientAlgolia.initIndex(process.env.ALGOLIA_INDEX);

export interface ProductData {
    objectID: string
    name: string
    in_stock: boolean
    link: string
    type: string
    images: Array<any>
    description: string
    size: string
    unit_cost: number

}

export class Product {
    id: string;
    ref: SearchIndex
    data: ProductData
    constructor(id: string) {
        this.id = id
        this.ref = productsIndex
    }
    async pull() {
        const product = await this.ref.getObject(this.id)
        this.data = product as ProductData
    }
    static async search(query: string, limit: number, offset: number) {
        const data = await productsIndex.search(query, {
            hitsPerPage: limit,
            page: offset > 1 ? Math.floor(offset / limit) : 0,
            attributesToHighlight: []
        })
        return data

    }
    static async getById(id: string) {
        const product = new Product(id)
        await product.pull()
        return product
    }

    static async add(objects: Array<ProductData>) {
        const { objectIDs } = await productsIndex.saveObjects(objects)
        return objectIDs
    }
}