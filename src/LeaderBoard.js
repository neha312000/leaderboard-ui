import React, { useEffect, useState,useRef, useCallback } from 'react';
import './LeaderBoard.css';
import axios from 'axios';
import {getBaseUrl} from './utils/Constants.js';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, Typography, Box, Button } from '@mui/material';


const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(2000);
    const [currentPage, setCurrentPage] = useState(1);
    const gridRef = useRef();

        const onPageChanged = (params) => {
            const newPage = params.api.paginationGetCurrentPage();
                    if (newPage !== currentPage) {
                        setCurrentPage(newPage);
                        fetchPlayers(newPage)
                            .then((data) => setPlayers(data))
                            .catch((error) => console.error('Error fetching data:', error));
                    }
        };

    const fetchPlayers = async (page = 1) => {
            try {
                const response = await axios.get(`${getBaseUrl()}/leaderboard/getLeaderBoard`, { params: { page } }
                );
                const fetchedPlayers = response.data; // Assuming 'content' contains the paginated data
                return fetchedPlayers;
            } catch (error) {
                console.error('Error fetching data:', error);
                return [];
            }
        };

        const fetchAllPlayers = async () => {
            let accumulatedPlayers = [];
            let page = 1;
            let fetchedPlayers = [];

            do {
                fetchedPlayers = await fetchPlayers(page);
                accumulatedPlayers = [...accumulatedPlayers, ...fetchedPlayers];
                page++;
            } while (fetchedPlayers.length > 0);

            setPlayers(accumulatedPlayers);
        };
    useEffect(() => {
            setPlayers([]);
            fetchAllPlayers();
        }, [currentPage]);

    useEffect(() => {
            if (autoRefresh) {
                const id = setInterval(() => {setPlayers([]);fetchAllPlayers();}, refreshInterval);
                setIntervalId(id);
                return () => clearInterval(id);
            } else {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }, [autoRefresh, refreshInterval, currentPage]);

    useEffect(() => {
            if (gridRef.current && gridRef.current.columnApi) {
                gridRef.current.columnApi.autoSizeAllColumns();
            }
        }, [players]);

    const columns = [
            { headerName: "Rank", valueGetter: "node.rowIndex + 1", sortable: true, filter: true, headerClass: 'header-center', cellStyle: { textAlign: 'center' }  },
            { headerName: "Player Name", field: "playerName", sortable: true, filter: true, headerClass: 'header-center', cellStyle: { textAlign: 'center' }  },
            { headerName: "Score", field: "score", sortable: true, filter: true, headerClass: 'header-center', cellStyle: { textAlign: 'center' }  }
        ];

        return (
            <div className="leaderboard">
                        <Typography variant="h4" gutterBottom>
                            All-Time Top Scores
                        </Typography>
                        <div className="controls">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={autoRefresh}
                                        onChange={() => setAutoRefresh(!autoRefresh)}
                                        color="secondary"
                                    />
                                }
                                label="Enable Auto Refresh"
                            />
                            {autoRefresh && (
                                <FormControl variant="outlined" className="refresh-interval-select">
                                    <InputLabel id="refresh-interval-label">Refresh Interval</InputLabel>
                                    <Select
                                        labelId="refresh-interval-label"
                                        id="refresh-interval"
                                        value={refreshInterval}
                                        onChange={(e) => setRefreshInterval(e.target.value)}
                                        label="Refresh Interval"
                                    >
                                        <MenuItem value={2000}>2 Seconds</MenuItem>
                                        <MenuItem value={5000}>5 Seconds</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </div>
                        <div className="ag-theme-alpine ag-grid-container" style={{ width: '50%', height: '500px' }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={players}
                                columnDefs={columns}
                                pagination={true}
                                paginationPageSize={5}
                                domLayout="autoHeight"
                                >
                            </AgGridReact>
                        </div>
                    </div>
        );
};

export default Leaderboard;
