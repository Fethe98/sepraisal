import { BLOCK_GROUPS, ObservableMap, VENDOR_MOD } from '@sepraisal/common'
import { action, runInAction } from 'mobx'

import { Blueprint, Component, Cube, Group, Ingot, Ore } from './models'
import {
    IParseBlueprintSbc,
    IParseComponentSbc,
    IParsePhysicalItemsSbc,
    parseBlueprintSbc,
    parseComponentSbc,
    parsePhysicalItemsSbc,
} from './parsers'
import { Praisal } from './Praisal'

// tslint:disable-next-line: min-class-cohesion
export class PraisalManager {
    private readonly blueprintSbcs = new ObservableMap<IParseBlueprintSbc>()
    private readonly physicalItemSbcs = new ObservableMap<IParsePhysicalItemsSbc>()
    private readonly componentSbcs = new ObservableMap<IParseComponentSbc>()

    public readonly components = new ObservableMap<Component>()
    public readonly ingots = new ObservableMap<Ingot>()
    public readonly ores = new ObservableMap<Ore>()

    public readonly cubes = new ObservableMap<Cube>()

    public readonly groups = new ObservableMap<Group>()

    public readonly praisals = new ObservableMap<Praisal>()

    public async addBlueprintsSbc(blueprintsSbc: string, mod: VENDOR_MOD) {
        const blueprintSbcs = await parseBlueprintSbc(blueprintsSbc)
        this.blueprintSbcs.merge(blueprintSbcs.map((sbc) => [sbc.fullType, sbc]))
    }
    public async addComponentsSbc(componentsSbc: string, mod: VENDOR_MOD) {
        const componentsSbcs = await parseComponentSbc(componentsSbc)
        this.componentSbcs.merge(componentsSbcs.map((sbc) => [sbc.fullType, sbc]))
    }
    public async addPhysicalItemsSbc(physicalItemsSbc: string, mod: VENDOR_MOD) {
        const physicalItemsSbcs = await parsePhysicalItemsSbc(physicalItemsSbc)
        this.physicalItemSbcs.merge(physicalItemsSbcs.map((sbc) => [sbc.fullType, sbc]))
    }

    @action public build() {
        this.buildOres()
        this.buildIngots()
        this.buildComponents()
        // this.buildCubes()
    }

    @action private buildOres() {
        const ore = Ore.fromSbcs(this.physicalItemSbcs)
        this.ores.merge(ore.map((ore) => [ore.title, ore]))
    }

    @action private buildIngots() {
        const ingots = Ingot.fromSbcs(this.physicalItemSbcs, this.blueprintSbcs)
        this.ingots.merge(ingots.map((ingot) => [ingot.title, ingot]))
    }

    @action private buildComponents() {
        const components = Component.fromSbcs(this.blueprintSbcs, this.componentSbcs)
        this.components.merge(components.map((component) => [component.title, component]))
    }

    public async addCubes(cubeBlocksSbc: string) {
        const cubes = await Cube.parseSbc(cubeBlocksSbc, this.components)
        runInAction('PraisalManager.addCubes', () => {
            cubes.forEach((cube) => this.cubes.set(cube.title, cube))
        })

    }

    @action public addGroups(groups2: typeof BLOCK_GROUPS) {
        groups2.forEach((groupDto) => this.groups.set(groupDto.title, new Group(groupDto)))
    }

    @action public praise(blueprint: Blueprint): Praisal {
        const praisal = new Praisal(blueprint, this, this.groups)
        this.praisals.set(blueprint.title, praisal)

        return praisal
    }

    public async praiseSbc(sbc: string): Promise<Praisal> {
        const blueprint = await Blueprint.parseSbc(sbc, this.cubes)

        return this.praise(blueprint)
    }
}
