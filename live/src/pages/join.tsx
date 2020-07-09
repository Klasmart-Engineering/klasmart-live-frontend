import React, { useState, useMemo } from 'react'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import StyledTextField from '../components/textfield'
import KidsloopButton from '../components/button'
import KidsloopLogo from "../assets/img/kidsloop.svg";
import CenterAlignChildren from '../components/centerAlignChildren'
import { IUserContext } from '../app'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            margin: 'auto 0'
        },
        card: {
            display: 'flex',
            alignItems: 'center',
            padding: '48px 40px !important'
        },
        formContainer: {
            width: '100%'
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
            height: "100vh",
        },
    })
)

interface Props { 
    setUserContext: (userContext: IUserContext) => any
}

export function Join ({setUserContext}: Props): JSX.Element {
    const classes = useStyles()
    const theme = useTheme();

    const [user, setUser] = useState<string>('')
    const room = useMemo(() => {
        const url = new URL(window.location.href)
        return url.searchParams.get('room')
    },[window.location.href])

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Grid item xs={12}>
                                <CenterAlignChildren>
                                    <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                                    <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                                        Live
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                            <Grid item xs={12} className={classes.formContainer}>
                                <form onSubmit={(e) => { e.preventDefault(); setUserContext({roomId: room?room:uuid(), teacher: !room, name: user}) }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                required
                                                fullWidth
                                                value={user}
                                                label={'Name'}
                                                onChange={(e) => setUser(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <KidsloopButton
                                                fullWidth
                                                type="submit"
                                                size="large"
                                            >
                                                <Typography>
                                                { room ? "Join Room" : "Create Room"}
                                                </Typography>
                                            </KidsloopButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    )
}

