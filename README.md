## PROXIMOS PASSOS

### PLANO DE IMPLEMENTACOES PARA ESTUDOS

#### OBSERVABILIDADE COM OPENTELEMETRY

- Lembrar de criar rede externa
  docker network create external_net

#### IMPLEMENTACAO DE SERVICOS EM NUVEM AWS

#### TESTES UNITARIOS E END TO END

#### TESTE DE ESTRESSE NO FLUXO DE CRIACAO DE USUARIOS E RECUPERACAO DE SENHA

#### AVALIAR FERRAMENTAS DE ENVIO DE SMS (OPCIONAL)

## NOTES

#### Commands to generate jwt secrets

###### Gerar a chave privada:

openssl genrsa -out private.key 2048

###### Gerar a chave pública a partir da chave privada:

openssl rsa -in private.key -pubout -out public.key
