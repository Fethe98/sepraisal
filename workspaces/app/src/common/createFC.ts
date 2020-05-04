import { observer } from 'mobx-react-lite'
import { basename } from 'path'
import { FC } from 'react'
import { DeepPartial } from 'utility-types'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Styles } from '@material-ui/styles/withStyles'

import { FunctionComponent, FunctionComponentProps } from './Component'
import { IMyTheme } from './myTheme'


// TProps will be provided, but TClasses will be inferred. Due types that can't be mixed in one function.

export const createSmartFC = <TClasses extends string>(
        styles: Styles<IMyTheme, {}, TClasses>,
        filepath?: string,
    ) => <TProps extends object>(
        fc: FunctionComponent<TProps, TClasses>,
    ) => {
        const name = filepath && basename(filepath, '.tsx')
        const useStyles = makeStyles(styles, {name})
        const wrapperFC = (props: TProps) => {
            const theme = useTheme<IMyTheme>()
            const classes = useStyles(props)

            // tslint:disable-next-line: no-object-literal-type-assertion
            return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
        }
        wrapperFC.displayName = name

        return observer<TProps & DeepPartial<FunctionComponentProps<TProps, TClasses>>>(wrapperFC)
    }


export const createDumbFC = <TClasses extends string>(
        styles: Styles<IMyTheme, {}, TClasses>,
        filepath?: string,
    ) => <TProps extends object>(
        fc: FunctionComponent<TProps, TClasses>,
    ) => {
        const name = filepath && basename(filepath, '.tsx')
        const useStyles = makeStyles(styles, {name})

        // tslint:disable-next-line: no-identical-functions - Because closure matters.
        const wrapperFC = (props: TProps) => {
            const theme = useTheme<IMyTheme>()
            const classes = useStyles(props)

            // tslint:disable-next-line: no-object-literal-type-assertion
            return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
        }
        wrapperFC.displayName = name

        return wrapperFC
    }
