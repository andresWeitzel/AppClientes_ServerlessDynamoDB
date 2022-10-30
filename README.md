# ProyectoClientes_ServerlessDynamoDB
Proyecto Personal para la gestión de clientes implementando Serverless, Lambdas, Api Gateway y DynamoDB

</hr>

</br>   

## Instalación y Configuración de Serverless Local
* Una vez abierto el proyecto instalamos  serverless de forma Global `npm install -g serverless`
* Seguidamente creamos toda la config de serverless para nuestro proyecto(en mi caso el nombre del proyecto es `project-dynamodb`) `serverless create --template aws-nodejs --path project-dynamodb && cd project-dynamodb`
* Luego inicializamos el package.json en el proyecto `npm init -y`.
* Por último Instalamos el plugin serverless-offline `npm i serverless-offline`
* Comprobamos versión `serverless --version`
* Salida Esperada : 
   ``` cmd
    Framework Core: 3.23.0
    Plugin: 6.2.2
    SDK: 4.3.2

   ```
* Guía Oficial : https://www.serverless.com//blog/serverless-framework-v3-is-live)   
* Guía Recomendada : https://medium.com/@patricio.aranguiz/serverless-offline-aws-lambda-api-gateway-15a4dfdfbc16   
   
</br>


## Archivo `serverless.yml` 
* 
   
## Instalación de DynamoDB Local
(Guía Recomendada : https://fauna.com/blog/develop-using-serverless-offline)
* Dentro del directorio del proyecto ejecutamos `npm i serverless-dynamodb-local --save`
* Comprobamos versión `serverless --version`
* Salida Esperada : 
   ``` cmd
    Framework Core: 3.23.0
    Plugin: 6.2.2
    SDK: 4.3.2

   ```
</br>   
