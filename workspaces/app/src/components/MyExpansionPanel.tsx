import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelProps,
    ExpansionPanelSummary,
    Typography,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import ExpandMoreIcon from './icons/IconExpandMore'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&::before': {
            backgroundColor: theme.palette.primary.light,
            display: 'inherit !important',
            height: 2,
            // margin: theme.spacing(0, 2),
        },
    },

    summaryRoot: {
        padding: theme.spacing(0),
    },
    summaryContent: {
        alignItems: 'baseline',
        '& > svg': {
            alignSelf: 'center',
        },
    },
    details: {
        padding: theme.spacing(0, 0, 2, 0),
        flexDirection: 'column',
    },
    expanded: {
        margin: '0 !important',
        '&::before': {
            backgroundColor: theme.palette.primary.main,
            opacity: '1 !important',
        },
    },
    headingWithIcon: {
        paddingLeft: theme.spacing(1),
    },
    heading: {
        flexShrink: 0,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    headingWithSecondary: {
        flexBasis: '33.33%',
    },
    secondaryHeading: {
        flexGrow: 1,
        color: theme.palette.primary.main,
    },
})


export interface IMyExpansionPanelProps extends Omit<ExpansionPanelProps, 'title' | 'color'> {
    id?: string
    header: React.ReactNode
    subheader?: React.ReactNode
    icon?: React.ReactNode
}


export default hot(createSmartFC(styles, __filename)<IMyExpansionPanelProps>(({children, classes, theme, ...props}) => {
    const { id, header, subheader, className, icon, onChange, ...otherProps } = props

    const unique = id ?? String(header)
    const exclusiveScopeStore = React.useContext(CONTEXT.EXCLUSIVE_SCOPE)

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleToggle = (event: React.ChangeEvent<{}>, expanded: boolean) => {
        exclusiveScopeStore.setValue(exclusiveScopeStore.value === unique ? null : unique)
        if(onChange) onChange(event, exclusiveScopeStore.value !== unique)
    }

    React.useEffect(() => {
        if(exclusiveScopeStore && props.defaultExpanded) {
            exclusiveScopeStore.setValue(unique)
        }
    }, [])

    return (
        <ExpansionPanel
            elevation={0}
            classes={{
                root: clsx(classes.root, className),
                expanded: clsx(classes.expanded),
            }}
            expanded={exclusiveScopeStore && exclusiveScopeStore.value === unique}
            onChange={exclusiveScopeStore && handleToggle}
            {...otherProps}
        >
            <ExpansionPanelSummary classes={{root: classes.summaryRoot, content: classes.summaryContent}} expandIcon={<ExpandMoreIcon />}>
                {icon}
                <Typography
                    className={clsx({
                        [classes.heading]: true,
                        [classes.headingWithIcon]: icon,
                        [classes.headingWithSecondary]: subheader,
                    })}
                    variant='h3'
                >
                    {header}
                </Typography>
                <Typography component='span' variant='subtitle2' className={classes.secondaryHeading}>
                    {subheader}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
