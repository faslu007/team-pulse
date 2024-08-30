import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import SelectComponent from "../../../commons/SingleSelectBox";
import DateTimePickerCommon from "../../../commons/DateTimePicker";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../Store";
import { GameBasic, GameState } from "./Interfaces/GameInterfaces";
import { gameStatusOptions, roomTypeOptions } from "../../../commonConstatns";
import { createRoom } from "./GameThunk";
import { useEffect } from "react";
import { useSnackbar } from "../../../commons/Snackbar/Snackbar";

function GameBasicDetails() {
    const dispatch = useAppDispatch();
    const { showSnackbar } = useSnackbar();
    const gameBasicInputData: GameBasic = useAppSelector((state: RootState) => state.gameManage.gameBasicData);
    const apiStatus: GameState["apiStatus"] = useAppSelector((state: RootState) => state.gameManage.apiStatus);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!gameBasicInputData.id) {
            dispatch(createRoom({
                roomName: gameBasicInputData.gameName,
                roomType: gameBasicInputData.roomType,
                roomStatus: gameBasicInputData.roomStatus,
                roomStartsAt: gameBasicInputData.gameBeginsAt,
                roomExpiresAt: gameBasicInputData.gameEndsAt,
                invitationMessage: gameBasicInputData.invitationMessage ?? ""
            }));
        }
    };

    useEffect(() => {
        if (apiStatus.message) {
            showSnackbar(true, apiStatus.isError ? "error" : apiStatus.isSuccess ? "success" : "warning", apiStatus.message, 10000);
            dispatch({ type: "gameManage/resetStatusState" });
        }
    }, [apiStatus.message]);



    return (
        <Grid
            container
            spacing={2}
            direction={'row'}
        >
            <Grid
                item
                xs={6}
                sx={{ width: "100%", height: "100%" }}
            >
                <TextField
                    id="game-name"
                    label="Game Name"
                    fullWidth
                    name="gameName"
                    value={gameBasicInputData.gameName}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "gameName",
                                value: e.target.value
                            }
                        })
                    }}
                />
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ width: "100%" }}
            >
                <SelectComponent
                    id={"room-tag-selector"}
                    label="Room Tag"
                    options={roomTypeOptions}
                    minWidth="100%"
                    name="gameName"
                    disabled={true}
                    helperText="disabled"
                    value={gameBasicInputData.roomType ?? ""}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "roomType",
                                value: e.target.value
                            }
                        })
                    }}
                />
            </Grid>

            <Grid
                item
                xs={6}
                sx={{ width: "100%" }}
            >
                <DateTimePickerCommon
                    name="game-begins-at-time-stamp"
                    label="Game Begins at"
                    minDate={new Date()}
                    disablePast
                    helperText="Select the date and time for the game start"
                    required
                    fullWidth
                    sx={{ width: "100%" }}
                    value={gameBasicInputData.gameBeginsAt ? new Date(gameBasicInputData.gameBeginsAt) : null}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "gameBeginsAt",
                                value: e ? e.toISOString() : null
                            }
                        })
                    }}
                />
            </Grid>

            <Grid
                item
                xs={6}
                sx={{ width: "100%" }}
            >
                <DateTimePickerCommon
                    name="game-ends-at-time-stamp"
                    label="Game Ends at"
                    minDate={gameBasicInputData.gameBeginsAt ? new Date(new Date(gameBasicInputData.gameBeginsAt).getTime() + 10 * 60 * 1000) : null}
                    disablePast
                    helperText="Select the date and time for the game end"
                    required
                    fullWidth
                    sx={{ width: "100%" }}
                    value={gameBasicInputData.gameEndsAt ? new Date(gameBasicInputData.gameEndsAt) : null}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "gameEndsAt",
                                value: e ? e.toISOString() : null
                            }
                        })
                    }}
                />
            </Grid>

            <Grid
                item
                xs={12}
            >
                <TextField
                    label="Invitation Message"
                    multiline
                    sx={{
                        width: "100%"
                    }}
                    minRows={5}
                    value={gameBasicInputData.invitationMessage ?? null}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "invitationMessage",
                                value: e.target?.value ?? ""
                            }
                        })
                    }}
                />
            </Grid>

            <Grid
                item
                xs={6}
                sx={{ width: "100%" }}
            >
                <SelectComponent
                    id={"room-status-selector"}
                    label="Room Status"
                    options={gameStatusOptions}
                    minWidth="100%"
                    name="gameStatus"
                    helperText="Manage game status as Draft and Publish"
                    value={gameBasicInputData.roomStatus ?? ""}
                    onChange={(e) => {
                        dispatch({
                            type: "gameManage/updateInputFieldValues",
                            payload: {
                                stateToUpdate: "gameBasicData",
                                field: "roomStatus",
                                value: e.target.value
                            }
                        })
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: "row", alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={handleSubmit}
                    >
                        {apiStatus.isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            gameBasicInputData.id ? "Update" : "Create"
                        )}
                    </Button>
                </div>
            </Grid>

        </Grid>)
};


export default GameBasicDetails;
