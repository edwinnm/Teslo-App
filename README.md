<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar el proyecto
1. Ejecutar `yarn install`
1. Clonar el archivo `.env.template` y renombrarlo a `.env`
1. Cambiar el valor de las variables de entorno acorde a sua ambiente.
1. Levantar la base de datos

```
docker compose up -d

```

PD: Si no se levanta adecuadamente, es probable que se tenga que realizar cambios en el archivo `postgres/pg_hba.conf`

```
#host all all all scram-sha-256
host all all all trust

```

1. Ejecutar `yarn start:dev`
