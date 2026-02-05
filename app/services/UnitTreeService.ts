import Unit from '#models/unit'

export default class UnitTreeService {
    static async getTree(rootId: any) {
        const parent: any = await Unit.query().select('id', 'id_pusat', 'nama').where('id', rootId).first()

        let list: any[] = []
        list.push(parent.id)
        const childs = await Unit.query().select('id', 'id_pusat', 'nama').where('id_induk', parent.id_pusat)
        for (const u of childs) {
            list = list.concat(await this.getTree(u.id))
        }
        return list
    }
}
