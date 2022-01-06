import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Owner, Loading, BackButton, IssuesList, Pagination } from './styles';
import api from '../../services/api';

export default function Repositorio () {
    // recebe o parametro
    let params = useParams();

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(()=>{
        
        async function load()
        {
            const nomeRepo = params.repositorio;
            
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData);
            setIssues(issuesData);
            console.log(issuesData);
            setLoading(false);
        }

        load();

    },[params.repositorio]);

    

    useEffect(()=>{

        async function loadIssue(){
            const nomeRepo = params.repositorio;

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: 'open',
                    page,
                    per_page: 5,
                },
            });

            setIssues(response.data);
        }

        loadIssue();

    },[params.repositorio, page]);

    if(loading){
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    }

    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1);
    }

    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>
            <Owner>
                <img src={repositorio.data.owner.avatar_url} alt={repositorio.data.owner.login} />
                <h1>{repositorio.data.name}</h1>
                <p>{repositorio.data.description}</p>
            </Owner>

            <IssuesList>
                {issues.data.map(issue => (
                    <li key={issue.id}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <Pagination>
                <button onClick={()=> handlePage('back')} disabled={page < 2}>Voltar</button>
                <button onClick={()=> handlePage('next')}>Proximo</button>
            </Pagination>
        </Container>
    );
}