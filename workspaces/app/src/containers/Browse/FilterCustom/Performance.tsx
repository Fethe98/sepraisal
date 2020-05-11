import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'

import Checkbox from './FormControls/Checkbox'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyExpansionPanel>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyExpansionPanel className={clsx(classes.root, className)} header='Performance' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                </FormLabel>
                <Checkbox  title='Atmosperic thrusters'    findKey='sbc.thrustAtmospheric.Forward' yes={{$exists: true}} no={{$exists: false}} />
                <Checkbox  title='Ion thrusters'           findKey='sbc.thrustIon.Forward'         yes={{$exists: true}} no={{$exists: false}} />
                <Checkbox  title='Hydrogen thrusters'      findKey='sbc.thrustHydrogen.Forward'    yes={{$exists: true}} no={{$exists: false}} />
                {/* TODO: Average thrust x3 */}
                {/* TODO: Firepower (total DPS) */}
                {/* TODO: Jump Distance */}
                {/* TODO: Cargo capacity */}
                {/* TODO: Hitpoints */}
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
