import React , { useState } from 'react';
import useAuth from '../../hook/useAuth';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

import useStyles from './styles';

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

function EditarPerfil() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const [ erro, setErro ] = useState('');
  const [ carregando, setCarregando ] = useState(false);
  const { token, userPersistido, setUserPersistido } = useAuth();

  async function onSubmit(data) {
    setCarregando(true);
    setErro('');

    if (data.senha !== data.senhaValidar) {
      setErro('Senhas não conferem');
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/perfil', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const dados = await resposta.json();
      
      setCarregando(false);
      
      if (!resposta.ok) {
        setErro(dados);
        return;
      }

      if (resposta.ok) {
        const resposta2 = await fetch('http://localhost:3000/perfil', {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data2 = await resposta2.json();
        
          setUserPersistido(data2);
      }
      history.push('/perfil');
    } catch (error) {
      setErro(error.message)
    }
    
  };

  return (
    <form 
      className={classes.root} 
      noValidate 
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h1">{userPersistido.nome}</Typography>
      <Typography variant="h3">Editar Perfil</Typography>
      {carregando && <CircularProgress color="secondary" />}
      <TextField label="Seu nome" {...register('nome')} type='text'/>
      <TextField label="Nome da loja" {...register('nome_loja')} type='text'/>
      <TextField label="E-mail" {...register('email')} type='text'/>
      <TextField label="Nova senha" {...register('senha')} type='password'/>
      <TextField label="Repita a nova senha" {...register('senhaValidar')} type='password'/>
      <div>
        <Typography variant="p"><Link to='/perfil'>CANCELAR</Link></Typography>
        <Button variant='contained' color='primary' type='submit'>EDITAR PERFIL</Button>
      </div>
      {erro && <Alert severity="error">{erro}</Alert>}
    </form>
  );
}

export default EditarPerfil;