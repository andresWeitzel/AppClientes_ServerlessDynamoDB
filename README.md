# AppClientes_ServerlessDynamoDB

* App para la gestión de clientes implementando NodeJs, Serverless V3, IAM, SSM, Api Gateway, Bucket S3, DynamoDB y Otras Tecnologías.

</br>




### Tecnologías Implementadas

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| SDK | 4.3.2  | Inyección Automática de Módulas para Lambdas |
| Serverless Framework Core | 3.23.0 | Core Servicios AWS |
| Serverless Plugin | 6.2.2  | Librerías para la Definición Modular |
| Systems Manager Parameter Store (SSM) | 3.0 | Manejo de Variables de Entorno |
| Amazon Api Gateway | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| NodeJS | 14.18.1  | Librería JS |
| VSC | 1.72.2  | IDE |
| CMD | 10 | Símbolo del Sistema para linea de comandos | 
| Git | 2.29.1  | Control de Versiones |



</br>

### Documentación Oficial de las Tecnologías Implementadas.

| **Tecnología** | **Documentación** |               
| -------------  | ------------- |
| Serverless Framework V3 |  https://www.serverless.com//blog/serverless-framework-v3-is-live |
| Amazon Api Gateway |  https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html |
| Systems Manager Parameter Store (SSM) | https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html |
| NodeJs |  https://nodejs.org/en/ |
| VSC |  https://code.visualstudio.com/docs |
| Git   |  https://git-scm.com/docs |

</br>

### Plugins Implementados.

| **Plugin** | **Descarga** |               
| -------------  | ------------- |
| serverless-offline |  https://www.serverless.com/plugins/serverless-offline |
| serverless-offline-ssm |  https://www.npmjs.com/package/serverless-offline-ssm |


</br>

### Extensiones VSC Implementados.

| **Extensión** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |
| DotENV |


</br>

<hr>

## Documentación y Guía del Proyecto
#### (Esta Documentación es para la Creación y/o Configuración de cada Servicio de AWS, se ha generado de forma sucinta en relación a la doc oficial y no oficial solventando aspectos de compatibilidad de versiones y configuraciones personalizadas. Recomiendo la ejecución de cada servicio según se indica en la misma).

</br>

### Indice.

#### Sección 1) Serverless Local y Api Gateway
   
   - [1.0) Instalación y Configuración de Serverless Local](#10-instalación-y-configuración-de-serverless-local)
  
   - [2.0) Configuración de Api Gateway](#20-configuración-de-api-gateway)
   
   - [3.0) Ejecución de Serverless Local](#30-ejecución-de-serverless-local)
   
#### Sección 2) SSM e IAM
   
   - [4.0) Instalación y Configuración de SSM Local ](#40-instalación-y-configuración-de-ssm-local)
   
   
  

</br>

## Sección 1) Serverless Local y Api Gateway


#### Arquitectura Lambda Function y Api gateway .
 ![Index app](https://github.com/andresWeitzel/ProyectoClientes_ServerlessDynamoDB/blob/master/doc/lambdasApiGateway.png)
 
</br>


### 1.0) Instalación y Configuración de Serverless Local
* Una vez abierto el proyecto instalamos  serverless de forma Global `npm install -g serverless`
* Seguidamente creamos toda la config de serverless para nuestro proyecto(en mi caso el nombre del proyecto es `project-dynamodb`) `serverless create --template aws-nodejs --path project-dynamodb && cd project-dynamodb`
* Luego inicializamos el package.json en el proyecto `npm init -y`.
* Instalamos el plugin serverless-offline `npm i serverless-offline`
* Comprobamos versión `serverless --version`
* Salida Esperada ..

   ``` bash
    Framework Core: 3.23.0
    Plugin: 6.2.2
    SDK: 4.3.2

   ```
* Agregamos el plugin instalado de serverless-offline al archivo `serverless.yml`
* Configuramos los diversos parámetros necesarios del provider
* Configuramos tipo de método y path a través de httpApi.
* Configuramos el puerto http 
* Archivo serveless.yml..

  ``` yml
  
   service: project-dynamodb

   frameworkVersion: '3'

   provider:
     name: aws
     runtime: nodejs14.x
     stage: offline
     region : us-west-1
     memorySize: 512
     timeout : 20

   plugins:
     - serverless-offline 

   custom: 
     serverless-offline:
       httpPort: 4000   

   functions:
     hello:
       handler: handler.hello
       events:
         - httpApi:
             method: GET
             path: hello

  ``` 
   
  
</br>   

* Guía Oficial : https://www.serverless.com//blog/serverless-framework-v3-is-live)   
* Guía Recomendada : https://medium.com/@patricio.aranguiz/serverless-offline-aws-lambda-api-gateway-15a4dfdfbc16
* Config Parámetros Provider : https://www.tutorialspoint.com/serverless/serverless_regions_memory_size_timeouts.htm


</br>

### 2.0) Configuración de Api Gateway
* API Gateway gestiona todas las tareas relacionadas con la aceptación y el procesamiento de centenares de miles de llamadas simultáneas a la API. Estas tareas incluyen la administración del tráfico, el control de la autorización y el acceso, el monitoreo y la administración de versiones de la API.
* No es necesario la instalación de ningún paquete adicional, este servicio viene incluido en la instalación principal de serverless.
* Para cada lambda es necesario adicionar el parametro `private: true` dentro de `- httpApi` para que se aplique la restricción de acceso correctamente.
* Vamos a generar una sección de `resources` . Esta es la plantilla de CloudFormation (Servicio de recursos de AWS) para declarar los recursos de serverless a utilizar.
* En este caso vamos a extender los diversos manejos de recursos para nuestra Api Gateway. (Tipos, Templates y Códigos de Respuesta).
* La configuración General de nuestro `serverless.yml` quedaría...

     ``` yml
  
   service: project-dynamodb

   frameworkVersion: "3"

   provider:
     name: aws
     runtime: nodejs14.x
     stage: offline
     region : us-west-1
     memorySize: 512
     timeout : 10

   plugins:
     - serverless-offline

   custom:
     serverless-offline:
       httpPort: 4000

   functions:
     hello:
       handler: handler.hello
       events:
         - httpApi:
             method: GET
             path: hello
             private: true

   resources:
     Resources:
       ApiGatewayRestApi:
         Type: AWS::ApiGateway::RestApi
         Properties:
           Name: apiGatewayRestApi
       #### Gateway Response INIT
       GatewayResponseDefault400:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: DEFAULT_4XX
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-4XX-generic\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseDefault500:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: DEFAULT_5XX
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-5XX-generic\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseAccessDeied:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: ACCESS_DENIED
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-403-access-denied\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseApiConfigurationError:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: API_CONFIGURATION_ERROR
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-500-api-configuration-error\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseAuthorizerConfigurationError:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: AUTHORIZER_CONFIGURATION_ERROR
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-500-authorizer-configuration-error\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseAuthorizerFailure:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: AUTHORIZER_FAILURE
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-500-authorizer-failure\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseBadRequestBody:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: BAD_REQUEST_BODY
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-400-bad-request-body\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseBadRequestParameters:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: BAD_REQUEST_PARAMETERS
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-400-bad-request-parameters\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseExpiredToken:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: EXPIRED_TOKEN
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-403-expired-token\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseIntegrationFailure:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: INTEGRATION_FAILURE
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-504-integration-failure\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseIntegrationTimeout:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: INTEGRATION_TIMEOUT
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-504-integration-timeout\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseInvalidApiKey:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: INVALID_API_KEY
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-403-invalid-api-key\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseInvalidSignature:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: INVALID_SIGNATURE
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-403-invalid-signature\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseMissingAuthenticationToken:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: MISSING_AUTHENTICATION_TOKEN
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-403-missing-authentication-token\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseQuotaExceeded:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: QUOTA_EXCEEDED
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-429-quota-exceeded\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseRequestTooLarge:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: REQUEST_TOO_LARGE
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-413-request-too-large\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseResourceNotFound:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: RESOURCE_NOT_FOUND
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-404-resource-not-found\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseThrottled:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: THROTTLED
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-429-throttled\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseUnauthorized:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: UNAUTHORIZED
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-401-unauthorized\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       GatewayResponseUnauthorizedMediType:
         Type: 'AWS::ApiGateway::GatewayResponse'
         Properties:
           RestApiId: 
             Ref: 'ApiGatewayRestApi'
           ResponseType: UNSUPPORTED_MEDIA_TYPE
           ResponseTemplates:
             application/json: "{\"error\":{\"code\":\"custom-415-unsupported-media-type\",\"message\":$context.error.messageString},\"requestId\":\"$context.requestId\"}"
       #### Gateway Response END

  ```

</br>   

* Código Base : https://gist.github.com/jonatassaraiva/4c33dd8225605c02318cd71a55b2335d



</br>

### 3.0) Ejecución de Serverless Local
* Por defecto tenemos configurado una lambda llamada handler a través de su función .hello
* Comprobamos la config generada.
* Además tenemos configurada la seguridad y manejo de responses por parte de la Api Gateway, esta nos provera un token de acceso (x-api-key) para el acceso a cada lambda.
* Levantamos serverless con el comando `sls offline start` o `serverless offline start`
* Visualizamos el endpoint local que serverless nos genera..

     ``` bash
     Starting Offline at stage dev (us-east-1)

   Offline [http for lambda] listening on http://localhost:3002
   Function names exposed for local invocation by aws-sdk:
              * hello: project-dynamodb-dev-hello
   Remember to use 'x-api-key' on the request headers.
   Key with token: 'd41d8cd98f00b204e9800998ecf8427e'           
              
    GET | http://localhost:3000/hello   
    POST | http://localhost:3000/2015-03-31/functions/hello/invocations 
    
    Server ready: http://localhost:4000
  ``` 
* Abrimos alguna herramienta para generar peticiones http (ej: Postman) y generamos una request al endpoint generado junto con la api key de nuestro gateway  
* Seleccionamos método `GET`, luego escribimos el endpoint `http://localhost:3000/hello`, seguidamente pestaña `Headers` en `KEY` colocamos `x-api-key` y en `VALUE` colocamos el token generado `d41d8cd98f00b204e9800998ecf8427e`.
* Procedemos a ejecutar la request y podemos comprobar la metadata de la lambda en la consola de postman
* También obtenemos la respuesta por consola..
  
  ``` bash
    GET /hello (λ: hello)
   (λ: hello) RequestId: 63fc1719-ae56-4d56-8296-87d45b44fc96  Duration: 124.64 ms  Billed Duration: 125 ms
  ```
  
  
  
  
</br>

## Sección 2) SSM e IAM 


#### Arquitectura Lambda Function y SSM .
 ![Index app](https://github.com/andresWeitzel/ProyectoClientes_ServerlessDynamoDB/blob/master/doc/ssmLambdas.png)
 
</br>


### 4.0) Instalación y Configuración de SSM Local
* Instalamos el plugin `npm install serverless-offline serverless-offline-ssm --save-dev`
* Agregamos el complemento dentro del serverless.yml. Es importante mantener el orden siguiente (serverless-offline siempre último por temas de compatibilidad).
   
  ``` YML
    plugins:
       - serverless-offline-ssm
       - serverless-offline
  ``` 
* Dentro del proyecto creamos el archivo `serverless.env.yml` que será el que contenga los valores de las variables de entorno de nuestro proyecto
* Dentro de dicho archivo colocamos una variable test para comprobar su funcionamiento.. 
  
  ``` YML
    HELLO_TEST : ${ssm:/hello_test}  
  ```
* Relacionamos el arhivo `serverless.env.yml` dentro del `serverless.yml` agregando el parametro `enviroment` junto a dicho archivo..
 
  ``` YML
   provider:
     name: aws
     runtime: nodejs14.x
     stage: offline
     region : us-west-1
     memorySize: 512
     timeout : 10
     environment: ${file(serverless.env.yml)}  
  ``` 
* Seguidamente vamos a configurar el ssm dentro del bloque `custom` para el archivo `serverless.yml` 
* Agregamos el stage (IMPORTANTE RESPETAR EL STAGE DEL PROVIDER Y DEL SSM) y la variable test, quedando..

  ``` YML
    custom:
     serverless-offline-ssm:
       stages:
         - offline
       ssm:
         '/hello_test': 'HELLO SSM'
     serverless-offline:
       httpPort: 4000  
  ```
* Por último utilizamos dicha variable en la lambda declarada, para invocar una variable de entorno utilizamos `process.env.variable`  
 
    ```js
      'use strict';

      module.exports.hello = async (event) => {
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              message: process.env.HELLO_TEST,
              input: event,
            },
            null,
            2
          ),
        };

      };

   ```
* Ejecutamos el programa, realizamos la petición get a través de postman a nuestra lambda y podemos visualizar la metadata de la misma junto con nuestra variable de entorno.
* Salida Esperada..

     ```cmd
        {
          "message": "HELLO SSM",
          "input": {
              "body": null,
              "cookies": [],
              "headers": {
                  "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
                  "content-type": "application/json",
                  "user-agent": "PostmanRuntime/7.29.2",
                  "accept": "*/*",
                  "cache-control": "no-cache",
                  "postman-token": "ea2e186f-732f-450e-abf2-4572b3e0206b",
                  "host": "localhost:4000",
                  "accept-encoding": "gzip, deflate, br",
                  "connection": "keep-alive",
                  "content-length": "163"
              },
              "isBase64Encoded": false,
              "pathParameters": null,
              "queryStringParameters": null,
              "rawPath": "/hello",
              "rawQueryString": "",
              "requestContext": {
                  "accountId": "offlineContext_accountId",
                  "apiId": "offlineContext_apiId",
                  "authorizer": {
                      "jwt": {}
                  },
                  "domainName": "offlineContext_domainName",
                  "domainPrefix": "offlineContext_domainPrefix",
                  "http": {
                      "method": "GET",
                      "path": "/hello",
                      "protocol": "HTTP/1.1",
                      "sourceIp": "127.0.0.1",
                      "userAgent": "PostmanRuntime/7.29.2"
                  },
                  "requestId": "offlineContext_resourceId",
                  "routeKey": "GET hello",
                  "stage": "$default",
                  "time": "31/Oct/2022:23:49:02 -0300",
                  "timeEpoch": 1667270942415
              },
              "routeKey": "GET hello",
              "stageVariables": null,
              "version": "2.0"
          }
      }
    ```
  
  
  
  
  
  
</br>

###  Instalación de DynamoDB Local
(Guía Recomendada : https://fauna.com/blog/develop-using-serverless-offline)
* Dentro del directorio del proyecto ejecutamos `npm i serverless-dynamodb-local --save`

</br>

* https://dynobase.dev/run-dynamodb-locally/
* https://sitiobigdata.com/2018/02/05/tablas-en-dynamodb-creacion-carga/#
* https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html
* https://dynobase.dev/run-dynamodb-locally/#connecting-dynamodb-offline-cli

* ARQUITECTURA A SEGUIR : https://www.freecodecamp.org/news/complete-back-end-system-with-serverless/

</br>


<hr>
 

### Configuración de gitignore
   * Vamos a excluir la carpeta `node_modules` para no añadir las librerías a nuestro repositorio.
   * Creamos el archivo `.gitignore` dentro del directorio del proyecto.
   * Dentro del archivo añadimos `node_modules/`
   * Realizamos los pasos necesarios con git y para el próximo push node_modules será exluido
 
</br>




`DOCUMENTACIÓN EN PROCESO DE DESARROLLO`

