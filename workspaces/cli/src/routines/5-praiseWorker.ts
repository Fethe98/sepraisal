// tslint:disable: no-submodule-imports
import { BLOCK_GROUPS, DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import { parseSteamArchive } from '@sepraisal/praisal/lib/parseSteamArchive'
import { createReadStream, readFileSync } from 'fs'
import { Collection, MongoClient } from 'mongodb'
import * as pad from 'pad'
import { join } from 'path'
import { PromiseType } from 'utility-types'

import { sbcPath } from '../utils'


interface IProjection {
    _id: number,
    steam: {
        revision: number,
    },
}


const VENDOR_DIR = join(require.resolve('@sepraisal/praisal'), '..', '..', 'vendor')
const sePraisal = new PraisalManager()
// tslint:disable-next-line: no-unused - TODO: this is bug.
let collection: Collection<IProjection>


const init = (async () => {
    const cubeBlocksXml = readFileSync(join(VENDOR_DIR, 'CubeBlocks.sbc')).toString()
    const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
    await sePraisal.addOres(physicalItemsXml)
    await sePraisal.addIngots(physicalItemsXml, materialsXml)
    await sePraisal.addComponents(materialsXml, componentsXml)
    await sePraisal.addCubes(cubeBlocksXml)
    sePraisal.addGroups(BLOCK_GROUPS)
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // console.info(`Database connection established (fork ${process.pid}).`)
    const db = client.db(DB_NAME)
    collection = db.collection<IProjection>('blueprints')

})()

export = async (index: number, doc: IProjection, callback: (err: Error | void) => unknown) => {
    await init
    const timer = Date.now()

    const prefix = () => [
        `#${pad(String(index), 5)}`,
        `|`,
        `${pad(String(doc._id), 10)}`,
        `|`,
        pad(4, `${((Date.now() - timer) / 1000).toFixed(1)}s`),
        `|`,
    ].join(' ')

    let archive: PromiseType<ReturnType<typeof parseSteamArchive>>
    try {
        archive = await parseSteamArchive(createReadStream(sbcPath(doc)))
    } catch(err) {
        err.type = 'read'
        console.warn(prefix(), `Reading Error: failed to open archive: ${err.message}`)

        return callback(err as Error)
    }

    let sbc: IBlueprint.ISbc
    try {
        const praisal = await sePraisal.praiseXml(archive.blueprint)
        sbc = praisal.toBlueprintSbc(doc.steam.revision)
    } catch(err) {
        err.type = 'praise'
        console.error(prefix(), `Praisal Error: ${err.message.replace(/\n/g, '|')}`)

        return callback(err)
    }

    try {
        await collection.updateOne({ _id: doc._id }, { $set: {sbc}})
    } catch(err) {
        err.type = 'update'
        console.error(prefix(), `Update Error: ${err.message.replace(/\n/g, '|')}`)

        return callback(err)
    }

    console.info(
        prefix(),
        pad(5, String(sbc.blockCount)),
        sbc.gridSize === 'Small' ? 'SG' : 'LG',
        `|`,
        `${sbc.gridTitle}`,
    )
    // console.info(JSON.stringify(sbc))
    callback(undefined)
}
