import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, linkBp } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import LegendCell from '../Cell/LegendCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MyLink from '../MyLink'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp

    const {top, front, side} = sbc.integrityPlanes
    const batteryBlocks = 0
        + (sbc.blocks['BatteryBlock/SmallBlockBatteryBlock'] ?? 0)
        + (sbc.blocks['BatteryBlock/LargeBlockBatteryBlock'] ?? 0)
        + (sbc.blocks['BatteryBlock/SmallBlockSmallBatteryBlock'] ?? 0)

    const blockSize = sbc.gridSize === 'Small' ? 0.5 : 2.5
    const length = top[0].length * blockSize
    const width = top.length * blockSize
    const height = side.length * blockSize

    const weldersHorizontally = Math.ceil((width - 2) / 2.5)
    const weldersVertically = Math.ceil((height - 2) / 2.5)
    const weldersDeep = Math.ceil((length - 2.5) / 10)

    const printable = true
        && sbc.gridSize === 'Small'
        && sbc.gridCount === 1
        && batteryBlocks > 0
        && weldersDeep <= 2

    const output = printable ? `Yes, ${weldersHorizontally}x${weldersVertically}${weldersDeep >= 2 ? ' long' : ''}` : '-'

    const apLink = (
        <MyLink href={linkBp(2066785552)}>
            AutoPrinter (3x2):
        </MyLink>
    )
    const apCheck = printable && weldersHorizontally <=3 && weldersVertically <=2 && weldersDeep === 1 ? 'Probably' : '-'

    return (
        <MySection heading='Printable' label='printer size' value={output} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label='grids' value={formatDecimal(sbc.gridCount)} />
                        <ValueCell label={`grid size`} value={sbc.gridSize} />
                        <ValueCell label={`battery block`} value={batteryBlocks} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`length (m)`} value={formatDecimal(length, 1)} />
                        <ValueCell label={`width (m)`} value={formatDecimal(width, 1)} />
                        <ValueCell label={`height (m)`} value={formatDecimal(height, 1)} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <LegendCell width={2} legend={apLink} legendProps={{align: 'right'}} />
                        <ValueCell label='compatibility' value={apCheck} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'integrityPlanes'
    | 'gridSize'
    | 'blocks'
    | 'gridCount'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
