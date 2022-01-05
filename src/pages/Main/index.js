import React, { useState, useCallback, useEffect} from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Styled from './styles';
import api from '../../services/api';

export default function Main () {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    
    // buscar
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    },[]);

    // salva alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    },[repositorios]);

    const handleSubmit = useCallback((event)=>{

        event.preventDefault();

        async function submit()
        {
            setLoading(true);
            setAlert(null);
            try{

                if(newRepo === ''){
                    throw new Error('Você precisa indicar um repositorio válido!');
                }

                const hasRepo = repositorios.find(repo => repo.name === newRepo);
                if(hasRepo){
                    throw new Error('Repositorio duplicado');
                }
                
                const response = await api.get(`repos/${newRepo}`);
                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');

            } catch(erro){
                setAlert(true);
                console.log(erro);
            } finally{
                setLoading(false);
            }
        }
        
        submit();

    },[newRepo,repositorios]);

    function handleInputChange(event){
        setNewRepo(event.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    },[repositorios]);

    return (
        <div>
            <Styled.Container>
                
                <h1><FaGithub size={25} /> Meus Repositorios</h1>

                <Styled.Form onSubmit={handleSubmit} error={alert}>
                    <input 
                        type="text" 
                        value={newRepo}
                        onChange={handleInputChange}
                        placeholder="Adicionar repositorio" />

                    <Styled.SubmitButton loading={loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </Styled.SubmitButton>
                </Styled.Form>

                <Styled.List>
                    {repositorios.map(repo => (
                        <li kye={repo.name}>
                            <span>
                                <Styled.DeleteButton onClick={() => handleDelete(repo.name)}>
                                    <FaTrash size={14} />
                                </Styled.DeleteButton>
                                {repo.name}</span>
                            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                                <FaBars size={20} />
                            </Link>
                        </li>
                    ))}
                </Styled.List>

            </Styled.Container>
        </div>
    );
}