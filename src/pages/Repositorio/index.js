import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as Styled from './styles';
import { api } from '../../services/api';

export default function Repositorio () {
    // recebe o paramentro
    let params = useParams();

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(()=>{
        
        async function load(){
            const nomeRepo = params.repositorio;
            
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        par_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData);
            setIssues(issuesData);
            setLoad(false);
        }

        load();

    },[params.repositorio]);

    return (
        <Styled.Container>
            <h1 style={{color: '#FF0'}}>Repositorio: {params.repositorio}</h1>
        </Styled.Container>
    );
}